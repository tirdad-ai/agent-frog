# 🚨 MANDATORY: Before Starting Any Work

**ALL AGENTS MUST FOLLOW THESE RULES**

## Step 1: Read These Files (IN THIS ORDER)

1. **`.agent-state/current-release.json`** - What's happening NOW
2. **`.agent-state/agent-handoffs.json`** - Check if work was handed off to YOU
3. **`.agent-state/completed-contracts.json`** - Learn from previous releases
4. **`releases/{RELEASE}/PROGRESS.md`** - Current task status
5. **Relevant contracts/requirements for your role**

### If You Find a Handoff for Your Agent:

```json
// Example in agent-handoffs.json
{
  "pending_handoffs": [
    {
      "to_agent": "YourAgentName", // ← This is YOU!
      "context": {
        "required_inputs": ["file1.md", "file2.md"],
        "expected_outputs": ["what you should create"],
        "special_instructions": "important context"
      }
    }
  ]
}
```

**Action:**

- Read all `required_inputs` files
- Follow `special_instructions`
- Plan to deliver `expected_outputs`
- Update handoff status to `"in_progress"`

### Check for Reusable Patterns:

```json
// Example in completed-contracts.json
{
  "contracts": [
    {
      "pattern_name": "Multi-tenant Repository Pattern",
      "when_to_use": "Any entity that belongs to a tenant",
      "code_reference": "packages/services/repositories/base-repository.ts"
    }
  ]
}
```

**Action:**

- Check if similar work was done before
- Reuse proven patterns instead of reinventing
- Learn from `issues_encountered` to avoid same mistakes

---

## Step 2: After Completing Your Work

### Update 1: PROGRESS.md (ALWAYS)

```markdown
## Phase X: Your Phase

### Your Task

- [x] ✅ Task completed (2025-11-06T15:30:00Z) - 100%

**Phase Progress:** X% complete
```

### Update 2: current-release.json (ALWAYS)

```json
{
  "active_agent": "YourAgentName",
  "next_task": "What comes next",
  "progress_percentage": 35,
  "last_updated": "2025-11-06T15:30:00Z",
  "completed_artifacts": ["Previous artifacts...", "Your new artifact"],
  "notes": "Brief context about what you completed"
}
```

### Update 3: agent-handoffs.json (IF HANDING OFF TO ANOTHER AGENT)

```json
{
  "pending_handoffs": [
    {
      "id": "handoff-20251106-153000",
      "from_agent": "YourAgentName",
      "to_agent": "NextAgentName",
      "release": "R3-CUSTOMER-EXPERIENCE",
      "trigger_condition": "your_work_complete",
      "created_at": "2025-11-06T15:30:00Z",
      "status": "pending",
      "context": {
        "required_inputs": ["files the next agent needs"],
        "expected_outputs": ["what the next agent should create"],
        "special_instructions": "Any important context"
      }
    }
  ],
  "last_updated": "2025-11-06T15:30:00Z"
}
```

**When to create handoff:**

- Your phase is complete
- Another agent needs to work next
- You know what they need to do

**Handoff targets by phase:**

- Planning → TDD: `SolutionArchitectAgent` → `QATestingAgent`
- TDD → Implementation: `QATestingAgent` → `SeniorBackendAgent`
- Backend → Frontend: `SeniorBackendAgent` → `SeniorFrontendAgent`
- Implementation → Validation: `SeniorFrontendAgent` → `QATestingAgent`
- Validation → Review: `QATestingAgent` → `ReviewerAgent`

### Update 4: completed-contracts.json (IF RELEASE IS COMPLETE)

**Only ReviewerAgent or final agent updates this when entire release finishes:**

```json
{
  "completed_releases": [
    {
      "release_id": "R3-CUSTOMER-EXPERIENCE",
      "completed_date": "2025-11-15T18:00:00Z",
      "duration_weeks": 4,
      "key_patterns": [
        "Pattern 1 we learned",
        "Pattern 2 that worked well",
        "Pattern 3 to reuse"
      ],
      "issues_encountered": [
        {
          "issue": "Problem we faced",
          "solution": "How we solved it",
          "reference": "Where to find details"
        }
      ],
      "reusable_contracts": {
        "contract_name": "path/to/contract.md"
      }
    }
  ],
  "contracts": [
    {
      "pattern_name": "New Pattern Name",
      "category": "backend" | "frontend" | "fullstack",
      "description": "What this pattern does",
      "when_to_use": "When to use it",
      "benefits": ["Benefit 1", "Benefit 2"],
      "example_usage": "code example",
      "reused_in": []
    }
  ]
}
```

---

## Step 3: Completion Message (ALWAYS)

```
(**YourAgentName**): Brief description of what was completed.

✅ Completed: Specific deliverable
📝 Updated: releases/{RELEASE}/PROGRESS.md
🤖 Updated: .agent-state/current-release.json
🔄 Updated: .agent-state/agent-handoffs.json (if handing off)
📚 Updated: .agent-state/completed-contracts.json (if release complete)
👉 Next: [Next agent] will [next task]
```

---

## 📋 Quick Checklist

Before responding:

- [ ] Read current-release.json
- [ ] Check agent-handoffs.json for work assigned to me
- [ ] Review completed-contracts.json for reusable patterns
- [ ] Read PROGRESS.md

After completing work:

- [ ] Update PROGRESS.md with ✅
- [ ] Update current-release.json
- [ ] Create handoff in agent-handoffs.json (if needed)
- [ ] Update completed-contracts.json (if release complete)
- [ ] Include all updates in completion message

---

## 🔗 Full Documentation

- **Enforcement Rules:** `.agent-prompts/AGENT_ENFORCEMENT_RULES.md`
- **Usage Guide:** `.agent-state/README.md`
- **Workflow:** `WARP.md`

---

**NOW PROCEED WITH YOUR AGENT-SPECIFIC INSTRUCTIONS BELOW**

---
