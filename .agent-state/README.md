# Agent State Files - Usage Guide

**Purpose:** This directory contains JSON files that track agent workflow state, handoffs, and organizational learning.

---

## 📁 Files Overview

| File                       | Purpose                   | Updated By    | Update Frequency       |
| -------------------------- | ------------------------- | ------------- | ---------------------- |
| `current-release.json`     | Current release state     | All agents    | After every task       |
| `agent-handoffs.json`      | Work queue between agents | All agents    | When handing off work  |
| `completed-contracts.json` | Historical learnings      | ReviewerAgent | When release completes |

---

## 1. `current-release.json`

### Purpose

Single source of truth for what's happening RIGHT NOW.

### Structure

```json
{
  "current_release": "R3-CUSTOMER-EXPERIENCE",
  "phase": "tdd", // planning, tdd, implementation, validation, complete
  "active_agent": "QATestingAgent", // Who's working now
  "next_task": "Create TEST_PLAN.md", // What needs to be done
  "progress_percentage": 30, // Current completion %
  "blocked": false,
  "blocking_reason": null,
  "last_updated": "2025-11-06T14:45:00Z", // ISO 8601 timestamp
  "completed_artifacts": [
    // What's been delivered
    "BUSINESS_REQUIREMENTS.md",
    "UX_DESIGN.md",
    "ARCHITECTURE_DECISIONS.md"
  ],
  "notes": "Optional context about current state"
}
```

### When to Update

**After EVERY task completion:**

- Update `active_agent` to your agent name
- Update `next_task` to what comes next
- Update `progress_percentage` (estimate)
- Add completed artifacts to `completed_artifacts` array
- Update `last_updated` timestamp
- Add `notes` if relevant context

### Example Update

```json
{
  "current_release": "R3-CUSTOMER-EXPERIENCE",
  "phase": "tdd",
  "active_agent": "QATestingAgent",
  "next_task": "Write backend tests for widget APIs",
  "progress_percentage": 35,
  "blocked": false,
  "blocking_reason": null,
  "last_updated": "2025-11-06T15:30:00Z",
  "completed_artifacts": [
    "BUSINESS_REQUIREMENTS.md",
    "UX_DESIGN.md",
    "ARCHITECTURE_DECISIONS.md",
    "API_CONTRACT.md",
    "COMPONENT_CONTRACT.md",
    "TEST_PLAN.md"
  ],
  "notes": "TEST_PLAN.md complete. Ready for test implementation phase."
}
```

---

## 2. `agent-handoffs.json`

### Purpose

Work queue that tracks what needs to be done next and by whom.

### Structure

```json
{
  "pending_handoffs": [
    {
      "id": "handoff-{timestamp}",
      "from_agent": "SolutionArchitectAgent",
      "to_agent": "QATestingAgent",
      "release": "R3-CUSTOMER-EXPERIENCE",
      "trigger_condition": "architecture_complete",
      "created_at": "2025-11-06T14:45:00Z",
      "status": "pending", // "pending" | "in_progress" | "completed"
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
        "special_instructions": "Widget requires vanilla JS tests + React wrapper tests"
      }
    }
  ],
  "completed_handoffs": [
    {
      "id": "handoff-20251106-140000",
      "from_agent": "UXAgent",
      "to_agent": "SolutionArchitectAgent",
      "release": "R3-CUSTOMER-EXPERIENCE",
      "completed_at": "2025-11-06T14:30:00Z",
      "duration_minutes": 30
    }
  ],
  "last_updated": "2025-11-06T14:45:00Z"
}
```

### When to Update

#### When Completing Your Work (Creating Handoff)

1. Add new handoff to `pending_handoffs` array
2. Specify which agent should work next (`to_agent`)
3. Document required inputs and expected outputs
4. Add special instructions if needed
5. Update `last_updated` timestamp

#### When Accepting Handoff (Starting Work)

1. Find your agent name in `pending_handoffs`
2. Read the handoff context (required inputs, instructions)
3. Update handoff status to `"in_progress"`
4. Update `last_updated` timestamp

#### When Completing Handoff (Finishing Work)

1. Move handoff from `pending_handoffs` to `completed_handoffs`
2. Add `completed_at` timestamp
3. Calculate `duration_minutes` (optional)
4. Update `last_updated` timestamp

### Example: Creating Handoff

**Before (after SolutionArchitectAgent completes):**

```json
{
  "pending_handoffs": [],
  "completed_handoffs": [],
  "last_updated": "2025-11-06T14:00:00Z"
}
```

**After (SolutionArchitectAgent hands off to QATestingAgent):**

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
          "releases/R3/COMPONENT_CONTRACT.md",
          "releases/R3/ARCHITECTURE_DECISIONS.md"
        ],
        "expected_outputs": [
          "releases/R3/TEST_PLAN.md",
          "Backend tests (failing)",
          "Frontend tests (failing)"
        ],
        "special_instructions": "Widget needs vanilla JS tests. Portal uses React Testing Library."
      }
    }
  ],
  "completed_handoffs": [],
  "last_updated": "2025-11-06T14:45:00Z"
}
```

### Example: Accepting Handoff

**QATestingAgent reads handoffs and finds work for them:**

```javascript
// QATestingAgent checks for pending handoffs
const myHandoffs = handoffs.pending_handoffs.filter(
  (h) => h.to_agent === "QATestingAgent",
);

if (myHandoffs.length > 0) {
  const handoff = myHandoffs[0];
  console.log("Work handed off to me:");
  console.log("Required inputs:", handoff.context.required_inputs);
  console.log("Expected outputs:", handoff.context.expected_outputs);
  console.log("Special instructions:", handoff.context.special_instructions);
}
```

---

## 3. `completed-contracts.json`

### Purpose

Organizational memory - captures learnings, patterns, and reusable contracts from completed releases.

### Structure

```json
{
  "completed_releases": [
    {
      "release_id": "R2-CATALOG-MANAGEMENT",
      "completed_date": "2025-11-03T18:00:00Z",
      "duration_weeks": 3,
      "phase_breakdown": {
        "planning": "1 week",
        "tdd": "3 days",
        "implementation": "1.5 weeks",
        "validation": "2 days"
      },
      "key_patterns": [
        "Multi-tenant repository base class",
        "shadcn/ui DataTable with server pagination",
        "Shared Zod validation schemas"
      ],
      "issues_encountered": [
        {
          "issue": "Prisma many-to-many with extra fields needed explicit junction table",
          "solution": "Created PlanFeature model instead of implicit @relation",
          "reference": "releases/R2/ARCHITECTURE_DECISIONS.md#database-schema"
        }
      ],
      "reusable_contracts": {
        "catalog_api": "releases/R2/API_CONTRACT.md",
        "data_table_pattern": "releases/R2/COMPONENT_CONTRACT.md#data-tables"
      },
      "metrics": {
        "api_endpoints": 8,
        "components": 15,
        "test_coverage": "92%",
        "lines_of_code": 3240
      }
    }
  ],
  "contracts": [
    {
      "pattern_name": "Multi-tenant Repository Pattern",
      "category": "backend",
      "first_used_in": "R2-CATALOG-MANAGEMENT",
      "description": "Base repository class that automatically filters by tenantId",
      "code_reference": "packages/services/repositories/base-repository.ts",
      "when_to_use": "Any entity that belongs to a tenant",
      "benefits": [
        "Prevents cross-tenant data leaks",
        "DRY - no repeated filtering logic"
      ],
      "example_usage": "class PlanRepository extends BaseTenantRepository<Plan>",
      "reused_in": ["R3-CUSTOMER-EXPERIENCE"]
    }
  ],
  "last_updated": "2025-11-03T18:00:00Z"
}
```

### When to Update

**Only when a release is COMPLETE** (typically by ReviewerAgent):

- Add release to `completed_releases` array
- Document key patterns learned
- List issues encountered and solutions
- Reference reusable contracts
- Capture metrics

**When reusing a pattern in new release:**

- Update pattern's `reused_in` array

### How Agents Use This

#### Before Starting Work

**All agents should:**

1. Check `completed_releases` for similar features
2. Review `contracts` for reusable patterns
3. Learn from `issues_encountered` to avoid same mistakes

**Example:**

```
QATestingAgent working on R3 customer portal tests:
1. Checks completed_contracts.json
2. Finds "R2-CATALOG-MANAGEMENT" had similar admin portal
3. Reviews R2 test patterns: "Backend tests used Vitest + Prisma mocks"
4. Reuses same testing approach for R3
```

#### After Completing Release

**ReviewerAgent (or last agent) should:**

1. Summarize key patterns learned
2. Document issues and solutions
3. Add reusable contracts
4. Update timestamp

---

## 🔄 Workflow Example: Complete Flow

### Step 1: SolutionArchitectAgent Completes Architecture

**Updates `current-release.json`:**

```json
{
  "current_release": "R3-CUSTOMER-EXPERIENCE",
  "phase": "planning",
  "active_agent": "SolutionArchitectAgent",
  "next_task": "Hand off to QATestingAgent for TEST_PLAN.md",
  "progress_percentage": 30,
  "last_updated": "2025-11-06T14:45:00Z",
  "completed_artifacts": [
    "ARCHITECTURE_DECISIONS.md",
    "API_CONTRACT.md",
    "COMPONENT_CONTRACT.md"
  ]
}
```

**Updates `agent-handoffs.json`:**

```json
{
  "pending_handoffs": [
    {
      "id": "handoff-20251106-144500",
      "from_agent": "SolutionArchitectAgent",
      "to_agent": "QATestingAgent",
      "release": "R3-CUSTOMER-EXPERIENCE",
      "created_at": "2025-11-06T14:45:00Z",
      "status": "pending",
      "context": {
        "required_inputs": ["API_CONTRACT.md", "COMPONENT_CONTRACT.md"],
        "expected_outputs": ["TEST_PLAN.md", "Tests (failing)"]
      }
    }
  ]
}
```

**Agent response:**

```
(**SolutionArchitectAgent**): Architecture complete, ready for testing phase.

✅ Completed: API_CONTRACT.md, COMPONENT_CONTRACT.md, ARCHITECTURE_DECISIONS.md
📝 Updated: releases/R3-CUSTOMER-EXPERIENCE/PROGRESS.md
🤖 Updated: .agent-state/current-release.json
🔄 Updated: .agent-state/agent-handoffs.json (handoff to QATestingAgent)
👉 Next: QATestingAgent will create TEST_PLAN.md and write tests
```

---

### Step 2: QATestingAgent Accepts Handoff

**Reads `agent-handoffs.json`:**

```javascript
// QATestingAgent sees handoff waiting
{
  "to_agent": "QATestingAgent",
  "required_inputs": ["API_CONTRACT.md", "COMPONENT_CONTRACT.md"],
  "special_instructions": "Widget needs vanilla JS tests"
}
```

**Reads `completed-contracts.json`:**

```javascript
// QATestingAgent checks for similar patterns
"Multi-tenant Repository Pattern" - reuse testing approach
"shadcn/ui DataTable" - reuse component testing patterns
```

**Updates `agent-handoffs.json` (accepts handoff):**

```json
{
  "pending_handoffs": [
    {
      "id": "handoff-20251106-144500",
      "status": "in_progress", // Changed from "pending"
      "accepted_at": "2025-11-06T15:00:00Z"
    }
  ]
}
```

**Updates `current-release.json`:**

```json
{
  "active_agent": "QATestingAgent",
  "next_task": "Write backend tests for widget APIs",
  "progress_percentage": 35,
  "last_updated": "2025-11-06T15:30:00Z",
  "completed_artifacts": [..., "TEST_PLAN.md"]
}
```

---

### Step 3: ReviewerAgent Completes Release

**Updates `completed-contracts.json`:**

```json
{
  "completed_releases": [
    {
      "release_id": "R3-CUSTOMER-EXPERIENCE",
      "completed_date": "2025-11-15T18:00:00Z",
      "key_patterns": [
        "Vanilla JS widget with CDN distribution",
        "OpenFeature provider for feature flags",
        "Stripe Elements integration"
      ]
    }
  ]
}
```

---

## 📋 Quick Reference: Agent Responsibilities

| Agent                   | current-release.json       | agent-handoffs.json         | completed-contracts.json        |
| ----------------------- | -------------------------- | --------------------------- | ------------------------------- |
| **All Agents**          | ✅ Update after every task | ✅ Create handoff when done | ❌ Read for patterns            |
| **QATestingAgent**      | ✅ Update                  | ✅ Accept handoff           | ❌ Read                         |
| **SeniorBackendAgent**  | ✅ Update                  | ✅ Accept/create handoff    | ❌ Read                         |
| **SeniorFrontendAgent** | ✅ Update                  | ✅ Accept/create handoff    | ❌ Read                         |
| **ReviewerAgent**       | ✅ Update                  | ✅ Complete handoff         | ✅ **Update when release done** |

---

## ⚠️ Common Mistakes

### ❌ Don't Do This

```json
// Forgetting to update agent-handoffs.json when handing off
{
  "pending_handoffs": [] // Empty! Next agent doesn't know what to do
}

// Not checking completed-contracts.json before starting
// Result: Re-implementing patterns that already exist

// Not capturing learnings when release completes
// Result: Same mistakes repeated in next release
```

### ✅ Do This

```json
// Always create handoff when your work is done
{
  "pending_handoffs": [
    {
      "from_agent": "YourAgent",
      "to_agent": "NextAgent",
      "context": { "required_inputs": [...] }
    }
  ]
}

// Always check completed-contracts.json first
// Look for similar features, reusable patterns, known issues

// Always capture learnings when release completes
// Document what worked, what didn't, reusable patterns
```

---

## 🎯 Benefits of Using These Files

1. **agent-handoffs.json:**
   - Clear work queue (no confusion about what's next)
   - Context preservation (next agent knows exactly what to do)
   - Enables future automation

2. **completed-contracts.json:**
   - Pattern library grows over time
   - Avoid repeating mistakes
   - Faster development (reuse proven patterns)
   - Knowledge doesn't disappear between releases

3. **All three together:**
   - Complete audit trail of project
   - "What's next?" command always accurate
   - New agents can learn from past work
   - Organizational memory persists

---

**END OF GUIDE**
