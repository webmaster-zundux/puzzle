# Playwright Test Project

## Inside that directory, you can run several commands

`npx playwright test`
Runs the end-to-end tests.

`npx playwright test --ui`
Starts the interactive UI mode.

`npx playwright test --project=chromium`
Runs the tests only on Desktop Chrome.

`npx playwright test example`
Runs the tests in a specific file.

`npx playwright test --debug`
Runs the tests in debug mode.

`npx playwright codegen`
Auto generate tests with Codegen.

`npx playwright show-report`
Open last HTML report run.

### We suggest that you begin by typing

`npx playwright test`

or

`npx playwright test --ui`

### And check out the following files

- `./e2e/example.spec.ts` - Example end-to-end test
- `./tests-examples/demo-todo-app.spec.ts` - Demo Todo App end-to-end tests
- `./playwright.config.ts` - Playwright Test configuration

## Init new test project

`npm init playwright@latest`

### Install Playwright browsers

`npx playwright install`

### Install Playwright operating system dependencies

`sudo npx playwright install-deps`

## Updating Playwright

`npm install -D @playwright/test@latest`

### Also download new browser binaries and their dependencies

`npx playwright install --with-deps`

## Print version of Playwright

`npx playwright --version`
