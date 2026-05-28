// app/terms/page.tsx
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { APP_CONFIG } from "@/config/CORE_CONFIG";

export const metadata = {
  title: `Terms of Service | ${APP_CONFIG.appName}`,
  description: `Read this to understand about the ${APP_CONFIG.appName} platform terms of service.`,
};

export default function TermsPage() {
  return (
    <ClientPortal>
      <ScrollArea className="h-screen absolute-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <BusinessNavbar />

        {/* Terms and Conditions content */}
        <div className="max-w-2xl mx-auto p-10 pt-20 pb-20 text-foreground scrollbar-hide">
          <br /><br />
          <article className="prose 
    prose-headings:text-foreground 
    prose-p:text-foreground 
    prose-li:text-foreground 
    prose-strong:text-foreground">
            <h1><b>Terms & Conditions</b></h1>

            <p><em>Last updated: 24-12-2025 (DD-MM-YYYY)</em></p>

            <h2>Introduction</h2>

            <p>Welcome to <strong>DonorSync</strong>. By using our platform, you agree to the following terms and conditions. Please read them carefully.</p>

            <h2>User Responsibilities</h2>

            <ul>
              <li>Provide accurate and truthful information.</li>
              <li>Use the platform only for lawful purposes.</li>
              <li>Do not misuse or exploit donor information.</li>
            </ul>

            <h2>Account & Data Security</h2>

            <ul>
              <li>Users are responsible for maintaining the confidentiality of their account credentials.</li>
              <li>We are not liable for unauthorized access due to user negligence.</li>
            </ul>

            <h2>Service Limitations</h2>

            <ul>
              <li>We do not guarantee donor availability at all times.</li>
              <li>Our platform does not provide medical advice; consult healthcare professionals for medical concerns.</li>
            </ul>

            <h2>Prohibited Activities</h2>

            <p>Users must not:</p>
            <ul>
              <li>Engage in fraudulent activities.</li>
              <li>Attempt to hack or disrupt the platform.</li>
              <li>Share false or misleading information.</li>
            </ul>

            <h2>Liability Disclaimer</h2>

            <p>We are not responsible for:</p>
            <ul>
              <li>Errors or inaccuracies in user-provided data.</li>
              <li>Any health-related complications from blood donations.</li>
              <li>Third-party misuse of shared data.</li>
            </ul>

            <h2>Policy Changes</h2>

            <p>We reserve the right to update these terms. Continued use of the platform after changes implies acceptance.</p>

            <h2>Contact Us</h2>

            <p>For any questions, contact us at:</p>

            <p><strong>Email:</strong> <a href="mailto:reach.saad@outlook.com" className="text-primary hover:underline">reach.saad@outlook.com</a></p>
          </article>
        </div>

        <Footer />
      </ScrollArea>
    </ClientPortal>
  );
}
