# Getting Started with AgentForge

This guide will help you understand and start using the AgentForge AI agent orchestration system.

---

## 📖 Table of Contents

1. [Understanding the System](#understanding-the-system)
2. [Initial Setup](#initial-setup)
3. [Starting Your First Project](#starting-your-first-project)
4. [Working with Agents](#working-with-agents)
5. [Agent Workflow](#agent-workflow)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Understanding the System

### What is AgentForge?

AgentForge combines:
- **A production-ready monorepo boilerplate** (Next.js + TypeScript + Prisma + shadcn/ui)
- **An AI agent orchestration system** (9 specialized agents following TDD and strict quality gates)

### The 9 Agents

Each agent has a specific role and cannot do work outside their domain:

1. **ProjectInitializerAgent** - Conducts discovery (40+ questions), creates roadmap
2. **BusinessOwnerAgent** - Defines requirements, success metrics, user pain points
3. **UXAgent** - Designs flows, wireframes, error states
4. **SolutionArchitectAgent** - Creates API contracts, database schema, architecture decisions
5. **QATestingAgent** - Writes test plans and tests BEFORE implementation (TDD)
6. **SeniorBackendAgent** - Implements backend to pass tests
7. **SeniorFrontendAgent** - Implements frontend to pass tests
8. **ReviewerAgent** - Validates quality, security, and requirements
9. **MarketingAgent** - Creates marketing copy, user content, launch materials

### How Agents Communicate

Agents communicate through:
- **Documentation files** in `releases/{RELEASE}/` folder
- **State files** in `.agent-state/` directory
- **Handoff protocols** defined in `WARP.md`

---

## Initial Setup

### 1. Prerequisites

Install these tools:

```bash
# Node.js 18+ (check version)
node --version

# pnpm 8+ (install if needed)
npm install -g pnpm
pnpm --version

# PostgreSQL (verify it's running)
psql --version
```

### 2. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/agentforge.git
cd agentforge

# Install dependencies
pnpm install
```

### 3. Database Setup

```bash
# Create a PostgreSQL database
createdb agentforge_dev

# Configure environment
cp .env.example .env.local

# Add your database URL to .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/agentforge_dev"

# Generate Prisma client and push schema
cd packages/database
pnpm db:generate
pnpm db:push
cd ../..
```

### 4. Configure Apps

```bash
# Configure admin app
cd apps/admin
cp .env.example .env.local
# Edit .env.local with your settings
cd ../..

# Configure other apps as needed
```

### 5. Build and Run

```bash
# Build all packages
pnpm build

# Start development servers
pnpm dev
```

Visit:
- Admin: http://localhost:3001
- PlanGPT: http://localhost:3000
- Examples: http://localhost:3002

---

## Starting Your First Project

### Option 1: New Project Discovery (Recommended)

Use this when starting a completely new project:

**Tell your AI assistant:**
```
I want to start a new project using AgentForge.
```

**ProjectInitializerAgent will activate and ask questions like:**

**Business Context:**
- What problem does your product solve?
- Who are your target users?
- What industry are you in?

**Project Goals:**
- What are the top 3 features for MVP?
- What's your target launch date?
- How do you measure success?

**Technical Requirements:**
- Do you need internationalization?
- What scale do you expect?
- Any third-party integrations?

**Output:** 
- `PROJECT_OVERVIEW.md` - High-level summary
- `DISCOVERY_SESSION.md` - Complete Q&A
- `TODO_RELEASES.md` - Release roadmap
- `releases/R1-FOUNDATION/RELEASE_PLAN.md` - First release

### Option 2: Manual Project Setup

If you prefer to manually create project documents:

```bash
# Create project overview
cat > PROJECT_OVERVIEW.md << 'EOF'
# My Project

**Industry:** [Your industry]
**Target Users:** [Your users]
**Problem:** [Problem you're solving]

## Core Features
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]
EOF

# Create release roadmap
cat > TODO_RELEASES.md << 'EOF'
# Release Roadmap

## R1-FOUNDATION
- [ ] Authentication system
- [ ] Database schema
- [ ] Basic UI components

## R2-CORE-FEATURES
- [ ] [Your features]
EOF

# Create first release folder
mkdir -p releases/R1-FOUNDATION
```

Then tell your AI assistant:
```
Read PROJECT_OVERVIEW.md and start R1-FOUNDATION with BusinessOwnerAgent.
```

---

## Working with Agents

### Activating an Agent

Each agent has a specific trigger. You activate agents by:

1. **Telling your AI assistant which agent to use:**
   ```
   Activate BusinessOwnerAgent for R1-FOUNDATION.
   ```

2. **Using "What's next?" (recommended):**
   ```
   What's next?
   ```
   The system automatically determines which agent should work next.

### Agent Outputs

Each agent creates specific files:

**BusinessOwnerAgent:**
- `BUSINESS_REQUIREMENTS.md` - What we're building and why

**UXAgent:**
- `UX_DESIGN.md` - User flows, wireframes, error states

**SolutionArchitectAgent:**
- `ARCHITECTURE_DECISIONS.md` - System design decisions
- `API_CONTRACT.md` - Backend API contracts
- `COMPONENT_CONTRACT.md` - Frontend component contracts

**QATestingAgent:**
- `TEST_PLAN.md` - Testing strategy
- `tests/backend/` - Backend tests (failing)
- `tests/frontend/` - Frontend tests (failing)

**SeniorBackendAgent:**
- Backend implementation (to pass tests)

**SeniorFrontendAgent:**
- Frontend implementation (to pass tests)

**ReviewerAgent:**
- Quality validation, approval or feedback

### Checking Progress

```bash
# Check current state
cat .agent-state/current-release.json

# Check release progress
cat releases/R1-FOUNDATION/PROGRESS.md

# Check pending handoffs
cat .agent-state/agent-handoffs.json
```

---

## Agent Workflow

### Complete Release Flow

Here's how a feature goes from idea to production:

```
User Request: "Add user authentication"
        ↓
BusinessOwnerAgent: Creates BUSINESS_REQUIREMENTS.md
    - Documents user pain points
    - Defines success metrics
    - Outlines security requirements
        ↓
UXAgent: Creates UX_DESIGN.md
    - Designs login/signup flows
    - Creates wireframes
    - Defines error states
        ↓
SolutionArchitectAgent: Creates contracts
    - ARCHITECTURE_DECISIONS.md (JWT vs sessions)
    - API_CONTRACT.md (POST /auth/login, etc.)
    - COMPONENT_CONTRACT.md (LoginForm, SignupForm)
        ↓
QATestingAgent: Writes tests (BEFORE implementation!)
    - tests/backend/auth.test.ts (failing ❌)
    - tests/frontend/LoginForm.test.tsx (failing ❌)
        ↓
SeniorBackendAgent: Implements backend
    - Implements auth APIs
    - All backend tests pass ✅
        ↓
SeniorFrontendAgent: Implements frontend
    - Implements LoginForm, SignupForm
    - All frontend tests pass ✅
        ↓
ReviewerAgent: Validates everything
    - Checks security
    - Validates quality
    - Confirms requirements met
    - Approves ✅
        ↓
Release Complete! 🎉
```

### Validation Gates

Agents enforce strict quality gates:

**Gate 1: UX Design Required**
```
IF (frontend work) AND (no UX_DESIGN.md)
THEN BLOCK: "UX design must be created first"
```

**Gate 2: Tests Required Before Code**
```
IF (implementation) AND (no tests OR tests passing)
THEN BLOCK: "Write failing tests first (TDD)"
```

**Gate 3: Backend Before Frontend**
```
IF (frontend work) AND (backend tests not passing)
THEN BLOCK: "Backend must be complete first"
```

**Gate 4: Contract Validation**
```
IF (implementation doesn't match contracts)
THEN BLOCK: "Implementation must follow contracts"
```

---

## Best Practices

### 1. Always Use "What's Next?"

Let the system determine which agent should work:
```
What's next?
```

This is better than manually activating agents because it:
- Reads current state automatically
- Follows the correct workflow
- Prevents skipping steps

### 2. Follow TDD Strictly

**❌ Wrong:**
```
Write the authentication API.
```

**✅ Correct:**
```
Write tests for authentication API, then implement.
```

### 3. Let Agents Validate Each Other

Don't skip cross-agent validation. If UXAgent creates a design that can't support the business requirements, **it should push back**:

```
UXAgent → BusinessOwnerAgent
"The requirement 'users can switch tenants' needs clarification. 
Should users belong to multiple tenants?"
```

This prevents cascading errors.

### 4. Keep Releases Small

**❌ Too big:**
```
R1: Complete authentication, user management, subscription management, 
invoicing, and payment processing
```

**✅ Right size:**
```
R1: Authentication foundation (signup, login, password reset)
R2: User management (profiles, roles)
R3: Subscription management
```

### 5. Document Decisions

When agents make non-obvious decisions, document them:

```markdown
## Why JWT Instead of Sessions?

**Decision:** Use JWT tokens for authentication.

**Rationale:**
- Stateless (scales horizontally)
- Works with edge functions
- Supports multiple clients (web + mobile)

**Trade-offs:**
- Cannot invalidate tokens server-side
- Larger token size
```

---

## Troubleshooting

### Agent Seems Stuck

```bash
# 1. Check current state
cat .agent-state/current-release.json

# 2. Check if there's a pending handoff
cat .agent-state/agent-handoffs.json

# 3. Check release progress
cat releases/*/PROGRESS.md

# 4. If stuck, ask: "What's next?"
```

### Tests Failing

```bash
# Backend tests
cd releases/R1-FOUNDATION/tests/backend
pnpm test

# Frontend tests
cd releases/R1-FOUNDATION/tests/frontend
pnpm test

# Check test plan for debugging hints
cat releases/R1-FOUNDATION/TEST_PLAN.md
```

### Agent Created Wrong Output

Don't edit agent files directly. Instead:

1. Tell the agent what's wrong:
   ```
   The API contract is missing the /auth/logout endpoint.
   SolutionArchitectAgent should update API_CONTRACT.md.
   ```

2. The agent will update the file correctly.

3. Subsequent agents will use the updated version.

### Need to Start Over

```bash
# Nuclear option: Reset agent state
rm -rf .agent-state/*.json
rm -rf releases/*

# Then restart with:
# "I want to start a new project using AgentForge."
```

### Build Errors

```bash
# Clean everything
pnpm clean
rm -rf node_modules

# Reinstall
pnpm install

# Regenerate Prisma client
cd packages/database
pnpm db:generate

# Rebuild
pnpm build
```

---

## Next Steps

1. ✅ **Complete Initial Setup** (above)
2. ✅ **Read [Agent System Guide](./.agent-state/README.md)** - Understand agent state management
3. ✅ **Read [WARP.md](./WARP.md)** - Complete orchestration rules
4. ✅ **Start your first project** - Use ProjectInitializerAgent
5. ✅ **Review agent outputs** - Learn from generated documentation
6. ✅ **Customize for your needs** - Modify agent prompts if needed

---

## Resources

- **Main README**: [README.md](./README.md)
- **Agent Orchestration Rules**: [WARP.md](./WARP.md)
- **Agent Prompts**: [.agent-prompts/](./.agent-prompts/)
- **Package Documentation**: [packages/*/README.md](./packages/)

---

## Support

If you get stuck:

1. Check `.agent-state/current-release.json` for current state
2. Review `WARP.md` for workflow rules
3. Read individual agent prompts in `.agent-prompts/`
4. Open a GitHub issue

---

**Happy building with AgentForge!** 🚀
