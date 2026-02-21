# Rejectly.pro

AI-powered CV & job posting match analysis - "Why was I rejected?"

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (use nvm: `nvm use 20`)
- pnpm (`npm install -g pnpm`)
- Supabase account
- OpenAI API key.
- Stripe accountt

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/rejectly-pro.git
cd rejectly-pro
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`

5. Run the development server
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Public marketing pages
│   ├── (auth)/            # Authentication pages
│   └── (app)/             # Private app pages
├── components/            # React components
│   └── ui/                # UI components
├── contexts/              # React contexts
├── lib/                   # Utility functions & configs
├── styles/                # Global styles & theme
└── types/                 # TypeScript types
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** styled-components
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **AI:** OpenAI GPT-4o-mini
- **Payments:** Stripe
- **Deployment:** Vercel

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🎯 MVP Timeline (10 Days)

- **Day 1-2:** Project setup, UI components
- **Day 3-4:** Supabase setup, database schema
- **Day 5-6:** Auth flow, file upload
- **Day 7-8:** AI analysis engine
- **Day 9:** Stripe integration
- **Day 10:** Testing & deployment

## 📄 License

MIT