// app/terms/page.tsx
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { APP_CONFIG } from "@/config/CORE_CONFIG";
import Link from "next/link";

export const metadata = {
  title: `Terms of Service | ${APP_CONFIG.appName}`,
  description: `Official Terms of Service, Legal Disclaimers, and User Agreement for the ${APP_CONFIG.appName} platform.`,
};

export default function TermsPage() {
  return (
    <ClientPortal>
      <ScrollArea className="h-screen absolute-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <BusinessNavbar />

        {/* Terms and Conditions content */}
        <div className="max-w-4xl mx-auto p-6 md:p-12 pt-24 pb-24 text-foreground scrollbar-hide">
          <article className="prose prose-slate dark:prose-invert max-w-none 
            prose-headings:text-foreground 
            prose-p:text-foreground/90 
            prose-li:text-foreground/90 
            prose-strong:text-foreground 
            prose-a:text-primary hover:prose-a:underline">
            
            <header className="border-b border-border/40 pb-6 mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Terms of Service &amp; Legal Disclaimers</h1>
              <p className="text-sm text-muted-foreground font-medium">
                Last updated: <strong>{APP_CONFIG.last_updated_legal || "19th December 2025"}</strong> | Version 1.1.0
              </p>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm mt-4 leading-relaxed">
                <strong>IMPORTANT NOTICE:</strong> PLEASE READ THESE TERMS CAREFULLY BEFORE ACCESSING OR USING THE {APP_CONFIG.appName.toUpperCase()} PLATFORM. BY ACCESSING, REGISTERING, OR USING ANY PART OF THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND UNCONDITIONALLY AGREE TO BE BOUND BY THESE TERMS, INCLUDING THE MEDICAL DISCLAIMERS, ARBITRATION AGREEMENT, AND LIMITATIONS OF LIABILITY.
              </div>
            </header>

            <section>
              <h2>1. Agreement to Terms</h2>
              <p>
                These Terms of Service (&quot;Terms&quot;, &quot;Agreement&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;), whether individually or on behalf of an entity, and the operators, creators, contributors, maintainers, and affiliates of <strong>{APP_CONFIG.appName}</strong> (&quot;{APP_CONFIG.appName}&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), governing your access to and use of the {APP_CONFIG.appName} website, web application, APIs, and associated communication channels (collectively, the &quot;Platform&quot; or &quot;Service&quot;).
              </p>
              <p>
                If you do not agree to all terms and conditions stated herein, you are expressly prohibited from using the Platform and must discontinue use immediately.
              </p>
            </section>

            <section>
              <h2>2. Platform Nature &amp; Pure Intermediary Status (Not a Healthcare Provider)</h2>
              <p>
                <strong>{APP_CONFIG.appName} is strictly an open-source informational technology communications platform and digital intermediary.</strong>
              </p>
              <ul>
                <li><strong>No Medical Operations:</strong> {APP_CONFIG.appName} is <em>not</em> a medical facility, healthcare provider, blood bank, blood transfusion service, blood storage center, diagnostic laboratory, or emergency response dispatcher.</li>
                <li><strong>No Medical Oversight:</strong> {APP_CONFIG.appName} does not practice medicine, offer clinical advice, formulate medical diagnoses, perform medical assessments, or supervise blood collection, cross-matching, testing, storage, or transfusion procedures.</li>
                <li><strong>Intermediary Only:</strong> Our Service functions solely as an online directory and communication facilitator to connect voluntary blood donors, patients/recipients, medical institutions, and non-profit organizations. We exercise no clinical or physical control over any party using the Platform.</li>
              </ul>
            </section>

            <section>
              <h2>3. Critical Emergency Medical Services Disclaimer</h2>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-foreground text-sm my-4 leading-relaxed">
                <strong>DO NOT RELY ON {APP_CONFIG.appName.toUpperCase()} FOR IMMEDIATE LIFE-THREATENING EMERGENCIES.</strong>
                <br />
                If you or someone you know is experiencing a life-threatening medical emergency, traumatic hemorrhage, critical surgical emergency, or acute medical condition, immediately call your national or local emergency helpline (e.g., <strong>112</strong>, <strong>911</strong>, <strong>999</strong>, or <strong>108</strong>) or proceed immediately to the nearest hospital emergency trauma center. {APP_CONFIG.appName} cannot guarantee immediate response times or donor availability.
              </div>
            </section>

            <section>
              <h2>4. Zero Medical Warranty &amp; Donor Screening Disclaimer</h2>
              <p>
                You explicitly recognize and agree that:
              </p>
              <ul>
                <li><strong>No Independent Verification of Donors:</strong> {APP_CONFIG.appName} does not physically inspect, clinically screen, lab-test, verify the identity of, or assess the infectious disease status (including but not limited to HIV, Hepatitis B/C, Syphilis, Malaria) or general health fitness of any registered donor.</li>
                <li><strong>Hospital / Blood Bank Sole Responsibility:</strong> Licensed hospitals, certified blood banks, and qualified medical professionals bear 100% sole and absolute legal and clinical responsibility for conducting mandatory donor screening, serological testing, hemoglobin checks, pathogen screening, cross-matching, and blood safety compliance in strict adherence to applicable national laws (e.g., Drugs and Cosmetics Act and Rules, National Blood Transfusion Council guidelines, or equivalent regional medical regulations).</li>
                <li><strong>No Guarantee of Blood Availability or Compatibility:</strong> We do not warrant that any voluntary donor will be reachable, available, willing, medically eligible, or compatible for any specific request or transfusion.</li>
              </ul>
            </section>

            <section>
              <h2>5. Absolute Prohibition of Commercial Blood Trading</h2>
              <p>
                <strong>Human blood and blood components are non-commercial voluntary biological gifts.</strong>
              </p>
              <ul>
                <li>The sale, purchase, brokering, commercial exchange, or solicitation of money, financial kickbacks, gifts, or tangible consideration in exchange for blood or blood donation is <strong>strictly prohibited</strong> on this Platform and violates national and international laws.</li>
                <li>Any user, organization, or intermediary found attempting to buy, sell, or commercially broker blood donations will face immediate permanent account termination and will be reported to competent law enforcement and regulatory authorities.</li>
              </ul>
            </section>

            <section>
              <h2>6. User Eligibility, Accounts &amp; Authentication</h2>
              <ul>
                <li><strong>Age Requirement:</strong> You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to register an account, offer voluntary blood donations, or submit hospital requests.</li>
                <li><strong>Account Integrity:</strong> You agree to provide accurate, truthful, current, and complete information during registration and keep your profile updated. Impersonating any medical institution, physician, patient, or other individual is strictly prohibited.</li>
                <li><strong>Credential Confidentiality:</strong> You are solely responsible for safeguarding your login credentials and one-time authentication tokens. You agree to notify us immediately of any unauthorized access to your account.</li>
              </ul>
            </section>

            <section>
              <h2>7. Prohibited Uses &amp; Platform Security</h2>
              <p>You agree not to engage in any of the following prohibited activities:</p>
              <ul>
                <li>Submitting fabricated, fraudulent, deceptive, malicious, or prank emergency blood requests;</li>
                <li>Harvesting, scraping, copying, collecting, or compiling donor contact information, phone numbers, or emails for commercial marketing, spamming, unsolicited outreach, stalking, or harassment;</li>
                <li>Reverse engineering, decompiling, probing, fuzzing, or launching denial-of-service (DoS) attacks against our infrastructure or APIs;</li>
                <li>Introducing viruses, trojans, worms, logic bombs, or other technologically harmful material;</li>
                <li>Bypassing or circumventing authentication systems, access controls, rate limiters, or security measures;</li>
                <li>Using the Platform for any purpose that violates local, state, national, or international healthcare laws or regulations.</li>
              </ul>
            </section>

            <section>
              <h2>8. Intellectual Property &amp; Open Source Licensing</h2>
              <p>
                The {APP_CONFIG.appName} source code is distributed under the <strong>GNU General Public License v3.0 (GPL-3.0)</strong>. All software provided under this license is subject to the terms and disclaimers set forth in the <Link href="https://github.com/saad2134/donor-sync/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">GPL-3.0 License</Link>.
              </p>
              <p>
                All trademarks, trade names, logos, brand names, service marks, and third-party intellectual property displayed on the Platform are the property of their respective owners and are used for identification and informational purposes only.
              </p>
            </section>

            <section>
              <h2>9. Third-Party Integrations &amp; External Services</h2>
              <p>
                The Platform relies on third-party infrastructure and services (including but not limited to Firebase, Uploadcare, Phone.Email authentication, Google Gemini API, map providers, and Vercel hosting). We do not control, endorse, or assume responsibility for the availability, uptime, accuracy, security, or practices of any third-party providers. Your interactions with third-party providers are governed by their respective terms and policies.
              </p>
            </section>

            <section>
              <h2>10. Disclaimer of Warranties (&quot;AS IS&quot; and &quot;AS AVAILABLE&quot;)</h2>
              <div className="p-4 rounded-lg bg-muted border border-border text-foreground text-sm my-4 leading-relaxed uppercase font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE PLATFORM, SERVICES, AND ALL CONTENT ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
              </div>
              <p>
                WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, NON-INFRINGEMENT, SERVICE AVAILABILITY, CONTINUOUS UPTIME, DATA INTEGRITY, AND FREEDOM FROM COMPUTER VIRUSES OR OTHER HARMFUL CODE.
              </p>
              <p>
                WE MAKE NO WARRANTY THAT THE PLATFORM WILL MEET YOUR REQUIREMENTS, ACHIEVE ANY INTENDED RESULTS, BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT ANY DEFECTS WILL BE DETECTED OR CORRECTED.
              </p>
            </section>

            <section>
              <h2>11. Limitation of Liability</h2>
              <div className="p-4 rounded-lg bg-muted border border-border text-foreground text-sm my-4 leading-relaxed uppercase font-semibold">
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL {APP_CONFIG.appName.toUpperCase()}, ITS CREATORS, FOUNDERS, DEVELOPERS, CONTRIBUTORS, MAINTAINERS, AFFILIATES, PARTNERS, LICENSORS, OR AGENTS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES WHATSOEVER.
              </div>
              <p>
                This limitation covers, without limitation, damages for:
              </p>
              <ul>
                <li>Bodily injury, illness, infection, medical complications, disability, emotional distress, wrongful death, or personal injury arising out of or related to blood donation, transfusion, medical treatment, or interactions facilitated via the Platform;</li>
                <li>Loss of profits, loss of data, loss of goodwill, business interruption, or technological malfunction;</li>
                <li>Any conduct, misrepresentation, fraud, negligence, or breach by any third party, donor, patient, hospital, or organization;</li>
                <li>Any unauthorized access to, alteration of, or disclosure of user data or communications;</li>
                <li>Unavailability, delay, or failure of blood donation fulfillment or communications.</li>
              </ul>
              <p>
                UNDER NO CIRCUMSTANCES SHALL OUR AGGREGATE TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE USE OF THE PLATFORM EXCEED THE AMOUNT PAID BY YOU TO US (IF ANY) IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR USD $0.00 (ZERO DOLLARS), WHICHEVER IS LESS.
              </p>
            </section>

            <section>
              <h2>12. Indemnification (Hold Harmless)</h2>
              <p>
                You agree to defend, indemnify, and hold harmless {APP_CONFIG.appName}, its founders, project leads, developers, maintainers, contributors, collaborators, and agents from and against any and all claims, demands, liabilities, damages, judgments, awards, losses, costs, expenses, or legal fees (including reasonable attorneys&apos; fees) arising out of or relating to:
              </p>
              <ul>
                <li>Your access to, use of, or misuse of the Platform;</li>
                <li>Any data, information, or content you submit, post, or transmit through the Platform;</li>
                <li>Your violation of these Terms of Service, applicable laws, or the rights of any third party;</li>
                <li>Your participation in any blood donation, transfusion, medical transaction, or offline meeting arranged through the Platform;</li>
                <li>Any willful misconduct, gross negligence, misrepresentation, or fraud committed by you.</li>
              </ul>
            </section>

            <section>
              <h2>13. Dispute Resolution, Binding Arbitration &amp; Class Action Waiver</h2>
              <p>
                <strong>Informal Negotiations:</strong> To expedite resolution and minimize costs, you and {APP_CONFIG.appName} agree to first attempt to negotiate any dispute, controversy, or claim informally for at least thirty (30) days prior to initiating formal proceedings.
              </p>
              <p>
                <strong>Binding Arbitration:</strong> Any dispute arising out of or related to these Terms or the Platform that cannot be resolved through informal negotiations shall be settled by binding arbitration in accordance with standard commercial arbitration rules, rather than in court.
              </p>
              <p>
                <strong>Class Action Waiver:</strong> YOU AND {APP_CONFIG.appName.toUpperCase()} AGREE THAT EACH PARTY MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, OR REPRESENTATIVE PROCEEDING.
              </p>
            </section>

            <section>
              <h2>14. Governing Law &amp; Jurisdiction</h2>
              <p>
                These Terms and your use of the Platform are governed by and construed in accordance with the laws applicable to the administrative jurisdiction of the project maintainers, without giving effect to any conflict of law principles. Any legal action or proceeding not subject to arbitration shall be brought exclusively in the competent courts having jurisdiction over the maintainers.
              </p>
            </section>

            <section>
              <h2>15. Severability &amp; Entire Agreement</h2>
              <p>
                If any provision of these Terms is found to be invalid, illegal, or unenforceable by an arbitrator or court of competent jurisdiction, that provision shall be enforced to the maximum extent permissible, and the remaining provisions of these Terms shall remain in full force and effect. These Terms, together with our Privacy Policy, Cookie Policy, and Refund Policy, constitute the complete and exclusive agreement between you and {APP_CONFIG.appName}.
              </p>
            </section>

            <section>
              <h2>16. Contact &amp; Legal Notices</h2>
              <p>
                For questions, formal notices, or inquiries concerning these Terms of Service, please contact our legal and administrative team at:
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
