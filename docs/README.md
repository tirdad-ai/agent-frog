# Documentation Index

This directory contains all documentation for AI agent handoffs and system architecture.

## 📚 Documentation Structure

```
docs/
├── README.md                    # This file - documentation index
├── AGENT_WORKFLOW.md            # Detailed agent workflow
├── TODO_RELEASES.md             # Release planning
├── RELEASE_PROCESS.md           # Automated versioning with release-it
├── GIT_HOOKS_SETUP.md           # Git hooks (Husky, commitlint, lint-staged)
│
├── architecture/                # Technical architecture docs
│   ├── I18N_INTEGRATION.md     # Internationalization patterns
│   ├── I18N_STRUCTURE_SUMMARY.md
│   ├── SHADCN_UI_ARCHITECTURE.md
│   ├── SHARED_PACKAGES.md       # Monorepo shared packages
│   └── TANSTACK_LIBRARIES.md    # TanStack ecosystem
│
├── guides/                      # Quick start and guides
│   └── QUICKSTART.md            # Getting started guide
│
└── reference/                   # Reference materials
    └── (future reference docs)

# Root Level
../WARP.md                       # Main AI orchestration guide
../README.md                     # Project overview
```

---

## 🎯 For AI Agents

### Starting a New Task?
1. Read `../WARP.md` - Complete agent orchestration guide
2. Check `.agent-prompts/` - Your specific agent prompt
3. Read relevant architecture docs below

### Agent-Specific Documentation

**ProjectInitializerAgent:**
- `.agent-prompts/project-initializer-agent-prompt.md`
- `GETTING_STARTED.md` (user-facing guide)
- `PROJECT_OVERVIEW.md` (created by this agent)

**BusinessOwnerAgent:**
- `.agent-prompts/business-owner-agent-prompt.md`
- `guides/QUICKSTART.md`

**SolutionArchitectAgent:**
- `architecture/SHARED_PACKAGES.md`
- `architecture/I18N_INTEGRATION.md`

**SeniorBackendAgent:**
- `.agent-prompts/senior-backend-agent-prompt.md`
- `architecture/SHARED_PACKAGES.md` (services, database, auth)
- `architecture/I18N_INTEGRATION.md` (backend patterns)

**SeniorFrontendAgent:**
- `.agent-prompts/senior-frontend-agent-prompt.md`
- `architecture/SHADCN_UI_ARCHITECTURE.md`
- `architecture/TANSTACK_LIBRARIES.md`
- `architecture/I18N_INTEGRATION.md` (frontend patterns)

**QATestingAgent:**
- Testing patterns in agent prompts
- Architecture docs for understanding system

---

## 📖 Documentation Files

### Architecture (Technical Deep Dives)

#### `architecture/I18N_INTEGRATION.md` (12KB)
Complete internationalization implementation:
- Structured translations (shared vs page-specific)
- Backend patterns (i18n service)
- Frontend patterns (next-intl)
- Examples and usage

#### `architecture/I18N_STRUCTURE_SUMMARY.md` (5.4KB)
Quick reference for i18n organization:
- Decision guide (shared vs app-specific)
- Namespace conventions
- Quality checklist

#### `architecture/SHADCN_UI_ARCHITECTURE.md` (11KB)
Complete UI component architecture:
- shadcn/ui as foundation (50+ components)
- Base vs Custom component structure
- Setup guide and available components
- Usage patterns and examples

#### `architecture/TANSTACK_LIBRARIES.md` (14KB)
Complete TanStack ecosystem guide:
- TanStack Query (server state)
- TanStack Table (data tables)
- TanStack Virtual (large lists)
- Complete examples and patterns

#### `architecture/SHARED_PACKAGES.md` (21KB)
Monorepo shared packages architecture:
- `eslint-config` - Shared linting
- `typescript-config` - Shared TypeScript
- `ui` - Component library
- `ui-config` - Tailwind presets
- `auth` - Authentication (NextAuth/Clerk)
- Complete package structure and usage

---

### Guides (Getting Started)

#### `guides/QUICKSTART.md`
Quick start guide for developers:
- Setup instructions
- Development workflow
- Common commands

#### `RELEASE_PROCESS.md` (15KB)
Automated versioning and release system:
- release-it configuration and workflow
- Buildable vs non-buildable packages
- Conventional commits for changelog
- CI/CD integration examples
- Troubleshooting guide

#### `GIT_HOOKS_SETUP.md` (16KB)
Git hooks for quality enforcement:
- Husky configuration and setup
- Pre-commit: lint-staged (format, lint, typecheck)
- Commit-msg: commitlint (conventional commits)
- Pre-push: full validation (test, typecheck, lint)
- Troubleshooting and best practices

---

### Root Level (Main Entry Points)

#### `../WARP.md` (16.7KB)
**Main orchestration guide** - Read this first!
- Complete agent system
- 7 specialized agents
- Handoff process
- Validation gates
- TDD workflow

#### `../README.md` (11KB)
Project overview:
- What this boilerplate is
- Key features
- Architecture overview
- Getting started

---

## 🔄 Documentation Workflow

### When to Read Documentation

**Planning Phase:**
→ Read `../WARP.md` and `../README.md`

**Architecture Phase:**
→ Read `architecture/SHARED_PACKAGES.md`
→ Read relevant architecture docs

**Implementation Phase:**
→ Read agent-specific prompt in `.agent-prompts/`
→ Reference architecture docs as needed

**Review Phase:**
→ Check against quality checklists in agent prompts

---

## ✅ Documentation Principles

1. **Single Source of Truth**
   - Each concept documented once
   - Cross-reference, don't duplicate

2. **Agent-Focused**
   - Written for AI agents, not humans
   - Clear instructions, examples
   - Complete patterns

3. **Structured for Handoffs**
   - Organized by agent role
   - Clear entry points
   - Progressive detail

4. **Living Documentation**
   - Updated as architecture evolves
   - Reflects actual implementation
   - Examples from real code

---

**For complete agent orchestration, start with `../WARP.md`**
