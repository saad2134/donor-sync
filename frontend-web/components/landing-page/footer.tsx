export default function Footer() {
  return (
    <footer className="relative py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Links Footer Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pl-10 pr-10 pb-10">

          <div>
            <h3 className="text-lg font-semibold mb-4">Donor Sync</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="our-team" className="text-muted-foreground hover:text-foreground">
                  Our Team
                </a>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="/refund-policy" className="text-muted-foreground hover:text-foreground">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>


        {/* Social Media Section */}
        <div className="mt-12 flex justify-center space-x-6 pt-12 border-t border-border text-center pl-10 pr-10 text-muted-foreground">
          <a
            href="https://github.com/saad2134/donor-sync"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <span className="sr-only">GitHub</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-current"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582 0-.287-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.495.998.108-.775.42-1.305.763-1.605-2.665-.303-5.467-1.335-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.653.243 2.873.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.807 5.624-5.48 5.92.431.372.815 1.102.815 2.222 0 1.606-.015 2.898-.015 3.293 0 .323.216.7.825.58C20.565 21.795 24 17.303 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          {/* copyright section footer*/}
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground pl-10 pr-10">
          <p>
            © 2025 Donor Sync. All rights reserved. Built with ❤️ for the{" "}
            <a
              href="https://vision.hack2skill.com/event/solutionschallenge2025"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GDG on Campus Solution Challenge 2025
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
