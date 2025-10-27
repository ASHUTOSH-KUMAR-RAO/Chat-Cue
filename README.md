# Chat-Cue - AI-Powered Customer Support Platform

<div align="center">

**A production-ready B2B SaaS platform for intelligent customer support**

Built with Next.js 15, Convex, AI embeddings, and modern web technologies
</div>

---

## 🎯 About Chat-Cue

Chat-Cue is a complete AI-powered customer support platform built from scratch. It demonstrates how to build a real-world B2B SaaS product with:

- 🤖 **AI-Powered Responses** - Using document embeddings and intelligent context retrieval
- 🔍 **Intelligent Search** - Semantic search across your knowledge base
- 📄 **Document Processing** - Automatic embedding generation from your documentation
- 💳 **Billing & Subscriptions** - Complete payment integration
- 🔒 **Enterprise Security** - Secure AWS credential management and multi-tenancy
- 📊 **Analytics Dashboard** - Track support metrics and AI performance
- ⚡ **Turborepo Monorepo** - Fast, scalable development workflow

## ✨ Key Features

### Platform Features
- **Multi-Tenant Architecture** - Support multiple organizations securely
- **Real-time Chat Widget** - Embeddable customer support widget
- **Knowledge Base Management** - Upload and manage support documentation
- **Conversation History** - Track all customer interactions
- **Admin Dashboard** - Manage customers, documents, and settings

### Business Features
- **Subscription Management** - Flexible pricing tiers and plans
- **Billing Integration** - Automated invoicing and payment processing
- **Usage Analytics** - Monitor AI usage and costs
- **Team Collaboration** - Multi-user support with role-based access

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts

### Backend
- **Database:** Convex (Real-time, serverless)
- **Authentication:** Clerk
- **File Storage:** AWS S3 (planned)
- **Vector DB:** Convex Vector Search

### AI 
- **Embeddings:** OpenAI / Custom model (planned)
- **LLM:** GPT-4 / Claude (planned)
- **Vector Search:** Convex Vector Search

### DevOps
- **Monorepo:** Turborepo (Fast build system with caching)
- **Package Manager:** pnpm (Fast, disk space efficient)
- **Error Tracking:** Sentry
- **Deployment:** Vercel (frontend) + Convex (backend)

## 📦 Project Structure

```
chat-cue/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/                # App router pages
│       ├── components/         # React components
│       │   ├── widget/         # Customer support widget
│       │   └── dashboard/      # Admin dashboard
│       └── lib/                # Utilities and helpers
│
├── packages/
│   ├── backend/                # Convex backend
│   │   ├── convex/             # Database schema & functions
│   │   │   ├── schema.ts       # Data models
│   │   │   ├── queries.ts      # Database queries
│   │   │   └── mutations.ts    # Database mutations
│   │   └── embeddings/         # Vector search logic
│   │
│   ├── ui/                     # Shared UI components
│   │   └── components/         # shadcn/ui components
│   │
│   ├── math/                   # Utility functions
│   ├── typescript-config/      # Shared TS configs
│   └── eslint-config/          # Shared linting rules
│
├── turbo.json                  # Turborepo configuration
└── package.json                # Root dependencies
```

## 🛠️ Getting Started

### Prerequisites

Make sure you have these installed:
- **Node.js** >= 20
- **pnpm** >= 10.4.1
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/chat-cue.git
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
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex Backend
CONVEX_DEPLOYMENT=prod:...
NEXT_PUBLIC_CONVEX_URL=https://...

# OpenAI (for embeddings & LLM)
OPENAI_API_KEY=sk-...

# Stripe (for billing)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS (for file storage)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...

# Sentry (optional)
SENTRY_DSN=...
```

4. **Initialize Convex backend**
```bash
cd packages/backend
pnpm setup
```

This will:
- Create your Convex deployment
- Set up the database schema
- Generate types

5. **Start development servers**
```bash
# From root directory
pnpm dev
```

This starts:
- Next.js app on `http://localhost:3000`
- Convex backend with live reload

## 📚 Development Workflow

### Running the App

```bash
# Start all services
pnpm dev

# Start only web app
pnpm --filter web dev

# Start only backend
pnpm --filter @workspace/backend dev
```

### Building for Production

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter web build
```

### Code Quality

```bash
# Lint all packages
pnpm lint

# Fix linting issues
pnpm --filter web lint:fix

# Format code
pnpm format

# Type checking
pnpm --filter web typecheck
```

## 🎨 Key Components

### Customer Support Widget
Embeddable chat widget that can be added to any website:
```tsx
import { WidgetView } from '@/components/widget';

<WidgetView organizationId="org_123" />
```

### Document Upload & Embedding
Upload documents and automatically generate embeddings:
```typescript
// Upload document
await uploadDocument(file);

// Generate embeddings
await generateEmbeddings(documentId);

// Search similar documents
const results = await searchDocuments(query);
```

### AI Response Generation
Retrieve relevant context and generate AI responses:
```typescript
// 1. Convert query to embedding
const queryEmbedding = await embedQuery(userQuestion);

// 2. Search similar documents
const context = await vectorSearch(queryEmbedding);

// 3. Generate AI response with context
const response = await generateResponse(userQuestion, context);
```

## ⚡ Turborepo Benefits

Chat-Cue uses **Turborepo** for efficient monorepo management:

- **⚡ Fast Builds** - Remote caching and parallel execution
- **📦 Smart Caching** - Never rebuild the same code twice
- **🔄 Task Pipelines** - Define dependencies between tasks
- **📊 Build Analytics** - Track build performance
- **🎯 Selective Builds** - Only build what changed

### Turborepo Configuration

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

## 🔐 Security Features

- **Multi-tenant Isolation** - Secure data separation per organization
- **Row-Level Security** - Convex handles data access automatically
- **API Key Management** - Secure credential storage
- **Rate Limiting** - Prevent API abuse
- **Input Validation** - Zod schema validation on all inputs
- **XSS Protection** - Built-in Next.js security features

## 💳 Billing & Subscriptions

Chat-Cue includes complete billing functionality:

- **Pricing Tiers** - Free, Pro, Enterprise plans
- **Usage-Based Billing** - Track AI API usage
- **Subscription Management** - Upgrade/downgrade flows
- **Payment Processing** - Stripe integration
- **Invoice Generation** - Automated billing

## 📊 Monitoring & Analytics

- **Error Tracking** - Sentry integration for production monitoring
- **Performance Metrics** - Track response times and AI performance
- **Usage Analytics** - Monitor customer interactions
- **Cost Tracking** - Track AI API costs per organization

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

### Environment Variables

Make sure to set all required environment variables in your Vercel dashboard.

## 📖 Learning Resources

This project teaches you:

1. **AI Integration**
   - Document embeddings generation
   - Vector database setup
   - Semantic search implementation
   - Context-aware AI responses

2. **Backend Development**
   - Convex real-time database
   - Serverless functions
   - File uploads & processing
   - API design

3. **Frontend Development**
   - Next.js 15 App Router
   - shadcn/ui components
   - Form handling & validation
   - Real-time updates

4. **SaaS Business Logic**
   - Multi-tenancy
   - Billing & subscriptions
   - User management
   - Analytics

5. **Monorepo Management**
   - Turborepo configuration
   - Shared packages setup
   - Build optimization
   - Development workflow

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is [MIT](LICENSE) licensed.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the amazing component library
- [Convex](https://convex.dev) for the real-time backend
- [Clerk](https://clerk.com) for authentication
- [Vercel](https://vercel.com) for hosting

## 📧 Support

- 📧 Email: support@chat-cue.dev
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/chat-cue/issues)

---

<div align="center">

**Built with ❤️ for the modern web**

⭐ Star this repo if you find it helpful!

</div>
