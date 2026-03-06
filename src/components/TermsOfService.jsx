import React from "react";

export default function TermsOfService() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          HeliCoach — Terms of Service
        </h2>
        <p className="text-sm text-slate-500 mb-6">Last updated: 2026-03-06</p>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              1. Acceptance
            </h3>
            <p>
              By using HeliCoach (the &ldquo;App&rdquo;), you agree to these
              Terms of Service. If you do not agree, do not use the App.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              2. Service Description
            </h3>
            <p className="mb-2">
              HeliCoach is an open-source, client-side web application designed
              to help RC helicopter pilots:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Track practice manoeuvres</li>
              <li>Generate practice prompts</li>
              <li>Manage progress directly in the browser</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              3. Use and Restrictions
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                The App is provided{" "}
                <strong>free and open source</strong> under its repository
                license. You may use, modify, and self-host the App according to
                that license.
              </li>
              <li>
                You must <strong>not use the App</strong> to:
                <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                  <li>Infringe third-party rights</li>
                  <li>Violate applicable laws</li>
                  <li>
                    Send unsolicited messages through third-party services
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              4. No Warranty
            </h3>
            <p className="mb-2">
              The App is provided <strong>&ldquo;as-is&rdquo;</strong> without
              warranties of any kind.
            </p>
            <p className="mb-2">
              The authors and maintainers{" "}
              <strong>disclaim all warranties</strong>, whether express or
              implied, including:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              5. Limitation of Liability
            </h3>
            <p>
              To the maximum extent permitted by law, the authors and
              maintainers are{" "}
              <strong>
                not liable for any indirect, incidental, special, consequential,
                or punitive damages
              </strong>{" "}
              arising from your use of the App.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              6. Changes
            </h3>
            <p>
              These Terms may be updated from time to time. Continued use of the
              App after changes constitutes acceptance of the updated Terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
