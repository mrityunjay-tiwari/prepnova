import type {Metadata} from "next";
import {LegalShell} from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "Privacy Policy — Prepnova",
  description:
    "How Prepnova collects, uses, and protects your data during AI mock interviews.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" lastUpdated="July 2, 2026">
      <section>
        <p>
          This Privacy Policy explains what information Prepnova (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) collects when you use our AI mock-interview platform,
          how we use it, and the choices you have. By using Prepnova, you agree
          to the practices described here.
        </p>
      </section>

      <section>
        <h2>1. Information We Collect</h2>
        <ul>
          <li>
            <strong>Account information.</strong> When you sign in with Google,
            we receive your name, email address, and profile image to create and
            secure your account.
          </li>
          <li>
            <strong>Interview data.</strong> During a live interview we process
            your microphone audio to transcribe your answers, and we store the
            resulting questions, answers, transcripts, per-answer feedback, and
            scores that make up your interview reports.
          </li>
          <li>
            <strong>Posture &amp; presence signals.</strong> If you enable your
            camera, posture analysis runs locally in your browser. Your camera
            video is <strong>never uploaded</strong>; only lightweight summary
            values (minimum, maximum, and average posture scores) are sent to
            generate your report.
          </li>
          <li>
            <strong>Usage &amp; technical data.</strong> Basic session and
            device information needed to operate the service and keep it secure.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To run live interviews and generate structured reports.</li>
          <li>To power your dashboard, progress tracking, and history.</li>
          <li>To maintain, secure, and improve the service.</li>
          <li>To communicate with you about your account when necessary.</li>
        </ul>
      </section>

      <section>
        <h2>3. Third-Party Processors</h2>
        <p>
          We rely on trusted service providers to deliver core functionality.
          Data is shared with them only as needed to provide the service:
        </p>
        <ul>
          <li>
            <strong>Google</strong> — authentication (sign-in).
          </li>
          <li>
            <strong>Stream (GetStream)</strong> — real-time video/audio
            infrastructure for the live interview.
          </li>
          <li>
            <strong>Deepgram</strong> — speech-to-text and text-to-speech during
            the interview.
          </li>
          <li>
            <strong>OpenRouter</strong> — large-language-model processing for
            question generation, answer evaluation, and report synthesis.
          </li>
          <li>
            <strong>Hosting &amp; database providers</strong> — to run the
            application and store your reports securely.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Data Retention</h2>
        <p>
          We keep your interview reports and account data for as long as your
          account is active so you can review your history and track progress.
          You can delete individual reports at any time from your dashboard, and
          you may request deletion of your account and associated data.
        </p>
      </section>

      <section>
        <h2>5. Your Rights &amp; Choices</h2>
        <ul>
          <li>Access and review the reports stored in your account.</li>
          <li>Delete individual interview reports at any time.</li>
          <li>Decline camera access — posture analysis is optional.</li>
          <li>
            Request deletion of your account and associated data by contacting
            us.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Data Security</h2>
        <p>
          We use reasonable technical and organizational measures to protect
          your information. No method of transmission or storage is completely
          secure, but we work to safeguard your data against unauthorized
          access.
        </p>
      </section>

      <section>
        <h2>7. Children&rsquo;s Privacy</h2>
        <p>
          Prepnova is not directed to children under 13, and we do not knowingly
          collect personal information from them.
        </p>
      </section>

      <section>
        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes
          will be reflected by updating the &ldquo;Last updated&rdquo; date at
          the top of this page.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          Your privacy matters to us. For any privacy question or data request —
          including deleting your account and data — you can email the founder of
          Prepnova directly at{" "}
          <a href="mailto:mrityunjaytiwari1873@gmail.com">
            mrityunjaytiwari1873@gmail.com
          </a>
          . Every message is read and answered personally.
        </p>
      </section>
    </LegalShell>
  );
}
