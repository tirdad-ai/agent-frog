# WARP.md - AI Agent Orchestration System

**Project:** AgentForge  
**Purpose:** Multi-agent development system with strict process controls  
**Last Updated:** 2025-11-06  
**Version:** 2.2 - PromptEngineerAgent AI Optimization

---

## 🤖 FOR AI ASSISTANTS: How to Use This Document

**YOU ARE HERE:** This is WARP.md - the complete orchestration rulebook for AgentForge.

**Your Role:** You are an AI assistant helping a user build software using the AgentForge multi-agent system.

### ⚡ Critical Rules for AI

1. **Read agent state FIRST:** Always check `.agent-state/current-release.json` before responding
2. **Identify your agent role:** Determine which agent persona you should activate based on current task
3. **Follow validation gates:** Never skip the 🚨 gates - they prevent cascading failures
4. **Update state files:** After completing work, update `PROGRESS.md` and agent state JSON
5. **Start responses with agent name:** Format: `(**AgentName**): [your response]`

### 🚀 Quick Start for AI

**New project?**
→ Activate ProjectInitializerAgent (see Phase 0)

**Existing project?**
→ Run "What's Next?" logic (see Section: "What's Next?" Command)

**Mid-release?**
→ Check `releases/{RELEASE}/PROGRESS.md` to see what's done

**This document has 1,400+ lines - use the Table of Contents below to navigate.**

---

## 📑 Table of Contents

### Core Documentation
- [Core Principles](#-core-principles)
- [Agent System Overview](#-agent-system-overview)
- [Release Workflow (Phases 0-6)](#-release-workflow-mandatory-sequence)
- [Validation Gates](#-validation-gates-strict-enforcement)
- [Cross-Agent Review Protocol](#-cross-agent-review-protocol-mandatory)

### Workflow Details
- [File Structure](#-file-structure-per-release)
- [Agent Handoff Process](#-agent-handoff-process)
- ["What's Next?" Command](#-whats-next-command)
- [Progress Tracking](#-progress-tracking)

### Maintenance & Operations
- [Maintenance Workflows](#-maintenance-workflows-run-separately)
- [Self-Updating Rules](#-self-updating-rules)
- [Error Handling](#-error-handling)
- [Git Hooks & Quality](#-git-hooks--quality-automation)
- [Release Management](#-release-management)

### Reference
- [Best Practices](#-best-practices)
- [Reference Documentation](#-reference-documentation)
- [Quick Reference Card](#-quick-reference-card)
- [Troubleshooting](#-troubleshooting)
- [Example: Complete Release Flow](#-example-complete-release-flow)
- [Version History](#-version-history)

---

## 🎯 Core Principles

### 1. Release-Based Development

- All work is organized into releases (R1, R2, R3, etc.)
- Each release has complete documentation BEFORE any code is written
- Releases are independent, shippable increments

### 2. TDD-First Mandatory

- **RULE:** Write tests BEFORE implementation
- No code without corresponding tests
- Tests define the contract between agents

### 3. Documentation-Driven Development

- Business requirements MUST be documented first
- UX design MUST be approved before frontend work
- Architecture decisions MUST be documented before backend work
- All decisions update relevant docs automatically

### 4. Strict Agent Boundaries

- Each agent has specific responsibilities
- Agents CANNOT do work outside their domain
- Handoffs are explicit with validation gates

### 5. Cross-Agent Validation

- **Every agent MUST validate previous agent's output**
- Agents CAN and SHOULD push back if design is flawed
- Feedback loops are mandatory, not optional
- No agent proceeds until upstream issues are resolved

---

## 🤖 Agent System Overview

### Available Agents

| Agent                       | Responsibility                       | Input                      | Output                                                                    |
| --------------------------- | ------------------------------------ | -------------------------- | ------------------------------------------------------------------------- |
| **ProjectInitializerAgent** | Project discovery & release planning | User's business idea       | `PROJECT_OVERVIEW.md` + `DISCOVERY_SESSION.md` + `TODO_RELEASES.md`       |
| **BusinessOwnerAgent**      | Define business value & requirements | Project overview           | `BUSINESS_REQUIREMENTS.md`                                                |
| **UXAgent**                 | Design user experience & flows       | Business requirements      | `UX_DESIGN.md`                                                            |
| **SolutionArchitectAgent**  | Define architecture & system design  | Requirements + UX          | `ARCHITECTURE_DECISIONS.md` + `API_CONTRACT.md` + `COMPONENT_CONTRACT.md` |
| **QATestingAgent**          | Create test plans & write tests      | Contracts                  | `TEST_PLAN.md` + Test files                                               |
| **SeniorBackendAgent**      | Implement backend (TDD)              | API contract + tests       | Backend implementation                                                    |
| **SeniorFrontendAgent**     | Implement frontend (TDD)             | Component contract + tests | Frontend implementation                                                   |
| **ReviewerAgent**           | Validate work & quality              | Implementation             | Approval or feedback                                                      |
| **PromptEngineerAgent**     | Maintain & improve agent prompts     | Agent performance feedback | Updated prompts + `AGENT_ALIGNMENT_REPORT.md`                             |

---

## 🔄 Release Workflow (Mandatory Sequence)

### Phase 0: Project Initialization (ProjectInitializerAgent) - NEW PROJECTS ONLY

**Estimated Time:** 30-60 minutes (AI)  
**Trigger:** User says "I want to start a new project using AgentForge"

1. **ProjectInitializerAgent:**
   - Conduct comprehensive discovery session
   - Ask 40+ questions across 8 categories:
     1. Business Context (name, problem, users, industry, model)
     2. Project Goals (goals, success metrics, timeline, features)
     3. Users & Personas (user types, roles, actions, auth needs)
     4. Core Features (top 5 features, workflows, data)
     5. Technical Requirements (i18n, real-time, integrations, scale)
     6. Design & UX (branding, wireframes, inspiration, requirements)
     7. Compliance & Security (sensitive data, regulations, security)
     8. Future Vision (6 months, 1 year, growth strategy)
   - Extract and validate complete requirements
   - Create release plan (R1, R2, R3+)
   - Get user confirmation
   - **Output:**
     - `PROJECT_OVERVIEW.md` (high-level project summary)
     - `DISCOVERY_SESSION.md` (complete Q&A record)
     - `TODO_RELEASES.md` (release roadmap with phases)
     - `releases/R1-FOUNDATION/RELEASE_PLAN.md` (initial plan)
   - **Hand off to:** BusinessOwnerAgent for R1

**🚨 VALIDATION GATE:** All critical information must be collected and user must confirm plan

**Note:** This phase only runs ONCE when starting a new project. Subsequent releases skip to Phase 1.

---

### Phase 1: Planning (BusinessOwnerAgent + UXAgent)

**Estimated Time:** 30-60 minutes (AI)

1. **BusinessOwnerAgent:**
   - Read user request
   - Create `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`
   - Define success metrics
   - Identify user pain points
   - **Output:** Business requirements document

2. **UXAgent:**
   - Read business requirements
   - Create `releases/{RELEASE}/UX_DESIGN.md`
   - Design user flows
   - Create wireframes (text-based)
   - Define empty states & error states
   - **Output:** Complete UX specification

**🚨 VALIDATION GATE:** UX design MUST be approved before proceeding

---

### Phase 2: Architecture (SolutionArchitectAgent)

**Estimated Time:** 30-45 minutes (AI)

1. **SolutionArchitectAgent:**
   - Read business requirements + UX design
   - Create `releases/{RELEASE}/ARCHITECTURE_DECISIONS.md`
   - Create `releases/{RELEASE}/API_CONTRACT.md`
   - Create `releases/{RELEASE}/COMPONENT_CONTRACT.md`
   - Define database schema changes
   - Define service boundaries
   - **Output:** Complete technical contracts

**🚨 VALIDATION GATE:** Architecture must align with business requirements and UX design

---

### Phase 3: Test-Driven Development (QATestingAgent)

**Estimated Time:** 30-60 minutes (AI)

1. **QATestingAgent:**
   - Read all contracts (API + Component)
   - Create `releases/{RELEASE}/TEST_PLAN.md`
   - Write backend tests (BEFORE backend implementation)
   - Write frontend tests (BEFORE frontend implementation)
   - Write integration tests
   - Define acceptance criteria
   - **Output:** Complete test suite

**🚨 VALIDATION GATE:** All tests must be written and failing before implementation starts

---

### Phase 4: Implementation (Backend → Frontend)

**Estimated Time:** 2-8 hours (AI, depends on complexity)

#### Step 4A: Backend Implementation

1. **SeniorBackendAgent:**
   - Read `API_CONTRACT.md`
   - Read backend tests
   - Implement APIs to pass tests
   - Run tests until all pass
   - Update `PROGRESS.md`
   - **Output:** Working backend implementation

**🚨 VALIDATION GATE:** All backend tests must pass before frontend starts

#### Step 4B: Frontend Implementation

2. **SeniorFrontendAgent:**
   - Read `COMPONENT_CONTRACT.md`
   - Read `UX_DESIGN.md`
   - Read frontend tests
   - Implement components to pass tests
   - Implement pages to match UX design
   - Run tests until all pass
   - Update `PROGRESS.md`
   - **Output:** Working frontend implementation

**🚨 VALIDATION GATE:** All frontend tests must pass

---

### Phase 5: Integration & Validation (QATestingAgent + ReviewerAgent)

**Estimated Time:** 30-60 minutes (AI)

1. **QATestingAgent:**
   - Run all tests (unit + integration + e2e)
   - Validate against acceptance criteria
   - Check UX design implementation
   - Update `PROGRESS.md`

2. **ReviewerAgent:**
   - Review implementation quality
   - Validate against business requirements
   - Check for security issues
   - Verify documentation updates
   - **Output:** Approval or feedback

**🚨 VALIDATION GATE:** All tests pass + reviewer approval required

---

### Phase 6: Release Completion

**Estimated Time:** 15 minutes (AI)

1. **Any Agent:**
   - Create `releases/{RELEASE}/CHANGELOG.md`
   - Update `TODO_RELEASES.md` (mark release complete)
   - Update `WARP.md` with learnings (if architectural changes)
   - Archive agent state
   - Initialize next release

---

## 🔧 Maintenance Workflows (Run Separately)

These workflows are **NOT part of the sequential release process**. They run periodically or on-demand.

---

### Marketing & Launch Content (MarketingAgent) - OPTIONAL

**When to Run:** After Phase 6 (Release Complete), before next release OR for major releases only

**Trigger:** User requests marketing materials OR external launch planned

**Estimated Time:** 30-45 minutes (AI)

**MarketingAgent Actions:**
1. Read `BUSINESS_REQUIREMENTS.md`
2. Read `UX_DESIGN.md` (if exists)
3. Read `CHANGELOG.md` (what was delivered)
4. Create `releases/{RELEASE}/MARKETING_STRATEGY.md`
   - Target audience segments
   - Key messaging and value propositions
   - Positioning statement
   - Competitive differentiation
5. Create `releases/{RELEASE}/LAUNCH_MATERIALS.md`
   - Product announcement copy
   - Feature highlights
   - Social media posts
   - Email templates
6. Create `releases/{RELEASE}/USER_CONTENT.md`
   - Onboarding flows and welcome messages
   - In-app messaging and tooltips
   - Help documentation
   - FAQ entries
7. Create `releases/{RELEASE}/LANDING_PAGE_COPY.md` (if needed)
   - Hero headline and subheadline
   - Feature sections
   - CTAs
   - Social proof placeholders

**Output:** Marketing materials ready for implementation

**Note:** Skip this phase for internal tools, MVPs, or features that don't need external communication.

---

### Prompt Maintenance (PromptEngineerAgent) - PERIODIC

**When to Run:** Weekly review OR on-demand when issues detected

**Trigger:** Scheduled maintenance OR agent performance issues

**Estimated Time:** 30-60 minutes (AI)

**PromptEngineerAgent Actions:**
1. Review all agent prompts for consistency
2. Identify misalignments between agents
3. Check for new patterns or anti-patterns
4. Update prompts based on feedback
5. Create `.agent-prompts/AGENT_ALIGNMENT_REPORT.md`
6. Create `.agent-prompts/AGENT_PROMPT_CHANGELOG.md`
7. **Output:** Updated prompts + alignment report

**Triggers for Activation:**
- Weekly scheduled review
- New architectural pattern adopted
- Common implementation mistakes observed
- Agent produces unexpected output
- User reports inconsistency

---

## 🚫 Validation Gates (STRICT ENFORCEMENT)

### Gate 1: UX Design Required

```
IF (task involves UI/frontend)
  AND (UX_DESIGN.md does NOT exist)
THEN
  BLOCK: "UX design must be created first by UXAgent"
```

### Gate 2: Tests Required Before Code

```
IF (implementation task)
  AND (tests do NOT exist OR tests are passing)
THEN
  BLOCK: "Write failing tests first (TDD)"
```

### Gate 3: Backend Before Frontend

```
IF (frontend implementation requested)
  AND (backend tests are NOT all passing)
THEN
  BLOCK: "Backend must be complete and tested first"
```

### Gate 4: Contract Validation

```
IF (implementation does NOT match contract)
THEN
  BLOCK: "Implementation must follow API_CONTRACT.md or COMPONENT_CONTRACT.md"
```

### Gate 5: UX Must Validate Business Requirements (NEW)

```
IF (UXAgent creates UX_DESIGN.md)
  AND (UX design cannot support business requirements)
THEN
  BLOCK: "UX design is not scalable or conflicts with requirements"
  RETURN_TO: BusinessOwnerAgent with specific feedback
```

### Gate 6: Architecture Must Match Requirements + UX (NEW)

```
IF (SolutionArchitectAgent creates schema)
  AND (schema cannot support business requirements OR UX flows)
THEN
  BLOCK: "Architecture violates requirements or UX design"
  RETURN_TO: BusinessOwnerAgent + UXAgent with specific feedback

EXAMPLE:
  IF (Business Requirements mention "multi-tenant access" OR "tenant switching")
    AND (User model has single tenantId FK)
  THEN
    BLOCK: "User-Tenant relationship must be many-to-many"
```

### Gate 7: Tests Must Match Architecture (NEW)

```
IF (QATestingAgent writes tests)
  AND (tests don't match architecture contracts)
THEN
  BLOCK: "Tests conflict with architecture design"
  RETURN_TO: SolutionArchitectAgent for clarification
```

### Gate 8: Implementation Must Follow Best Practices (NEW)

```
IF (Backend/Frontend agent implements code)
  AND (code violates scalability OR security best practices)
THEN
  BLOCK: "Implementation does not follow best practices"
  RETURN_TO: SolutionArchitectAgent to update architecture
```

---

## 🔍 Cross-Agent Review Protocol (MANDATORY)

### Overview

Every agent MUST validate previous agents' work before proceeding. This prevents cascading errors and ensures quality from the start.

### Review 1: UXAgent → BusinessOwnerAgent

**When:** After reading BUSINESS_REQUIREMENTS.md, BEFORE creating UX_DESIGN.md

**UXAgent MUST check:**

1. ❓ Are requirements implementable with scalable UX patterns?
2. ❓ Are there missing user flows or edge cases?
3. ❓ Do requirements conflict with UX best practices?
4. ❓ Are multi-user scenarios properly defined?

**Action if issues found:**

```
CREATE: releases/{RELEASE}/feedback/UX_FEEDBACK_TO_BUSINESS.md
CONTENT:
  - Specific conflicts found
  - Questions that need answers
  - Suggested requirement changes
RETURN_TO: BusinessOwnerAgent
WAIT: Until BusinessOwnerAgent updates BUSINESS_REQUIREMENTS.md
```

**Example Issue:**

```markdown
## UX Feedback to Business Requirements

### Issue 1: Multi-Tenant User Access Not Defined

**Requirement:** "Super Admin can switch between tenant contexts"
**Problem:** Requirements don't specify HOW users relate to tenants
**Questions:**

- Can a user belong to multiple tenants?
- What happens when user switches tenants?
- What role does user have in each tenant?
  **Suggested Fix:** Add requirement "Users can have memberships in multiple tenants with different roles"
```

---

### Review 2: SolutionArchitectAgent → BusinessOwnerAgent + UXAgent

**When:** After reading BUSINESS_REQUIREMENTS.md + UX_DESIGN.md, BEFORE creating ARCHITECTURE_DECISIONS.md

**SolutionArchitectAgent MUST check:**

1. ❓ Does proposed schema support ALL business requirements?
2. ❓ Does proposed schema support ALL UX flows?
3. ❓ Are there scalability issues with current design?
4. ❓ Are relationships (1:1, 1:N, N:M) correctly identified?
5. ❓ Does design follow database normalization best practices?
   **Action if issues found:**

```

CREATE: releases/{RELEASE}/feedback/ARCHITECTURE_FEEDBACK_TO_BUSINESS.md
       OR releases/{RELEASE}/feedback/ARCHITECTURE_FEEDBACK_TO_UX.md
CONTENT:
  - Specific design conflicts
  - Why current requirements are not implementable
  - Proposed architecture alternatives
  - Questions for BusinessOwnerAgent/UXAgent
RETURN_TO: BusinessOwnerAgent + UXAgent
WAIT: Until requirements/UX are updated
```

**Example Issue:**

````markdown
## Architecture Feedback

### Issue 1: User-Tenant Relationship Conflict

**Business Requirement:** "Super Admin can switch between tenant contexts" (Story 3.2)
**UX Flow:** "Tenant switcher in header shows all accessible tenants"
**Proposed Schema:** User.tenantId (single FK)
**Problem:** Single FK means user can only belong to ONE tenant
**Impact:** Super Admin cannot access multiple tenants

**Solution Options:**

1. Many-to-many relationship via TenantMembership table (RECOMMENDED)
2. Duplicate Super Admin user in each tenant (NOT SCALABLE)
3. Special case Super Admin to bypass tenantId (SECURITY RISK)

**Recommended Schema:**

```prisma
model TenantMembership {
  userId   String
  tenantId String
  role     Role

  user     User   @relation(...)
  tenant   Tenant @relation(...)
  @@unique([userId, tenantId])
}
```
````

**Questions for BusinessOwnerAgent:**

- Should regular users (not Super Admin) also be able to belong to multiple tenants?
- Should we support "invited users" who haven't signed up yet?

```

---

### Review 3: QATestingAgent → SolutionArchitectAgent
**When:** After reading ARCHITECTURE_DECISIONS.md + API_CONTRACT.md, BEFORE writing tests

**QATestingAgent MUST check:**
1. ❓ Are all API endpoints clearly defined in API_CONTRACT.md?
2. ❓ Are request/response schemas complete?
3. ❓ Are database relationships testable?
4. ❓ Are there ambiguous specifications?

**Action if issues found:**
```

CREATE: releases/{RELEASE}/feedback/QA_FEEDBACK_TO_ARCHITECTURE.md
CONTENT:

- Ambiguities in contracts
- Missing test scenarios
- Questions about implementation
  RETURN_TO: SolutionArchitectAgent
  WAIT: Until contracts are clarified

```

---

### Review 4: Backend/Frontend Agents → SolutionArchitectAgent
**When:** During implementation, if contract is unclear or violates best practices

**Implementation Agents MUST check:**
1. ❓ Can I implement this without violating SOLID principles?
2. ❓ Does this scale beyond 1000 users?
3. ❓ Are there security vulnerabilities in this design?
4. ❓ Is the contract missing critical information?

**Action if issues found:**
```

CREATE: releases/{RELEASE}/feedback/IMPLEMENTATION_FEEDBACK_TO_ARCHITECTURE.md
CONTENT:

- Specific implementation blocker
- Why current design won't work
- Proposed architectural changes
  RETURN_TO: SolutionArchitectAgent
  WAIT: Until architecture is updated

```

---

### Review 4.5: Backend/Frontend Agents → QATestingAgent (NEW)
**When:** After reading TEST_PLAN.md, BEFORE writing implementation code

**Implementation Agents MUST check:**
1. ❓ Are the tests implementable with the given architecture?
2. ❓ Are there missing test scenarios I'll need when implementing?
3. ❓ Do test assertions match what I'll actually build?
4. ❓ Are test mocks/fixtures realistic and maintainable?
5. ❓ Is test coverage sufficient (no untested edge cases)?

**Action if issues found:**
```

CREATE: releases/{RELEASE}/feedback/BACKEND_FEEDBACK_TO_QA.md
OR releases/{RELEASE}/feedback/FRONTEND_FEEDBACK_TO_QA.md
CONTENT:

- Missing test scenarios
- Unrealistic test expectations
- Test assertions that don't match implementation
- Suggested additional tests
  RETURN_TO: QATestingAgent
  WAIT: Until test plan is updated

````

**Example Issue:**
```markdown
## Backend Feedback to QA Test Plan

### Issue 1: Missing Transaction Rollback Test

**Test Plan:** Tests signup flow creates 2 memberships
**Problem:** No test for transaction rollback when Super Admin membership fails
**Impact:** Could ship code without proper transaction handling

**Suggested Test:**
```typescript
test('Signup rolls back user + tenant if Super Admin membership fails', async () => {
  // Mock Super Admin membership creation to fail
  jest.spyOn(prisma.tenantMembership, 'create')
    .mockResolvedValueOnce({ /* user membership */ })
    .mockRejectedValueOnce(new Error('DB error'));

  await expect(signup()).rejects.toThrow();

  // Verify nothing was created
  expect(await prisma.user.count()).toBe(0);
  expect(await prisma.tenant.count()).toBe(0);
});
````

```

---

### Feedback Loop Resolution

**When feedback is returned:**
1. Original agent MUST read feedback document
2. Original agent MUST address ALL issues raised
3. Original agent MUST update their output
4. Original agent MUST notify requesting agent
5. Requesting agent reviews updates and proceeds OR raises new issues

**Maximum feedback iterations:** 3
**After 3 iterations:** Escalate to User for decision

---

## 📋 File Structure (Per Release)

### Finalized Deliverables (releases/{RELEASE}/)

These are the **final, approved documents** that define the release:

```

releases/{RELEASE}/
├── RELEASE_PLAN.md # What we're building (overview)
├── PROGRESS.md # Task tracking (auto-updated)
├── BUSINESS_REQUIREMENTS.md # BusinessOwnerAgent final deliverable
├── UX_DESIGN.md # UXAgent final deliverable (REQUIRED for UI)
├── ARCHITECTURE_DECISIONS.md # SolutionArchitectAgent final deliverable
├── API_CONTRACT.md # Backend contract (final)
├── COMPONENT_CONTRACT.md # Frontend contract (final)
├── TEST_PLAN.md # QATestingAgent final deliverable
├── CHANGELOG.md # What was delivered
├── tests/
│ ├── backend/ # Backend tests (written FIRST)
│ ├── frontend/ # Frontend tests (written FIRST)
│ └── integration/ # Integration tests
└── implementation/
├── backend/ # Backend code (after tests)
└── frontend/ # Frontend code (after tests)

```

### Cross-Agent Feedback (releases/{RELEASE}/feedback/)

These are **temporary feedback documents** created during cross-agent validation:

```

releases/{RELEASE}/feedback/
├── UX_FEEDBACK_TO_BUSINESS.md # UXAgent → BusinessOwnerAgent
├── BUSINESS_RESPONSE_TO_UX.md # BusinessOwnerAgent → UXAgent
├── UX_VALIDATION_COMPLETE.md # UXAgent confirms resolution
├── ARCHITECTURE_FEEDBACK_TO_UX.md # ArchitectAgent → UXAgent
├── ARCHITECTURE_FEEDBACK_TO_BUSINESS.md # ArchitectAgent → BusinessOwnerAgent
├── QA_FEEDBACK_TO_ARCHITECTURE.md # QAAgent → ArchitectAgent
├── IMPLEMENTATION_FEEDBACK.md # Backend/Frontend → ArchitectAgent
└── [other feedback documents...] # Any agent-to-agent feedback

```

**Rules for Feedback Documents:**
1. **ALL cross-agent feedback MUST go in `feedback/` folder**
2. Naming convention: `{FROM_AGENT}_FEEDBACK_TO_{TO_AGENT}.md` or `{FROM_AGENT}_RESPONSE_TO_{TO_AGENT}.md`
3. Feedback documents are **temporary** - they exist to resolve issues during planning
4. Once issues are resolved, feedback docs remain for audit trail but are not "active" deliverables
5. Agents MUST check `feedback/` folder when starting work to see if upstream agent raised concerns

**Example Feedback Flow:**
```

1. UXAgent creates: releases/R1/feedback/UX_FEEDBACK_TO_BUSINESS.md
2. BusinessOwnerAgent reads feedback and creates: releases/R1/feedback/BUSINESS_RESPONSE_TO_UX.md
3. BusinessOwnerAgent updates: releases/R1/BUSINESS_REQUIREMENTS.md (final deliverable)
4. UXAgent validates and creates: releases/R1/feedback/UX_VALIDATION_COMPLETE.md
5. UXAgent proceeds to create: releases/R1/UX_DESIGN.md (final deliverable)

```

### Progress & Status Summaries (releases/{RELEASE}/summary/)

These are **progress tracking and status summary documents** created during implementation:

```

releases/{RELEASE}/summary/
├── HANDOFF_TO_QATESTING.md # Handoff documentation
├── HANDOFF_TO_SOLUTIONARCHITECT.md # Handoff documentation
├── TDD_PROGRESS.md # Test-driven development progress
├── IMPLEMENTATION_PROGRESS.md # Implementation status updates
├── TEST_ISSUES.md # Test debugging notes
├── TEST_SUMMARY.md # Test results summary
├── INTEGRATION_TEST_FIX_SUMMARY.md # Integration test fixes
├── COMPLETION_SUMMARY.md # Release completion summary
├── FINAL_TEST_STATUS.md # Final test results
└── [other status documents...] # Any progress/status tracking

```

**Rules for Summary Documents:**
1. **ALL progress tracking, handoffs, and status updates MUST go in `summary/` folder**
2. These documents track work-in-progress and are useful for debugging/audit trail
3. Summary documents are NOT final deliverables (they don't define the release)
4. Agents should create summaries when handing off work or tracking complex progress
5. These docs remain for historical reference but don't clutter the main release folder

**What goes in summary/ vs root:**
- `summary/HANDOFF_TO_QATESTING.md` ✅ (work-in-progress communication)
- `summary/TDD_PROGRESS.md` ✅ (status update during implementation)
- `summary/IMPLEMENTATION_PROGRESS.md` ✅ (progress tracking)
- `PROGRESS.md` ❌ (stays in root - this is the master task tracker)
- `CHANGELOG.md` ❌ (stays in root - final deliverable)
- `BUSINESS_REQUIREMENTS.md` ❌ (stays in root - final deliverable)

---

## 🤝 Agent Handoff Process

### ⚠️ MANDATORY AGENT PROTOCOL (ALL AGENTS)

**Before starting work:**
1. Start response with `(**YourAgentName**):`
2. Read current state (IN THIS ORDER):
   - `.agent-state/current-release.json` - Current release state
   - `.agent-state/agent-handoffs.json` - Check if work was handed off to you
   - `.agent-state/completed-contracts.json` - Learn from previous releases
   - `releases/{RELEASE}/PROGRESS.md` - Task status
   - Relevant contracts/requirements for your role
3. If you find a handoff assigned to you:
   - Read `required_inputs` files
   - Follow `special_instructions`
   - Plan to deliver `expected_outputs`
   - Update handoff status to `"in_progress"`
4. Check for reusable patterns:
   - Review `completed_releases` for similar features
   - Check `contracts` array for proven patterns
   - Learn from `issues_encountered` to avoid mistakes

**After completing ANY task:**
1. Update `releases/{RELEASE}/PROGRESS.md`:
   - Mark task as complete ✅
   - Update completion percentage
   - Add timestamp
2. Update `.agent-state/current-release.json`:
   - Set `active_agent` to next agent OR keep current if more work
   - Set `next_task` to next action
   - Update `progress_percentage`
   - Update `last_updated` timestamp (ISO 8601)
   - Update `phase` if phase changed
   - Add to `completed_artifacts` array
3. Update `.agent-state/agent-handoffs.json` (IF handing off to another agent):
   - Add handoff to `pending_handoffs` array
   - Specify `to_agent` (which agent should work next)
   - Document `required_inputs` (files the next agent needs)
   - Document `expected_outputs` (what the next agent should create)
   - Add `special_instructions` if needed
   - Update `last_updated` timestamp
4. Update `.agent-state/completed-contracts.json` (IF release is COMPLETE):
   - Add release to `completed_releases` array
   - Document `key_patterns` learned
   - List `issues_encountered` and solutions
   - Reference `reusable_contracts`
   - Update `last_updated` timestamp
   - Note: Only ReviewerAgent or final agent does this
5. Confirm updates in response with emojis:
   - 📝 Updated: releases/{RELEASE}/PROGRESS.md
   - 🤖 Updated: .agent-state/current-release.json
   - 🔄 Updated: .agent-state/agent-handoffs.json (if handing off)
   - 📚 Updated: .agent-state/completed-contracts.json (if release complete)

**Example completion message (with handoff):**
```

(**SolutionArchitectAgent**): Architecture complete, ready for testing phase.

✅ Completed: API_CONTRACT.md, COMPONENT_CONTRACT.md, ARCHITECTURE_DECISIONS.md
📝 Updated: releases/R3-CUSTOMER-EXPERIENCE/PROGRESS.md
🤖 Updated: .agent-state/current-release.json
🔄 Updated: .agent-state/agent-handoffs.json (handoff to QATestingAgent)
👉 Next: QATestingAgent will create TEST_PLAN.md and write tests

```

**Example completion message (release complete):**
```

(**ReviewerAgent**): R2-CATALOG-MANAGEMENT approved and complete.

✅ Completed: Release validation, all tests passing, code quality approved
📝 Updated: releases/R2-CATALOG-MANAGEMENT/PROGRESS.md
🤖 Updated: .agent-state/current-release.json
📚 Updated: .agent-state/completed-contracts.json (R2 patterns captured)
👉 Next: Ready to start R3 planning

````

---

### Handoff 0: User → ProjectInitializerAgent (NEW PROJECTS ONLY)
**Trigger:** User says "I want to start a new project using AgentForge"

**ProjectInitializerAgent Actions:**
1. Conduct comprehensive discovery session (40+ questions)
2. Create `PROJECT_OVERVIEW.md`
3. Create `DISCOVERY_SESSION.md`
4. Create `TODO_RELEASES.md` (with R1, R2, R3+ planned)
5. Create `releases/R1-FOUNDATION/RELEASE_PLAN.md`
6. Get user confirmation on plan
7. **MANDATORY:** Update `.agent-state/current-release.json`
8. **MANDATORY:** Update `releases/R1/PROGRESS.md`
9. **Handoff to:** BusinessOwnerAgent for R1

**🚨 BLOCKING:** Cannot proceed without complete discovery and user confirmation

**Note:** This handoff only happens ONCE per project at the very start.

---

### Handoff 1: ProjectInitializerAgent → BusinessOwnerAgent OR User → BusinessOwnerAgent
**Trigger:**
- **NEW PROJECT:** ProjectInitializerAgent completes discovery
- **EXISTING PROJECT:** User asks "What's next?" or provides new release request

**BusinessOwnerAgent Actions:**
1. Read `PROJECT_OVERVIEW.md` (new) OR `TODO_RELEASES.md` (existing)
2. If current release incomplete → continue current release
3. If current release complete → start next release
4. Create/update `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`
5. **Handoff to:** UXAgent (if UI work) OR SolutionArchitectAgent (if backend-only)

---

### Handoff 2: BusinessOwnerAgent → UXAgent
**Trigger:** Business requirements document exists + UI work required

**UXAgent Actions:**
1. Read `BUSINESS_REQUIREMENTS.md`
2. Create `UX_DESIGN.md` with:
   - User flows
   - Wireframes (text-based)
   - Navigation structure
   - Empty states
   - Error states
   - Component specifications
3. **Handoff to:** SolutionArchitectAgent

**🚨 BLOCKING:** Frontend work CANNOT start without approved UX_DESIGN.md

---

### Handoff 3: UXAgent → SolutionArchitectAgent
**Trigger:** UX design approved OR backend-only work

**SolutionArchitectAgent Actions:**
1. Read `BUSINESS_REQUIREMENTS.md`
2. Read `UX_DESIGN.md` (if exists)
3. Create `ARCHITECTURE_DECISIONS.md`
4. Create `API_CONTRACT.md`
5. Create `COMPONENT_CONTRACT.md` (if UI work)
6. **Handoff to:** QATestingAgent

---

### Handoff 4: SolutionArchitectAgent → QATestingAgent
**Trigger:** All contracts defined

**QATestingAgent Actions:**
1. Read `API_CONTRACT.md`
2. Read `COMPONENT_CONTRACT.md`
3. Read `UX_DESIGN.md`
4. Create `TEST_PLAN.md`
5. Write backend tests (failing)
6. Write frontend tests (failing)
7. Write integration tests (failing)
8. **Handoff to:** SeniorBackendAgent

**🚨 BLOCKING:** Implementation CANNOT start without failing tests

---

### Handoff 5: QATestingAgent → SeniorBackendAgent
**Trigger:** Backend tests exist and are failing

**SeniorBackendAgent Actions:**
1. Read `ARCHITECTURE_DECISIONS.md`
2. Read `API_CONTRACT.md`
3. Read backend tests
4. Implement backend to pass tests
5. Run tests until all pass
6. Update `PROGRESS.md`
7. **Handoff to:** SeniorFrontendAgent (if UI work) OR ReviewerAgent (if backend-only)

---

### Handoff 6: SeniorBackendAgent → SeniorFrontendAgent
**Trigger:** Backend tests passing + UI work required

**SeniorFrontendAgent Actions:**
1. Read `COMPONENT_CONTRACT.md`
2. Read `UX_DESIGN.md`
3. Read frontend tests
4. Implement frontend to pass tests
5. Run tests until all pass
6. Update `PROGRESS.md`
7. **Handoff to:** QATestingAgent (validation)

---

### Handoff 7: SeniorFrontendAgent → QATestingAgent (Validation)
**Trigger:** Frontend tests passing

**QATestingAgent Actions:**
1. Run ALL tests (unit + integration + e2e)
2. Validate against acceptance criteria
3. Check UX design implementation
4. If all pass → **Handoff to:** ReviewerAgent
5. If failures → **Handoff back to:** respective implementation agent

---

### Handoff 8: QATestingAgent → ReviewerAgent
**Trigger:** All tests passing

**ReviewerAgent Actions:**
1. Review implementation quality
2. Validate against business requirements
3. Check security, performance, accessibility
4. If approved → Mark release complete
5. If issues → **Handoff back to:** respective agent

---

## 🔄 Self-Updating Rules

### When to Update WARP.md
- Major architectural pattern changes
- New agent added to workflow
- New validation gate added
- Process improvement identified

### When to Update Release Docs
- **After every task completion:** Update `PROGRESS.md`
- **After architectural decision:** Update `ARCHITECTURE_DECISIONS.md`
- **After UX change:** Update `UX_DESIGN.md`
- **After contract change:** Update `API_CONTRACT.md` or `COMPONENT_CONTRACT.md`

### When to Update TODO_RELEASES.md
- Release phase complete
- Release fully complete
- New release initialized

---

## 🎯 "What's Next?" Command

When user asks "What's next?", the system should:

1. **Read current state (MANDATORY ORDER):**
```bash
# ALWAYS read these files in this order:
1. .agent-state/current-release.json  # Current agent, task, progress
2. releases/{RELEASE}/PROGRESS.md     # Detailed task status
3. TODO_RELEASES.md                   # Overall release plan
4. PROJECT_OVERVIEW.md                # (if exists) Project context
````

2. **Determine next action:**

```

IF PROJECT_OVERVIEW.md does NOT exist:
→ NEW PROJECT: Activate ProjectInitializerAgent for discovery

IF no active release (but PROJECT_OVERVIEW.md exists):
→ Start R1 planning (BusinessOwnerAgent)

IF release in planning phase:
→ Continue planning (next required doc)

IF release in TDD phase:
→ Continue test writing (QATestingAgent)

IF release in implementation phase:
→ Continue implementation (Backend or Frontend)

IF release in validation phase:
→ Run validation (QATestingAgent + ReviewerAgent)

IF release complete:
→ Start next release planning (BusinessOwnerAgent)

```

3. **Activate correct agent:**

- Route to the agent responsible for next task
- Provide agent with required context
- Set up handoff expectations

4. **Report to user:**

```

📍 Current State: R2 - Implementation Phase (60% complete)
🤖 Active Agent: SeniorBackendAgent
📝 Next Task: Implement user authentication API
⏱️ Estimated Time: 45 minutes
📂 Files: releases/R2-CORE-FEATURES/API_CONTRACT.md

```

---

## 📊 Progress Tracking

### Agent State File Format

`.agent-state/current-release.json`:

```json
{
  "current_release": "R2-CORE-FEATURES",
  "phase": "implementation",
  "active_agent": "SeniorBackendAgent",
  "next_task": "Implement user authentication API",
  "progress_percentage": 60,
  "blocked": false,
  "blocking_reason": null,
  "last_updated": "2025-11-02T11:37:24Z"
}
```

### Handoff Queue Format

`.agent-state/agent-handoffs.json`:

```json
{
  "pending_handoffs": [
    {
      "id": "handoff-20251106-144500",
      "from_agent": "SolutionArchitectAgent",
      "to_agent": "QATestingAgent",
      "release": "R3-CUSTOMER-EXPERIENCE",
      "trigger_condition": "architecture_complete",
      "created_at": "2025-11-06T14:45:00Z",
      "status": "pending",
      "context": {
        "required_inputs": [
          "releases/R3/API_CONTRACT.md",
          "releases/R3/COMPONENT_CONTRACT.md"
        ],
        "expected_outputs": [
          "releases/R3/TEST_PLAN.md",
          "Backend tests (failing)",
          "Frontend tests (failing)"
        ],
        "special_instructions": "Widget needs vanilla JS tests"
      }
    }
  ],
  "completed_handoffs": [],
  "last_updated": "2025-11-06T14:45:00Z"
}
```

### Historical Learning Format

`.agent-state/completed-contracts.json`:

```json
{
  "completed_releases": [
    {
      "release_id": "R2-CATALOG-MANAGEMENT",
      "completed_date": "2025-11-03T18:00:00Z",
      "duration_weeks": 3,
      "key_patterns": [
        "Multi-tenant repository base class",
        "shadcn/ui DataTable with server pagination",
        "Shared Zod validation schemas"
      ],
      "issues_encountered": [
        {
          "issue": "Prisma many-to-many needed explicit junction table",
          "solution": "Created PlanFeature model",
          "reference": "releases/R2/ARCHITECTURE_DECISIONS.md"
        }
      ],
      "reusable_contracts": {
        "catalog_api": "releases/R2/API_CONTRACT.md"
      }
    }
  ],
  "contracts": [
    {
      "pattern_name": "Multi-tenant Repository Pattern",
      "category": "backend",
      "description": "Base repository with automatic tenantId filtering",
      "code_reference": "packages/services/repositories/base-repository.ts",
      "when_to_use": "Any entity that belongs to a tenant",
      "benefits": ["Prevents cross-tenant data leaks", "DRY pattern"],
      "reused_in": ["R3-CUSTOMER-EXPERIENCE"]
    }
  ],
  "last_updated": "2025-11-03T18:00:00Z"
}
```

---

## 📊 Agent State Files (Complete Guide)

### Purpose

Three JSON files track workflow state, handoffs, and organizational learning:

| File                       | Purpose       | Updated By    | When                   |
| -------------------------- | ------------- | ------------- | ---------------------- |
| `current-release.json`     | Current state | All agents    | After every task       |
| `agent-handoffs.json`      | Work queue    | All agents    | When handing off       |
| `completed-contracts.json` | Learnings     | ReviewerAgent | When release completes |

### Benefits

1. **Clear work queue** - No confusion about what's next
2. **Context preservation** - Next agent knows exactly what to do
3. **Pattern reuse** - Avoid re-implementing same solutions
4. **Learn from mistakes** - Issues documented with solutions
5. **Audit trail** - Complete history of project decisions

### When Agents Use These Files

**Before starting work (ALL agents):**

1. Read `agent-handoffs.json` - Check if work was handed off to you
2. Read `completed-contracts.json` - Look for reusable patterns
3. Read handoff context if found (required inputs, instructions)

**After completing work:**

1. Update `current-release.json` - Always
2. Update `agent-handoffs.json` - If handing off to another agent
3. Update `completed-contracts.json` - Only when entire release completes

**See `.agent-state/README.md` for complete usage guide.**

---

## 🚨 Error Handling

### Blocking Scenarios

**Scenario 1: Missing UX Design**

```
Agent: SeniorFrontendAgent
Error: UX_DESIGN.md not found
Action: Block implementation, activate UXAgent
```

**Scenario 2: Tests Passing (TDD violation)**

```
Agent: SeniorBackendAgent
Error: Backend tests already passing
Action: Block implementation, activate QATestingAgent to write more tests
```

**Scenario 3: Contract Mismatch**

```
Agent: SeniorBackendAgent
Error: Implementation doesn't match API_CONTRACT.md
Action: Block, request SolutionArchitectAgent to update contract OR fix implementation
```

---

## 🪝 Git Hooks & Quality Automation

### Automated Quality Enforcement

The boilerplate uses **Husky** to enforce quality gates automatically:

#### Pre-Commit Hook

**Runs on:** `git commit`  
**What it does:**

- Runs `lint-staged` on staged files
- Type checks modified files
- Lints with ESLint (auto-fixes)
- Formats with Prettier

**Impact on agents:** Code is automatically formatted and validated before commit

#### Commit-Msg Hook

**Runs on:** `git commit`  
**What it does:**

- Validates commit message format with `commitlint`
- Enforces conventional commits

**Required format:** `type(scope): subject`

**Valid types:** feat, fix, docs, style, refactor, perf, test, chore, ci

**Examples:**

```bash
# ✅ Valid
git commit -m "feat(auth): add login endpoint"
git commit -m "fix(ui): resolve button styling issue"

# ❌ Invalid
git commit -m "added feature"  # Missing type format
git commit -m "FEAT: new feature"  # Wrong case
```

#### Pre-Push Hook

**Runs on:** `git push`  
**What it does:**

- Runs `pnpm test` (all tests must pass)
- Runs `pnpm typecheck` (no type errors)
- Runs `pnpm lint` (no lint errors)

**Impact on agents:** Cannot push failing code

**See:** `docs/GIT_HOOKS_SETUP.md` for complete documentation

---

## 🚀 Release Management

### Automated Versioning (release-it)

**After ReviewerAgent approves** a release, use automated versioning:

```bash
# Semantic versioning
pnpm release:patch    # Bug fixes (0.0.X)
pnpm release:minor    # New features (0.X.0)
pnpm release:major    # Breaking changes (X.0.0)
pnpm release          # Interactive mode
```

**What happens automatically:**

1. Pre-release validation (lint, typecheck, test)
2. Version bump in all packages
3. Build changed packages (only buildable ones)
4. Generate/update CHANGELOG.md from conventional commits
5. Create git commit & tag
6. Push to remote & create GitHub release

### Package Build Classification

**Buildable packages** (require build step):

- `@repo/services` - Backend business logic
- `@repo/database` - Prisma client
- `@repo/auth` - Authentication utilities
- `@repo/eslint-config` - ESLint configs
- `@repo/typescript-config` - TypeScript configs

**Non-buildable packages** (built by consuming apps):

- `@repo/ui` - React components (built by Next.js)
- `@repo/ui-config` - Tailwind config (consumed by apps)
- `@repo/i18n` - Translation files (bundled by apps)

**See:** `docs/RELEASE_PROCESS.md` for complete documentation

---

## 💡 Best Practices

### For All Agents:

1. **MANDATORY RESPONSE FORMAT:** Every agent response MUST start with `(**AgentName**):` where AgentName is the current agent (e.g., `(**BusinessOwnerAgent**):`, `(**UXAgent**):`, etc.)
   - Example: `(**SeniorBackendAgent**): I've completed the database schema implementation.`
   - This applies to ALL responses, without exception

2. **MANDATORY PROGRESS UPDATE:** After EVERY task completion, you MUST:
   - Update `releases/{RELEASE}/PROGRESS.md` with task status
   - Mark completed tasks with ✅
   - Update task completion percentage
   - Add completion timestamp

3. **MANDATORY AGENT STATE UPDATE:** After EVERY task completion or phase change, you MUST:
   - Update `.agent-state/current-release.json` with:
     - `active_agent`: Current agent name
     - `next_task`: What's coming next
     - `progress_percentage`: Current completion %
     - `last_updated`: Current timestamp (ISO 8601)
     - `phase`: Current phase (planning, tdd, implementation, validation, complete)
     - `completed_artifacts`: List of completed deliverables
   - This keeps the "What's next?" command accurate

4. **MANDATORY COMMIT MESSAGE FORMAT:** All commits MUST follow Conventional Commits specification (https://www.conventionalcommits.org/en/v1.0.0/)
   - Format: `type(scope): subject` (lowercase type, max 100 chars total)
   - Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`
   - Examples:
     - ✅ `feat(auth): add login endpoint`
     - ✅ `fix(catalog): correct role retrieval in services API`
     - ❌ `FEAT(auth): add login` (uppercase type)
     - ❌ `feat(catalog): add new feature with very long description that exceeds one hundred characters limit` (too long)
   - **This is enforced by commitlint pre-commit hook**

5. **Always read before writing:** Check existing docs before creating new ones
6. **Follow contracts strictly:** Never deviate from API or component contracts
7. **Document decisions:** Any non-obvious decision should be documented
8. **Test everything:** If you write code, you must write or update tests

### For BusinessOwnerAgent:

- Focus on business value and user pain points
- Define clear success metrics
- Keep requirements concise and actionable

### For UXAgent:

- Design for empty states and error states
- Consider accessibility and mobile experience
- Provide detailed component specifications

### For SolutionArchitectAgent:

- Keep architecture decisions documented
- Define clear API contracts
- Consider scalability and maintainability

### For QATestingAgent:

- Write tests that validate contracts
- Cover edge cases and error scenarios
- Write tests BEFORE any implementation

### For Implementation Agents:

- Follow TDD strictly (tests first)
- Write clean, maintainable code
- Update docs if implementation reveals better approach

### For ReviewerAgent:

- Validate against all requirements
- Check security and performance
- Ensure documentation is updated

---

## 📚 Reference Documentation

- **Agent Prompts:** `.agent-prompts/` - Individual agent system prompts
- **Agent State Guide:** `.agent-state/README.md` - State file usage and management
- **Getting Started:** `GETTING_STARTED.md` - User quickstart guide
- **Main Overview:** `README.md` - AgentForge introduction and features
- **Release Planning:** `TODO_RELEASES.md` - Release roadmap (when exists)
- **Current Progress:** `releases/{RELEASE}/PROGRESS.md` - Task tracking per release
- **Git Hooks:** `docs/GIT_HOOKS_SETUP.md` - Quality automation setup
- **Release Process:** `docs/RELEASE_PROCESS.md` - Versioning and deployment

---

## ⚡ Quick Reference Card

### For AI: Common Commands

```markdown
# Start new project
"I want to start a new project using AgentForge"
→ Activates ProjectInitializerAgent

# Check progress
"What's next?"
→ Reads .agent-state/current-release.json
→ Determines next agent and task

# Activate specific agent
"Activate [AgentName] for [Release]"
→ Example: "Activate BusinessOwnerAgent for R2-AUTH"

# Check release status
"Show me the status of [Release]"
→ Reads releases/{RELEASE}/PROGRESS.md
```

### Key File Locations

```
.agent-state/
  ├── current-release.json       # Current agent & task
  ├── agent-handoffs.json        # Work queue
  └── completed-contracts.json   # Historical patterns

releases/{RELEASE}/
  ├── PROGRESS.md                # Task tracking
  ├── BUSINESS_REQUIREMENTS.md  # What we're building
  ├── UX_DESIGN.md              # User experience
  ├── ARCHITECTURE_DECISIONS.md # System design
  ├── API_CONTRACT.md           # Backend contract
  ├── COMPONENT_CONTRACT.md     # Frontend contract
  ├── TEST_PLAN.md              # Testing strategy
  └── CHANGELOG.md              # What was delivered

TODO_RELEASES.md                # Release roadmap
PROJECT_OVERVIEW.md             # Project summary
```

### Agent Response Format

```markdown
(**AgentName**): [Your response here]

[Work completed]

✅ Completed: [deliverables]
📝 Updated: releases/{RELEASE}/PROGRESS.md
🤖 Updated: .agent-state/current-release.json
🔄 Updated: .agent-state/agent-handoffs.json (if handing off)
👉 Next: [Next agent and task]
```

### Validation Gates Checklist

- ☐ UX design exists (if frontend work)
- ☐ Tests written and failing (before implementation)
- ☐ Backend tests passing (before frontend)
- ☐ Implementation matches contracts
- ☐ All tests passing (before review)
- ☐ Reviewer approval (before release)

---

## 🔧 Troubleshooting

### Agent Seems Stuck

**Symptoms:** No progress, unclear next steps

**Solution:**
```bash
# 1. Check current state
cat .agent-state/current-release.json

# 2. Check pending handoffs
cat .agent-state/agent-handoffs.json

# 3. Check release progress
cat releases/*/PROGRESS.md

# 4. Ask: "What's next?"
```

### Tests Won't Run

**Symptoms:** Test execution fails, can't verify implementation

**Solution:**
```bash
# Check test files exist
ls releases/{RELEASE}/tests/

# Verify test plan
cat releases/{RELEASE}/TEST_PLAN.md

# Check for test framework issues
pnpm test
```

### Agent Created Wrong Output

**Problem:** Agent file doesn't match expectations

**Solution:**
1. Don't edit files directly
2. Tell the agent what's wrong:
   ```
   The API contract is missing the /auth/logout endpoint.
   SolutionArchitectAgent should update API_CONTRACT.md.
   ```
3. Agent will update correctly
4. Subsequent agents use updated version

### State Files Corrupted

**Symptoms:** Invalid JSON, conflicting state

**Solution:**
```bash
# Backup current state
cp -r .agent-state .agent-state.backup

# Reset to clean state
cat > .agent-state/current-release.json << 'EOF'
{
  "current_release": null,
  "phase": "initialization",
  "active_agent": null,
  "next_task": "Start new project",
  "progress_percentage": 0,
  "blocked": false,
  "blocking_reason": null,
  "last_updated": "2025-01-01T00:00:00Z",
  "completed_artifacts": []
}
EOF

cat > .agent-state/agent-handoffs.json << 'EOF'
{
  "pending_handoffs": [],
  "completed_handoffs": [],
  "last_updated": "2025-01-01T00:00:00Z"
}
EOF
```

### Need to Start Over

**Nuclear option:** Complete reset

```bash
# WARNING: This deletes all agent state
rm -rf .agent-state/*.json
rm -rf releases/*

# Restart with:
# "I want to start a new project using AgentForge."
```

### Release Validation Fails

**Symptoms:** ReviewerAgent rejects work

**Solution:**
1. Read reviewer feedback in `releases/{RELEASE}/feedback/`
2. Identify which agent needs to fix issues
3. Activate that agent with specific instructions
4. Re-run validation after fixes

---

## 🎓 Example: Complete Release Flow

**User Request:** "Build user authentication"

**Step 1:** BusinessOwnerAgent

- Creates `releases/R2-AUTH/BUSINESS_REQUIREMENTS.md`
- Defines: user pain points, success metrics, security requirements

**Step 2:** UXAgent

- Creates `releases/R2-AUTH/UX_DESIGN.md`
- Designs: login page, signup flow, password reset, error states

**Step 3:** SolutionArchitectAgent

- Creates `releases/R2-AUTH/ARCHITECTURE_DECISIONS.md` (JWT vs sessions)
- Creates `releases/R2-AUTH/API_CONTRACT.md` (POST /auth/login, etc.)
- Creates `releases/R2-AUTH/COMPONENT_CONTRACT.md` (LoginForm, SignupForm)

**Step 4:** QATestingAgent

- Creates `releases/R2-AUTH/TEST_PLAN.md`
- Writes `tests/backend/auth.test.ts` (failing)
- Writes `tests/frontend/LoginForm.test.tsx` (failing)

**Step 5:** SeniorBackendAgent

- Reads `API_CONTRACT.md`
- Implements auth APIs to pass tests
- All backend tests pass ✅

**Step 6:** SeniorFrontendAgent

- Reads `COMPONENT_CONTRACT.md` and `UX_DESIGN.md`
- Implements LoginForm, SignupForm to pass tests
- All frontend tests pass ✅

**Step 7:** QATestingAgent (Validation)

- Runs all tests
- Validates against UX design
- All pass ✅

**Step 8:** ReviewerAgent

- Reviews implementation
- Checks security (password hashing, etc.)
- Approves ✅

**Step 9:** Release Complete

- Creates `releases/R2-AUTH/CHANGELOG.md`
- Updates `TODO_RELEASES.md`
- Marks R2 complete
- Initializes R3

---

## 📜 Version History

### Version 2.2 (2025-11-06) - PromptEngineerAgent AI Optimization
**Changes:**
- ➕ Added "For AI Assistants" orientation section at top
- ➕ Added comprehensive Table of Contents for navigation
- ➕ Added MarketingAgent workflow in Maintenance section
- ➕ Added Quick Reference Card for common commands
- ➕ Added Troubleshooting section with common issues
- ➕ Added Version History (this section)
- 🔄 Restructured Phase 7 as "Maintenance Workflows" (not sequential)
- 🔄 Updated Reference Documentation with correct file paths
- ➖ Removed "(NEW)" labels from Cross-Agent Validation and Handoff 1
- ✅ Fixed: Code block formatting inconsistencies
- ✅ Fixed: AI assistant entry point clarity

**Impact:** Critical AI usability improvements - document now optimized for AI consumption

### Version 2.1 (2025-11-06) - AgentForge Production Release
**Changes:**
- 🏷️ Rebranded from "Turbo Boilerplate" to "AgentForge"
- 🔄 Updated all trigger phrases to use "AgentForge"
- ✅ Genericized all project-specific references

**Impact:** Document ready for boilerplate distribution

### Version 2.0 (2025-11-04) - Enhanced Cross-Agent Validation
**Changes:**
- ➕ Added Cross-Agent Validation as Core Principle #5
- ➕ Added Review 4.5: Backend/Frontend → QATestingAgent
- ➕ Added Validation Gates 5-8
- ➕ Added feedback folder structure and protocols
- ➕ Added completed-contracts.json for historical learning
- 📚 Enhanced cross-agent review protocol with detailed examples

**Impact:** Major quality improvement - prevents cascading errors

### Version 1.0 (2025-10-01) - Initial Release
**Changes:**
- ✅ Core principles established
- ✅ 9 agent system defined
- ✅ Release workflow (Phases 0-6)
- ✅ Validation gates 1-4
- ✅ Agent handoff protocols
- ✅ File structure conventions
- ✅ Git hooks integration

**Impact:** Foundation for multi-agent orchestration

---

**END OF WARP.md**
