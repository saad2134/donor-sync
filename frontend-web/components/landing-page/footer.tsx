"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from 'next/link'

import {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "@/components/ui/footer";

import { TextHoverEffect } from "@/components/ui/text-hover-effect";



export const FooterLogo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2  py-1 text-sm font-normal text-black">

      <img
        src="/donor-sync-icon-rounder.svg"
        alt="logo"
        width={30}
        height={30}
      />
      <h1 className="font-medium text-xl text-black dark:text-white">DonorSync</h1>

    </Link>
  );
};

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface SocialMediaLink {
  name: string;
  href: string;
  icon: ReactNode;
}

interface FooterProps {
  logo?: ReactNode;
  name?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  socialMedia?: SocialMediaLink[];
  showModeToggle?: boolean;
  className?: string;
}

// Social Media Icons using foreground color
const SocialIcons = {
  Twitter: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  ),
  GitHub: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  LinkedIn: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.24 14.815 3.75 13.664 3.75 12.367s.49-2.448 1.376-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.886.875 1.376 2.026 1.376 3.323s-.49 2.448-1.376 3.323c-.875.807-2.026 1.297-3.323 1.297zm8.062-9.723c-.457 0-.828-.37-.828-.828 0-.457.37-.828.828-.828s.828.37.828.828c0 .457-.37.828-.828.828zm1.782 4.723c0 1.297-.49 2.448-1.376 3.323-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.886-.875-1.376-2.026-1.376-3.323s.49-2.448 1.376-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.886.875 1.376 2.026 1.376 3.323z" />
    </svg>
  ),
  YouTube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  Discord: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  ),
  Threads: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161" />
    </svg>
  )
};

export default function FooterSection({
  logo = <FooterLogo />,
  name = "DonorSync",
  columns = [
    {
      title: "Explore",
      links: [
        { text: "Home", href: "/" },
        { text: "About", href: "/about" },
        { text: "Our Team", href: "/our-team" },
        { text: "Contact", href: "/contact" },
        // { text: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Platform",
      links: [
        { text: "Pricing", href: "/pricing" },
        { text: "Partner with Us", href: "/partner" },
        { text: "Sponsor Us & Donate", href: "/sponsor-n-donate" },
      ],
    },
    {
      title: "Legal",
      links: [
        { text: "Terms of Service", href: "/terms" },
        { text: "Privacy Policy", href: "/privacy" },
        { text: "Cookie Policy", href: "/cookies" },
        { text: "Refunds Policy", href: "/refunds" },
      ],
    },
  ],
  copyright = `© ${Number.isFinite(new Date().getFullYear()) ? new Date().getFullYear() : 2025} DonorSync. All rights reserved.`,
  policies = [
    { text: "Privacy Policy", href: '/privacy' },
    { text: "Terms of Service", href: '/terms' },
  ],
  socialMedia = [
    {
      name: "GitHub", href: "https://github.com/saad2134/donor-sync",
      icon: undefined
    },
    {
      name: "YouTube", href: "https://www.youtube.com/channel/UCTI7SEmg33EvWtn0j0RFzXg",
      icon: undefined
    }, 
    /* {
      name: "Instagram", href: "https://www.instagram.com/_com/",
      icon: undefined
    },
    {
      name: "Threads", href: "https://www.threads.com/@_com",
      icon: undefined
    },
    {
      name: "Facebook", href: "https://www.facebook.com/profile.php?id=61582116868060",
      icon: undefined
    }, */

    /*
    {
      name: "GitHub", href: "https://github.com/",
      icon: undefined
    },
    {
      name: "LinkedIn", href: "https://linkedin.com/company/",
      icon: undefined
    }, */
  ],
  showModeToggle = true,
  className,
}: FooterProps) {
  return (
    <footer className={cn("bg-background w-full px-8 py-12", className)}>
      <div className="max-w-7xl mx-auto">
        <Footer>
          {/* Main Footer Content */}
          <FooterContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Logo Column - spans 2 columns on desktop */}
            <FooterColumn className="lg:col-span-2">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  {logo}

                </div>
                <p className="text-muted-foreground text-sm max-w-md">
                  A comprehensive open-source web-based platform that connects blood donors directly with hospitals, and hospitals with patients, and even NGOs ensuring quick and efficient blood donation.
                </p>

                {/* Social Media Icons */}
                {socialMedia.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {/* <h4 className="text-sm font-semibold text-foreground">
                      Follow Us
                    </h4> */}
                    <div className="flex items-center gap-4">
                      {socialMedia.map((social, index) => (
                        <Link
                          href={social.href}
                          key={index}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                          aria-label={`Follow us on ${social.name}`}>

                          {SocialIcons[social.name as keyof typeof SocialIcons] || (
                            <div className="w-5 h-5 bg-muted-foreground rounded" />
                          )}

                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FooterColumn>

            {/* Dynamic Columns - auto distribution */}
            {columns.map((column, index) => (
              <FooterColumn key={index} className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {column.title}
                </h3>
                <div className="flex flex-col gap-3">
                  {column.links.map((link, linkIndex) => (
                    <Link
                      href={link.href}
                      key={linkIndex}
                      className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200">

                      {link.text}

                    </Link>
                  ))}
                </div>
              </FooterColumn>
            ))}
          </FooterContent>

          {/* Footer Bottom Section */}
          <FooterBottom className="flex flex-row justify-center items-center mt-10 gap-4">
            <div className="flex items-center justify-center w-full text-sm text-muted-foreground/75 pt-4">
              <div className="text-muted-foreground/75 text-center">
                {copyright}
                <p className="text-muted-foreground/25 text-center select-none">
                <br />
                Originally built with 💖 as a prototype for the{" "}
                <a
                  href="https://vision.hack2skill.com/event/solutionschallenge2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Google Developer Group (GDG) on Campus Solution Challenge India 2025 Hackathon
                </a>.
                <br />
                Disclaimers: We are not responsible for the content of any external sites we may link to. All 3rd party IP such as logos, icons, etc. shown are the property of their respective owners.
                </p>
              </div>
              
            </div>
          </FooterBottom>
        </Footer>
      </div>
      <div className="xl:h-[18rem] lg:h-[13rem] md:h-[10rem] h-[4rem] flex items-center justify-center">
        <TextHoverEffect text="DONORSYNC" />
      </div>
    </footer>
  );
}