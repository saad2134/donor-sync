'use client';

import { useState, useEffect } from 'react';
import { submitContactForm } from '@/lib/actions';

export function ContactForm() {
  const [state, setState] = useState<{
    message: string;
    type: 'success' | 'error' | '';
  }>({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);

  // Initialize cooldown from localStorage on component mount
  useEffect(() => {
    const savedLastSubmitTime = localStorage.getItem('contactFormLastSubmit');
    if (savedLastSubmitTime) {
      const savedTime = parseInt(savedLastSubmitTime, 10);
      setLastSubmitTime(savedTime);

      const now = Date.now();
      const timeSinceLastSubmit = now - savedTime;
      const remainingCooldown = Math.max(0, 60000 - timeSinceLastSubmit);

      if (remainingCooldown > 0) {
        setCooldown(Math.ceil(remainingCooldown / 1000));
      }
    }
  }, []);

  // Update cooldown timer and localStorage when lastSubmitTime changes
  useEffect(() => {
    if (lastSubmitTime !== null) {
      localStorage.setItem('contactFormLastSubmit', lastSubmitTime.toString());
    }
  }, [lastSubmitTime]);

  // Handle cooldown countdown
  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // Clear localStorage when cooldown completes
            localStorage.removeItem('contactFormLastSubmit');
            setLastSubmitTime(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldown]);

  // Check cooldown status periodically (in case user leaves and comes back)
  useEffect(() => {
    const checkCooldown = () => {
      if (lastSubmitTime) {
        const now = Date.now();
        const timeSinceLastSubmit = now - lastSubmitTime;
        const remainingCooldown = Math.max(0, 60000 - timeSinceLastSubmit);

        if (remainingCooldown > 0) {
          setCooldown(Math.ceil(remainingCooldown / 1000));
        } else {
          setCooldown(0);
          setLastSubmitTime(null);
          localStorage.removeItem('contactFormLastSubmit');
        }
      }
    };

    // Check immediately
    checkCooldown();

    // Set up interval to check every 5 seconds
    const interval = setInterval(checkCooldown, 5000);

    return () => clearInterval(interval);
  }, [lastSubmitTime]);

  async function handleSubmit(formData: FormData) {
    if (cooldown > 0) {
      setState({
        message: `Please wait ${cooldown} seconds before submitting again.`,
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    setState({ message: '', type: '' });

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setState({
          message: 'Thank you for your message! We\'ll get back to you soon.',
          type: 'success'
        });
        // Reset form
        const form = document.getElementById('contact-form') as HTMLFormElement;
        form?.reset();
        // Start cooldown
        const submitTime = Date.now();
        setLastSubmitTime(submitTime);
        setCooldown(60);
      } else {
        setState({
          message: result.error || 'Something went wrong. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      setState({
        message: 'An unexpected error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const isDisabled = isLoading || cooldown > 0;

  return (
    <>
      {state.message && (
        <div
          className={`p-4 rounded-lg mb-6 ${state.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
              : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
            }`}
        >
          {state.message}
          {cooldown > 0 && state.type === 'success' && (
            <div className="text-sm mt-2 opacity-90">
              Cooldown: {cooldown}s
            </div>
          )}
        </div>
      )}

      <form id="contact-form" action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={isDisabled}
              placeholder="Your full name"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isDisabled}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-2">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            disabled={isDisabled}
            placeholder="Your company name"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2">
            Subject *
          </label>
          <select
            id="subject"
            name="subject"
            required
            disabled={isDisabled}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select a subject</option>
            <option value="general-inquiry">General Inquiry</option>
            <option value="partnership">Partnership Opportunity</option>
            <option value="project-discussion">Project Discussion</option>
            <option value="technical-support">Technical Support</option>
            <option value="career">Career Opportunities</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={isDisabled}
            placeholder="Tell us about your project or inquiry..."
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          //type="submit"
          //disabled={isDisabled}
          className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          {/* Shine effect */}
          {!isDisabled && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-background/20 to-transparent transform -skew-x-12 animate-wave-shine"></div>
            </div>
          )}

          {isLoading ? (
            <span className="flex items-center justify-center relative z-10">
              <div className="relative">
                {/* Outer spinning circle */}
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                {/* Inner pulsing dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-1 w-1 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              Processing...
            </span>
          ) : cooldown > 0 ? (
            <span className="flex items-center justify-center relative z-10">
              <div className="relative mr-2">
                {/* Cooldown timer circle */}
                <svg className="w-5 h-5 transform -rotate-90" viewBox="0 0 20 20">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    className="opacity-30"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="50.265"
                    strokeDashoffset={50.265 * (1 - cooldown / 60)}
                    className="transition-all duration-1000"
                  />
                </svg>
              </div>
              Wait {cooldown}s
            </span>
          ) : (
            <span className="flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-300">
              <svg
                className="w-5 h-5 mr-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              (Kindly email us directly!)
            </span>
          )}

          {/* Ripple effect background during loading */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 animate-shimmer"></div>
          )}
        </button>

        {cooldown > 0 && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ⏱️ Form cooldown active. This prevents spam submissions.
            </p>
          </div>
        )}
      </form>

      <style jsx>{`
  @keyframes wave-shine {
    0% {
      transform: translateX(-100%) skewX(-12deg);
      opacity:  0.6;
    }
    100% {
    transform: translateX(900%) skewX(-12deg);
      opacity: 0.6;
    }
  }
  .animate-wave-shine {
    animation: wave-shine 2s ease-in-out infinite;
  }
`}</style>
    </>
  );
}