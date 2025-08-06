#!/bin/bash
# run_all_tests.sh - InternalAI Test Suite (Matching CI/CD Pipeline)
# Runs the same commands as GitHub Actions pipeline
# Usage: ./run_all_tests.sh

echo "🧪 InternalAI CI/CD Test Suite"
echo "=============================="
echo "📅 Started: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track results
FRONTEND_UNIT_EXIT=0
FRONTEND_E2E_EXIT=0
FRONTEND_LINT_EXIT=0
BACKEND_TEST_EXIT=0

# Check if we're in the right directory
if [ ! -f "backend/app.py" ] || [ ! -f "frontend/package.json" ]; then
    echo -e "${RED}❌ Error: Must be run from InternalAI project root${NC}"
    echo "Expected structure:"
    echo "  - backend/app.py"
    echo "  - frontend/package.json"
    exit 1
fi

echo "🏗️ Project Structure Verified"
echo "   ✅ backend/app.py found"
echo "   ✅ frontend/package.json found"
echo ""

# ================================
# FRONTEND TESTS
# ================================
echo -e "${BLUE}⚛️ Frontend Testing Phase${NC}"
echo "=========================="

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        exit 1
    fi
fi

# 1. Frontend Unit Tests with Coverage
echo ""
echo "🧪 Step 1/4: Running Frontend Unit Tests with Coverage"
echo "Command: npm test -- --coverage --watchAll=false"
echo "-------------------------------------------------------"
npm test -- --coverage --watchAll=false
FRONTEND_UNIT_EXIT=$?

if [ $FRONTEND_UNIT_EXIT -eq 0 ]; then
    echo -e "✅ ${GREEN}Frontend unit tests passed${NC}"
else
    echo -e "❌ ${RED}Frontend unit tests failed${NC}"
fi

# 2. End-to-End Tests
echo ""
echo "🎭 Step 2/4: Running End-to-End Tests"
echo "Command: npm run test:e2e"
echo "------------------------------------"
npm run test:e2e
FRONTEND_E2E_EXIT=$?

if [ $FRONTEND_E2E_EXIT -eq 0 ]; then
    echo -e "✅ ${GREEN}E2E tests passed${NC}"
else
    echo -e "❌ ${RED}E2E tests failed${NC}"
fi

# 3. ESLint Code Quality
echo ""
echo "🔍 Step 3/4: Running ESLint Code Quality Check"
echo "Command: npx eslint src/ --format=compact --max-warnings=0"
echo "-------------------------------------------------------------"
npx eslint src/ --format=compact --max-warnings=0
FRONTEND_LINT_EXIT=$?

if [ $FRONTEND_LINT_EXIT -eq 0 ]; then
    echo -e "✅ ${GREEN}ESLint checks passed${NC}"
else
    echo -e "❌ ${RED}ESLint checks failed${NC}"
fi

cd ..

# ================================
# BACKEND TESTS
# ================================
echo ""
echo -e "${BLUE}🐍 Backend Testing Phase${NC}"
echo "======================="

cd backend

# Check if virtual environment exists
if [ ! -d "../.venv" ]; then
    echo -e "${YELLOW}⚠️ Virtual environment not found. Creating one...${NC}"
    cd ..
    python -m venv .venv
    cd backend
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source ../.venv/bin/activate

# Install/update dependencies
echo "📦 Installing/updating backend dependencies..."
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

# 4. Backend Tests
echo ""
echo "🧪 Step 4/4: Running Backend Tests"
echo "Command: pytest"
echo "-----------------"
pytest

BACKEND_TEST_EXIT=$?

if [ $BACKEND_TEST_EXIT -eq 0 ]; then
    echo -e "✅ ${GREEN}Backend tests passed${NC}"
else
    echo -e "❌ ${RED}Backend tests failed${NC}"
fi

cd ..

# ================================
# SUMMARY REPORT
# ================================
echo ""
echo "📋 CI/CD Pipeline Test Results"
echo "=============================="
echo "📅 Completed: $(date)"
echo ""

# Test Results Summary
echo "🧪 Test Results:"
echo "--------------"

if [ $FRONTEND_UNIT_EXIT -eq 0 ]; then
    echo -e "✅ Frontend Unit Tests: ${GREEN}PASSED${NC}"
else
    echo -e "❌ Frontend Unit Tests: ${RED}FAILED${NC}"
fi

if [ $FRONTEND_E2E_EXIT -eq 0 ]; then
    echo -e "✅ Frontend E2E Tests: ${GREEN}PASSED${NC}"
else
    echo -e "❌ Frontend E2E Tests: ${RED}FAILED${NC}"
fi

if [ $FRONTEND_LINT_EXIT -eq 0 ]; then
    echo -e "✅ Frontend Linting: ${GREEN}PASSED${NC}"
else
    echo -e "❌ Frontend Linting: ${RED}FAILED${NC}"
fi

if [ $BACKEND_TEST_EXIT -eq 0 ]; then
    echo -e "✅ Backend Tests: ${GREEN}PASSED${NC}"
else
    echo -e "❌ Backend Tests: ${RED}FAILED${NC}"
fi

# Coverage Reports
echo ""
echo "📊 Coverage Reports Available:"
echo "----------------------------"

if [ -f "frontend/coverage/lcov-report/index.html" ]; then
    echo "⚛️ Frontend Coverage: frontend/coverage/lcov-report/index.html"
fi

if [ -f "backend/htmlcov/index.html" ]; then
    echo "🐍 Backend Coverage: backend/htmlcov/index.html"
elif [ -f "backend/.coverage" ]; then
    echo "🐍 Backend Coverage: Run 'pytest --cov=. --cov-report=html' in backend/"
fi

# Overall Result
echo ""
TOTAL_FAILED=$((FRONTEND_UNIT_EXIT + FRONTEND_E2E_EXIT + FRONTEND_LINT_EXIT + BACKEND_TEST_EXIT))

if [ $TOTAL_FAILED -eq 0 ]; then
    echo -e "🎉 ${GREEN}ALL TESTS PASSED!${NC} Pipeline would succeed ✅"
    echo ""
    echo "🚀 Ready for deployment:"
    echo "   git add ."
    echo "   git commit -m \"Add comprehensive admin tests\""
    echo "   git push origin main"
    echo ""
    exit 0
else
    echo -e "⚠️ ${RED}$TOTAL_FAILED TEST PHASE(S) FAILED${NC} Pipeline would fail ❌"
    echo ""
    echo "🔧 Debugging Tips:"
    
    if [ $FRONTEND_UNIT_EXIT -ne 0 ]; then
        echo "   📍 Frontend Unit Tests:"
        echo "      - Check test output above for specific failures"
        echo "      - Try: cd frontend && npm test"
    fi
    
    if [ $FRONTEND_E2E_EXIT -ne 0 ]; then
        echo "   📍 Frontend E2E Tests:"
        echo "      - Check if backend is running during E2E tests"
        echo "      - Try: cd frontend && npm run test:e2e"
    fi
    
    if [ $FRONTEND_LINT_EXIT -ne 0 ]; then
        echo "   📍 Frontend Linting:"
        echo "      - Fix ESLint errors shown above"
        echo "      - Try: cd frontend && npx eslint src/ --fix"
    fi
    
    if [ $BACKEND_TEST_EXIT -ne 0 ]; then
        echo "   📍 Backend Tests:"
        echo "      - Check pytest output above"
        echo "      - Try: cd backend && source ../.venv/bin/activate && pytest -v"
    fi
    
    echo ""
    echo "💡 Run individual commands to debug specific failures"
    echo ""
    exit 1
fi