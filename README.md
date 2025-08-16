# 📝 AI-Powered Meeting Notes Summarizer

This is a **full-stack application** that lets you upload meeting transcripts, generate AI-powered summaries based on custom instructions, edit them, and share the results via email.

---

## 🚀 Features

- 📂 Upload a meeting transcript (text file / pasted notes).
- ✍️ Input a **custom prompt** (e.g., "Summarize in bullet points for executives", "Highlight action items").
- 🤖 AI-powered **summary generation**.
- 📝 Editable summaries before sharing.
- 📧 Share the summary via **email**.

---

## 📂 Project Structure

├── public/ # Static assets
│ ├── favicon.ico
│ ├── placeholder.svg
│ └── robots.txt
├── src/ # Application source
│ ├── components/ # React components
│ │ ├── ui/ # UI building blocks
│ │ └── MeetingSummarizer.tsx
│ ├── hooks/ # Custom React hooks
│ │ ├── use-mobile.tsx
│ │ └── use-toast.tsx
│ ├── lib/ # Utility libraries
│ │ └── utils.ts
│ ├── pages/ # Application pages
│ │ ├── Index.tsx
│ │ └── NotFound.tsx
│ ├── supabase/functions # Supabase Edge Functions
│ │ ├── send-email/ # Email sending function
│ │ └── summarize/ # AI summarization function
│ ├── App.tsx
│ ├── main.tsx
│ ├── index.css
│ └── vite-env.d.ts
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md 



---

## 🛠️ Tech Stack

- **Frontend:** React + Vite + TypeScript + TailwindCSS  
- **Backend:** Supabase Edge Functions  
- **AI Summarization:** OpenAI API (or similar LLM provider)  
- **Email Delivery:** Supabase function (`send-email`)  

---

## ⚡ Getting Started



npm install
npm run dev 


