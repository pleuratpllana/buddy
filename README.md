# Chatbot

A simple and mdoern AI chatbot web app built with React, designed for small companies or startups to manage real-time customer support. It supports custom data training to deliver accurate, on-brand responses and improve customer experience effortlessly.


---

## Features

- ⚡ Fast, responsive React frontend (Vite)
- ☁️ Serverless backend API (Vercel functions)
- 🔒 Secure API key handling (no secrets in frontend)
- 🌙 Dark mode / Light mode toggle
- 💾 Download chat history as a file
- 🔊 Sound notifications for new messages
- 📱 Responsive design for desktop and mobile
- 🎨 Modern UI/UX
- 🌐 Easy deployment to Vercel

---


## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/chatbot.git
cd chatbot/frontend
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

- Copy `.env.example` to `.env` and fill in your own API keys:

```sh
cp .env.example .env
```

- Edit `.env` and set your `GEMINI_API_KEY` and other variables.

### 4. Run locally

```sh
npm run dev
```

- The app will be available at `http://localhost:5173` (or as shown in your terminal).

---


## Environment Variables

See `.env.example` for required variables:

- `GEMINI_API_KEY`
- `GEMINI_API_URL`
- `GEMINI_REFERER`

---

## License

MIT

---

## Live Preview

https://buddy-umber.vercel.app/
