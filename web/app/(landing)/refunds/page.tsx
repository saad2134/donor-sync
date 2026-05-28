// app/refunds/page.tsx
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { APP_CONFIG } from "@/config/CORE_CONFIG";

export const metadata = {
  title: `Refunds Policy | ${APP_CONFIG.appName}`,
  description: `Read this to understand about how the ${APP_CONFIG.appName} platform handles refunds.`,
};

export default function RefundPolicyPage() {
  return (
    <ClientPortal>
      <ScrollArea className="h-screen absolute-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <BusinessNavbar />

        {/* Refunds content */}
        <div className="max-w-2xl mx-auto p-10 pt-20 pb-20 text-foreground scrollbar-hide">
          <br /><br />
          <article className="prose 
    prose-headings:text-foreground 
    prose-p:text-foreground 
    prose-li:text-foreground 
    prose-strong:text-foreground">
            <h1><b>Refund Policy</b></h1>

            <p><em>Last updated: 24-12-2025 (DD-MM-YYYY)</em></p>

            <h2>Introduction</h2>

            <p>At <strong>DonorSync</strong>, we strive to provide a seamless experience and keep things as accessible to the people in need as possible. This Refund Policy outlines the conditions for refunds (if applicable).</p>

            <h2>Refund Eligibility</h2>

            <p>Refunds apply only to:</p>
            <ul>
              <li>Services or feature subscription payments (if any) (this policy focuses on this).</li>
              <li>Partnerships (refund terms as per agreement basis and this policy does not apply).</li>
              <li>Accidental duplicate payments.</li>
            </ul>

            <h2>Non-Refundable Items</h2>

            <ul>
              <li>Donations made to the platform.</li>
              <li>Sponsorship payments made to the platform.</li>
            </ul>

            <h2>Refund Process</h2>

            <p>To request a refund:</p>
            <ol>
              <li>Contact us within <strong>14 calendar days</strong> of the transaction.</li>
              <li>Provide payment proof and a reason for the refund request.</li>
              <li>We will review and respond within <strong>14 calendar days</strong>.</li>
            </ol>

            <h2>Processing Time</h2>

            <p>Approved refunds will be processed within <strong>7 business days</strong> and credited via the original payment method.</p>

            <h2>Policy Updates</h2>

            <p>We may modify this policy as needed. Changes will be posted here with the latest update date.</p>

            <h2>Contact Us</h2>

            <p>For refund inquiries, reach out to us:</p>

            <p><strong>Email:</strong> <a href="mailto:reach.saad@outlook.com" className="text-primary hover:underline">reach.saad@outlook.com</a></p>
          </article>
        </div>

        <Footer />
      </ScrollArea>
    </ClientPortal>
  );
}
