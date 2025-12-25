import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/BusinessNavbar";
import { ContactForm } from "@/components/landing-page/contact-form";

export const metadata = {
  title: "Contact Us | DonorSync",
  description: "Get in touch with the DonorSync team for support, inquiries, or collaboration opportunities.",
};

export default async function Contact() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-background text-foreground ">
      <Navbar />

      <section className="mx-auto  px-6 py-12 pt-40 md:pt-48 sm:gap-48 pb-40 absolute-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 flex justify-center items-center">
        <div className="max-w-6xl">
          {/* Background gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-[-1]"
            style={{
              background: 'linear-gradient(to right, var(--primary) 0%, transparent 50%, var(--primary) 100%)',
              opacity: 0.5
            }}
          />

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Any Issues? Want to Partner with us? Let's discuss how we can collaborate for the greater good.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                  <p className="text-muted-foreground mb-6">
                    Any queries or support needed? Interested in a partnership? Reach out and our team will get back to you within 24 hours.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="space-y-6">
                      <h3 className="font-semibold mb-4">Email Us</h3>
                      <div>
                        <p className="text-muted-foreground">For all inquiries:</p>
                        <a
                          href="mailto:contact@DonorSync.com"
                          className="text-primary hover:underline font-medium"
                        >
                          reach.saad@outlook.com
                        </a>
                      </div>

                    </div>

                  </div>

                  {/* <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>

                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Offices</h3>

                </div>
              </div> */}
                </div>

                <div className="bg-muted/50 p-6 rounded-lg relative overflow-hidden group hover:scale-105 transition-transform duration-300 ease-out">
                  {/* Slow shine effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-30 h-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent transform -skew-x-12 animate-slow-shine"></div>
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-semibold mb-2">Response Time</h3>
                    <p className="text-sm text-muted-foreground">
                      We typically respond to all inquiries within 24 hours during business days.
                      For urgent matters, please include "URGENT" in your subject line.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form 
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Send us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Tell us about your project or inquiry and we'll get back to you soon.
              </p>

              <ContactForm />
            </div>
          </div>*/}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}