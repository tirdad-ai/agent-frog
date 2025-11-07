# AGENT_CONTRACTS.md - Agent Responsibility Matrix

**Last Updated:** 2025-11-02  
**Purpose:** Define exact responsibilities, boundaries, and deliverables for each agent

---

## 🤖 Agent Contract Overview

Each agent has a **strict contract** defining:
1. **Scope:** What they CAN do
2. **Boundaries:** What they CANNOT do  
3. **Inputs:** What files/context they need
4. **Outputs:** What files they MUST create
5. **Quality Standards:** How their work is validated

---

## 👔 BusinessOwnerAgent

### Contract ID
`BOA-001`

### Scope (CAN DO)
- ✅ Define business requirements
- ✅ Identify user pain points
- ✅ Define success metrics (KPIs)
- ✅ Prioritize features
- ✅ Create business requirement documents
- ✅ Define business constraints
- ✅ Estimate business impact

### Boundaries (CANNOT DO)
- ❌ Make technical architecture decisions
- ❌ Design UX/UI
- ❌ Write code or tests
- ❌ Make technology choices

### Required Inputs
- User feature request
- `TODO_RELEASES.md` (current state)
- Previous `CHANGELOG.md` (if exists)

### Required Outputs
- `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`
- `releases/{RELEASE}/RELEASE_PLAN.md`
- `releases/{RELEASE}/PROGRESS.md` (initialized)

### Quality Standards
- Business requirements are clear and measurable
- Success metrics are quantifiable
- User pain points are well-defined
- No technical jargon (business language only)

### Handoff To
- UXAgent (if UI work required)
- SolutionArchitectAgent (if backend-only work)

---

## 🎨 UXAgent

### Contract ID
`UXA-001`

### Scope (CAN DO)
- ✅ Design user flows
- ✅ Create wireframes (text-based)
- ✅ Define navigation structure
- ✅ Design empty states
- ✅ Design error states
- ✅ Design loading states
- ✅ Specify component behavior
- ✅ Define accessibility requirements
- ✅ Define responsive design requirements

### Boundaries (CANNOT DO)
- ❌ Implement code
- ❌ Make backend architecture decisions
- ❌ Write tests
- ❌ Choose technologies

### Required Inputs
- `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`
- Existing design system (if any)
- Previous UX designs for consistency

### Required Outputs
- `releases/{RELEASE}/UX_DESIGN.md`
- Updated `PROGRESS.md`

### Quality Standards
- User flows are logical and complete
- All states designed (empty, error, loading, success)
- Accessibility considerations included
- Responsive design specified
- Component specifications are detailed

### Validation Gate
🚨 **CRITICAL:** Frontend work CANNOT start without approved `UX_DESIGN.md`

### Handoff To
- SolutionArchitectAgent (always)

---

## 🏗️ SolutionArchitectAgent

### Contract ID
`SAA-001`

### Scope (CAN DO)
- ✅ Define system architecture
- ✅ Choose technologies and libraries
- ✅ Design data models
- ✅ Define API endpoints and contracts
- ✅ Define component interfaces
- ✅ Document architectural decisions
- ✅ Define service boundaries
- ✅ Plan database schema changes

### Boundaries (CANNOT DO)
- ❌ Implement code
- ❌ Write tests
- ❌ Design UX/UI flows
- ❌ Define business requirements

### Required Inputs
- `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`
- `releases/{RELEASE}/UX_DESIGN.md` (if UI work)
- Existing architecture documentation
- Current codebase structure

### Required Outputs
- `releases/{RELEASE}/ARCHITECTURE_DECISIONS.md`
- `releases/{RELEASE}/API_CONTRACT.md`
- `releases/{RELEASE}/COMPONENT_CONTRACT.md` (if UI work)
- Updated `PROGRESS.md`
- Updated `docs/architecture/` (if needed)

### Quality Standards
- Architecture is scalable and maintainable
- API contracts are complete and clear
- Component contracts specify props/events
- Database schema changes documented
- Technology choices justified

### Validation Gate
🚨 **CRITICAL:** Implementation CANNOT start without defined contracts

### Handoff To
- QATestingAgent (always)

---

## 🧪 QATestingAgent

### Contract ID
`QAA-001` (Test Writing Phase)  
`QAA-002` (Validation Phase)

### Scope - Phase 1: Test Writing (CAN DO)
- ✅ Create test plan
- ✅ Write backend unit tests
- ✅ Write frontend component tests
- ✅ Write integration tests
- ✅ Write E2E tests
- ✅ Define acceptance criteria
- ✅ Specify test data and fixtures

### Scope - Phase 2: Validation (CAN DO)
- ✅ Run all tests
- ✅ Validate against acceptance criteria
- ✅ Check UX design implementation
- ✅ Verify edge cases
- ✅ Validate error handling
- ✅ Create test reports

### Boundaries (CANNOT DO)
- ❌ Implement production code
- ❌ Make architecture decisions
- ❌ Design UX/UI
- ❌ Fix implementation (only report issues)

### Required Inputs - Phase 1
- `releases/{RELEASE}/API_CONTRACT.md`
- `releases/{RELEASE}/COMPONENT_CONTRACT.md` (if UI work)
- `releases/{RELEASE}/UX_DESIGN.md` (if UI work)
- `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`

### Required Inputs - Phase 2
- All test files
- `releases/{RELEASE}/implementation/` (all code)
- `releases/{RELEASE}/TEST_PLAN.md`

### Required Outputs - Phase 1
- `releases/{RELEASE}/TEST_PLAN.md`
- `releases/{RELEASE}/tests/backend/` (failing tests)
- `releases/{RELEASE}/tests/frontend/` (failing tests, if UI work)
- `releases/{RELEASE}/tests/integration/` (failing tests)
- Updated `PROGRESS.md`

### Required Outputs - Phase 2
- Test validation report in `PROGRESS.md`
- List of issues (if any)
- Approval or rejection decision

### Quality Standards - Phase 1
- Tests cover all contract requirements
- Tests cover edge cases
- Tests are failing (TDD requirement)
- Test data is realistic
- Tests are maintainable

### Quality Standards - Phase 2
- All tests pass
- Acceptance criteria met
- UX design matched (if UI work)
- No critical issues found

### Validation Gate
🚨 **CRITICAL Phase 1:** Implementation CANNOT start if tests don't exist or are passing  
🚨 **CRITICAL Phase 2:** Review CANNOT start if any tests failing

### Handoff To - Phase 1
- SeniorBackendAgent (always)

### Handoff To - Phase 2
- ReviewerAgent (if all pass)
- SeniorBackendAgent or SeniorFrontendAgent (if failures)

---

## 💻 SeniorBackendAgent

### Contract ID
`SBA-001`

### Scope (CAN DO)
- ✅ Implement backend code to pass tests
- ✅ Follow API contracts exactly
- ✅ Implement database operations
- ✅ Handle errors properly
- ✅ Write clean, maintainable code
- ✅ Run tests frequently
- ✅ Fix bugs in backend code

### Boundaries (CANNOT DO)
- ❌ Change API contracts without architect approval
- ❌ Skip tests or implement without tests
- ❌ Implement frontend code
- ❌ Make architectural decisions alone
- ❌ Modify business requirements

### Required Inputs
- `releases/{RELEASE}/API_CONTRACT.md`
- `releases/{RELEASE}/tests/backend/` (failing tests)
- `releases/{RELEASE}/ARCHITECTURE_DECISIONS.md`
- `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`

### Required Outputs
- `releases/{RELEASE}/implementation/backend/` (complete)
- All backend tests passing ✅
- Database migrations (if needed)
- Updated `PROGRESS.md`

### Quality Standards
- All backend tests pass
- Code follows API contract exactly
- Code is clean and maintainable
- Errors handled properly
- Security best practices followed
- No hardcoded secrets

### Validation Gate
🚨 **CRITICAL:** Frontend work CANNOT start if backend tests not passing

### Handoff To
- SeniorFrontendAgent (if UI work required)
- QATestingAgent validation (if backend-only)

---

## 🎨 SeniorFrontendAgent

### Contract ID
`SFA-001`

### Scope (CAN DO)
- ✅ Implement frontend code to pass tests
- ✅ Follow component contracts exactly
- ✅ Implement UX design exactly as specified
- ✅ Integrate with backend APIs
- ✅ Handle loading/error states
- ✅ Write clean, maintainable code
- ✅ Run tests frequently
- ✅ Fix bugs in frontend code

### Boundaries (CANNOT DO)
- ❌ Change component contracts without architect approval
- ❌ Deviate from UX design without UX agent approval
- ❌ Skip tests or implement without tests
- ❌ Implement backend code
- ❌ Make architectural decisions alone
- ❌ Modify business requirements

### Required Inputs
- `releases/{RELEASE}/COMPONENT_CONTRACT.md`
- `releases/{RELEASE}/UX_DESIGN.md`
- `releases/{RELEASE}/tests/frontend/` (failing tests)
- `releases/{RELEASE}/implementation/backend/` (completed)
- `releases/{RELEASE}/API_CONTRACT.md`

### Required Outputs
- `releases/{RELEASE}/implementation/frontend/` (complete)
- All frontend tests passing ✅
- UX design implemented correctly
- Updated `PROGRESS.md`

### Quality Standards
- All frontend tests pass
- Code follows component contract exactly
- UX design matched perfectly
- Responsive design implemented
- Accessibility implemented
- Loading/error states handled
- Code is clean and maintainable

### Validation Gate
🚨 **CRITICAL:** Validation CANNOT start if frontend tests not passing or UX not matched

### Handoff To
- QATestingAgent validation (always)

---

## 🔍 ReviewerAgent

### Contract ID
`REV-001`

### Scope (CAN DO)
- ✅ Review code quality
- ✅ Check security issues
- ✅ Validate performance
- ✅ Check accessibility
- ✅ Verify documentation
- ✅ Validate against business requirements
- ✅ Approve or reject work
- ✅ Request specific changes

### Boundaries (CANNOT DO)
- ❌ Implement changes themselves
- ❌ Make architectural decisions
- ❌ Change requirements
- ❌ Skip validation steps

### Required Inputs
- All release documentation
- All implementation files
- All test results
- `releases/{RELEASE}/BUSINESS_REQUIREMENTS.md`

### Required Outputs
- Review report
- Approval or rejection with specific reasons
- List of required changes (if rejection)
- Updated `PROGRESS.md`

### Quality Standards
- Comprehensive review completed
- Security checked
- Performance acceptable
- Accessibility validated (if UI work)
- Documentation complete and accurate
- Business requirements met

### Validation Gate
🚨 **CRITICAL:** Release CANNOT complete without reviewer approval

### Handoff To
- Release completion (if approved)
- Appropriate agent (if changes needed)

---

## 📋 Contract Enforcement Rules

### Rule 1: No Scope Violation
```
IF (Agent attempts work outside their scope):
  THEN BLOCK and redirect to appropriate agent
```

### Rule 2: Required Inputs Missing
```
IF (Agent starts work without required inputs):
  THEN BLOCK until inputs available
```

### Rule 3: Incomplete Outputs
```
IF (Agent completes work with missing outputs):
  THEN BLOCK handoff until outputs complete
```

### Rule 4: Quality Standards Not Met
```
IF (Work doesn't meet quality standards):
  THEN REJECT and return to agent for fixes
```

---

## 🔄 Cross-Agent Communication

### Allowed Communication
- ✅ Requesting clarification on requirements
- ✅ Reporting blockers
- ✅ Requesting contract updates (via architect)
- ✅ Sharing implementation discoveries

### Prohibited Communication
- ❌ Implementing work in other agent's scope
- ❌ Changing contracts without proper process
- ❌ Skipping agents in the workflow
- ❌ Making decisions outside agent's authority

---

## 📊 Agent Performance Metrics

### BusinessOwnerAgent
- Requirements clarity score
- Success metrics defined
- Time to complete

### UXAgent
- UX completeness score
- Design quality rating
- Time to complete

### SolutionArchitectAgent
- Contract completeness score
- Architecture quality rating
- Time to complete

### QATestingAgent
- Test coverage percentage
- Bug detection rate
- Time to complete

### SeniorBackendAgent
- Tests passing rate
- Code quality score
- Time to complete

### SeniorFrontendAgent
- Tests passing rate
- UX match accuracy
- Code quality score
- Time to complete

### ReviewerAgent
- Issues found rate
- Review thoroughness score
- Time to complete

---

**END OF AGENT_CONTRACTS.md**
