# Testing Guide - Ganapatih-FE

## Panduan Lengkap Testing untuk Project

Dokumen ini menjelaskan cara menjalankan dan menulis tests untuk project Ganapatih-FE.

---

## Daftar Isi

1. [Setup Testing Environment](#setup-testing-environment)
2. [Menjalankan Tests](#menjalankan-tests)
3. [Manual Testing](#manual-testing)
4. [Automated Testing](#automated-testing)
5. [Best Practices](#best-practices)
6. [CI/CD Integration](#cicd-integration)

---

## Setup Testing Environment

### 1. Install Dependencies

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

### 2. Verify Jest Configuration

File `jest.config.js` sudah tersedia di root project dengan konfigurasi:
- Test environment: jsdom
- Module mapper untuk path aliases
- Coverage thresholds: 70%

### 3. Verify Setup File

File `jest.setup.js` sudah include mock untuk:
- window.matchMedia
- IntersectionObserver
- @testing-library/jest-dom matchers

---

## Menjalankan Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Specific Test File

```bash
npm test -- post-form.test.tsx
```

### Run Tests Matching Pattern

```bash
npm test -- --testNamePattern="should render"
```

---

## Manual Testing

### Checklist untuk Manual Testing

File `TEST_CASES.md` berisi 39 test cases yang dapat dijalankan secara manual, mencakup:

#### 1. Authentication Tests (6 tests)
- ✅ TC-AUTH-001: User Registration
- ✅ TC-AUTH-002: User Login (Valid)
- ✅ TC-AUTH-003: User Login (Invalid)
- ✅ TC-AUTH-004: Form Validation
- ✅ TC-AUTH-005: Session Persistence
- ✅ TC-AUTH-006: Logout Functionality

#### 2. Dashboard Tests (3 tests)
- ✅ TC-DASH-001: Dashboard Loading
- ✅ TC-DASH-002: Responsive Layout
- ✅ TC-DASH-003: Navigation Guard

#### 3. Post Management Tests (8 tests)
- ✅ TC-POST-001 to TC-POST-008

#### 4. Follow System Tests (5 tests)
- ✅ TC-FOLLOW-001 to TC-FOLLOW-005

#### 5. UI/UX Tests (7 tests)
- ✅ TC-UI-001 to TC-UI-007

#### 6. Performance Tests (5 tests)
- ✅ TC-PERF-001 to TC-PERF-005

#### 7. Security Tests (5 tests)
- ✅ TC-SEC-001 to TC-SEC-005

### Cara Menjalankan Manual Tests

1. **Buka file TEST_CASES.md**
2. **Pilih test case yang ingin dijalankan**
3. **Ikuti Test Steps yang tertera**
4. **Bandingkan hasil dengan Expected Result**
5. **Update status test (PASSED/FAILED)**
6. **Catat notes jika diperlukan**

---

## Automated Testing

### Test Structure

```
__tests__/
├── components/
│   ├── post-form.test.tsx       # 10 test cases
│   └── follow-panel.test.tsx    # 10 test cases
└── integration/
    └── auth-flow.test.tsx       # 10 test cases
```

### Available Test Files

#### 1. Post Form Tests (`__tests__/components/post-form.test.tsx`)

**Coverage:**
- Render component
- Character counter
- Character limit validation
- Submit valid post
- Prevent empty post
- Clear button
- Loading state
- Character counter color
- Trim whitespace
- Clear after submit

**Run:**
```bash
npm test post-form.test.tsx
```

#### 2. Follow Panel Tests (`__tests__/components/follow-panel.test.tsx`)

**Coverage:**
- Render component
- Minimum character validation
- Search functionality
- Display results
- Follow button
- Unfollow button
- Empty results
- Error handling
- Loading state
- Button disabled state

**Run:**
```bash
npm test follow-panel.test.tsx
```

#### 3. Authentication Flow Tests (`__tests__/integration/auth-flow.test.tsx`)

**Coverage:**
- Complete registration
- Complete login
- Invalid credentials
- Session persistence
- Logout flow
- Protected routes
- Token validation
- Expired tokens
- Concurrent requests
- Re-authentication

**Run:**
```bash
npm test auth-flow.test.tsx
```

### Writing New Tests

#### Template untuk Component Test

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { YourComponent } from '@/components/your-component';
import '@testing-library/jest-dom';

describe('YourComponent', () => {
  test('should do something', () => {
    render(<YourComponent />);
    
    // Your test logic here
    expect(screen.getByText('Something')).toBeInTheDocument();
  });
});
```

#### Template untuk Integration Test

```typescript
describe('Feature Integration Tests', () => {
  beforeEach(() => {
    // Setup
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should complete full flow', async () => {
    // Arrange
    const mockData = { /* ... */ };
    
    // Act
    // ... perform actions
    
    // Assert
    await waitFor(() => {
      expect(/* ... */).toBe(/* ... */);
    });
  });
});
```

---

## Best Practices

### 1. Test Naming

✅ **Good:**
```typescript
test('should display error message when username is empty', () => {})
```

❌ **Bad:**
```typescript
test('error test', () => {})
```

### 2. Arrange-Act-Assert Pattern

```typescript
test('example', () => {
  // Arrange
  const mockData = { id: 1, name: 'Test' };
  
  // Act
  render(<Component data={mockData} />);
  
  // Assert
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### 3. Mock External Dependencies

```typescript
jest.mock('@/lib/api', () => ({
  apiFetch: jest.fn(),
}));
```

### 4. Clean Up After Tests

```typescript
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
```

### 5. Use Testing Library Queries

**Priority:**
1. `getByRole` - Most accessible
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Inputs
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

### 6. Async Testing

```typescript
test('async operation', async () => {
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

---

## Coverage Goals

### Target Coverage
- **Lines:** 70%
- **Functions:** 70%
- **Branches:** 70%
- **Statements:** 70%

### View Coverage Report

```bash
npm test -- --coverage
```

Coverage report akan di-generate di folder `coverage/lcov-report/index.html`

### Exclude from Coverage

Files yang di-exclude dari coverage (sudah di-set di jest.config.js):
- `*.d.ts` - Type definitions
- `*.stories.*` - Storybook files
- `__tests__/**` - Test files

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test -- --coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Test Reports

### Generate Test Report

```bash
npm test -- --json --outputFile=test-results.json
```

### View Test Results

Test results akan tersedia di:
- Console output
- `test-results.json` (if generated)
- Coverage report: `coverage/lcov-report/index.html`

---

## Troubleshooting

### Common Issues

#### 1. "Cannot find module '@/...'"

**Solution:** Check `jest.config.js` moduleNameMapper

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

#### 2. "window is not defined"

**Solution:** Use `jest-environment-jsdom`

```javascript
testEnvironment: 'jest-environment-jsdom'
```

#### 3. "localStorage is not defined"

**Solution:** Mock localStorage in `jest.setup.js`

```javascript
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
```

#### 4. Async tests timeout

**Solution:** Increase timeout

```typescript
test('long running test', async () => {
  // test code
}, 10000); // 10 seconds timeout
```

---

## Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Tools
- [Jest](https://jestjs.io/) - Testing framework
- [React Testing Library](https://testing-library.com/) - React testing utilities
- [Playwright](https://playwright.dev/) - E2E testing (recommended for future)
- [Cypress](https://www.cypress.io/) - E2E testing (alternative)

---

## Summary

### Current Test Coverage

| Category | Files | Tests | Status |
|----------|-------|-------|--------|
| Component Tests | 2 | 20 | ✅ Ready |
| Integration Tests | 1 | 10 | ✅ Ready |
| Manual Tests | 1 | 39 | ✅ Documented |
| **Total** | **4** | **69** | **✅ Complete** |

### Quick Commands

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific file
npm test post-form.test.tsx

# Run with pattern
npm test -- --testNamePattern="should render"
```

### Next Steps

1. ✅ Manual testing menggunakan TEST_CASES.md
2. ✅ Run automated tests: `npm test`
3. ✅ Check coverage: `npm test -- --coverage`
4. 📝 Update test status di TEST_CASES.md
5. 📊 Generate dan share test report

---

**Last Updated:** October 21, 2025  
**Maintainer:** QA Team  
**Version:** 1.0.0

