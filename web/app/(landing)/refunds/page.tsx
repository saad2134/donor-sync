// app/refunds/page.tsx
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { APP_CONFIG } from "@/config/CORE_CONFIG";
import Link from "next/link";

export const metadata = {
  title: `Refunds & Payment Policy | ${APP_CONFIG.appName}`,
  description: `Official Refund, Financial Contribution, and Payment Policy for the ${APP_CONFIG.appName} platform.`,
};

export default function RefundPolicyPage() {
  return (
    <ClientPortal>
      <ScrollArea className="h-screen absolute-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <BusinessNavbar />

        {/* Refunds content */}
        <div className="max-w-4xl mx-auto p-6 md:p-12 pt-24 pb-24 text-foreground scrollbar-hide">
          <article className="prose prose-slate dark:prose-invert max-w-none 
            prose-headings:text-foreground 
            prose-p:text-foreground/90 
            prose-li:text-foreground/90 
            prose-strong:text-foreground 
            prose-a:text-primary hover:prose-a:underline">
            
            <header className="border-b border-border/40 pb-6 mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Refund &amp; Financial Policy</h1>
              <p className="text-sm text-muted-foreground font-medium">
                Last updated: <strong>{APP_CONFIG.last_updated_legal || "19th December 2025"}</strong> | Version 1.1.0
              </p>
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-sm mt-4 leading-relaxed">
                <strong>CORE FINANCIAL PRINCIPLE:</strong> All core search, patient assistance, and voluntary donor matchmaking features on {APP_CONFIG.appName} are provided <strong>100% free of charge</strong>. This policy governs voluntary platform sponsorships, donations, and any future institutional premium/API tiers.
              </div>
            </header>

            <section>
              <h2>1. Introduction &amp; Financial Structure</h2>
              <p>
                <strong>{APP_CONFIG.appName}</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is an open-source, community-focused healthcare technology platform designed to save lives by bridging the gap between blood donors, hospitals, and patients in need.
              </p>
              <p>
                To maintain server infrastructure, database storage, API integrations, and uptime, the Platform accepts voluntary charitable sponsorships, donations, and may offer specialized institutional services to partner organizations. This Refund Policy sets forth the strict terms governing all financial transactions on the Platform.
              </p>
            </section>

            <section>
              <h2>2. Voluntary Donations &amp; Platform Sponsorships (Strictly Non-Refundable)</h2>
              <p>
                <strong>All voluntary financial contributions, gifts, tips, grant payments, and sponsorships made to {APP_CONFIG.appName} are final and strictly non-refundable.</strong>
              </p>
              <ul>
                <li><strong>Voluntary Nature:</strong> When you sponsor or donate to {APP_CONFIG.appName}, you acknowledge that your contribution is given freely and voluntarily without any expectation of commercial goods, clinical services, or proprietary returns.</li>
                <li><strong>Immediate Allocation:</strong> Donated funds are immediately applied toward active server hosting expenses, third-party API quotas (such as authentication and database costs), maintenance tools, and open-source project development.</li>
                <li><strong>Tax Exemption Status:</strong> Unless explicitly accompanied by official non-profit 501(c)(3) or 80G documentation from an authorized partner entity, voluntary contributions may not be tax-deductible in your jurisdiction.</li>
              </ul>
            </section>

            <section>
              <h2>3. Paid Institutional Services &amp; Premium Features (If Applicable)</h2>
              <p>
                Where fee-based institutional subscriptions, verified hospital dashboard tiers, or specialized enterprise API services are provided under formal service contracts:
              </p>
              
              <h3>A. Eligibility for Refund Consideration</h3>
              <p>A refund request for paid software services will be evaluated exclusively under the following narrow circumstances:</p>
              <ul>
                <li><strong>Accidental Duplicate Transaction:</strong> You were billed multiple times for the exact same subscription due to a verified payment gateway processing error;</li>
                <li><strong>Prolonged Service Inoperability:</strong> A major paid feature remained completely inaccessible or unusable for more than seven (7) consecutive business days solely due to an error within our technical infrastructure, and our engineering team was unable to rectify the issue within a reasonable grace period.</li>
              </ul>

              <h3>B. Non-Refundable Scenarios</h3>
              <p>Refunds will <strong>not</strong> be granted under any of the following conditions:</p>
              <ul>
                <li>Failure of external voluntary blood donors to respond, attend, or match requests (as {APP_CONFIG.appName} is an informational intermediary and does not control voluntary human donors);</li>
                <li>User change of mind, lack of usage, or organizational staff turnover;</li>
                <li>Accounts terminated, restricted, or banned due to violations of our <Link href="/terms">Terms of Service</Link> (including attempt to trade blood commercially, data scraping, harassment, or submitting fraudulent requests);</li>
                <li>Refund requests submitted more than fourteen (14) calendar days after the billing transaction date;</li>
                <li>Service disruptions resulting from third-party hosting failures (e.g., global Cloudflare, Vercel, or Firebase outages), internet routing failures, or force majeure events.</li>
              </ul>
            </section>

            <section>
              <h2>4. Formal Refund Request Procedure</h2>
              <p>
                To initiate a formal refund review for eligible transactions, you must submit a written request adhering to the following protocol:
              </p>
              <ol>
                <li>
                  <strong>Written Notice:</strong> Send an email to <a href="mailto:reach.saad@outlook.com" className="text-primary hover:underline">reach.saad@outlook.com</a> with the subject line <code>&quot;Formal Refund Request - [Transaction ID]&quot;</code> within <strong>14 calendar days</strong> of the transaction.
                </li>
                <li>
                  <strong>Required Documentation:</strong> You must include:
                  <ul>
                    <li>Official payment receipt or transaction reference number;</li>
                    <li>The registered email address associated with the account;</li>
                    <li>A detailed, factual explanation of the billing anomaly or technical malfunction.</li>
                  </ul>
                </li>
                <li>
                  <strong>Investigation Window:</strong> Our financial team will review the transaction logs, verify system telemetry, and deliver a written determination within <strong>7 to 14 business days</strong>.
                </li>
                <li>
                  <strong>Disbursement of Funds:</strong> If approved, refunds will be credited exclusively back to the <strong>original payment method or card</strong> used during the initial transaction within seven (7) business days. For anti-money laundering (AML) compliance, no cash disbursements or redirects to third-party bank accounts will be made.
                </li>
              </ol>
            </section>

            <section>
              <h2>5. Chargebacks, Payment Disputes &amp; Anti-Fraud Protection</h2>
              <p>
                We maintain a zero-tolerance policy against fraudulent chargebacks and payment disputes.
              </p>
              <ul>
                <li><strong>Obligation to Contact Us First:</strong> You agree to contact our support team and exhaust all informal dispute resolution avenues prior to initiating a dispute or chargeback with your bank or payment provider.</li>
                <li><strong>Immediate Account Suspension:</strong> In the event of an unjustified chargeback or payment reversal initiated without prior notification, {APP_CONFIG.appName} reserves the right to immediately suspend or permanently terminate the associated user account and institutional access.</li>
                <li><strong>Recovery of Fees:</strong> We reserve the right to seek reimbursement for all statutory dispute fees, chargeback fines, administrative costs, and reasonable legal expenses incurred as a result of fraudulent or bad-faith payment disputes.</li>
              </ul>
            </section>

            <section>
              <h2>6. Policy Modifications</h2>
              <p>
                We reserve the right to amend, update, or revise this Refund &amp; Financial Policy at any time to accommodate new payment methods, platform enhancements, or legal standards. Changes become effective immediately upon posting to this page.
              </p>
            </section>

            <section>
              <h2>7. Contact Us</h2>
              <p>
                For inquiries, billing clarifications, or refund requests, please contact our billing administration:
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
