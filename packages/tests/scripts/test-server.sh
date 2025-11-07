#!/bin/bash
# Test Server Manager
# Starts Next.js on port 4000 with test database

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
WEB_APP_DIR="$PROJECT_ROOT/apps/web"
PID_FILE="/tmp/tirdad-test-server.pid"

start_server() {
  echo "🚀 Starting test server on port 4000..."
  
  # Check if server is already running
  if [ -f "$PID_FILE" ]; then
    if ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
      echo "⚠️  Test server already running (PID: $(cat "$PID_FILE"))"
      return 0
    else
      rm -f "$PID_FILE"
    fi
  fi
  
  # Start Next.js dev server with test environment
  cd "$WEB_APP_DIR"
  PORT=4000 TEST_MODE=true DATABASE_URL="${TEST_DATABASE_URL:-postgresql://tirdad_test:tirdad_test_password@localhost:5434/tirdad_test}" \
    pnpm dev > /tmp/tirdad-test-server.log 2>&1 &
  
  SERVER_PID=$!
  echo $SERVER_PID > "$PID_FILE"
  
  echo "⏳ Waiting for server to be ready..."
  for i in {1..30}; do
    if curl -s http://localhost:4000/api/health > /dev/null 2>&1 || \
       curl -s http://localhost:4000 > /dev/null 2>&1; then
      echo "✅ Test server started (PID: $SERVER_PID)"
      return 0
    fi
    sleep 1
  done
  
  echo "❌ Server failed to start. Check logs at /tmp/tirdad-test-server.log"
  stop_server
  exit 1
}

stop_server() {
  echo "🛑 Stopping test server..."
  
  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
      kill $PID 2>/dev/null || true
      sleep 2
      # Force kill if still running
      if ps -p $PID > /dev/null 2>&1; then
        kill -9 $PID 2>/dev/null || true
      fi
      echo "✅ Test server stopped"
    fi
    rm -f "$PID_FILE"
  else
    echo "⚠️  No PID file found"
  fi
}

status_server() {
  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
      echo "✅ Test server running (PID: $PID)"
      return 0
    else
      echo "❌ Test server not running (stale PID file)"
      rm -f "$PID_FILE"
      return 1
    fi
  else
    echo "❌ Test server not running"
    return 1
  fi
}

case "${1:-}" in
  start)
    start_server
    ;;
  stop)
    stop_server
    ;;
  restart)
    stop_server
    sleep 1
    start_server
    ;;
  status)
    status_server
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
