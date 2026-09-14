// app/privacy/page.tsx
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { APP_CONFIG } from "@/config/CORE_CONFIG";
import Link from "next/link";

export const metadata = {
  title: `Privacy, Security & Data Retention Policy | ${APP_CONFIG.appName}`,
  description: `Comprehensive Privacy Policy, Security Disclaimers, and Data Retention Standards for the ${APP_CONFIG.appName} platform.`,
};

export default function PrivacyPage() {
  return (
    <ClientPortal>
      <ScrollArea className="h-screen absolute-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <BusinessNavbar />

        {/* Privacy content */}
        <div className="max-w-4xl mx-auto p-6 md:p-12 pt-24 pb-24 text-foreground scrollbar-hide">
          <article className="prose prose-slate dark:prose-invert max-w-none 
            prose-headings:text-foreground 
            prose-p:text-foreground/90 
            prose-li:text-foreground/90 
            prose-strong:text-foreground 
            prose-a:text-primary hover:prose-a:underline">
            
            <header className="border-b border-border/40 pb-6 mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Privacy, Security &amp; Data Retention Policy</h1>
              <p className="text-sm text-muted-foreground font-medium">
                Last updated: <strong>{APP_CONFIG.last_updated_legal || "19th December 2025"}</strong> | Version 1.1.0
              </p>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-900 dark:text-blue-200 text-sm mt-4 leading-relaxed">
                <strong>OVERVIEW:</strong> {APP_CONFIG.appName} is committed to responsible, transparent, and legally sound data processing. This document outlines how we collect, store, process, protect, and retain your personal and health-related donation information when you interact with our platform.
              </div>
            </header>

            <section>
              <h2>1. Introduction &amp; Scope</h2>
              <p>
                This Privacy, Security, and Data Retention Policy (&quot;Privacy Policy&quot;) applies to all users, voluntary donors, patients, hospitals, blood banks, and partner organizations who access or utilize <strong>{APP_CONFIG.appName}</strong> (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
              </p>
              <p>
                By registering for an account, submitting donation preferences, or using the Platform, you explicitly consent to the collection, processing, transfer, and storage of your information in accordance with this Privacy Policy and our <Link href="/terms">Terms of Service</Link>.
              </p>
            </section>

            <section>
              <h2>2. Explicit Consent for Health &amp; Voluntary Donor Data</h2>
              <p>
                To connect voluntary blood donors with hospitals and patients in urgent need, {APP_CONFIG.appName} requires the voluntary submission of specific health-adjacent information (such as blood group, availability status, and general geographic location).
              </p>
              <p>
                <strong>Your Explicit Consent:</strong> By submitting your blood group, donation records, or medical institution affiliation, you provide explicit, informed, and unambiguous consent for {APP_CONFIG.appName} to process this information solely for the purpose of facilitating blood donation matching and communication. You may modify your availability or request data deletion at any time.
              </p>
            </section>

            <section>
              <h2>3. Categories of Information We Collect</h2>
              <ul>
                <li>
                  <strong>Personal Identification &amp; Contact Details:</strong> Full name, verified email address, verified phone number, profile photo (optional), country code, and user role (Donor, Patient, Hospital, Organization).
                </li>
                <li>
                  <strong>Donation &amp; Health-Adjacent Data:</strong> Blood group / Rh factor (e.g., A+, O-, etc.), date of last blood donation, availability status (Available / Unavailable / On Cooldown), and voluntary donor registration metadata.
                </li>
                <li>
                  <strong>Geographical &amp; Location Data:</strong> City, state/province, postal/ZIP code, and approximate geographic coordinates provided during registration or search to enable proximity-based donor matching.
                </li>
                <li>
                  <strong>Institutional &amp; Verification Data:</strong> For hospitals and blood banks, we may collect institutional registration numbers, official contact person credentials, verification documents, and facility addresses.
                </li>
                <li>
                  <strong>Technical, Log &amp; Telemetry Data:</strong> IP address, browser type and version, operating system, device identifiers, session timestamps, referral URLs, access logs, and error telemetry.
                </li>
              </ul>
            </section>

            <section>
              <h2>4. How We Use Your Information</h2>
              <p>We process collected data strictly for lawful, legitimate, and platform-essential purposes:</p>
              <ul>
                <li><strong>Donor-Recipient Matching:</strong> Enabling hospitals, healthcare providers, and emergency patients to locate and reach compatible, nearby voluntary donors;</li>
                <li><strong>Identity &amp; Contact Verification:</strong> Authenticating phone numbers and email addresses via trusted verification services (Phone.Email) to deter fraudulent accounts;</li>
                <li><strong>Platform Security &amp; Fraud Prevention:</strong> Monitoring suspicious behavior, detecting unauthorized access, preventing fake emergency appeals, and enforcing our Terms of Service;</li>
                <li><strong>Service Communication:</strong> Sending critical transactional notifications, OTP codes, donation status updates, security alerts, and system notices;</li>
                <li><strong>Operational Analytics &amp; Optimization:</strong> Analyzing platform uptime, debugging application errors, improving user experience, and optimizing database query performance.</li>
              </ul>
            </section>

            <section>
              <h2>5. Data Disclosure &amp; Controlled Visibility</h2>
              <p>
                <strong>We do not sell, rent, lease, trade, or monetize your personal or health data under any circumstances.</strong>
              </p>
              <p>Data is disclosed strictly under the following controlled conditions:</p>
              <ul>
                <li>
                  <strong>Matching Visibility:</strong> When you register as an active voluntary donor, your designated contact details (phone number, name, blood group, city) are made visible to registered, verified requesters (hospitals, patients) searching for matching donors. You may set your status to &quot;Unavailable&quot; at any time to hide your contact details from search results.
                </li>
                <li>
                  <strong>Infrastructure &amp; Service Processors:</strong> We partner with trusted third-party technology providers to run our infrastructure (e.g., Firebase/Firestore for database storage, Uploadcare for secure media hosting, Phone.Email for OTP verification, Google Gemini API for automated informational chatbot support, and Vercel for hosting). These providers process data solely on our behalf under strict confidentiality and security requirements.
                </li>
                <li>
                  <strong>Legal &amp; Regulatory Compliance:</strong> We may disclose information if required to do so by applicable law, court subpoena, judicial warrant, or regulatory mandate, or in good-faith belief that such action is necessary to protect human life, public safety, or prevent serious physical harm.
                </li>
              </ul>
            </section>

            <section>
              <h2>6. Comprehensive Security Safeguards &amp; Disclaimers</h2>
              <p>
                We implement industry-standard technical, organizational, and administrative safeguards designed to protect your personal data from unauthorized access, accidental loss, alteration, or disclosure. These measures include:
              </p>
              <ul>
                <li>End-to-end SSL/TLS cryptographic encryption for all data in transit (HTTPS);</li>
                <li>Role-based access controls and granular database security rules restricting access to sensitive records;</li>
                <li>Automated SSRF/CWE-918 validation protocols and server-side canonicalization on API endpoints;</li>
                <li>Separation of public client keys from private API secrets on the server environment.</li>
              </ul>
              <div className="p-4 rounded-lg bg-muted border border-border text-foreground text-sm my-4 leading-relaxed font-medium">
                <strong>LEGAL SECURITY SAFE HARBOR:</strong> While we employ rigorous security practices, no method of transmission over the Internet or electronic storage system is 100% impenetrable. Consequently, we cannot guarantee absolute, infallible security. You transmit information through the Platform at your own risk.
              </div>
            </section>

            <section>
              <h2>7. Data Retention &amp; Disposal Policy</h2>
              <p>
                We retain personal and operational data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
              </p>
              <ul>
                <li>
                  <strong>Active User Profiles:</strong> Data is retained for as long as your account remains active and registered on the Platform.
                </li>
                <li>
                  <strong>Transactional &amp; Match Logs:</strong> Donation match records, search logs, and verification events are retained for up to <strong>24 months</strong> for security auditing, fraud detection, and regulatory compliance, after which they are automatically anonymized or purged.
                </li>
                <li>
                  <strong>Inactive Accounts:</strong> Accounts with no login or platform activity for consecutive <strong>18 months</strong> may be flagged for dormancy, anonymized, or securely deleted.
                </li>
                <li>
                  <strong>Deletion on Request:</strong> Upon receiving a verified account deletion request from you, your personal identifiers and contact information will be permanently removed from our active databases within <strong>30 calendar days</strong>, subject to any statutory retention requirements.
                </li>
              </ul>
            </section>

            <section>
              <h2>8. Your Legal Rights &amp; Choices</h2>
              <p>Depending on your geographic location and applicable data protection regulations (such as GDPR, CCPA, or DPDP Act), you possess the following rights:</p>
              <ul>
                <li><strong>Right of Access:</strong> Request a summary of the personal information we maintain about you;</li>
                <li><strong>Right to Rectification:</strong> Update, amend, or correct inaccurate or outdated information via your profile dashboard;</li>
                <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request the permanent deletion of your account and associated personal data;</li>
                <li><strong>Right to Restrict or Withdraw Consent:</strong> Toggle your donor availability status to &quot;Inactive&quot; or withdraw consent for non-essential processing;</li>
                <li><strong>Right to Data Portability:</strong> Request an export of your personal information in a structured, machine-readable format.</li>
              </ul>
              <p>
                To exercise any of these rights, please email us at <a href="mailto:reach.saad@outlook.com" className="text-primary hover:underline">reach.saad@outlook.com</a> with the subject line &quot;Data Rights Request&quot;.
              </p>
            </section>

            <section>
              <h2>9. Medical &amp; Health Intermediary Disclaimer</h2>
              <p>
                <strong>{APP_CONFIG.appName} is an open-source technical matchmaking platform, not a covered healthcare entity or medical records custodian.</strong>
              </p>
              <p>
                The Platform does not maintain electronic health records (EHR), medical diagnostic charts, or clinical transfusion records. Medical facilities and blood banks remain solely responsible for maintaining their independent statutory patient records, donor confidentiality, and compliance with healthcare regulatory standards.
              </p>
            </section>

            <section>
              <h2>10. Children&apos;s Privacy (Strict 18+ Requirement)</h2>
              <p>
                The Platform is strictly intended for individuals who are 18 years of age or older. We do not knowingly solicit, collect, or process personal data from children under the age of 18. If we become aware that personal data of a minor has been collected without verified parental/legal guardian consent, we will take immediate steps to delete the information from our servers.
              </p>
            </section>

            <section>
              <h2>11. Changes to This Privacy Policy</h2>
              <p>
                We reserve the right to revise or update this Privacy Policy at our discretion to reflect technical enhancements, statutory amendments, or evolving platform practices. Any changes will be posted on this page with an updated &quot;Last updated&quot; date. Your continued use of the Platform following any modifications signifies your full acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2>12. Data Protection Officer &amp; Inquiries</h2>
              <p>
                For questions, concerns, complaints, or feedback regarding our privacy practices, security protocols, or data management, please contact our team:
              </p>
              <p>
                <strong>Email:</strong> <a href="mailto:reach.saad@outlook.com" className="text-primary hover:underline">reach.saad@outlook.com</a>
                <br />
                <strong>Project Repository:</strong> <Link href="https://github.com/saad2134/donor-sync" target="_blank" rel="noopener noreferrer">github.com/saad2134/donor-sync</Link>
              </p>
            </section>

          </article>
        </div>

        <Footer />
      </ScrollArea>
    </ClientPortal>
  );
}
