import * as React from "react";

export default function FAQAccordion() {
  // openIndex is null when no FAQ is open; otherwise it holds the index of the open FAQ.
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "What is DonorSync?",
      answer:
        "It is a platform that connects blood donors with hospitals, allowing efficient blood donation and management.",
    },
    {
      question: "Who can use this platform?",
      answer:
        "Donors, hospitals, and blood bank organizations can register and access services.",

    },
    {
      question: "Is it free to use?",
      answer:
        "Yes, all of our patient and donor features will always to be completely free to use. Majority of our features for hospitals and organisations will also continue to be free to use.",

    },
    {
      question: "What blood types are accepted?",
      answer:
        "We accept all blood types, including rare ones, to ensure no patient goes without the blood they need.",

    },
    {
      question: "How do I register for an account?",
      answer:
        "To register, click on the <a href='/login'><b>Login</b></a> button on the homepage, fill in the required information and verify your phone/email.",
    },
    {
      question: "Is my data secure?",
      answer:
        "We give data privacy as highest priority to our users, data is encrypted and securely stored following industry best practices to ensure confidentiality and integrity.",

    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact support through our <a href='/contact'><b>Contact Us</b></a> page or by emailing <i>reach.saad@outlook.com</i>",
    },
  ]; 
 
  return (
    <div className="bg-gradient-to-t from-primary/5 to-primary/5 pl-10 pr-10">
      <div className="max-w-4xl mx-auto px-4 py-2 pb-20 pt-14 ">
        <h1 className="text-3xl font-bold mb-6 text-center">FAQs</h1>
        {faqs.map((faq, index) => (
          <div key={index} className="py-2">
            <h2>
              <button
                className="flex items-center justify-between w-full text-left font-semibold py-2"
                onClick={(e) => {
                  e.preventDefault();
                  // Toggle: if clicking the currently open item, close it; otherwise open this one.
                  setOpenIndex(openIndex === index ? null : index);
                }}
                aria-expanded={openIndex === index}
                aria-controls={`accordion-text-${index}`}
              >
                <span>{faq.question}</span>
                <svg
                  className="fill-red-500 shrink-0 ml-8"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className={`transform origin-center transition duration-200 ease-out ${openIndex === index ? "!rotate-180" : ""
                      }`}
                  />
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className={`transform origin-center rotate-90 transition duration-200 ease-out ${openIndex === index ? "!rotate-180" : ""
                      }`}
                  />
                </svg>
              </button>
            </h2>
            <div
              id={`accordion-text-${index}`}
              role="region"
              aria-labelledby={`accordion-title-${index}`}
              className={`grid text-sm text-slate-600 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
            >
              <div className="overflow-hidden">
                <p
                  className="pb-3 text-slate-600 dark:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                ></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
