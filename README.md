<h1 align="center"> 🩸 Donor Sync – Blood Bank Management System </h1>

> <p align="center"><strong>A comprehensive web-based platform that connects blood donors directly with hospitals, ensuring quick and efficient blood donation. It manages databases for donors, hospitals, and active donor organizations, streamlining the process and improving healthcare accessibility, with seamless connectivity between donors, patients, hospitals & organizations. 🎯</strong></p>


<div align="center">

<a href="https://donorsync.vercel.app/" target="_blank">
  <img  style="width:350px;" src="https://img.shields.io/badge/🚀_Access_the_Prototype_Here-Live-brightgreen?style=for-the-badge&labelColor=ff3838" alt="Access the Prototype Here"  />
</a>

![Phase](https://img.shields.io/badge/🛠️%20Phase-In%20Development-blue?style=for-the-badge)
![Platforms](https://img.shields.io/badge/🌐%20Platforms-Web%20%7C%20Android*-28a745?style=for-the-badge)

</div>

## ✨ Context 

### 🏆 Google Developer Group (GDG) on Campus Solution Challenge India 2025
- Initially developed as a Prototype for Google Developer Group (GDG) on Campus Solution Challenge India 2025
- Sustainable Development Goal (SDG): 3. Good health and well being.
- Problem Statement: "Lack of Access to Healthcare in Underserved Communities". Many communities, especially in rural and remote areas, lack access to basic healthcare services. This results in poor health outcomes, preventable diseases, and reduced quality of life. Barriers include inadequate healthcare infrastructure, a shortage of medical professionals, and limited awareness of preventive care.

👥 Original Hack2innovate Team Members

1. [**Fareed Ahmed Owais**](https://github.com/FareedAhmedOwais)
2. [**Mohammed Saad Uddin**](https://github.com/saad2134)
3. [**Abdur Rahman Qasim**](https://github.com/Abdur-rahman-01)
4. [**Mohammed Abdul Rahman**](https://github.com/Abdul-Rahman26)

## 🚀 Features

- *🔗 Donor-Hospital Connection*: Directly links blood donors with hospitals for real-time donation requests.
- *📊 Database Management*: Stores and manages detailed information on blood donors, hospitals, and active donor organizations.
- *📈 Donation Tracking*: Tracks blood donation records and availability, ensuring transparency and faster access.
- *🔒 User Access*: Secure access for hospitals, donors, and partner organizations.
- *⚡ Efficiency*: Reduces delays in emergency cases through an automated system.

## 📊 Usage

1. *Patients*: Register and request for specific blood types.
2. *Donors*: Register and find places where blood is needed.
3. *Hospitals*: Request blood directly from registered donors.
4. *Organizations*: Manage donation drives and support patients.

---

## ⚙️ Platforms

| Platform                                                       | Supported? |
| --------------------------------------------------------------- | ----------- |
| Web (any browser with JS functionality) + Fully Responsive       | ✅          |
| [Android](frontend-android/) (non-natively through WebView)                | ✅          |

## 🛠 Tech Stack *

```mermaid
flowchart LR
    %% Frontend
    subgraph Frontend
        FE[React + Next.js<br>TypeScript + TailwindCSS<br>shadcn/ui + AceternityUI<br>
        Vercel Hosting<br>
        Developed in 
        Firebase Studio IDE]
         
    end

    %% Backend Services
    subgraph Backend_Services["Backend Services"]
        VERIFY[Phone Email<br>Email & Phone Verification]
        STORAGE[Uploadcare<br>File Storage]
        DB[Firestore<br>NoSQL Database]
        FEEDBACK[Google Apps Script<br>Feedback Collection]
        BOT[Gemini API<br>Syncbot Chatbot]
  
    end

    %% Connections
    FE <--> VERIFY
    FE <--> STORAGE
    FE <--> DB
    FE <--> BOT
    FE <--> FEEDBACK


```

## 🚀 Getting Started *

### Web Frontend: Install & Run the Project 

1. Clone & Download the Repo

2. Install NodeJS on your system.

3. Open the project in your preferred IDE.

4. Run in Terminal to Install all dependancies:
   ```bash
   npm i
   ```

4. Get all api keys in env.template as set them in your env:

5. Run in Terminal to Start Development Server:
   ```bash
   npm run dev
   ```

### Web Frontend: Using the app
1. Simply go to https://donorsync.vercel.app/

### Android Frontend: Using the app
1. Enable `Install from Unknown Sources` in your android device settings.
2. Download the latest `.apk` file from the [`native`](native/) directory and install it on your device.



## 📁 Project Architecture
```
donor-sync/
└── README.md & LICENSE etc.
└── frontend-web/
    ├── app/
    │   └── …                     # Top-level Next.js app directory (routes, layouts, pages, etc.)
    ├── components/
    │   └── …                     # Reusable UI components (buttons, forms, cards, etc.)
    ├── context/
    │   └── …                     # React Contexts for state management across components
    ├── data/
    │   └── …                     # Static data, seed data, or JSON fixtures used in the app
    ├── hooks/
    │   └── …                     # Custom React hooks (e.g. for fetching, authentication, etc.)
    ├── lib/
    │   └── …                     # Library code: utilities, helper functions, wrappers over APIs
    ├── public/
    │   └── …                     # Static assets (images, icons, fonts, etc.)
    ├── types/
    │   └── …                     # TypeScript type definitions and interfaces
    ├── firebaseConfig.ts          # Firebase setup / initialization logic
    ├── firebaseFunctions.ts       # Cloud Functions or server-side Firebase logic
    ├── next.config.ts             # Next.js configuration
    ├── tailwind.config.ts         # Tailwind CSS configuration
    ├── tsconfig.json              # TypeScript configuration
    ├── env.template               # Template for environment variables (API keys, etc.)
    ├── firebase.json              # Firebase project settings, rules, etc.
    ├── database.rules.json        # Firestore database rules
    ├── package.json               # Project dependencies & scripts
    ├── eslint.config.mjs          # Linting rules
```

## 📱 Screenshots

<table> <tr> <td><strong>Landing Page</strong><br><br> <img src="https://github.com/user-attachments/assets/4c4d534c-c6f3-4049-a0bb-ace850f0d1ba" width="100%" alt="Landing Page" /> </td> </tr> <tr> <td><strong>Authentication</strong><br><br> <img src="https://github.com/user-attachments/assets/cc9c6a2b-1e15-4fdc-8ade-813c71853d50" width="300px" alt="Authentication" /> </td> </tr> <tr> <td><strong>Donor Blood Donation Search</strong><br><br> <img src="https://github.com/user-attachments/assets/5ba4b049-67a1-483a-b219-d11e7b037d8f" width="100%" alt="Donor Blood Donation Search" /> </td> </tr> <tr> <td><strong>Donor Profile</strong><br><br> <img src="https://github.com/user-attachments/assets/1f09e451-d409-4ba5-aaf0-d6d7291f365f" width="100%" alt="Donor Profile" /> </td> </tr> <tr> <td><strong>Settings</strong><br><br> <img src="https://github.com/user-attachments/assets/777be84e-23ff-4d86-a4f0-18f5cbae6978" width="100%" alt="Settings" /> </td> </tr> <tr> <td><strong>Community</strong><br><br> <img src="https://github.com/user-attachments/assets/99f36774-a22a-4f5b-b573-a582f020e1e8" width="100%" alt="Community" /> </td> </tr> <tr> <td><strong>Syncbot AI Chatbot</strong><br><br> <img src="https://github.com/user-attachments/assets/a83f5337-f572-4ce8-a987-8847f2ed7d4a" width="100%" alt="Syncbot AI Chatbot" /> </td> </tr> </table>

## 📊 **Project Stats**

<div align="center">
  
![Repo Size](https://img.shields.io/github/repo-size/saad2134/donor-sync)
![Last Commit](https://img.shields.io/github/last-commit/saad2134/donor-sync)
![Open Issues](https://img.shields.io/github/issues/saad2134/donor-sync)
![Open PRs](https://img.shields.io/github/issues-pr/saad2134/donor-sync)
![License](https://img.shields.io/github/license/saad2134/donor-sync)
![Forks](https://img.shields.io/github/forks/saad2134/donor-sync?style=social)
![Stars](https://img.shields.io/github/stars/saad2134/donor-sync?style=social)
![Watchers](https://img.shields.io/github/watchers/saad2134/donor-sync?style=social)
![Contributors](https://img.shields.io/github/contributors/saad2134/donor-sync)
![Languages](https://img.shields.io/github/languages/count/saad2134/donor-sync)
![Top Language](https://img.shields.io/github/languages/top/saad2134/donor-sync)

</div>

## ⭐ Star History

<a href="https://www.star-history.com/#saad2134/donor-sync&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=saad2134/donor-sync&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=saad2134/donor-sync&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=saad2134/donor-sync&type=Date" />
 </picture>
</a>

## ✨ Icon

<img src="https://github.com/user-attachments/assets/01f9e3d6-85a7-4d97-9348-1fc046ea2ff2" alt="icon" width="250"/>

## 🔰 Banner

![repository-open-graph](https://github.com/user-attachments/assets/13f5c0fd-96ff-4275-a634-4cd1efc79b52)


## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

## ✍️ Endnote
<p align="center">Initially developed with 💖 as a Prototype for Google Developer Group (GDG) on Campus Solution Challenge India 2025</p>
<p align="center">⭐ Star this repo if you found it helpful! Thanks for reading.</p>

---

## 🏷 Tags

`#BloodBank` `#HealthcareTech` `#DatabaseManagement` `#WebApp` `#GBGChallenge` `#MedicalInnovation` `#BloodDonation` `#DonorManagement` `#HospitalManagement` `#FullStackDevelopment` `#HealthTech` `#EmergencyServices` `#DataManagement` `#CommunitySupport` `#HealthcareAccess` `#OpenSource` `#HealthcareInnovation` `#AIforSocialGood` `#BuildWithAI`
