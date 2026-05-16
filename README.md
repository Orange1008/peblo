# 🌟 Peblo AI Study Buddy

> A magical, AI-powered collaborative learning workspace designed for children aged 10–15. Built with a dreamy pastel futuristic aesthetic, Peblo makes studying fun, interactive, and engaging.

🔗 **Live Demo:** [https://peblo-44dn.vercel.app](https://peblo-44dn.vercel.app)  
📁 **Repository:** [https://github.com/Orange1008/peblo](https://github.com/Orange1008/peblo)

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)
![Groq AI](https://img.shields.io/badge/Groq-AI-orange?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)

---

## ✨ Features

### 🎓 Learning Tools
- **📝 Magic Backpack (Notes)** — Create, edit, and organize notes with folders, tags, and auto-save
- **🎮 Fun Quiz** — AI-generated multiple choice quizzes with XP rewards and confetti celebrations
- **🃏 Flashcards** — Interactive flippable flashcards with mastery tracking
- **🏆 Adventure Log (Insights)** — Productivity dashboard with badges, XP, weekly activity, and real stats

### 🤖 AI Integration (Groq)
- **Live AI Chat** — Ask Peblo Buddy anything, with your note as context
- **Summarize** — One-click bullet-point note summaries
- **Explain** — Child-friendly explanations with fun analogies
- **Generate Quiz** — AI builds a playable inline quiz from your notes
- **Generate Flashcards** — AI creates flippable study cards from your content

### 🗂️ Notes Management
- Full **CRUD** (Create, Read, Update, Delete)
- **Auto-save** with debounce (saves 800ms after last keystroke)
- **Keyword search** across title, content, and tags
- **Tag filtering** and sort (Newest / Oldest / A→Z)
- **Archive** notes you don't need right now
- **Public share links** — share a note with anyone, no login required

### 👤 User Authentication
- Secure **JWT-based** signup and login
- Persistent sessions via HTTP-only cookies
- User profile with avatar and display name

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript |
| **Styling** | Tailwind CSS, Shadcn UI, Framer Motion |
| **Fonts** | Nunito + Quicksand (Google Fonts) |
| **AI** | Groq SDK (`llama-3.3-70b-versatile`) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT + bcryptjs |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the Repository

```bash
git clone https://github.com/Orange1008/peblo.git
cd peblo
```

> Or visit the live app directly: [https://peblo-44dn.vercel.app](https://peblo-44dn.vercel.app)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root:

```env
# Groq AI
GROQ_API_KEY=your_groq_api_key_here

# Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

### Frontend — Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add the environment variables in the Vercel dashboard:
   - `GROQ_API_KEY`
   - `NEXT_PUBLIC_API_URL`
4. Deploy!

✅ **Already deployed at:** [https://peblo-44dn.vercel.app](https://peblo-44dn.vercel.app)

### Backend — Render

1. Push the `/server` directory to its own repo (or as a monorepo)
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set the following environment variables:
   - `MONGO_URI` — Your MongoDB Atlas connection string
   - `JWT_SECRET` — A long, random secret string
   - `CLIENT_URL` — Your Vercel frontend URL (for CORS)
4. Deploy!

---

## 📁 Project Structure

```
peblo/
├── public/
│   ├── ai_mascot.png          # 3D AI mascot image
│   └── bg.png                 # Background image
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   │   ├── dashboard/     # Command Center
│   │   │   ├── notes/         # Magic Backpack
│   │   │   ├── quiz/          # Fun Quiz
│   │   │   ├── flashcards/    # Flashcards
│   │   │   ├── insights/      # Adventure Log
│   │   │   └── settings/      # Profile & Settings
│   │   ├── api/
│   │   │   └── ai/            # Groq AI API route
│   │   ├── login/             # Login page
│   │   ├── signup/            # Sign up page
│   │   ├── share/[shareId]/   # Public note share page
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # Shadcn UI components
│   │   ├── FloatingNavbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopNavbar.tsx
│   │   ├── InlineQuiz.tsx     # AI-generated quiz in notes
│   │   └── InlineFlashcard.tsx# AI-generated flashcards in notes
│   └── lib/
│       ├── types.ts           # Shared TypeScript types
│       ├── notes-context.tsx  # Notes state + localStorage
│       └── utils.ts
└── vercel.json
```

---

## 🎨 Design System

- **Color Palette:** Purple, Pink, Blue pastel gradients
- **Style:** Glassmorphism + soft glowing shadows
- **Animations:** Framer Motion (bounce, fade, 3D flip)
- **Components:** Rounded blob-like cards, floating UI elements
- **Typography:** Nunito (headings) + Quicksand (body)

---

## 📸 Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero, features, AI demo, testimonials |
| Login | `/login` | Animated split-screen login |
| Signup | `/signup` | Start your adventure onboarding |
| Command Center | `/dashboard` | XP bar, stats, quick actions |
| Magic Backpack | `/notes` | Full notes workspace + AI panel |
| Fun Quiz | `/quiz` | Gamified multiple choice quiz |
| Flashcards | `/flashcards` | 3D flip cards with mastery tracking |
| Adventure Log | `/insights` | Badges, heatmap, weekly activity |
| Settings | `/settings` | Profile, theme, preferences |
| Share | `/share/[id]` | Public read-only note page |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License © 2026 Peblo AI Study Buddy

---

<p align="center">Made with ❤️ and ✨ for young learners everywhere</p>
