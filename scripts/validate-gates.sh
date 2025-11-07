#!/bin/bash
# Validation Gates Automation Script
# Enforces validation gates programmatically

set -e

RELEASE=$1
PHASE=$2

if [ -z "$RELEASE" ]; then
    echo "❌ Usage: ./validate-gates.sh <RELEASE> <PHASE>"
    echo "   Example: ./validate-gates.sh R1-FOUNDATION planning"
    exit 1
fi

RELEASE_DIR="releases/$RELEASE"

echo "🔍 Validating gates for $RELEASE (Phase: $PHASE)"
echo ""

# Gate 1: UX Design Required (for frontend work)
validate_ux_design() {
    echo "🚨 Gate 1: UX Design Required"
    if [ ! -f "$RELEASE_DIR/UX_DESIGN.md" ]; then
        echo "   ❌ BLOCKED: UX_DESIGN.md not found"
        echo "   ACTION: Activate UXAgent to create UX design"
        return 1
    fi
    
    # Check if file is not empty
    if [ ! -s "$RELEASE_DIR/UX_DESIGN.md" ]; then
        echo "   ❌ BLOCKED: UX_DESIGN.md is empty"
        return 1
    fi
    
    echo "   ✅ PASS: UX_DESIGN.md exists and is not empty"
    return 0
}

# Gate 2: Tests Required Before Implementation
validate_tests_exist() {
    echo "🚨 Gate 2: Tests Required Before Implementation"
    
    TESTS_DIR="$RELEASE_DIR/tests"
    
    if [ ! -d "$TESTS_DIR" ]; then
        echo "   ❌ BLOCKED: tests/ directory not found"
        echo "   ACTION: QATestingAgent must write tests first"
        return 1
    fi
    
    # Check for test files
    TEST_COUNT=$(find "$TESTS_DIR" -name "*.test.*" -o -name "*.spec.*" | wc -l)
    
    if [ "$TEST_COUNT" -eq 0 ]; then
        echo "   ❌ BLOCKED: No test files found"
        echo "   ACTION: QATestingAgent must write tests first"
        return 1
    fi
    
    echo "   ✅ PASS: Found $TEST_COUNT test files"
    return 0
}

# Gate 3: Backend Before Frontend
validate_backend_complete() {
    echo "🚨 Gate 3: Backend Before Frontend"
    
    BACKEND_DIR="$RELEASE_DIR/implementation/backend"
    
    if [ ! -d "$BACKEND_DIR" ]; then
        echo "   ❌ BLOCKED: Backend implementation not found"
        echo "   ACTION: SeniorBackendAgent must complete backend first"
        return 1
    fi
    
    # Check if backend has files
    BACKEND_FILES=$(find "$BACKEND_DIR" -type f | wc -l)
    
    if [ "$BACKEND_FILES" -eq 0 ]; then
        echo "   ❌ BLOCKED: Backend implementation is empty"
        return 1
    fi
    
    echo "   ✅ PASS: Backend implementation exists ($BACKEND_FILES files)"
    return 0
}

# Gate 4: Contract Validation
validate_contracts_exist() {
    echo "🚨 Gate 4: Contract Validation"
    
    MISSING=0
    
    if [ ! -f "$RELEASE_DIR/API_CONTRACT.md" ]; then
        echo "   ❌ API_CONTRACT.md missing"
        MISSING=1
    else
        echo "   ✅ API_CONTRACT.md exists"
    fi
    
    # Component contract only required if UI work
    if [ -f "$RELEASE_DIR/UX_DESIGN.md" ]; then
        if [ ! -f "$RELEASE_DIR/COMPONENT_CONTRACT.md" ]; then
            echo "   ❌ COMPONENT_CONTRACT.md missing (required for UI work)"
            MISSING=1
        else
            echo "   ✅ COMPONENT_CONTRACT.md exists"
        fi
    fi
    
    if [ $MISSING -eq 1 ]; then
        echo "   ❌ BLOCKED: Contracts incomplete"
        echo "   ACTION: SolutionArchitectAgent must define all contracts"
        return 1
    fi
    
    return 0
}

# Gate 5: All Tests Must Pass
validate_tests_passing() {
    echo "🚨 Gate 5: All Tests Must Pass"
    echo "   ⚠️  Run your test command to verify"
    echo "   Example: pnpm test"
    echo "   ℹ️  This gate requires manual verification or CI integration"
    return 0
}

# Gate 6: Documentation Complete
validate_documentation() {
    echo "🚨 Gate 6: Documentation Complete"
    
    MISSING=0
    REQUIRED_DOCS=(
        "BUSINESS_REQUIREMENTS.md"
        "ARCHITECTURE_DECISIONS.md"
        "TEST_PLAN.md"
    )
    
    for doc in "${REQUIRED_DOCS[@]}"; do
        if [ ! -f "$RELEASE_DIR/$doc" ]; then
            echo "   ❌ $doc missing"
            MISSING=1
        else
            echo "   ✅ $doc exists"
        fi
    done
    
    if [ $MISSING -eq 1 ]; then
        echo "   ❌ BLOCKED: Documentation incomplete"
        return 1
    fi
    
    return 0
}

# Main validation logic based on phase
case $PHASE in
    planning)
        echo "📋 Validating Planning Phase..."
        validate_documentation
        EXIT_CODE=$?
        ;;
    
    ux-design)
        echo "🎨 Validating UX Design Phase..."
        validate_ux_design
        EXIT_CODE=$?
        ;;
    
    architecture)
        echo "🏗️  Validating Architecture Phase..."
        validate_contracts_exist
        EXIT_CODE=$?
        ;;
    
    tdd)
        echo "🧪 Validating TDD Phase..."
        validate_tests_exist
        EXIT_CODE=$?
        ;;
    
    backend)
        echo "💻 Validating Backend Implementation..."
        validate_tests_exist
        validate_contracts_exist
        EXIT_CODE=$?
        ;;
    
    frontend)
        echo "🎨 Validating Frontend Implementation..."
        validate_ux_design
        validate_backend_complete
        validate_tests_exist
        EXIT_CODE=$?
        ;;
    
    validation)
        echo "✅ Validating Release..."
        validate_documentation
        validate_contracts_exist
        validate_tests_exist
        validate_tests_passing
        EXIT_CODE=$?
        ;;
    
    *)
        echo "❌ Unknown phase: $PHASE"
        echo "Valid phases: planning, ux-design, architecture, tdd, backend, frontend, validation"
        exit 1
        ;;
esac

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ All gates passed for $PHASE phase"
    exit 0
else
    echo "❌ Some gates failed for $PHASE phase"
    echo "   Fix issues before proceeding"
    exit 1
fi
