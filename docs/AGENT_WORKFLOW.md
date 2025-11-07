# AGENT_WORKFLOW.md - Multi-Agent Development Process

**Last Updated:** 2025-11-02  
**Purpose:** Define strict agent handoff process, deliverables, and validation gates

---

## 📖 Overview

This document defines the **exact workflow** for multi-agent collaboration. Each agent has:
- **Inputs:** What files/context they need
- **Actions:** What they must do
- **Outputs:** What files they must create
- **Handoff Criteria:** When to pass to next agent

---

## 🔄 Agent Workflow Sequence

```
User Request
    ↓
BusinessOwnerAgent (Planning)
    ↓
UXAgent (Design) [if UI work]
    ↓
SolutionArchitectAgent (Architecture)
    ↓
QATestingAgent (Write Tests)
    ↓
SeniorBackendAgent (Implement Backend)
    ↓
SeniorFrontendAgent (Implement Frontend) [if UI work]
    ↓
QATestingAgent (Validation)
    ↓
ReviewerAgent (Final Review)
    ↓
Release Complete
```

---

## 🤖 Agent 1: BusinessOwnerAgent

### Role
Define business value, requirements, and success metrics

### Trigger
- User provides feature request
- User asks "What's next?"
- New release needs to be started

### Required Inputs
- User request or feature description
- Current `TODO_RELEASES.md` state
- Previous release learnings (if any)

### Actions
1. **Read Context:**
   - Read `TODO_RELEASES.md` to understand project state
   - Read previous release `CHANGELOG.md` (if exists)
   - Read any user-provided requirements

2. **Analyze Business Value:**
   - Identify user pain points
   - Define business goals
   - Estimate business impact
   - Define success metrics (KPIs)

3. **Create Documentation:**
   - Create `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`
   - Include:
     - Problem statement
     - User stories
     - Success metrics
     - Business constraints
     - Priority level

4. **Initialize Release:**
   - Create `releases/{RELEASE}/RELEASE_PLAN.md` (high-level overview)
   - Create `releases/{RELEASE}/PROGRESS.md` (empty, ready to track)

### Required Outputs
- ✅ `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md` (complete)
- ✅ `releases/{RELEASE}/RELEASE_PLAN.md` (overview)
- ✅ `releases/{RELEASE}/PROGRESS.md` (initialized)

### Handoff Criteria
```
IF (UI work required):
  → Handoff to: UXAgent
ELSE:
  → Handoff to: SolutionArchitectAgent
```

### Estimated Time
- Simple feature: 10 minutes
- Medium feature: 20 minutes
- Complex feature: 30 minutes

---

## 🎨 Agent 2: UXAgent

### Role
Design user experience, flows, and interface specifications

### Trigger
- `BUSINESS_REQUIREMENTS.md` exists
- Feature requires UI/frontend work

### Required Inputs
- `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`
- Existing design system patterns (if any)
- Previous UX designs for consistency

### Actions
1. **Read Requirements:**
   - Understand business goals
   - Identify user journeys
   - Extract UI requirements

2. **Design User Experience:**
   - Create user flow diagrams (text-based)
   - Design wireframes (text-based descriptions)
   - Define navigation structure
   - Design empty states
   - Design error states
   - Design loading states
   - Define component specifications

3. **Create Documentation:**
   - Create `releases/{RELEASE}/UX_DESIGN.md`
   - Include:
     - User flows
     - Wireframes (detailed descriptions)
     - Navigation map
     - Component specifications
     - Interaction patterns
     - Accessibility considerations
     - Mobile/responsive requirements

4. **Update Progress:**
   - Mark "UX Design Complete" in `PROGRESS.md`

### Required Outputs
- ✅ `releases/{RELEASE}/UX_DESIGN.md` (complete)
- ✅ Updated `PROGRESS.md`

### Handoff Criteria
```
IF (UX design approved by user OR no approval needed):
  → Handoff to: SolutionArchitectAgent
ELSE:
  → Wait for approval
```

### Validation Gate
🚨 **BLOCKING:** Frontend work CANNOT start without approved `UX_DESIGN.md`

### Estimated Time
- Simple UI: 15 minutes
- Medium UI: 30 minutes
- Complex UI: 45-60 minutes

---

## 🏗️ Agent 3: SolutionArchitectAgent

### Role
Define technical architecture, contracts, and system design

### Trigger
- `BUSINESS_REQUIREMENTS.md` exists
- `UX_DESIGN.md` exists (if UI work) OR no UI work required

### Required Inputs
- `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`
- `releases/{RELEASE}/UX_DESIGN.md` (if exists)
- Existing architecture patterns
- Current codebase structure

### Actions
1. **Read Requirements:**
   - Understand business requirements
   - Understand UX requirements (if UI work)
   - Review existing architecture

2. **Design Architecture:**
   - Define system components
   - Choose architectural patterns
   - Define data models
   - Define service boundaries
   - Choose technologies/libraries

3. **Create Contracts:**
   - Define API endpoints (REST/GraphQL)
   - Define request/response schemas
   - Define component interfaces
   - Define database schema changes

4. **Create Documentation:**
   - Create `releases/{RELEASE}/ARCHITECTURE_DECISIONS.md`
   - Create `releases/{RELEASE}/API_CONTRACT.md`
   - Create `releases/{RELEASE}/COMPONENT_CONTRACT.md` (if UI work)
   - Update `docs/architecture/` if needed

5. **Update Progress:**
   - Mark "Architecture Complete" in `PROGRESS.md`

### Required Outputs
- ✅ `releases/{RELEASE}/ARCHITECTURE_DECISIONS.md` (complete)
- ✅ `releases/{RELEASE}/API_CONTRACT.md` (complete)
- ✅ `releases/{RELEASE}/COMPONENT_CONTRACT.md` (if UI work)
- ✅ Updated `PROGRESS.md`

### Handoff Criteria
```
IF (All contracts defined AND reviewed):
  → Handoff to: QATestingAgent
ELSE:
  → Wait for contract review
```

### Validation Gate
🚨 **BLOCKING:** Implementation CANNOT start without defined contracts

### Estimated Time
- Simple feature: 20 minutes
- Medium feature: 30-45 minutes
- Complex feature: 60 minutes

---

## 🧪 Agent 4: QATestingAgent (Test Writing Phase)

### Role
Create test plan and write tests BEFORE implementation

### Trigger
- All contracts defined (`API_CONTRACT.md`, `COMPONENT_CONTRACT.md`)

### Required Inputs
- `releases/{RELEASE}/API_CONTRACT.md`
- `releases/{RELEASE}/COMPONENT_CONTRACT.md` (if UI work)
- `releases/{RELEASE}/UX_DESIGN.md` (if UI work)
- `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`

### Actions
1. **Read Contracts:**
   - Understand API contract
   - Understand component contract
   - Understand acceptance criteria

2. **Create Test Plan:**
   - Define test strategy
   - Identify test scenarios
   - Define acceptance criteria
   - Create `releases/{RELEASE}/TEST_PLAN.md`

3. **Write Backend Tests (FIRST):**
   - Create test files: `releases/{RELEASE}/tests/backend/`
   - Write unit tests for each API endpoint
   - Write integration tests
   - Tests should FAIL (no implementation yet)

4. **Write Frontend Tests (FIRST):**
   - Create test files: `releases/{RELEASE}/tests/frontend/`
   - Write component tests
   - Write integration tests
   - Tests should FAIL (no implementation yet)

5. **Write E2E Tests:**
   - Create test files: `releases/{RELEASE}/tests/integration/`
   - Write end-to-end user flow tests
   - Tests should FAIL (no implementation yet)

6. **Update Progress:**
   - Mark "Test Plan Complete" in `PROGRESS.md`
   - Mark "Tests Written" in `PROGRESS.md`

### Required Outputs
- ✅ `releases/{RELEASE}/TEST_PLAN.md` (complete)
- ✅ `releases/{RELEASE}/tests/backend/` (failing tests)
- ✅ `releases/{RELEASE}/tests/frontend/` (failing tests, if UI work)
- ✅ `releases/{RELEASE}/tests/integration/` (failing tests)
- ✅ Updated `PROGRESS.md`

### Handoff Criteria
```
IF (All tests written AND all tests FAILING):
  → Handoff to: SeniorBackendAgent
ELSE:
  → Continue writing tests
```

### Validation Gate
🚨 **BLOCKING:** Implementation CANNOT start if:
- Tests don't exist
- Tests are passing (nothing to implement)

### Estimated Time
- Simple feature: 30 minutes
- Medium feature: 45 minutes
- Complex feature: 60-90 minutes

---

## 💻 Agent 5: SeniorBackendAgent

### Role
Implement backend to pass tests (TDD)

### Trigger
- Backend tests exist and are failing
- `API_CONTRACT.md` defined

### Required Inputs
- `releases/{RELEASE}/API_CONTRACT.md`
- `releases/{RELEASE}/tests/backend/` (failing tests)
- `releases/{RELEASE}/ARCHITECTURE_DECISIONS.md`
- `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`

### Actions
1. **Read Context:**
   - Read API contract
   - Read failing backend tests
   - Understand architecture decisions

2. **Implement Backend (TDD):**
   - Implement APIs to match contract
   - Run tests frequently
   - Implement until all backend tests pass
   - Follow architecture decisions
   - Write clean, maintainable code

3. **Create Implementation Files:**
   - Create `releases/{RELEASE}/implementation/backend/` directory
   - Organize code by feature/domain
   - Include database migrations if needed

4. **Verify Tests:**
   - Run all backend tests
   - Ensure all pass ✅

5. **Update Progress:**
   - Mark "Backend Implementation Complete" in `PROGRESS.md`
   - List implemented files

### Required Outputs
- ✅ `releases/{RELEASE}/implementation/backend/` (complete implementation)
- ✅ All backend tests passing ✅
- ✅ Updated `PROGRESS.md`

### Handoff Criteria
```
IF (All backend tests passing):
  IF (UI work required):
    → Handoff to: SeniorFrontendAgent
  ELSE:
    → Handoff to: QATestingAgent (validation phase)
ELSE:
  → Continue implementation
```

### Validation Gate
🚨 **BLOCKING:** Frontend work CANNOT start if backend tests are not passing

### Estimated Time
- Simple feature: 1-2 hours
- Medium feature: 2-4 hours
- Complex feature: 4-8 hours

---

## 🎨 Agent 6: SeniorFrontendAgent

### Role
Implement frontend to pass tests and match UX design (TDD)

### Trigger
- Frontend tests exist and are failing
- Backend tests are passing
- `COMPONENT_CONTRACT.md` and `UX_DESIGN.md` defined

### Required Inputs
- `releases/{RELEASE}/COMPONENT_CONTRACT.md`
- `releases/{RELEASE}/UX_DESIGN.md`
- `releases/{RELEASE}/tests/frontend/` (failing tests)
- `releases/{RELEASE}/implementation/backend/` (completed backend)
- `releases/{RELEASE}/API_CONTRACT.md` (for API integration)

### Actions
1. **Read Context:**
   - Read component contract
   - Read UX design specification
   - Read failing frontend tests
   - Understand backend APIs

2. **Implement Frontend (TDD):**
   - Implement components to match contract
   - Follow UX design exactly
   - Run tests frequently
   - Implement until all frontend tests pass
   - Integrate with backend APIs
   - Handle loading/error states

3. **Create Implementation Files:**
   - Create `releases/{RELEASE}/implementation/frontend/` directory
   - Organize components by feature
   - Include styles/assets if needed

4. **Verify Tests:**
   - Run all frontend tests
   - Ensure all pass ✅

5. **Verify UX Match:**
   - Validate implementation matches `UX_DESIGN.md`
   - Check responsive design
   - Check accessibility

6. **Update Progress:**
   - Mark "Frontend Implementation Complete" in `PROGRESS.md`
   - List implemented files

### Required Outputs
- ✅ `releases/{RELEASE}/implementation/frontend/` (complete implementation)
- ✅ All frontend tests passing ✅
- ✅ UX design implemented correctly
- ✅ Updated `PROGRESS.md`

### Handoff Criteria
```
IF (All frontend tests passing AND UX design matched):
  → Handoff to: QATestingAgent (validation phase)
ELSE:
  → Continue implementation
```

### Validation Gate
🚨 **BLOCKING:** Cannot proceed to validation if:
- Frontend tests failing
- UX design not matched

### Estimated Time
- Simple UI: 1-2 hours
- Medium UI: 2-4 hours
- Complex UI: 4-6 hours

---

## ✅ Agent 7: QATestingAgent (Validation Phase)

### Role
Validate complete implementation against all criteria

### Trigger
- Backend implementation complete (tests passing)
- Frontend implementation complete (tests passing, if UI work)

### Required Inputs
- `releases/{RELEASE}/tests/` (all test files)
- `releases/{RELEASE}/implementation/` (all implementation)
- `releases/{RELEASE}/TEST_PLAN.md`
- `releases/{RELEASE}/UX_DESIGN.md` (if UI work)
- `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`

### Actions
1. **Run All Tests:**
   - Run backend unit tests
   - Run frontend unit tests
   - Run integration tests
   - Run E2E tests

2. **Validate Implementation:**
   - Check against acceptance criteria
   - Validate UX design implementation (if UI work)
   - Check edge cases
   - Check error handling

3. **Create Test Report:**
   - Document test results
   - Document any issues found
   - Update `PROGRESS.md`

4. **Decision:**
   - If all pass → handoff to ReviewerAgent
   - If failures → handoff back to implementation agent

### Required Outputs
- ✅ All tests passing ✅
- ✅ Test report in `PROGRESS.md`
- ✅ Validation complete

### Handoff Criteria
```
IF (All tests passing AND acceptance criteria met):
  → Handoff to: ReviewerAgent
ELSE:
  IF (Backend issues):
    → Handoff back to: SeniorBackendAgent
  IF (Frontend issues):
    → Handoff back to: SeniorFrontendAgent
```

### Validation Gate
🚨 **BLOCKING:** Cannot proceed to review if any tests failing

### Estimated Time
- Simple feature: 15-30 minutes
- Medium feature: 30-45 minutes
- Complex feature: 45-60 minutes

---

## 🔍 Agent 8: ReviewerAgent

### Role
Final quality review and approval

### Trigger
- All tests passing
- QATestingAgent validation complete

### Required Inputs
- All release documentation
- All implementation files
- Test results
- `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`

### Actions
1. **Review Implementation:**
   - Code quality review
   - Security review
   - Performance considerations
   - Accessibility check (if UI work)
   - Documentation completeness

2. **Validate Against Requirements:**
   - Check against business requirements
   - Verify success metrics are measurable
   - Ensure contracts were followed

3. **Create Review Report:**
   - Document findings
   - Approve or request changes

4. **Decision:**
   - If approved → mark release complete
   - If issues → handoff back to appropriate agent

### Required Outputs
- ✅ Review report
- ✅ Approval or rejection with reasons
- ✅ Updated `PROGRESS.md`

### Handoff Criteria
```
IF (Approved):
  → Release Complete (create CHANGELOG.md)
ELSE:
  → Handoff back to: appropriate agent for fixes
```

### Validation Gate
🚨 **BLOCKING:** Cannot mark release complete without reviewer approval

### Estimated Time
- Simple feature: 15-20 minutes
- Medium feature: 20-30 minutes
- Complex feature: 30-45 minutes

---

## 🎉 Release Completion

### Trigger
- ReviewerAgent approval

### Actions
1. **Create Changelog:**
   - Create `releases/{RELEASE}/CHANGELOG.md`
   - List all features implemented
   - List all files created/modified
   - Document any breaking changes

2. **Update Release Tracker:**
   - Mark release complete in `TODO_RELEASES.md`
   - Update completion timestamp
   - Calculate actual vs estimated time

3. **Update WARP.md (if needed):**
   - Document any process improvements
   - Document any new patterns
   - Update agent guidelines if learned something

4. **Archive Agent State:**
   - Move `.agent-state/current-release.json` to completed
   - Clear pending handoffs

5. **Initialize Next Release (if planned):**
   - Create next release folder
   - Update `TODO_RELEASES.md` with next release

### Required Outputs
- ✅ `releases/{RELEASE}/CHANGELOG.md` (complete)
- ✅ Updated `TODO_RELEASES.md`
- ✅ Updated `WARP.md` (if needed)
- ✅ Archived agent state

---

## 🚨 Exception Handling

### Blocked by Missing UX Design
```
Current Agent: SeniorFrontendAgent
Issue: UX_DESIGN.md not found
Action:
  1. STOP current work
  2. Activate UXAgent
  3. UXAgent creates UX_DESIGN.md
  4. Resume SeniorFrontendAgent work
```

### Tests Already Passing (TDD Violation)
```
Current Agent: SeniorBackendAgent
Issue: All backend tests already passing
Action:
  1. STOP current work
  2. Activate QATestingAgent
  3. QATestingAgent writes more comprehensive tests
  4. Resume SeniorBackendAgent work
```

### Contract Mismatch
```
Current Agent: SeniorBackendAgent or SeniorFrontendAgent
Issue: Implementation doesn't match contract
Action:
  1. STOP current work
  2. Decision:
     - If contract is wrong → Activate SolutionArchitectAgent to update
     - If implementation is wrong → Fix implementation
  3. Resume work
```

### Failed Tests After Implementation
```
Current Agent: QATestingAgent (validation)
Issue: Tests failing after implementation
Action:
  1. Identify which tests failing (backend/frontend)
  2. Handoff back to SeniorBackendAgent or SeniorFrontendAgent
  3. Implementation agent fixes issues
  4. Return to QATestingAgent for validation
```

---

## 📊 Time Tracking

### Expected Total Time per Release

**Simple Release:**
- Planning: 30 min
- TDD: 30 min
- Implementation: 2 hr
- Validation: 30 min
- **Total: ~3-4 hours**

**Medium Release:**
- Planning: 60 min
- TDD: 60 min
- Implementation: 4 hr
- Validation: 60 min
- **Total: ~6-8 hours**

**Complex Release:**
- Planning: 90 min
- TDD: 90 min
- Implementation: 8 hr
- Validation: 90 min
- **Total: ~12-14 hours**

---

## ✅ Workflow Checklist

Use this checklist to ensure proper workflow:

### Planning Phase
- [ ] Business requirements documented
- [ ] UX design created (if UI work)
- [ ] Architecture decisions documented
- [ ] Contracts defined (API + Component)

### TDD Phase
- [ ] Test plan created
- [ ] Backend tests written (failing)
- [ ] Frontend tests written (failing, if UI work)
- [ ] Integration tests written (failing)

### Implementation Phase
- [ ] Backend implemented (tests passing)
- [ ] Frontend implemented (tests passing, if UI work)
- [ ] UX design matched (if UI work)

### Validation Phase
- [ ] All tests passing
- [ ] Acceptance criteria met
- [ ] Reviewer approval obtained

### Completion Phase
- [ ] Changelog created
- [ ] TODO_RELEASES.md updated
- [ ] WARP.md updated (if needed)
- [ ] Next release initialized (if planned)

---

**END OF AGENT_WORKFLOW.md**
