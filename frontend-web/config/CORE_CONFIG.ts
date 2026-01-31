// src/app/config.ts
export const APP_CONFIG = {
  appName: "DonorSync",
  appDescription: "A comprehensive open-source web-based platform that connects blood donors directly with hospitals, and hospitals with patients, and even NGOs ensuring quick and efficient blood donation.",
  version: "v1.1.0 alpha",
  last_updated_legal: "19th December 2025",
  getStartedUrl: "/login",
  contacts: {
    email: "mailto:reach.saad@outlook.com",
    phone: "",
  },
};

export const FAQ_CONFIG = {
  description: "Get answers to common questions about blood donation, donor registration, hospital services, and platform features. Can't find what you're looking for?",
  items: [
    {
      question: `What is ${APP_CONFIG.appName}?`,
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
        "We accept all blood types, including rare ones, to ensure no patient goes without blood they need.",
    },
    {
      question: "How do I register for an account?",
      answer:
        "To register, click on <a href='/login'><b>Login</b></a> button on homepage, fill in required information and verify your phone/email.",
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
  ],
};
