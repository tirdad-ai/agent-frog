# HANDOFF_PROCESS.md - Agent-to-Agent Transitions

**Last Updated:** 2025-11-02  
**Purpose:** Define exact handoff procedures between agents

---

## 🔄 Handoff Protocol

Each handoff must:
1. **Verify Completion:** Previous agent's work is complete
2. **Validate Outputs:** All required files exist and are correct
3. **Transfer Context:** Next agent has all required inputs
4. **Update State:** `.agent-state/` reflects new active agent

---

## 📋 Handoff Checklist

### Pre-Handoff (Sending Agent)
- [ ] All required outputs created
- [ ] Quality standards met
- [ ] `PROGRESS.md` updated
- [ ] Work reviewed (if applicable)
- [ ] Handoff criteria met

### During Handoff (System)
- [ ] Validate all outputs exist
- [ ] Check quality gates
- [ ] Update `.agent-state/current-release.json`
- [ ] Update `.agent-state/agent-handoffs.json`
- [ ] Notify next agent

### Post-Handoff (Receiving Agent)
- [ ] Read all required inputs
- [ ] Understand context
- [ ] Verify prerequisites met
- [ ] Begin work

---

## 🤝 Handoff Matrix

| From | To | Trigger | Prerequisites |
|------|-----|---------|---------------|
| **User** | BusinessOwnerAgent | Feature request or "What's next?" | None |
| **BusinessOwnerAgent** | UXAgent | `BUSINESS_REQUIREMENTS.md` created + UI work | Requirements document complete |
| **BusinessOwnerAgent** | SolutionArchitectAgent | `BUSINESS_REQUIREMENTS.md` created + no UI | Requirements document complete |
| **UXAgent** | SolutionArchitectAgent | `UX_DESIGN.md` approved | UX design complete |
| **SolutionArchitectAgent** | QATestingAgent | All contracts defined | Contracts complete |
| **QATestingAgent** | SeniorBackendAgent | Tests written (failing) | Test plan + failing tests |
| **SeniorBackendAgent** | SeniorFrontendAgent | Backend tests passing + UI work | Backend complete |
| **SeniorBackendAgent** | QATestingAgent (validation) | Backend tests passing + no UI | Backend complete |
| **SeniorFrontendAgent** | QATestingAgent (validation) | Frontend tests passing | Frontend complete |
| **QATestingAgent** (validation) | ReviewerAgent | All tests passing | Validation complete |
| **QATestingAgent** (validation) | SeniorBackendAgent | Backend tests failing | Need fixes |
| **QATestingAgent** (validation) | SeniorFrontendAgent | Frontend tests failing | Need fixes |
| **ReviewerAgent** | Release Complete | Approved | All quality checks pass |
| **ReviewerAgent** | Appropriate Agent | Rejected | Issues identified |

---

**END OF HANDOFF_PROCESS.md**
