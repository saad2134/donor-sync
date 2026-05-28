// app/cookies/page.tsx
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { APP_CONFIG } from "@/config/CORE_CONFIG";

export const metadata = {
  title: `Cookie Policy | ${APP_CONFIG.appName}`,
  description: `Read this to understand about how the ${APP_CONFIG.appName} platform uses cookies.`,
};

export default function CookiesPage() {
  return (
    <ClientPortal>
      <ScrollArea className="h-screen absolute-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <BusinessNavbar />

        {/* cookies content */}
        <div className="max-w-2xl mx-auto p-10 pt-20 pb-20 text-foreground scrollbar-hide">
          <br /><br />
          <article className="prose 
    prose-headings:text-foreground 
    prose-p:text-foreground 
    prose-li:text-foreground 
    prose-strong:text-foreground">
            <h1>Cookie Policy</h1>

            <p><em>Last updated: 24-12-2025 (DD-MM-YYYY)</em></p>

            <h2>Introduction</h2>

            <p>Welcome to <strong>DonorSync</strong>. This Cookie Policy outlines how we use cookies and similar tracking technologies to enhance user experience, ensure security, and improve our services.</p>

            <h2>What Are Cookies?</h2>

            <p>Cookies are small text files stored on your device when you visit a website. They help improve website functionality, personalize content, and track user behavior.</p>

            <h2>Types of Cookies We Use</h2>

            <ul>
              <li><strong>Essential Cookies</strong>: Necessary for core features such as login authentication, security, and session management.</li>
              <li><strong>Analytics Cookies</strong>: Collect anonymized data on user interactions to optimize performance and usability.</li>
              <li><strong>Functional Cookies</strong>: Remember user preferences like language settings for a customized experience.</li>
              <li><strong>Advertising Cookies</strong> (if applicable): Track user interests to deliver relevant advertisements and marketing materials.</li>
            </ul>

            <h2>Managing Your Cookie Preferences</h2>

            <p>You can control and disable cookies through your browser settings. However, blocking essential cookies may impact platform functionality and user experience.</p>

            <h2>Third-Party Cookies</h2>

            <p>We integrate third-party tools such as Google Analytics, which may set their own cookies. Please refer to their respective privacy policies for more information on how they use your data.</p>

            <h2>Policy Updates</h2>

            <p>We may update this policy periodically to reflect changes in regulations or our cookie usage practices. Any updates will be posted here with the latest revision date.</p>

            <h2>Contact Us</h2>

            <p>For inquiries regarding this Cookie Policy, please reach out to us:</p>

            <p><strong>Email:</strong> reach.saad@outlook.com</p>
          </article>
        </div>

        <Footer />
      </ScrollArea>
    </ClientPortal>
  );
}
