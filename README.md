# 🪐 ORION — Space & Astronomy AI Chatbot

A purpose-built AI chatbot for space exploration and astronomy, powered by Claude AI.

## 🚀 What I Built

**ORION** is an AI guide to the cosmos. Ask it anything about black holes, exoplanets, space missions, dark matter, the Big Bang — it answers with depth, enthusiasm, and genuine cosmic wonder.

**Why Space?** Space is the most universally fascinating topic — endlessly deep, visually stunning, and full of mind-bending concepts that benefit from a conversational explainer.

## ✨ Features

- **AI-powered conversations** via Claude API (claude-opus-4-5)
- **Cosmic UI** — animated starfield, nebula glows, floating orbs
- **Smart suggestions** — pre-loaded questions to spark curiosity
- **Loading / Error / Empty states** all thoughtfully designed
- **Markdown rendering** — responses with bold, lists, headers look great
- **Responsive** — works on mobile and desktop
- **Keyboard shortcuts** — Enter to send, Shift+Enter for new line

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Claude API** (Anthropic)
- **CSS Modules** with custom space design system
- **Deployed on Vercel**

## 🔧 Setup

```bash
npm install
```

Create `.env.local`:
```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌌 Design Decisions

- Dark void background with procedurally placed stars (no images needed)
- Nebula glow blobs give depth without being distracting
- ORION avatar in chat is a tiny animated solar system icon
- Suggestions chip row on input stays visible after first message for quick follow-ups
- Typing indicator with pulsing dots matches the cosmic aesthetic
