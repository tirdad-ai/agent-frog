# Agent Enforcement Rules

**Last Updated:** 2025-11-04  
**Version:** 2.1  
**Purpose:** Mandatory rules ALL agents MUST follow

---

## 🚨 CRITICAL: Five Mandatory Rules

### 1. Response Format (ALWAYS)

**Rule:** Every agent response MUST start with `(**AgentName**):`

**Examples:**

```
(**BusinessOwnerAgent**): I've created the business requirements document.
(**SeniorBackendAgent**): Database schema implementation complete.
(**UXAgent**): UX design approved and ready for handoff.
```

**Why:** This ensures clarity about which agent is currently active and maintains conversation context.

---

### 2. Progress Update (AFTER EVERY TASK)

**Rule:** After completing ANY task, you MUST update `releases/{RELEASE}/PROGRESS.md`

**Required Updates:**

- Mark completed task with ✅
- Update completion percentage
- Add timestamp (ISO 8601)

**Example:**

```markdown
## Phase 3: TDD Implementation

### Backend Tests

- [x] ✅ Create Prisma schema (2025-11-04T17:30:00Z) - 100%
- [ ] ⏳ Write backend tests (0%)
- [ ] ⏳ Implement backend code (0%)

**Phase Progress:** 33% complete
```

**Why:** Keeps the project status transparent and auditable.

---

### 3. Agent State Update (AFTER EVERY TASK)

**Rule:** After completing ANY task, you MUST update `.agent-state/current-release.json`

**Required Fields:**

```json
{
  "current_release": "R2-CATALOG-MANAGEMENT",
  "phase": "implementation", // planning, tdd, implementation, validation, complete
  "active_agent": "SeniorBackendAgent", // Current agent name
  "next_task": "Write backend tests", // What's coming next
  "progress_percentage": 33, // Current completion %
  "blocked": false,
  "blocking_reason": null,
  "last_updated": "2025-11-04T17:30:00Z", // ISO 8601 timestamp
  "completed_artifacts": [
    "ARCHITECTURE_DECISIONS.md",
    "API_CONTRACT.md",
    "Prisma schema"
  ],
  "notes": "Schema complete, ready for testing"
}
```

**Why:** Enables "What's next?" command and maintains system state.

---

### 4. Agent Handoff Registration (WHEN HANDING OFF WORK)

**Rule:** When your work is complete and you're handing off to another agent, you MUST update `.agent-state/agent-handoffs.json`

**Required Updates:**

- Add handoff to `pending_handoffs` array
- Specify which agent should work next
- Document what inputs the next agent needs
- Update `last_updated` timestamp

**Structure:**

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
        "special_instructions": "Widget requires vanilla JS tests + React wrapper tests"
      }
    }
  ],
  "completed_handoffs": [],
  "last_updated": "2025-11-06T14:45:00Z"
}
```

**When to Update:**

- After completing your phase deliverables
- Before your completion message
- When work is ready for next agent

**Why:** Creates a clear queue of work, enables automated handoffs, documents dependencies.

---

### 5. Historical Learning Capture (WHEN RELEASE COMPLETES)

**Rule:** When a release is COMPLETE, the final agent (ReviewerAgent or last implementation agent) MUST update `.agent-state/completed-contracts.json`

**Required Updates:**

- Add release to `completed_releases` array
- Document key patterns and learnings
- Reference reusable contracts
- Update `last_updated` timestamp

**Structure:**

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
        "implementation": "1 week",
        "validation": "2 days"
      },
      "key_patterns": [
        "Multi-tenant repository base class with automatic filtering",
        "shadcn/ui DataTable with server-side pagination scales to 1000+ rows",
        "Webhook retry mechanism with exponential backoff",
        "Zod schemas shared between frontend/backend validation"
      ],
      "issues_encountered": [
        {
          "issue": "Prisma many-to-many with extra fields required junction table",
          "solution": "Created explicit PlanFeature model instead of implicit relation",
          "reference": "releases/R2/ARCHITECTURE_DECISIONS.md#database-schema"
        }
      ],
      "reusable_contracts": {
        "catalog_api": "releases/R2/API_CONTRACT.md",
        "data_table_pattern": "releases/R2/COMPONENT_CONTRACT.md#data-tables",
        "multi_tenant_repo": "packages/services/repositories/base-repository.ts"
      },
      "metrics": {
        "api_endpoints": 8,
        "components": 15,
        "test_coverage": "95%",
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
      "reused_in": ["R3-CUSTOMER-EXPERIENCE"]
    }
  ],
  "last_updated": "2025-11-03T18:00:00Z"
}
```

**When to Update:**

- When ReviewerAgent approves the release
- Before marking release as complete in TODO_RELEASES.md
- After CHANGELOG.md is created

**Why:** Builds organizational memory, enables pattern reuse, helps future agents learn from past work.

---

## 📋 Completion Message Template

After completing ANY task, agents MUST respond with:

```
(**AgentName**): [Brief description of what was completed]

✅ Completed: [Specific deliverable]
📝 Updated: releases/{RELEASE}/PROGRESS.md
🤖 Updated: .agent-state/current-release.json
🔄 Updated: .agent-state/agent-handoffs.json (if handing off)
📚 Updated: .agent-state/completed-contracts.json (if release complete)
👉 Next: [Next agent] will [next task]
```

**Example (with handoff):**

```
(**SolutionArchitectAgent**): Architecture complete, ready for testing phase.

✅ Completed: API_CONTRACT.md, COMPONENT_CONTRACT.md, ARCHITECTURE_DECISIONS.md
📝 Updated: releases/R3-CUSTOMER-EXPERIENCE/PROGRESS.md
🤖 Updated: .agent-state/current-release.json
🔄 Updated: .agent-state/agent-handoffs.json (handoff to QATestingAgent)
👉 Next: QATestingAgent will create TEST_PLAN.md and write tests
```

**Example (release complete):**

```
(**ReviewerAgent**): R2-CATALOG-MANAGEMENT approved and complete.

✅ Completed: Release validation, all tests passing, code quality approved
📝 Updated: releases/R2-CATALOG-MANAGEMENT/PROGRESS.md
🤖 Updated: .agent-state/current-release.json
📚 Updated: .agent-state/completed-contracts.json (R2 patterns captured)
👉 Next: Ready to start R3 planning
```

---

## 🔍 Before Starting Work (MANDATORY READS)

Every agent MUST read these files before starting work:

1. `.agent-state/current-release.json` - Current state
2. `.agent-state/agent-handoffs.json` - Check if work was handed off to you
3. `.agent-state/completed-contracts.json` - Learn from previous releases
4. `releases/{RELEASE}/PROGRESS.md` - Task status
5. Relevant contracts/requirements for your role

**Special Instructions:**

- If your agent name appears in `pending_handoffs`, read the handoff context
- Check `completed_releases` for similar patterns from previous releases
- Review `contracts` array for reusable patterns

---

## ⚠️ Consequences of Non-Compliance

If an agent fails to follow these rules:

1. **Missing agent name format** → User will not know which agent is active
2. **Missing progress update** → Project status becomes stale and inaccurate
3. **Missing agent state update** → "What's next?" command breaks
4. **Missing handoff registration** → Next agent doesn't know what to do
5. **Missing learning capture** → Knowledge is lost, patterns aren't reused

**All five rules are NON-NEGOTIABLE and apply to EVERY agent response.**

---

## 📚 See Also

- `WARP.md` - Complete agent orchestration system
- `AGENT_CONTRACTS.md` - Agent responsibilities
- `HANDOFF_PROCESS.md` - Agent handoff protocol
