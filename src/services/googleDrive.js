// Google Drive API integration for seamless backup/restore
// Uses Google Identity Services (GIS) and Drive API v3

const SCOPES = "https://www.googleapis.com/auth/drive.file";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";
const FILE_NAME = "helicoach-backup.json";
const MIME_TYPE = "application/json";

class GoogleDriveService {
  constructor() {
    this.tokenClient = null;
    this.accessToken = null;
    this.gapiInited = false;
    this.gisInited = false;
  }

  // Initialize Google API client
  async initGapi() {
    if (this.gapiInited) return;

    return new Promise((resolve, reject) => {
      window.gapi.load("client", async () => {
        try {
          await window.gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
          });
          this.gapiInited = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // Initialize Google Identity Services
  initGis() {
    if (this.gisInited) return;

    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: "", // defined at request time
    });
    this.gisInited = true;
  }

  // Get access token (handles auth flow)
  async getAccessToken() {
    return new Promise((resolve, reject) => {
      try {
        // Check if we already have a valid token
        if (this.accessToken && window.gapi.client.getToken()) {
          resolve(this.accessToken);
          return;
        }

        this.tokenClient.callback = (response) => {
          if (response.error !== undefined) {
            reject(response);
            return;
          }
          this.accessToken = response.access_token;
          resolve(this.accessToken);
        };

        // Prompt user to select account and consent if necessary
        if (window.gapi.client.getToken() === null) {
          this.tokenClient.requestAccessToken({ prompt: "consent" });
        } else {
          this.tokenClient.requestAccessToken({ prompt: "" });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Find existing backup file
  async findBackupFile() {
    try {
      const response = await window.gapi.client.drive.files.list({
        q: `name='${FILE_NAME}' and mimeType='${MIME_TYPE}' and trashed=false`,
        spaces: "drive",
        fields: "files(id, name, modifiedTime)",
        orderBy: "modifiedTime desc",
      });

      return response.result.files && response.result.files.length > 0
        ? response.result.files[0]
        : null;
    } catch (error) {
      console.error("Error finding backup file:", error);
      throw error;
    }
  }

  // Save data to Google Drive
  async saveToGoogleDrive(data) {
    try {
      // Initialize if needed
      if (!this.gapiInited) await this.initGapi();
      if (!this.gisInited) this.initGis();

      // Get access token
      await this.getAccessToken();

      const content = JSON.stringify(data, null, 2);
      const existingFile = await this.findBackupFile();

      const boundary = "-------314159265358979323846";
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

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
        close_delim;

      let response;

      if (existingFile) {
        // Update existing file
        response = await fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + this.accessToken,
              "Content-Type": "multipart/related; boundary=" + boundary,
            },
            body: multipartRequestBody,
          },
        );
      } else {
        // Create new file
        response = await fetch(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + this.accessToken,
              "Content-Type": "multipart/related; boundary=" + boundary,
            },
            body: multipartRequestBody,
          },
        );
      }

      if (!response.ok) {
        throw new Error("Failed to save to Google Drive");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error saving to Google Drive:", error);
      throw error;
    }
  }

  // Restore data from Google Drive
  async restoreFromGoogleDrive() {
    try {
      // Initialize if needed
      if (!this.gapiInited) await this.initGapi();
      if (!this.gisInited) this.initGis();

      // Get access token
      await this.getAccessToken();

      const existingFile = await this.findBackupFile();

      if (!existingFile) {
        throw new Error("No backup found in Google Drive");
      }

      // Download file content
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${existingFile.id}?alt=media`,
        {
          headers: {
            Authorization: "Bearer " + this.accessToken,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to download backup from Google Drive");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error restoring from Google Drive:", error);
      throw error;
    }
  }

  // Sign out and revoke access
  signOut() {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token, () => {
        window.gapi.client.setToken("");
        this.accessToken = null;
      });
    }
  }
}

// Singleton instance
const googleDriveService = new GoogleDriveService();

export default googleDriveService;
