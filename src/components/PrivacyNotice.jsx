import React from "react";

export default function PrivacyNotice() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          HeliCoach — Privacy Notice
        </h2>
        <p className="text-sm text-slate-500 mb-2">Last updated: 2026-03-06</p>
        <p className="text-slate-700 leading-relaxed mb-6">
          <strong>Summary:</strong> HeliCoach is a fully open-source,
          client-side application that{" "}
          <strong>
            does not transmit personally identifiable data to remote servers
          </strong>
          .
        </p>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              1. Data Collection
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                The App stores progress locally using the browser&apos;s{" "}
                <code className="bg-slate-100 px-1 rounded text-sm">
                  localStorage
                </code>{" "}
                under the keys:{" "}
                <code className="bg-slate-100 px-1 rounded text-sm">
                  completedManeuvers
                </code>{" "}
                (maneuver progress) and{" "}
                <code className="bg-slate-100 px-1 rounded text-sm">
                  helicopters
                </code>{" "}
                (flight record data).
              </li>
              <li>
                <strong>Google Analytics</strong> is enabled to collect usage
                metrics to improve the application.
              </li>
              <li>
                Optional integrations (such as Google Drive backup, PWA features
                or external AI services) are{" "}
                <strong>
                  not enabled unless explicitly used by the user
                </strong>
                .
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              2. Local Storage and Retention
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                Progress and preferences are stored locally on the device via
                browser{" "}
                <code className="bg-slate-100 px-1 rounded text-sm">
                  localStorage
                </code>
                .
              </li>
              <li>
                Deleting browser data or clearing site storage will{" "}
                <strong>remove saved progress</strong>.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              3. Third-Party Services
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                The default distribution{" "}
                <strong>does not send data to external servers</strong>.
              </li>
              <li>
                If you enable external services (e.g., AI or backup services),
                this occurs through <strong>your explicit actions</strong> and
                is governed by{" "}
                <strong>that service&apos;s privacy policy</strong>, not this
                App.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              4. Security
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                The App is a{" "}
                <strong>static client-side application</strong>.
              </li>
              <li>
                Users should ensure their{" "}
                <strong>browser and device remain secure</strong>.
              </li>
              <li>
                The maintainers are{" "}
                <strong>
                  not responsible for device-level compromises
                </strong>
                .
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              5. Contact
            </h3>
            <p>
              For privacy questions or security reports, please{" "}
              <strong>open an issue in the project repository</strong>.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              6. Changes
            </h3>
            <p>
              This notice may be updated periodically. Material changes will be
              documented in the{" "}
              <strong>repository and release notes</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
