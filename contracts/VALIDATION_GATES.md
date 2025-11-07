# VALIDATION_GATES.md - Quality Control Checkpoints

**Last Updated:** 2025-11-02  
**Purpose:** Define strict validation gates that block progress

---

## 🚨 Gate Philosophy

**Gates are BLOCKING:** Work cannot proceed until gate conditions are met.  
**No Exceptions:** Even for "quick fixes" or "urgent work".  
**Automated Enforcement:** System should automatically check and block.

---

## 🔒 Gate Definitions

### Gate 1: UX Design Required
**Location:** Before frontend implementation  
**Enforced By:** SeniorFrontendAgent

**Condition:**
```
IF (task involves UI/frontend)
  AND (UX_DESIGN.md does NOT exist OR not approved)
THEN
  BLOCK: "Frontend work cannot start without approved UX design"
  ACTION: Activate UXAgent to create UX_DESIGN.md
```

**Check:**
- File exists: `releases/{RELEASE}/UX_DESIGN.md`
- File is complete (not empty, has all required sections)
- File is approved (marked in PROGRESS.md)

---

### Gate 2: Tests Required Before Implementation
**Location:** Before any implementation  
**Enforced By:** SeniorBackendAgent, SeniorFrontendAgent

**Condition:**
```
IF (implementation task)
  AND (tests do NOT exist OR tests are passing)
THEN
  BLOCK: "TDD violation: Write failing tests first"
  ACTION: Activate QATestingAgent to write/fix tests
```

**Check:**
- Test files exist for the feature
- Tests are currently FAILING (not passing)
- Tests cover the contracts

---

### Gate 3: Backend Before Frontend
**Location:** Before frontend implementation  
**Enforced By:** SeniorFrontendAgent

**Condition:**
```
IF (frontend implementation requested)
  AND (backend tests are NOT all passing)
THEN
  BLOCK: "Backend must be complete and tested first"
  ACTION: Wait for SeniorBackendAgent to complete
```

**Check:**
- Backend implementation exists
- All backend tests passing
- APIs match API contract

---

### Gate 4: Contract Validation
**Location:** During implementation  
**Enforced By:** SeniorBackendAgent, SeniorFrontendAgent

**Condition:**
```
IF (implementation does NOT match contract)
THEN
  BLOCK: "Implementation must follow contracts exactly"
  ACTION: Fix implementation OR update contract via architect
```

**Check:**
- API implementation matches `API_CONTRACT.md`
- Component implementation matches `COMPONENT_CONTRACT.md`
- No deviations without documented approval

---

### Gate 5: All Tests Must Pass
**Location:** Before validation phase  
**Enforced By:** QATestingAgent (validation)

**Condition:**
```
IF (ANY test is failing)
THEN
  BLOCK: "Cannot proceed with failing tests"
  ACTION: Return to implementation agent for fixes
```

**Check:**
- All backend unit tests passing
- All frontend unit tests passing
- All integration tests passing
- All E2E tests passing

---

### Gate 6: UX Design Match
**Location:** During frontend validation  
**Enforced By:** QATestingAgent (validation)

**Condition:**
```
IF (frontend implementation does NOT match UX_DESIGN.md)
THEN
  BLOCK: "UI must match approved UX design"
  ACTION: Return to SeniorFrontendAgent for fixes
```

**Check:**
- All UI screens implemented
- Navigation matches design
- Empty states match design
- Error states match design
- Loading states match design

---

### Gate 7: Reviewer Approval
**Location:** Before release completion  
**Enforced By:** Release completion process

**Condition:**
```
IF (reviewer has NOT approved)
THEN
  BLOCK: "Cannot complete release without approval"
  ACTION: Address reviewer feedback
```

**Check:**
- ReviewerAgent has completed review
- No critical issues remain
- All feedback addressed
- Formal approval given

---

## 📋 Gate Enforcement Checklist

### Before Starting Work
- [ ] Check if UX design required (for UI work)
- [ ] Check if tests exist (for implementation)
- [ ] Check if prerequisites complete (backend for frontend)

### During Work
- [ ] Verify following contracts
- [ ] Run tests frequently
- [ ] Check quality standards

### After Completing Work
- [ ] All tests passing
- [ ] Contracts followed
- [ ] Documentation updated
- [ ] Ready for next gate

---

## 🚫 Common Gate Violations

### Violation 1: "Quick UI Fix Without UX"
**Scenario:** Developer wants to quickly fix UI bug without UX design  
**Response:** BLOCK - Even small UI changes need design approval  
**Reason:** Maintains consistency and prevents design drift

### Violation 2: "Code First, Tests Later"
**Scenario:** Developer writes code before tests  
**Response:** BLOCK - Delete code, write tests first  
**Reason:** TDD discipline must be maintained

### Violation 3: "Frontend Started, Backend Not Done"
**Scenario:** Frontend work starts while backend incomplete  
**Response:** BLOCK - Wait for backend completion  
**Reason:** Prevents integration issues and rework

### Violation 4: "It's Close Enough to Contract"
**Scenario:** Implementation deviates slightly from contract  
**Response:** BLOCK - Match contract exactly OR update contract  
**Reason:** Contracts are the agreement between agents

### Violation 5: "One Test Failing, But Everything Else Works"
**Scenario:** Developer wants to proceed with one failing test  
**Response:** BLOCK - Fix ALL tests first  
**Reason:** Maintains quality standards

### Violation 6: "UI Looks Different But Better"
**Scenario:** Developer improves UI beyond UX design  
**Response:** BLOCK - Match design OR get UX approval for change  
**Reason:** Maintains design consistency

### Violation 7: "Skip Review, It's Simple"
**Scenario:** Developer wants to skip review for simple change  
**Response:** BLOCK - All work must be reviewed  
**Reason:** Quality and security checks are non-negotiable

---

## ✅ Gate Override Process

**Generally:** Gates should NOT be overridden

**Exception Cases:**
1. Critical production bug (emergency fix)
2. Explicit user approval for deviation
3. Documented technical impossibility

**Override Procedure:**
1. Document reason in `PROGRESS.md`
2. Get explicit user approval
3. Create follow-up task to address properly
4. Mark as technical debt

---

**END OF VALIDATION_GATES.md**
