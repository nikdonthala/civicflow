# 🏛️ CivicFlow — Your Public Services, Simplified

A unified citizen-facing public-service experience that makes Indian government services easier to discover, understand, complete, and track.

![CivicFlow](https://img.shields.io/badge/CivicFlow-v1.0.0-blue) ![React](https://img.shields.io/badge/React-18-61DAFB) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🔍 Smart Search** — Find government services quickly with intelligent search
- **📋 Application Tracker** — Track your applications through every stage with real-time progress
- **✅ Task Manager** — Stay on top of deadlines, appointments, and required actions
- **🎁 Benefits Explorer** — Discover schemes and benefits you're eligible for, with match scoring
- **🤖 AI Assistant** — Ask questions about government services, powered by Groq AI
- **💬 AI Guide** — Highlight any text on the page and get instant AI-powered explanations
- **🌐 Multi-Language** — Switch between English, Hindi (हिन्दी), and Telugu (తెలుగు)
- **📬 Inbox** — Get notifications for application updates, deadlines, and new schemes
- **👤 Profile** — View your linked accounts, preferences, and activity history
- **📱 Responsive** — Works seamlessly on desktop, tablet, and mobile

## 🚀 Live Demo

[**civicflow.vercel.app**](https://civicflow-snowy.vercel.app)

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **React Router v7** | Client-side routing |
| **Tailwind CSS 3** | Utility-first styling |
| **Vite 8** | Build tool & dev server |
| **Lucide React** | Icon library |
| **Framer Motion** | Animations |
| **Groq API** | AI-powered chat (streaming) |

## 📦 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/nikdonthala/civicflow.git
cd civicflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` and add your Groq API key:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

> 🔑 Get a free API key at [console.groq.com](https://console.groq.com)

### Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
civicflow/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── AiAssistant.jsx    # AI chat assistant (streaming)
│   │   ├── AiGuide.jsx        # Context-aware AI guide
│   │   ├── HighlightAsk.jsx   # Text selection → ask AI
│   │   ├── Layout.jsx         # App shell (sidebar + nav)
│   │   └── SettingsPanel.jsx  # API key management
│   ├── context/
│   │   └── AppContext.jsx     # Global state management
│   ├── data/              # Mock data & translations
│   │   ├── applications.js
│   │   ├── benefits.js
│   │   ├── notifications.js
│   │   ├── services.js
│   │   ├── tasks.js
│   │   ├── translations.js
│   │   ├── users.js
│   │   └── aiGuide.js
│   ├── pages/             # Route pages
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── ServiceDetail.jsx
│   │   ├── Tasks.jsx
│   │   ├── Applications.jsx
│   │   ├── ApplicationDetail.jsx
│   │   ├── Benefits.jsx
│   │   ├── Inbox.jsx
│   │   ├── Search.jsx
│   │   ├── Profile.jsx
│   │   └── LoginPage.jsx
│   ├── utils/
│   │   └── groqApi.js         # Groq API client (streaming)
│   ├── App.jsx            # Root component & routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Tailwind + custom styles
├── .env.example           # Environment variable template
├── tailwind.config.js     # Custom theme (civic/saffron colors)
├── vite.config.js         # Vite configuration
└── package.json
```

## 🔒 Security

- API keys are stored in **localStorage** (client-side only) — never sent to a backend
- `.env.local` is **gitignored** — your keys stay out of version control
- The `VITE_GROQ_API_KEY` env variable auto-seeds the localStorage on first load
- Users can override the key via the **Settings Panel** in-app

## 🎨 Design System

CivicFlow uses a custom Tailwind theme with:

- **Civic Blue** (`civic-50` to `civic-950`) — primary brand color
- **Saffron** (`saffron-50` to `saffron-900`) — accent & alerts
- **Emerald** (`emerald-50` to `emerald-900`) — success states
- Custom card styles, buttons, badges, and animations

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard:
# VITE_GROQ_API_KEY = your_key_here
```

## 📄 License

MIT © 2026 CivicFlow

---

> ⚠️ **Note:** This is a prototype with synthetic/mock data. No real government services or citizen data are involved.
