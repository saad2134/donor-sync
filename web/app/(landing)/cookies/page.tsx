// app/cookies/page.tsx
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { APP_CONFIG } from "@/config/CORE_CONFIG";
import Link from "next/link";

export const metadata = {
  title: `Cookie Policy | ${APP_CONFIG.appName}`,
  description: `Official Cookie & Tracking Technologies Policy for the ${APP_CONFIG.appName} platform.`,
};

export default function CookiesPage() {
  return (
    <ClientPortal>
      <ScrollArea className="h-screen absolute-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <BusinessNavbar />

        {/* cookies content */}
        <div className="max-w-4xl mx-auto p-6 md:p-12 pt-24 pb-24 text-foreground scrollbar-hide">
          <article className="prose prose-slate dark:prose-invert max-w-none 
            prose-headings:text-foreground 
            prose-p:text-foreground/90 
            prose-li:text-foreground/90 
            prose-strong:text-foreground 
            prose-a:text-primary hover:prose-a:underline">
            
            <header className="border-b border-border/40 pb-6 mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Cookie &amp; Tracking Technologies Policy</h1>
              <p className="text-sm text-muted-foreground font-medium">
                Last updated: <strong>{APP_CONFIG.last_updated_legal || "19th December 2025"}</strong> | Version 1.1.0
              </p>
              <div className="p-4 rounded-lg bg-slate-500/10 border border-slate-500/30 text-foreground text-sm mt-4 leading-relaxed">
                <strong>TRANSPARENCY NOTICE:</strong> This Cookie Policy explains how {APP_CONFIG.appName} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies, local storage, session tokens, and similar web technologies to ensure platform functionality, authenticate users, protect against abuse, and understand service performance.
              </div>
            </header>

            <section>
              <h2>1. What Are Cookies and Local Storage Technologies?</h2>
              <p>
                A <strong>cookie</strong> is a small data file transferred to your computer or mobile device by a web server. It enables the website to remember your actions and preferences (such as login state, theme selection, and language) over a period of time, eliminating the need to re-enter them whenever you return to the site or navigate between pages.
              </p>
              <p>
                In addition to standard HTTP cookies, we may utilize modern web storage technologies such as <strong>HTML5 LocalStorage</strong>, <strong>SessionStorage</strong>, and <strong>IndexedDB</strong> to store client-side state efficiently without transmitting unnecessary data in every network header.
              </p>
            </section>

            <section>
              <h2>2. Why We Use Cookies &amp; Tracking Technologies</h2>
              <p>
                {APP_CONFIG.appName} uses cookies and web storage strictly for functional, security, preference, and analytical purposes. We do not use intrusive spyware or third-party behavioral advertising trackers to harvest cross-site profiles of our users.
              </p>
            </section>

            <section>
              <h2>3. Categories of Cookies We Employ</h2>
              
              <h3>A. Strictly Necessary &amp; Security Cookies (Essential)</h3>
              <p>
                These cookies and storage items are fundamental to the operation of the Platform. Without them, core services—such as secure login authentication, CSRF attack prevention, session routing, and API rate limiting—cannot function.
              </p>
              <ul>
                <li><strong>Authentication Tokens:</strong> Securely persist your verified session so you do not need to repeatedly re-authenticate;</li>
                <li><strong>Security &amp; Integrity:</strong> Detect automated bots, prevent credential stuffing, and safeguard against Server-Side Request Forgery (SSRF) and Cross-Site Scripting (XSS);</li>
                <li><strong>Load Balancing:</strong> Route network requests efficiently to the nearest active server cluster.</li>
              </ul>

              <h3>B. Preference &amp; Functionality Storage</h3>
              <p>
                These items enable the Platform to remember your personalized choices and configuration settings:
              </p>
              <ul>
                <li><strong>Theme Preferences:</strong> Storing your selection of Dark Mode or Light Mode;</li>
                <li><strong>Localization &amp; Language:</strong> Preserving your chosen language / regional locale settings;</li>
                <li><strong>UI State &amp; Dismissals:</strong> Remembering if you have acknowledged notices, alerts, or onboarding guides.</li>
              </ul>

              <h3>C. Performance &amp; Operational Analytics</h3>
              <p>
                These cookies help us understand how users interact with the Platform by collecting aggregated, anonymized metrics (such as page response latencies, popular navigation paths, and error codes). This information is used exclusively to optimize performance, eliminate bugs, and improve healthcare connectivity workflows.
              </p>
            </section>

            <section>
              <h2>4. Third-Party Cookies &amp; External Integrations</h2>
              <p>
                Certain third-party service providers embedded within our application may set their own cookies on your device when you interact with specific features:
              </p>
              <ul>
                <li>
                  <strong>Phone.Email Verification Widget:</strong> When initiating phone or email OTP verification via Phone.Email scripts (<code>verify_email_v1.js</code> and <code>sign_in_button_v1.js</code>), Phone.Email may set session cookies to manage the verification handshake.
                </li>
                <li>
                  <strong>Firebase / Google Cloud:</strong> Used for client SDK authentication state, real-time database listeners, and secure Firestore communication.
                </li>
                <li>
                  <strong>Uploadcare:</strong> Used during media and profile image uploads to handle multipart file processing securely.
                </li>
                <li>
                  <strong>Hosting &amp; CDN (Vercel):</strong> Edge routing, caching, and server health telemetry.
                </li>
              </ul>
              <p>
                We do not control the independent data collection of external third-party domains. You are encouraged to review the respective privacy and cookie policies of these third-party services.
              </p>
            </section>

            <section>
              <h2>5. Cookie Management &amp; Opt-Out Controls</h2>
              <p>
                You have the absolute right to decide whether to accept or reject non-essential cookies. You can configure your browser settings to accept, reject, or alert you whenever a cookie is set.
              </p>
              <p>Here is how to manage cookie preferences across common browsers:</p>
              <ul>
                <li><strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data;</li>
                <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data;</li>
                <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data;</li>
                <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies and site data.</li>
              </ul>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm my-4 leading-relaxed">
                <strong>NOTE ON DISABLING COOKIES:</strong> If you choose to reject or block strictly necessary cookies or local storage, significant portions of the {APP_CONFIG.appName} platform (such as account login, donor dashboard, and verification tools) may fail to operate properly.
              </div>
            </section>

            <section>
              <h2>6. &quot;Do Not Track&quot; (DNT) &amp; Global Privacy Control (GPC)</h2>
              <p>
                Some web browsers transmit &quot;Do Not Track&quot; (DNT) or &quot;Global Privacy Control&quot; (GPC) signals. Because there is currently no universal industry standard for interpreting DNT signals, our Platform does not alter its data collection practices upon receiving DNT headers, but we honor your explicit cookie configuration choices and privacy selections at all times.
              </p>
            </section>

            <section>
              <h2>7. Policy Revisions</h2>
              <p>
                We may periodically update this Cookie Policy to reflect technical upgrades, changes in web technologies, or modifications in regulatory requirements. The &quot;Last updated&quot; timestamp at the top of this document will always reflect the date of the most recent revision.
              </p>
            </section>

            <section>
              <h2>8. Contact Information</h2>
              <p>
                If you have questions, comments, or concerns about our use of cookies and tracking technologies, please contact us:
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
