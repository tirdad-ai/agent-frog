# Agent Prompts Library

This directory contains detailed system prompts for each AI agent, enforcing **strict architectural patterns**.

## 📚 Available Prompts

### 1. BusinessOwnerAgent (5.3KB)

**File:** `business-owner-agent-prompt.md`

**Defines:**

- Business requirements format
- User story templates
- Success metrics guidelines
- Priority frameworks

**Use when:** Planning features and defining business value

---

### 2. SeniorBackendAgent (26KB)

**File:** `senior-backend-agent-prompt.md`

**Enforces:**

- ✅ Services in `packages/services/` - Business logic ONLY here
- ✅ Thin API routes - No business logic in routes
- ✅ Repository pattern - Database operations isolated
- ✅ Zod validation - Separate validation schemas
- ✅ Custom errors - Structured error handling
- ✅ i18n - Centralized translations with locale support
- ✅ Infrastructure services - Logger, Cache, Email, Storage, Queue
- ✅ Structured logging - No console.log
- ✅ Dependency injection - Constructor pattern

**Includes:**

- 10 mandatory patterns (including i18n & infrastructure)
- Complete examples (✅ correct vs ❌ wrong)
- File structure and naming
- Testing patterns
- Quality checklist

**Use when:** Implementing backend features

---

### 3. SeniorFrontendAgent (25KB)

**File:** `senior-frontend-agent-prompt.md`

**Enforces:**

- ✅ **shadcn/ui as foundation** - NEVER create custom base components
- ✅ Component structure - `base/` (shadcn) + `custom/` (compositions)
- ✅ **TanStack Query** - ALL server state (no useState + useEffect)
- ✅ **TanStack Table** - ALL data tables (with sorting/filtering/pagination)
- ✅ TanStack Virtual - For large lists (1000+ items)
- ✅ Formik for ALL forms - Mandatory form library
- ✅ Centralized API client - No direct fetch
- ✅ Zustand - Client state (when needed)
- ✅ ALL states handled - Loading, error, empty, success
- ✅ i18n - next-intl with RTL support
- ✅ Tailwind + cn - Styling patterns (from shadcn)
- ✅ UX design match - Exact implementation

**Includes:**

- 9 mandatory patterns (with shadcn/ui + i18n)
- shadcn/ui setup and available components
- Base vs Custom component organization
- Complete examples (✅ correct vs ❌ wrong)
- Form handling with Formik + shadcn Form
- i18n with next-intl and RTL support
- State management patterns
- Testing with React Testing Library
- Quality checklist

**Use when:** Implementing frontend features

---

### 4. MarketingAgent (34KB)

**File:** `marketing-agent-prompt.md`

**Enforces:**

- ✅ Benefit-focused messaging - Features translated to user benefits
- ✅ Brand voice consistency - Tone aligned with business requirements
- ✅ User-facing content - Onboarding, help docs, in-app messaging
- ✅ Launch materials - Announcements, social posts, email templates
- ✅ Landing page copy - Hero sections, CTAs, SEO optimization
- ✅ i18n support - Content designed for translation

**Includes:**

- Marketing strategy template
- Launch materials template
- User-facing content template
- Landing page copy template
- Features vs benefits framework
- Brand voice guidelines
- Cross-agent collaboration patterns
- Quality checklist

**Use when:** Creating marketing content, positioning, or go-to-market materials

---

## 🎯 How to Use

### ⚡ IMPORTANT: Universal Header (NEW)

**File:** `_AGENT_HEADER.md`

ALL agents MUST load this header BEFORE their specific prompt.

**Contains:**

- Mandatory workflow rules (5 rules)
- How to read agent state files (current-release.json, agent-handoffs.json, completed-contracts.json)
- How to update state files after completing work
- Handoff creation process
- Completion message template
- Quick checklist

**Why?** Ensures ALL agents follow the same workflow regardless of their specific role.

---

### Loading Prompts

When activating an agent:

1. **FIRST:** Load `_AGENT_HEADER.md` (universal workflow rules)
2. **THEN:** Load the agent-specific prompt (e.g., `senior-backend-agent-prompt.md`)
3. **Combine:** Header + Agent prompt = Complete system prompt
4. Agent will follow exact patterns defined

```
Example:
- User requests backend feature
- Load: _AGENT_HEADER.md (workflow rules)
- Load: senior-backend-agent-prompt.md (backend patterns)
- Agent implements with service layer, repositories, etc.
- Agent updates state files (handoffs, progress, etc.)
- Code is consistent with YOUR architecture
```

### Benefits

**Consistency:**

- All agents follow same patterns
- Code is predictable
- Easy to review and maintain

**Quality:**

- Best practices enforced
- No shortcuts or inconsistencies
- Professional codebase

**Speed:**

- Agents know exactly what to do
- No ambiguity
- Faster implementation

---

## 📋 Pattern Summary

### Backend Architecture

```
packages/
├── services/
│   ├── {domain}/           # Business logic (users, auth, etc.)
│   ├── infrastructure/     # Cross-cutting (logger, cache, email)
│   └── errors/            # Custom errors
└── i18n/
    ├── locales/           # Shared translations (en, ar, es)
    └── index.ts           # i18n service

apps/{app}/api/        # Thin API routes (no business logic)
```

### Frontend Architecture

```
packages/
├── ui/                # Component library
│   ├── components/
│   │   ├── base/       # shadcn/ui (DO NOT MODIFY)
│   │   └── custom/     # Composed from base/
│   └── lib/
│       └── utils.ts    # cn() helper
└── i18n/              # Shared translations

apps/{app}/
├── app/
│   └── [locale]/      # Locale-specific routes
├── messages/          # App-specific translations
├── components/        # App-specific compositions
└── lib/               # API client, hooks, utils
```

---

## 🔄 Updating Prompts

As you learn and refine your architecture:

1. **Update the prompt files** with new patterns
2. **Document new best practices**
3. **Add more examples** of correct/incorrect code
4. **Keep prompts synchronized** with actual codebase

---

## 📊 File Sizes

| Prompt              | Size  | Lines |
| ------------------- | ----- | ----- |
| BusinessOwnerAgent  | 5.3KB | ~238  |
| SeniorBackendAgent  | 26KB  | ~1166 |
| SeniorFrontendAgent | 23KB  | ~1059 |
| MarketingAgent      | 34KB  | ~855  |

**Total:** ~88KB of architectural guidance

---

## ✅ Quality Checklist

Each prompt includes a quality checklist. Before marking work complete, verify:

**Backend:**

- [ ] Business logic in services
- [ ] API routes are thin
- [ ] Database in repositories
- [ ] Validation with Zod
- [ ] i18n used (no hardcoded strings)
- [ ] Infrastructure services used correctly
- [ ] Structured logging
- [ ] All tests passing

**Frontend:**

- [ ] **Using shadcn/ui base components** (not custom)
- [ ] Custom components in `custom/` folder (composed from base)
- [ ] NO modifications to shadcn base components
- [ ] Forms with Formik + shadcn Form components
- [ ] API client used (no direct fetch)
- [ ] All states handled (loading, error, empty, success)
- [ ] i18n with next-intl (no hardcoded text)
- [ ] RTL support for Arabic
- [ ] UX design matched exactly
- [ ] All tests passing

**Marketing:**

- [ ] Copy is benefit-focused (not feature-focused)
- [ ] Brand voice is consistent
- [ ] All CTAs are clear and actionable
- [ ] Content supports i18n requirements
- [ ] User-facing text is scannable and clear
- [ ] Error messages are user-friendly
- [ ] Messaging aligns with business requirements

---

**See parent WARP.md for complete agent orchestration guide**
