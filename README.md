# Chat-Cue - AI-Powered Customer Support Platform

<div align="center">

**A production-ready B2B SaaS platform for intelligent, omnichannel customer support**

Built with Next.js 15, Convex, VAPI, RAG Pipeline, AWS Secrets Manager, and modern web technologies

</div>

---

## 🎯 About Chat-Cue

Chat-Cue is a complete AI-powered customer support platform built from scratch. It solves a real business problem — **companies spend too much on 24/7 human support agents** for repetitive, common queries. Chat-Cue replaces that with an intelligent AI layer that handles customer queries instantly via **chat, voice calls, and email** — all from one platform.

Think of it as an affordable, AI-first alternative to tools like Intercom or Freshdesk — purpose-built for modern businesses.

---

## 🚀 How It Works

```
Business uploads documents (FAQs, manuals, policies)
            ↓
RAG Pipeline extracts & embeds the content
            ↓
Customer visits website → Chat widget loads via embed script
            ↓
Customer asks a question
            ↓
Vector Search finds relevant context from documents
            ↓
AI generates accurate, context-aware response
            ↓
Conversation tracked → Resolved / Unresolved / Escalated
```

---

## ✨ Key Features

### 🤖 AI & Intelligence
- **RAG System** — Retrieval Augmented Generation for context-aware AI responses
- **Document Processing Pipeline** — Supports PDFs, Images (OCR), HTML, and plain text
- **Vector Search** — Semantic search across your knowledge base using Convex Vector Search
- **AI Embeddings** — Automatic embedding generation from uploaded documents
- **OCR Support** — Extract text from images using AI Vision (JPEG, PNG, WebP, GIF)
- **Intelligent Escalation** — AI detects when to escalate to a human agent

### 📞 Omnichannel Support
- **AI Chat Widget** — Real-time embeddable chat for any website
- **Voice Agent** — AI-powered voice calls via VAPI integration
- **Inbound Calls** — Customers can call your AI agent directly
- **Outbound Calls** — AI proactively calls customers on your behalf
- **Email Support** *(coming soon)* — Ticket-based email support

### 🏢 Business & SaaS Features
- **Multi-Tenant Architecture** — Securely support multiple organizations on one platform
- **Knowledge Base Management** — Upload and manage support documentation
- **Conversation Management** — Track all interactions with Resolved / Unresolved / Escalated states
- **Widget Customization** — Customize the chat widget to match your brand
- **Integrations Panel** — Connect external tools and services
- **Admin Dashboard** — Manage customers, documents, settings, and analytics

### 💳 Billing & Subscriptions
- **Subscription Management** — Free, Pro, and Enterprise plans
- **Usage-Based Billing** — Track AI API usage per organization
- **Clerk Billing Integration** — Seamless payment and plan management
- **Upgrade/Downgrade flows** — Flexible plan switching

### 🔒 Security
- **AWS Secrets Manager** — Secure, encrypted storage for API keys (VAPI, OpenAI, etc.)
- **Multi-Tenant Data Isolation** — Strict separation of data per organization
- **Clerk Authentication** — Secure user login and session management
- **Role-Based Access Control** — Different permissions per user
- **Input Validation** — Zod schema validation on all inputs
- **Rate Limiting** — Prevent API abuse
- **XSS Protection** — Built-in Next.js security features

### 📊 Monitoring & Analytics
- **Conversation Analytics** — Track resolved, unresolved, and escalated tickets
- **AI Performance Metrics** — Monitor response quality and speed
- **Usage Tracking** — AI API cost tracking per organization
- **Error Tracking** — Sentry integration for production monitoring

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts

### Backend
- **Database:** Convex (Real-time, serverless)
- **Authentication & Billing:** Clerk
- **File Storage:** AWS S3
- **Vector DB:** Convex Vector Search
- **Secrets Management:** AWS Secrets Manager

### AI & Voice
- **Embeddings & LLM:** OpenAI / Groq (Llama 3.3 70B)
- **Voice Agent:** VAPI (Inbound + Outbound calls)
- **RAG Pipeline:** Custom-built document processing + vector retrieval
- **OCR:** AI Vision via Groq

### DevOps
- **Monorepo:** Turborepo (Fast build system with caching)
- **Package Manager:** pnpm
- **Error Tracking:** Sentry
- **Deployment:** Vercel (frontend) + Convex (backend)

---

## 🗂️ Three Deployments

Chat-Cue runs as **3 separate applications** in a Turborepo monorepo:

| App | Description |
|-----|-------------|
| **Web** | Main dashboard for businesses — conversations, knowledge base, settings, billing |
| **Widget** | Customer-facing chat UI — the interface customers interact with |
| **Embed** | Lightweight embed script — businesses paste one line of code to load the widget |

---

## 🧠 RAG Pipeline — Document Processing

Chat-Cue processes uploaded documents through an intelligent pipeline before storing them for AI retrieval:

```
File Upload
    ↓
MIME Type Detection
    ↓
┌─────────────────────────────────────┐
│  Image → OCR via AI Vision          │
│  PDF   → Text extraction via AI     │
│  HTML  → Markdown conversion via AI │
│  Text  → Direct processing          │
└─────────────────────────────────────┘
    ↓
Text → Embeddings (OpenAI)
    ↓
Stored in Convex Vector DB
    ↓
Ready for semantic search
```

**AI Model Used:** Groq — Llama 3.3 70B Versatile (fast, high-quality extraction)

---

## 💬 Conversation States

Every customer interaction is tracked with one of three states:

| State | Meaning |
|-------|---------|
| ✅ **Resolved** | AI successfully answered the customer's query |
| ❓ **Unresolved** | AI couldn't find relevant context — needs manual review |
| 🚨 **Escalated** | Customer requested a human, or AI detected a complex issue |

This helps businesses understand AI effectiveness and identify gaps in their knowledge base.

---

## 📦 Project Structure

```
chat-cue/
├── apps/
│   └── web/                    # Main Next.js dashboard application
│       ├── app/                # App router pages
│       ├── components/
│       │   ├── widget/         # Customer support widget UI
│       │   └── dashboard/      # Admin dashboard components
│       └── lib/                # Utilities and helpers
│
├── packages/
│   ├── backend/                # Convex backend
│   │   ├── convex/
│   │   │   ├── schema.ts       # Data models
│   │   │   ├── queries.ts      # Database queries
│   │   │   └── mutations.ts    # Database mutations
│   │   └── embeddings/         # RAG pipeline & vector search logic
│   │
│   ├── ui/                     # Shared UI components (shadcn/ui)
│   ├── typescript-config/      # Shared TypeScript configs
│   └── eslint-config/          # Shared linting rules
│
├── turbo.json                  # Turborepo configuration
└── package.json                # Root dependencies
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10.4.1
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ASHUTOSH-KUMAR-RAO/chat-cue.git
cd chat-cue
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Create `.env.local` in `apps/web/`:
```bash
cp apps/web/.env.example apps/web/.env.local
```

Add your credentials:
```env
# Clerk Authentication & Billing
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex Backend
CONVEX_DEPLOYMENT=prod:...
NEXT_PUBLIC_CONVEX_URL=https://...

# OpenAI (for embeddings & LLM)
OPENAI_API_KEY=sk-...

# VAPI (for voice agents)
VAPI_PUBLIC_KEY=...
VAPI_PRIVATE_KEY=...   # Stored in AWS Secrets Manager in production

# AWS (for file storage & secrets)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
AWS_REGION=...

# Sentry (optional)
SENTRY_DSN=...
```

> ⚠️ **Security Note:** In production, sensitive keys like VAPI credentials are stored in **AWS Secrets Manager** — not in environment variables — for encrypted, auditable, and rotation-friendly key management.

4. **Initialize Convex backend**
```bash
cd packages/backend
pnpm setup
```

5. **Start development servers**
```bash
pnpm dev
```

Starts:
- Next.js app on `http://localhost:3000`
- Widget on `http://localhost:3001`
- Convex backend with live reload

---

## ⚡ Turborepo Benefits

Chat-Cue uses **Turborepo** for efficient monorepo management:

- **Fast Builds** — Remote caching and parallel execution
- **Smart Caching** — Never rebuild unchanged code
- **Task Pipelines** — Dependency-aware build order
- **Selective Builds** — Only build what changed

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is [MIT](LICENSE) licensed.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the component library
- [Convex](https://convex.dev) for the real-time backend
- [Clerk](https://clerk.com) for authentication and billing
- [VAPI](https://vapi.ai) for voice agent infrastructure
- [Vercel](https://vercel.com) for hosting

---

<div align="center">

**Built with ❤️ by Ashutosh Kumar Rao**

⭐ Star this repo if you find it helpful!

</div>
