# AgentForge - AI-Powered Development Orchestration

**Build production-ready applications with multi-agent AI orchestration**

AgentForge is a comprehensive Turborepo boilerplate with an embedded AI agent orchestration system. It combines modern full-stack architecture with intelligent development workflows powered by specialized AI agents.

---

## 🎯 What is AgentForge?

AgentForge is **two things in one**:

### 1. **Production-Ready Monorepo Boilerplate**
A modern TypeScript monorepo with Next.js, authentication, database, and UI design system — ready to build SaaS applications.

### 2. **AI Agent Orchestration System**
A sophisticated multi-agent development framework where specialized AI agents collaborate to build features using Test-Driven Development (TDD), documentation-driven workflows, and strict quality gates.

**The result?** You describe what you want to build, and AI agents orchestrate themselves to deliver production-ready code with tests, documentation, and quality validation.

---

## 🤖 The AI Agent System

### How It Works

AgentForge uses **9 specialized AI agents**, each with a specific role in the development process:

| Agent | Role | Responsibility |
|-------|------|----------------|
| **ProjectInitializerAgent** | Discovery | Conducts comprehensive discovery, creates project roadmap |
| **BusinessOwnerAgent** | Requirements | Defines business value, success metrics, user pain points |
| **UXAgent** | Design | Designs user flows, wireframes, empty/error states |
| **SolutionArchitectAgent** | Architecture | Defines system design, API contracts, database schema |
| **QATestingAgent** | Testing | Writes test plans and tests BEFORE implementation (TDD) |
| **SeniorBackendAgent** | Backend | Implements backend to pass tests |
| **SeniorFrontendAgent** | Frontend | Implements frontend to pass tests |
| **ReviewerAgent** | Quality | Validates implementation against requirements |
| **MarketingAgent** | Positioning | Creates marketing copy, launch materials, user content |

### Core Principles

1. **Release-Based Development** - All work organized into releases (R1, R2, R3...)
2. **TDD-First Mandatory** - Tests written BEFORE implementation
3. **Documentation-Driven** - Requirements documented before any code
4. **Strict Agent Boundaries** - Each agent has specific responsibilities
5. **Cross-Agent Validation** - Agents validate previous agents' work

### Validation Gates

AgentForge enforces strict quality gates:

- ✅ **UX Design Required** - No frontend work without approved UX design
- ✅ **Tests First** - No implementation without failing tests
- ✅ **Backend Before Frontend** - Backend must pass tests before frontend starts
- ✅ **Contract Compliance** - Implementation must follow architecture contracts
- ✅ **Cross-Agent Review** - Each agent validates upstream work

---

## 🏗️ Monorepo Architecture

AgentForge is built on a modern full-stack foundation:

```
agentforge/
├── apps/
│   └── web/                        # Main Next.js application
├── packages/
│   ├── auth/                       # @repo/auth - NextAuth.js v5
│   ├── database/                   # @repo/database - Prisma ORM
│   ├── services/                   # @repo/services - Business logic (service layer)
│   ├── ui/                         # @repo/ui - shadcn/ui components
│   ├── i18n/                       # @repo/i18n - next-intl translations
│   ├── types/                      # @repo/types - Shared TypeScript types
│   ├── tests/                      # @repo/tests - Test utilities + setup
│   ├── eslint-config/              # Shared ESLint config
│   └── typescript-config/          # Shared TypeScript config
├── .agent-prompts/                 # AI agent system prompts
├── .agent-state/                   # Agent workflow state
├── releases/                       # Release documentation
├── PACKAGES_OVERVIEW.md            # Complete package documentation
└── WARP.md                         # Agent orchestration rules
```

### Tech Stack

- **Frontend**: Next.js 14+ (App Router), React Server Components
- **Backend**: Next.js API Routes with Service Layer Pattern
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (@repo/auth)
- **UI**: shadcn/ui + Tailwind CSS + Radix UI (@repo/ui)
- **State Management**: TanStack Query v5 + Zustand
- **Forms**: Formik + Yup validation
- **Tables**: TanStack Table v8
- **i18n**: next-intl (@repo/i18n)
- **Testing**: Vitest + React Testing Library + Playwright
- **Monorepo**: Turborepo with pnpm workspaces
- **Quality**: ESLint, TypeScript, Husky git hooks
- **AI**: Multi-agent orchestration system

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL database
- AI assistant (Claude, ChatGPT, or similar)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/agentforge.git
cd agentforge
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

```bash
# Navigate to database package
cd packages/database

# Generate Prisma client
pnpm db:generate

# Create database (update .env.local with your connection string)
DATABASE_URL="postgresql://username:password@localhost:5432/agentforge_dev"

# Push schema to database
pnpm db:push
```

### 4. Environment Configuration

Copy environment examples:

```bash
# Root environment
cp .env.example .env.local

# Configure each app
cd apps/admin && cp .env.example .env.local
cd apps/plangpt && cp .env.example .env.local
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret-key"  # Generate: openssl rand -base64 32
AUTH_URL="http://localhost:3000"

# Optional: OAuth providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### 5. Build & Run

```bash
# Build all packages
pnpm build

# Start development servers
pnpm dev
```

Access applications:
- **Admin**: http://localhost:3001
- **PlanGPT**: http://localhost:3000
- **Examples**: http://localhost:3002

---

## 🎨 Using the AI Agent System

### Starting a New Project

1. **Trigger Project Discovery**

Tell your AI assistant:
```
I want to start a new project using AgentForge.
```

2. **ProjectInitializerAgent Activates**

The agent will ask 40+ discovery questions across:
- Business context (problem, users, industry)
- Project goals (features, timeline, success metrics)
- Users & personas (roles, permissions, workflows)
- Core features (top priorities, data models)
- Technical requirements (integrations, scale, i18n)
- Design & UX (branding, inspiration, requirements)
- Compliance & security (regulations, sensitive data)
- Future vision (6 months, 1 year roadmap)

3. **Receive Deliverables**

- `PROJECT_OVERVIEW.md` - High-level project summary
- `DISCOVERY_SESSION.md` - Complete Q&A transcript
- `TODO_RELEASES.md` - Release roadmap (R1, R2, R3+)
- `releases/R1-FOUNDATION/RELEASE_PLAN.md` - First release plan

4. **Agent Orchestration Begins**

The system automatically hands off work:
```
ProjectInitializerAgent → BusinessOwnerAgent → UXAgent → 
SolutionArchitectAgent → QATestingAgent → SeniorBackendAgent → 
SeniorFrontendAgent → ReviewerAgent → Complete ✅
```

### Adding New Features

For existing projects, ask:
```
What's next?
```

The system reads:
- `.agent-state/current-release.json` - Current state
- `releases/{RELEASE}/PROGRESS.md` - Task status
- `TODO_RELEASES.md` - Release roadmap

Then activates the correct agent to continue work.

### Agent Workflow Example

**User Request:** "Add user authentication"

1. **BusinessOwnerAgent** creates `BUSINESS_REQUIREMENTS.md`
   - Defines user pain points, success metrics
   - Documents security requirements

2. **UXAgent** creates `UX_DESIGN.md`
   - Designs login/signup flows
   - Creates wireframes, error states

3. **SolutionArchitectAgent** creates contracts:
   - `ARCHITECTURE_DECISIONS.md` (JWT vs sessions)
   - `API_CONTRACT.md` (POST /auth/login, etc.)
   - `COMPONENT_CONTRACT.md` (LoginForm, SignupForm)

4. **QATestingAgent** writes tests (failing):
   - `tests/backend/auth.test.ts`
   - `tests/frontend/LoginForm.test.tsx`

5. **SeniorBackendAgent** implements backend
   - All backend tests pass ✅

6. **SeniorFrontendAgent** implements frontend
   - All frontend tests pass ✅

7. **ReviewerAgent** validates
   - Checks security, quality, requirements
   - Approves release ✅

**Result:** Production-ready authentication with tests, docs, and validated quality.

---

## 📁 Project Structure

### Agent System Files

```
.agent-prompts/                     # AI agent system prompts
├── README.md                       # Agent system overview
├── _AGENT_HEADER.md                # Shared agent context
├── project-initializer-agent-prompt.md
├── business-owner-agent-prompt.md
├── ux-agent-prompt.md
├── solution-architect-agent-prompt.md
├── qa-testing-agent-prompt.md
├── senior-backend-agent-prompt.md
├── senior-frontend-agent-prompt.md
├── reviewer-agent-prompt.md
├── marketing-agent-prompt.md
└── prompt-engineer-agent-prompt.md

.agent-state/                       # Agent workflow state
├── README.md                       # State management guide
├── current-release.json            # Current agent & task
├── agent-handoffs.json             # Work queue & handoffs
└── completed-contracts.json        # Historical patterns

releases/                           # Release documentation
└── {RELEASE}/                      # Per-release folder
    ├── RELEASE_PLAN.md             # What we're building
    ├── PROGRESS.md                 # Task tracking
    ├── BUSINESS_REQUIREMENTS.md    # Business requirements
    ├── UX_DESIGN.md                # UX specification
    ├── ARCHITECTURE_DECISIONS.md   # System design
    ├── API_CONTRACT.md             # Backend contract
    ├── COMPONENT_CONTRACT.md       # Frontend contract
    ├── TEST_PLAN.md                # Testing strategy
    ├── CHANGELOG.md                # What was delivered
    ├── feedback/                   # Agent-to-agent feedback
    ├── summary/                    # Progress summaries
    ├── tests/                      # Test files
    └── implementation/             # Code

WARP.md                             # Agent orchestration rules
TODO_RELEASES.md                    # Release roadmap
PROJECT_OVERVIEW.md                 # Project context
```

### Shared Packages

For complete package documentation, see **[PACKAGES_OVERVIEW.md](./PACKAGES_OVERVIEW.md)**

#### Core Packages

- **[@repo/auth](./packages/auth/)** - NextAuth.js v5 authentication
- **[@repo/database](./packages/database/)** - Prisma ORM + PostgreSQL schema
- **[@repo/services](./packages/services/)** - Backend business logic (service layer pattern)
- **[@repo/ui](./packages/ui/)** - shadcn/ui components + Tailwind CSS
- **[@repo/i18n](./packages/i18n/)** - next-intl internationalization
- **[@repo/types](./packages/types/)** - Shared TypeScript types
- **[@repo/tests](./packages/tests/)** - Test utilities + Vitest setup

#### Configuration Packages

- **[@repo/eslint-config](./packages/eslint-config/)** - Shared ESLint configurations
- **[@repo/typescript-config](./packages/typescript-config/)** - Shared TypeScript configurations

**📖 See [PACKAGES_OVERVIEW.md](./PACKAGES_OVERVIEW.md) for detailed usage examples and architecture patterns.**

---

## 🔄 Development Workflow

### Git Hooks & Quality Automation

AgentForge uses **Husky** for automated quality gates:

#### Pre-Commit Hook
- Runs `lint-staged` on changed files
- Type checks modified code
- Auto-fixes with ESLint
- Formats with Prettier

#### Commit Message Hook
- Enforces **Conventional Commits**
- Required format: `type(scope): subject`
- Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`

Examples:
```bash
✅ git commit -m "feat(auth): add login endpoint"
✅ git commit -m "fix(ui): resolve button styling"
❌ git commit -m "added feature"  # Missing type format
```

#### Pre-Push Hook
- Runs all tests (`pnpm test`)
- Type checks entire codebase
- Lints all code
- **Blocks push if any checks fail**

### Release Management

Automated versioning with `release-it`:

```bash
pnpm release:patch    # Bug fixes (0.0.X)
pnpm release:minor    # New features (0.X.0)
pnpm release:major    # Breaking changes (X.0.0)
pnpm release          # Interactive mode
```

Automatically:
1. Validates (lint, typecheck, test)
2. Bumps versions in all packages
3. Builds changed packages
4. Generates CHANGELOG from commits
5. Creates git commit & tag
6. Pushes to remote & creates GitHub release

---

## 🎯 Key Features

### 🔐 Authentication System
- NextAuth.js v5 with OAuth providers (Google, GitHub, Discord)
- Credentials authentication with secure password hashing
- Session management (JWT + database sessions)
- Pre-built UI components for auth flows

### 🗄️ Database Layer
- Prisma ORM with PostgreSQL
- NextAuth-compatible schema
- Type-safe database operations
- Singleton client pattern

### 🎨 Design System
- shadcn/ui component library
- Tailwind CSS styling
- Dark mode support
- Accessible Radix UI primitives
- Responsive, mobile-first

### 🤖 AI Agent Orchestration
- 9 specialized agents with clear responsibilities
- TDD-first workflow (tests before code)
- Cross-agent validation and feedback loops
- Automated documentation generation
- Release-based development

### 📦 Monorepo Benefits
- Shared packages for code reuse
- Turborepo for optimized builds
- pnpm workspaces for efficient deps
- Consistent tooling across apps

---

## 📚 Documentation

### Getting Started
- [Agent System Guide](./.agent-state/README.md) - How agents work together
- [Agent Prompts](./.agent-prompts/README.md) - Individual agent documentation
- [Orchestration Rules](./WARP.md) - Complete workflow specification

### Package Documentation
- **[Complete Package Overview](./PACKAGES_OVERVIEW.md)** - All 9 packages documented
- [Authentication Package](./packages/auth/)
- [Database Package](./packages/database/)
- [Services Package](./packages/services/)
- [UI Package](./packages/ui/)
- [i18n Package](./packages/i18n/)
- [Types Package](./packages/types/)
- [Tests Package](./packages/tests/)

### Development Guides
- [Git Hooks Setup](./docs/GIT_HOOKS_SETUP.md)
- [Release Process](./docs/RELEASE_PROCESS.md)

---

## 🎓 Example Use Cases

### SaaS Applications
Build multi-tenant SaaS with authentication, database, and UI components ready out of the box.

### AI-Powered Tools
Like the included planGPT app - AI-powered applications with modern UX.

### Internal Tools
Admin dashboards, developer tools, component libraries.

### Rapid Prototyping
TDD workflow + AI agents = ship validated features fast.

---

## 🤝 Contributing

AgentForge welcomes contributions!

### Contribution Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes following the existing patterns
4. Ensure all packages build: `pnpm build`
5. Commit with conventional format: `git commit -m 'feat(scope): add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Update package READMEs when adding features
- Add proper TypeScript types
- Write tests for new functionality
- Update agent prompts if workflow changes

---

## 🛠️ Troubleshooting

### Database Connection Issues

```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Regenerate Prisma client
cd packages/database
pnpm db:generate
```

### Build Errors

```bash
# Clean build cache
pnpm clean

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

### Agent State Issues

If agent workflow seems stuck:

```bash
# Check current state
cat .agent-state/current-release.json

# Check pending handoffs
cat .agent-state/agent-handoffs.json

# Reset agent state (nuclear option)
rm -rf .agent-state/*.json
# Re-run agent initialization
```

---

## 📊 Architecture Decisions

### Why Turborepo?
- Optimized build caching
- Parallel task execution
- Clear dependency graph
- Scales to large monorepos

### Why pnpm?
- Efficient disk space usage
- Fast installs
- Strict dependency resolution
- Workspace support

### Why Next.js?
- React Server Components
- App Router for modern patterns
- API routes for backend
- Excellent TypeScript support
- Vercel deployment optimization

### Why Prisma?
- Type-safe database queries
- Excellent migration system
- Auto-generated TypeScript types
- Multi-database support

### Why AI Agents?
- **Consistency**: Agents follow strict patterns
- **Quality**: Multiple validation gates
- **Documentation**: Auto-generated and maintained
- **TDD**: Tests written first, always
- **Scalability**: Clear handoffs and state management

---

## 🌟 What Makes AgentForge Different?

### vs. Traditional Boilerplates
- ❌ Traditional: "Here's code, figure it out"
- ✅ AgentForge: "Orchestrated development with AI agents"

### vs. AI Code Generators
- ❌ AI Generators: "Generate code, hope it works"
- ✅ AgentForge: "TDD workflow, validated at every step"

### vs. Manual Development
- ❌ Manual: "Build → Test → Debug → Repeat"
- ✅ AgentForge: "Test → Build → Validate → Ship"

---

## 📈 Roadmap

### Current (v1.0)
- ✅ 9 AI agents with specialized roles
- ✅ TDD-first workflow
- ✅ Cross-agent validation
- ✅ Release-based development
- ✅ Full-stack monorepo boilerplate

### Near Future (v1.1-1.2)
- [ ] Agent performance metrics
- [ ] Visual workflow dashboard
- [ ] Additional agent roles (DevOps, Security)
- [ ] Enhanced error recovery
- [ ] CI/CD pipeline templates

### Future Vision (v2.0+)
- [ ] Multi-language support (Python, Go, etc.)
- [ ] Cloud deployment automation
- [ ] Team collaboration features
- [ ] Agent learning from feedback
- [ ] Integration with project management tools

---

## 💬 Community & Support

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Questions and community support
- **Email**: [your-email@domain.com]

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

AgentForge builds on excellent open-source projects:

- [Turborepo](https://turbo.build/) - High-performance build system
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

## ⚡ Quick Commands

```bash
# Development
pnpm dev                # Start all apps
pnpm build              # Build all packages
pnpm lint               # Lint all code
pnpm typecheck          # Type check all code
pnpm clean              # Clean build cache

# Database
pnpm db:generate        # Generate Prisma client
pnpm db:push            # Push schema to database
pnpm db:studio          # Open Prisma Studio

# Release
pnpm release:patch      # Patch version bump
pnpm release:minor      # Minor version bump
pnpm release:major      # Major version bump

# Per-package commands
pnpm --filter @repo/auth [command]
pnpm --filter @repo/database [command]
pnpm --filter @repo/ui [command]
```

---

**Built with ❤️ by developers, for developers.**

**AgentForge** - Where AI agents and human developers collaborate to build better software, faster.
