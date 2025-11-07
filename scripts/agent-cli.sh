#!/bin/bash
# Agent CLI Helper
# Manage AI agent state and workflow

set -e

AGENT_STATE_DIR=".agent-state"
CURRENT_RELEASE_FILE="$AGENT_STATE_DIR/current-release.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Command: status
cmd_status() {
    echo "📊 Agent Status"
    echo ""
    
    if [ ! -f "$CURRENT_RELEASE_FILE" ]; then
        print_warning "No active release"
        echo "Run: ./agent-cli.sh start <RELEASE>"
        return
    fi
    
    # Read JSON (requires jq)
    if command -v jq &> /dev/null; then
        CURRENT_RELEASE=$(jq -r '.current_release // "null"' "$CURRENT_RELEASE_FILE")
        PHASE=$(jq -r '.phase // "idle"' "$CURRENT_RELEASE_FILE")
        ACTIVE_AGENT=$(jq -r '.active_agent // "null"' "$CURRENT_RELEASE_FILE")
        NEXT_TASK=$(jq -r '.next_task // "None"' "$CURRENT_RELEASE_FILE")
        PROGRESS=$(jq -r '.progress_percentage // 0' "$CURRENT_RELEASE_FILE")
        BLOCKED=$(jq -r '.blocked // false' "$CURRENT_RELEASE_FILE")
        
        echo "📍 Current Release: $CURRENT_RELEASE"
        echo "🔄 Phase: $PHASE"
        echo "🤖 Active Agent: $ACTIVE_AGENT"
        echo "📝 Next Task: $NEXT_TASK"
        echo "📊 Progress: $PROGRESS%"
        
        if [ "$BLOCKED" = "true" ]; then
            BLOCKING_REASON=$(jq -r '.blocking_reason // "Unknown"' "$CURRENT_RELEASE_FILE")
            print_error "BLOCKED: $BLOCKING_REASON"
        else
            print_success "Not blocked"
        fi
    else
        print_warning "Install jq for better status display"
        cat "$CURRENT_RELEASE_FILE"
    fi
}

# Command: start
cmd_start() {
    RELEASE=$1
    
    if [ -z "$RELEASE" ]; then
        print_error "Usage: ./agent-cli.sh start <RELEASE>"
        echo "Example: ./agent-cli.sh start R1-FOUNDATION"
        exit 1
    fi
    
    if [ ! -d "releases/$RELEASE" ]; then
        print_error "Release directory not found: releases/$RELEASE"
        exit 1
    fi
    
    print_info "Starting release: $RELEASE"
    
    # Update agent state
    cat > "$CURRENT_RELEASE_FILE" << EOF
{
  "current_release": "$RELEASE",
  "phase": "planning",
  "active_agent": "BusinessOwnerAgent",
  "next_task": "Create business requirements",
  "progress_percentage": 0,
  "blocked": false,
  "blocking_reason": null,
  "last_updated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "notes": "Release started. BusinessOwnerAgent should create BUSINESS_REQUIREMENTS.md"
}
EOF
    
    print_success "Release $RELEASE started"
    print_info "Next: BusinessOwnerAgent creates business requirements"
}

# Command: validate
cmd_validate() {
    RELEASE=$1
    PHASE=$2
    
    if [ -z "$RELEASE" ] || [ -z "$PHASE" ]; then
        print_error "Usage: ./agent-cli.sh validate <RELEASE> <PHASE>"
        echo "Example: ./agent-cli.sh validate R1-FOUNDATION planning"
        exit 1
    fi
    
    if [ -f "scripts/validate-gates.sh" ]; then
        ./scripts/validate-gates.sh "$RELEASE" "$PHASE"
    else
        print_error "Validation script not found"
        exit 1
    fi
}

# Command: handoff
cmd_handoff() {
    TO_AGENT=$1
    
    if [ -z "$TO_AGENT" ]; then
        print_error "Usage: ./agent-cli.sh handoff <AGENT>"
        echo "Available agents:"
        echo "  - BusinessOwnerAgent"
        echo "  - UXAgent"
        echo "  - SolutionArchitectAgent"
        echo "  - QATestingAgent"
        echo "  - SeniorBackendAgent"
        echo "  - SeniorFrontendAgent"
        echo "  - ReviewerAgent"
        exit 1
    fi
    
    if [ ! -f "$CURRENT_RELEASE_FILE" ]; then
        print_error "No active release. Start one first."
        exit 1
    fi
    
    print_info "Handing off to: $TO_AGENT"
    
    # Update agent state (requires jq)
    if command -v jq &> /dev/null; then
        TEMP_FILE=$(mktemp)
        jq ".active_agent = \"$TO_AGENT\" | .last_updated = \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"" "$CURRENT_RELEASE_FILE" > "$TEMP_FILE"
        mv "$TEMP_FILE" "$CURRENT_RELEASE_FILE"
        print_success "Handed off to $TO_AGENT"
    else
        print_error "jq required for handoff. Install with: brew install jq"
        exit 1
    fi
}

# Command: blockers
cmd_blockers() {
    RELEASE=${1:-$(jq -r '.current_release // "null"' "$CURRENT_RELEASE_FILE" 2>/dev/null)}
    
    if [ "$RELEASE" = "null" ] || [ -z "$RELEASE" ]; then
        print_error "No active release"
        exit 1
    fi
    
    echo "🚨 Checking blockers for $RELEASE"
    echo ""
    
    PROGRESS_FILE="releases/$RELEASE/PROGRESS.md"
    
    if [ ! -f "$PROGRESS_FILE" ]; then
        print_warning "Progress file not found"
        exit 1
    fi
    
    # Extract blockers section
    if grep -q "## 🚨 Blockers" "$PROGRESS_FILE"; then
        echo "Found blockers:"
        sed -n '/## 🚨 Blockers/,/##/p' "$PROGRESS_FILE" | head -n -1
    else
        print_success "No blockers found"
    fi
}

# Command: help
cmd_help() {
    echo "🤖 Agent CLI Helper"
    echo ""
    echo "Usage: ./agent-cli.sh <command> [options]"
    echo ""
    echo "Commands:"
    echo "  status                      View current agent status"
    echo "  start <RELEASE>             Start a new release"
    echo "  validate <RELEASE> <PHASE>  Validate gates for a phase"
    echo "  handoff <AGENT>             Force handoff to specific agent"
    echo "  blockers [RELEASE]          Show current blockers"
    echo "  help                        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./agent-cli.sh status"
    echo "  ./agent-cli.sh start R1-FOUNDATION"
    echo "  ./agent-cli.sh validate R1-FOUNDATION planning"
    echo "  ./agent-cli.sh handoff UXAgent"
    echo "  ./agent-cli.sh blockers"
    echo ""
    echo "Requirements:"
    echo "  - jq (brew install jq) - for JSON operations"
    echo ""
}

# Main command dispatcher
COMMAND=${1:-help}

case $COMMAND in
    status)
        cmd_status
        ;;
    start)
        shift
        cmd_start "$@"
        ;;
    validate)
        shift
        cmd_validate "$@"
        ;;
    handoff)
        shift
        cmd_handoff "$@"
        ;;
    blockers)
        shift
        cmd_blockers "$@"
        ;;
    help|--help|-h)
        cmd_help
        ;;
    *)
        print_error "Unknown command: $COMMAND"
        echo ""
        cmd_help
        exit 1
        ;;
esac
