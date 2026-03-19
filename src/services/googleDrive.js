// Google Drive API integration for seamless backup/sync
// Uses Google Identity Services (GIS) and Drive API v3

const SCOPES = "https://www.googleapis.com/auth/drive.file";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";
const FILE_NAME = "helicoach-backup.json";
const MIME_TYPE = "application/json";
const SYNC_STATE_KEY = "googleDriveSyncState";

const DEFAULT_SYNC_STATE = {
  enabled: false,
  configured: false,
  status: "disabled",
  authRequired: false,
  lastSyncAt: null,
  lastAction: null,
  lastRemoteModifiedAt: null,
  lastError: null,
  fileId: null,
};

class GoogleDriveService {
  constructor() {
    this.tokenClient = null;
    this.accessToken = null;
    this.tokenExpiresAt = 0;
    this.gapiInited = false;
    this.gisInited = false;
    this.syncState = this.loadSyncState();
  }

  loadSyncState() {
    try {
      const raw = localStorage.getItem(SYNC_STATE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        ...DEFAULT_SYNC_STATE,
        ...parsed,
        configured: this.isConfigured(),
      };
    } catch {
      return {
        ...DEFAULT_SYNC_STATE,
        configured: this.isConfigured(),
      };
    }
  }

  persistSyncState(nextState) {
    this.syncState = {
      ...this.syncState,
      ...nextState,
      configured: this.isConfigured(),
    };
    localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(this.syncState));
    return this.syncState;
  }

  isConfigured() {
    return Boolean(
      import.meta.env.VITE_GOOGLE_CLIENT_ID &&
      import.meta.env.VITE_GOOGLE_API_KEY,
    );
  }

  isEnabled() {
    return this.syncState.enabled;
  }

  getSyncState() {
    this.syncState = this.loadSyncState();
    return { ...this.syncState };
  }

  async initGapi() {
    if (this.gapiInited) return;

    if (!window.gapi) {
      throw new Error("Google API library not loaded");
    }

    await new Promise((resolve, reject) => {
      window.gapi.load("client", async () => {
        try {
          await window.gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
          });
          this.gapiInited = true;
          resolve();
        } catch (error) {
          console.error("Error initializing Google API client:", error);
          reject(error);
        }
      });
    });
  }

  initGis() {
    if (this.gisInited) return;

    if (!window.google?.accounts?.oauth2) {
      throw new Error("Google Identity Services library not loaded");
    }

    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: "",
    });
    this.gisInited = true;
  }

  async initClients() {
    if (!this.isConfigured()) {
      throw new Error("Google Drive integration is not configured");
    }
    if (!this.gapiInited) await this.initGapi();
    if (!this.gisInited) this.initGis();
  }

  async getAccessToken({ interactive }) {
    const now = Date.now();
    const existingToken = window.gapi?.client?.getToken?.();

    // Reuse token already present in gapi client state when available.
    if (existingToken?.access_token && !this.accessToken) {
      this.accessToken = existingToken.access_token;
    }

    if (
      this.accessToken &&
      existingToken &&
      this.tokenExpiresAt &&
      now < this.tokenExpiresAt
    ) {
      return this.accessToken;
    }

    // Background sync must never trigger popup auth. Report auth-required instead.
    if (!interactive && !existingToken?.access_token) {
      throw new Error("auth_required");
    }

    // If no expiry is known but gapi has a token, use it for this request.
    if (!interactive && existingToken?.access_token) {
      this.accessToken = existingToken.access_token;
      return this.accessToken;
    }

    return new Promise((resolve, reject) => {
      this.tokenClient.callback = (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }

        this.accessToken = response.access_token;
        const expiresInMs = (response.expires_in || 3600) * 1000;
        this.tokenExpiresAt = Date.now() + expiresInMs - 60000;
        resolve(this.accessToken);
      };

      this.tokenClient.requestAccessToken({
        prompt: interactive ? "consent" : "",
      });
    });
  }

  async findBackupFile() {
    const response = await window.gapi.client.drive.files.list({
      q: `name='${FILE_NAME}' and mimeType='${MIME_TYPE}' and trashed=false`,
      spaces: "drive",
      fields: "files(id, name, modifiedTime)",
      orderBy: "modifiedTime desc",
      pageSize: 1,
    });

    return response.result.files && response.result.files.length > 0
      ? response.result.files[0]
      : null;
  }

  async downloadBackup(fileId) {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: "Bearer " + this.accessToken,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to download backup from Google Drive");
    }

    return response.json();
  }

  async uploadBackup(data, existingFile) {
    const content = JSON.stringify(data, null, 2);
    const boundary = "-------314159265358979323846";
    const delimiter = "\r\n--" + boundary + "\r\n";
    const closeDelim = "\r\n--" + boundary + "--";

    const metadata = {
      name: FILE_NAME,
      mimeType: MIME_TYPE,
      description: "HeliCoach progress backup",
    };

    const multipartRequestBody =
      delimiter +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      JSON.stringify(metadata) +
      delimiter +
      "Content-Type: " +
      MIME_TYPE +
      "\r\n\r\n" +
      content +
      closeDelim;

    const url = existingFile
      ? `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`
      : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

    const response = await fetch(url, {
      method: existingFile ? "PATCH" : "POST",
      headers: {
        Authorization: "Bearer " + this.accessToken,
        "Content-Type": "multipart/related; boundary=" + boundary,
      },
      body: multipartRequestBody,
    });

    if (!response.ok) {
      throw new Error("Failed to save to Google Drive");
    }

    return response.json();
  }

  async syncNow(localData, { interactive = false } = {}) {
    if (!this.isConfigured()) {
      return { action: "skipped", reason: "not-configured" };
    }
    if (!this.isEnabled()) {
      return { action: "skipped", reason: "disabled" };
    }

    try {
      this.persistSyncState({
        status: "syncing",
        lastError: null,
      });

      await this.initClients();
      await this.getAccessToken({ interactive });

      const existingFile = await this.findBackupFile();

      if (!existingFile) {
        const pushed = await this.uploadBackup(localData, null);
        const now = new Date().toISOString();
        this.persistSyncState({
          status: "connected",
          authRequired: false,
          fileId: pushed.id,
          lastAction: "push",
          lastSyncAt: now,
          lastRemoteModifiedAt: now,
          lastError: null,
        });
        return { action: "push" };
      }

      const remoteData = await this.downloadBackup(existingFile.id);
      const remoteTs = Date.parse(
        remoteData.updatedAt ||
          remoteData.exportedAt ||
          existingFile.modifiedTime ||
          0,
      );
      const localTs = Date.parse(
        localData.updatedAt || localData.exportedAt || 0,
      );

      if (remoteTs > localTs) {
        const now = new Date().toISOString();
        this.persistSyncState({
          status: "connected",
          authRequired: false,
          fileId: existingFile.id,
          lastAction: "pull",
          lastSyncAt: now,
          lastRemoteModifiedAt: existingFile.modifiedTime || now,
          lastError: null,
        });
        return {
          action: "pull",
          remoteData,
          remoteModifiedAt: existingFile.modifiedTime || null,
        };
      }

      const payload = {
        ...localData,
        updatedAt: localData.updatedAt || new Date().toISOString(),
      };
      const pushed = await this.uploadBackup(payload, existingFile);
      const now = new Date().toISOString();
      this.persistSyncState({
        status: "connected",
        authRequired: false,
        fileId: pushed.id || existingFile.id,
        lastAction: "push",
        lastSyncAt: now,
        lastRemoteModifiedAt: now,
        lastError: null,
      });
      return { action: "push" };
    } catch (error) {
      const authError = String(error?.message || "").toLowerCase();
      const requiresAuth =
        authError.includes("auth_required") ||
        authError.includes("auth required") ||
        authError.includes("consent") ||
        authError.includes("interaction") ||
        authError.includes("login") ||
        authError.includes("popup") ||
        authError.includes("access_denied");

      this.persistSyncState({
        status: requiresAuth ? "auth-required" : "error",
        authRequired: requiresAuth,
        lastError: error?.message || "Google Drive sync failed",
      });

      if (!interactive && requiresAuth) {
        return { action: "skipped", reason: "auth-required" };
      }
      throw error;
    }
  }

  async enableSync(localData) {
    if (!this.isConfigured()) {
      throw new Error("Google Drive integration is not configured");
    }

    this.persistSyncState({
      enabled: true,
      status: "connecting",
      authRequired: false,
      lastError: null,
    });

    await this.initClients();
    await this.getAccessToken({ interactive: true });
    return this.syncNow(localData, { interactive: false });
  }

  async reconnectAndSync(localData) {
    this.persistSyncState({
      enabled: true,
      status: "connecting",
      authRequired: false,
      lastError: null,
    });

    await this.initClients();
    await this.getAccessToken({ interactive: true });
    return this.syncNow(localData, { interactive: false });
  }

  disableSync() {
    this.signOut();
    this.persistSyncState({
      enabled: false,
      status: "disabled",
      authRequired: false,
      lastError: null,
    });
  }

  signOut() {
    const token = window.gapi?.client?.getToken?.();
    if (token?.access_token) {
      window.google.accounts.oauth2.revoke(token.access_token, () => {
        window.gapi.client.setToken("");
      });
    }
    this.accessToken = null;
    this.tokenExpiresAt = 0;
  }
}

const googleDriveService = new GoogleDriveService();

export default googleDriveService;
