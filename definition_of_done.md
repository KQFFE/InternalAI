# Definition of Done - InternalAI Project

## Code Quality & Testing Requirements

### ✅ **Frontend Requirements**
- **Unit Tests**: Add `.test.js` files in `frontend/src/` alongside components
- **E2E Tests**: Add `.spec.js` files in `frontend/e2e/` for user workflows
- **Code Quality**: Pass ESLint analysis with zero warnings (`npx eslint src/`)
- **Test Coverage**: Maintain/improve coverage reported to codecov
- **Build Success**: React build completes without errors (`npm run build`)

### ✅ **Backend Requirements** 
- **Unit Tests**: Add `test_*.py` files in `backend/` directory
- **Unit Tests**: Add `test_*.py` files in `backend/tests/` directory
- **API Tests**: Test all endpoints and business logic
- **Security Scan**: Pass bandit security analysis 
- **Code Coverage**: Maintain/improve backend coverage with pytest-cov
- **Dependencies**: Updated `requirements.txt` if new packages added

### ✅ **Code Review Process**
- **Pull Request**: All changes submitted via PR to `main` branch
- **Review Required**: Minimum 1 code reviewer approval before merge
- **Review Checklist**:
  - Code follows project patterns and conventions
  - Tests cover new functionality and edge cases
  - Documentation updated for API changes
  - No hardcoded secrets or sensitive data

## CI/CD Pipeline Requirements

### ✅ **Automated Checks (Must Pass)**
- **Frontend**: ESLint analysis, Jest unit tests, Playwright e2e tests
- **Backend**: pytest unit tests, bandit security scan
- **Coverage**: Both frontend and backend coverage reports uploaded
- **Build**: React production build succeeds
- **Integration**: Flask serves React app correctly

### ✅ **Deployment Criteria**
- **Branch**: Only `main` branch triggers deployment
- **Tests**: All pipeline tests pass (no failures allowed)
- **Azure**: Successful deployment to `qss-ai-webapp.azurewebsites.net`
- **Health Check**: `/api/health` endpoint responds correctly
- **Verification**: Deployed app functions as expected

## Documentation Requirements

### ✅ **Update When Required**
- **README.md**: Project setup, new features, or architectural changes
- **API Documentation**: New endpoints or changed request/response formats
- **Team Data**: Updated `team.json` for team changes
- **Dependencies**: Document new tools or libraries in README

## Acceptance Criteria

### ✅ **Feature Complete**
- **Functionality**: Feature works as specified in user story/requirements
- **Cross-browser**: Tested in major browsers (Chrome, Firefox, Safari, Edge)
- **Responsive**: Works on mobile, tablet, and desktop viewports
- **Accessibility**: Follows basic accessibility guidelines
- **Performance**: No significant performance regressions

### ✅ **Ready for Production**
- **No Debug Code**: Remove console.logs, debug statements, test data
- **Error Handling**: Proper error messages and graceful failure handling
- **Security**: No exposed secrets, proper input validation
- **Monitoring**: Appropriate logging for troubleshooting

## Pre-Merge Checklist

**Developer Responsibilities:**
- [ ] All tests written and passing locally
- [ ] Code linted and formatted
- [ ] Documentation updated
- [ ] No merge conflicts with main
- [ ] Feature tested in development environment

**Code Reviewer Responsibilities:**
- [ ] Code quality and maintainability reviewed
- [ ] Test coverage adequate for changes
- [ ] Security considerations addressed
- [ ] Documentation complete and accurate
- [ ] Approval given before merge

**CI/CD Pipeline Validation:**
- [ ] GitHub Actions workflow completes successfully
- [ ] All automated tests pass
- [ ] Security scans show no critical issues
- [ ] Deployment to Azure succeeds
- [ ] Post-deployment verification successful

---

**Note**: This DoD ensures consistent quality across all AI service integrations while maintaining the reliability of our GitHub + Azure CI/CD pipeline.