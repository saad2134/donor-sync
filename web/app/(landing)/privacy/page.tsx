// app/privacy/page.tsx
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { APP_CONFIG } from "@/config/CORE_CONFIG";

export const metadata = {
  title: `Privacy Policy | ${APP_CONFIG.appName}`,
  description: `Read this to understand about how the ${APP_CONFIG.appName} platform handles your data and privacy.`,
};

export default function PrivacyPage() {
  return (
    <ClientPortal>
      <ScrollArea className="h-screen absolute-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <BusinessNavbar />

        {/* Privacy content */}
        <div className="max-w-2xl mx-auto p-10 pt-20 pb-20 text-foreground scrollbar-hide">
          <br /><br />
          <article className="prose 
    prose-headings:text-foreground 
    prose-p:text-foreground 
    prose-li:text-foreground 
    prose-strong:text-foreground">
            <h1>Privacy, Security, and Data Retention Policies</h1>

            <p><em>Last updated: 24-12-2025 (DD-MM-YYYY)</em></p>

            <hr />

            <h2>Privacy Policy</h2>

            <h3>Introduction</h3>

            <p>Welcome to <strong>DonorSync</strong>. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.</p>

            <h3>Information We Collect</h3>

            <ul>
              <li><strong>Personal Data</strong>: Name, email, contact details, and donation history.</li>
              <li><strong>Technical Data</strong>: IP address, browser type, and device information.</li>
              <li><strong>Usage Data</strong>: Interaction with our platform, pages visited, and preferences.</li>
            </ul>

            <h3>How We Use Your Information</h3>

            <ul>
              <li>To provide and improve our services.</li>
              <li>To ensure security and prevent fraud.</li>
              <li>To communicate updates and important notifications.</li>
              <li>For analytics and performance tracking.</li>
            </ul>

            <h3>Data Protection &amp; Security</h3>

            <p>We implement strong security measures to protect user data from unauthorized access, loss, or misuse.</p>

            <h3>Third-Party Sharing</h3>

            <p>We do not sell or trade user data. However, we may share data with:</p>
            <ul>
              <li><strong>Service Providers</strong>: For platform functionality (e.g., analytics tools).</li>
              <li><strong>Legal Authorities</strong>: If required by law.</li>
            </ul>

            <h3>Your Rights</h3>

            <p>You have the right to:</p>
            <ul>
              <li>Access, update, or delete your data.</li>
              <li>Withdraw consent for data usage.</li>
              <li>Request a copy of your stored data.</li>
            </ul>

            <h3>Changes to This Policy</h3>

            <p>We may update this policy periodically. Any changes will be communicated on our platform.</p>

            <hr />

            <h2>Data Retention Policy</h2>

            <h3>Introduction</h3>

            <p>At <strong>DonorSync</strong>, we are committed to protecting user data. This policy explains how long we retain user information and when it is deleted.</p>

            <h3>Data We Retain</h3>

            <ul>
              <li><strong>Personal Data</strong>: Name, contact details, and donor history.</li>
              <li><strong>Technical Data</strong>: Login records, IP addresses, and browser details.</li>
              <li><strong>Usage Data</strong>: Platform interactions and preferences.</li>
            </ul>

            <h3>Retention Period</h3>

            <ul>
              <li><strong>User accounts</strong>: Data is retained as long as the account is active.</li>
              <li><strong>Transaction records</strong>: Stored for <strong>[Insert Duration]</strong> for compliance and auditing.</li>
              <li><strong>Inactive accounts</strong>: Deleted after <strong>[Insert Duration]</strong> of inactivity.</li>
              <li><strong>Legal compliance</strong>: Data required by law is retained as mandated.</li>
            </ul>

            <h3>Data Deletion</h3>

            <p>Users can request data deletion by contacting us. Once approved, data is permanently removed from our systems within <strong>[Insert Timeframe]</strong>.</p>

            <h3>Third-Party Data Sharing</h3>

            <p>Data shared with third-party services follows their retention policies. Refer to their privacy policies for details.</p>

            <h3>Policy Updates</h3>

            <p>We may update this policy periodically. Changes will be reflected with an updated date.</p>

            <hr />

            <h2>Security Policy &amp; Disclaimer</h2>

            <h3>General Information</h3>

            <p><strong>DonorSync</strong> is a platform that facilitates connections between blood donors, hospitals, and recipients. We do not directly collect, test, or distribute blood.</p>

            <h3>Medical Disclaimer</h3>

            <ul>
              <li>Our platform does not provide medical advice, diagnosis, or treatment.</li>
              <li>Donors and recipients should consult healthcare professionals before any transfusion.</li>
              <li>Hospitals are responsible for verifying donor eligibility and blood safety.</li>
            </ul>

            <h3>Liability Limitations</h3>

            <ul>
              <li>We are not liable for any medical complications arising from blood donations or transfusions.</li>
              <li>We do not guarantee blood availability at all times.</li>
              <li>We are not responsible for any misrepresentation by donors, hospitals, or recipients.</li>
            </ul>

            <h3>Data &amp; Privacy</h3>

            <ul>
              <li>User data is protected as per our Privacy Policy.</li>
              <li>We do not share personal data with unauthorized third parties.</li>
            </ul>

            <h3>Third-Party Links</h3>

            <ul>
              <li>Our platform may contain links to hospital websites or external organizations.</li>
              <li>We do not endorse or take responsibility for external content or services.</li>
            </ul>

            <h3>Changes to This Disclaimer</h3>

            <p>This disclaimer may be updated periodically. Users will be notified of major changes.</p>

            <hr />

            <h3>Contact Us</h3>

            <p>For inquiries regarding this disclaimer, contact us:</p>

            <p><strong>Email:</strong> <a href="mailto:reach.saad@outlook.com" className="text-primary hover:underline">reach.saad@outlook.com</a></p>
          </article>
        </div>

        <Footer />
      </ScrollArea>
    </ClientPortal>
  );
}
