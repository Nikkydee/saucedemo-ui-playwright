# SauceDemo & Restful-booker Automation

Playwright + TypeScript tests covering:

- **UI** – a [SauceDemo](https://www.saucedemo.com) checkout, asserting that the *Item total* equals the sum of the product prices read from the page.
- **API** – a [Restful-booker](https://restful-booker.herokuapp.com) booking that is created and then fetched by id, verifying every field matches what was sent.

## Tech stack

- [Playwright Test](https://playwright.dev/) (TypeScript)
- Node.js 18+
- `dotenv` for local environment configuration
- Allure + Playwright HTML reports

## Project structure

```
.
├── Utils/
│   └── helperMethods.ts          # Price parsing (to cents) and required env var helpers
├── tests/
│   ├── PageObjects/
│   │   ├── PageBase.ts           # Shared page + header elements (title, cart link)
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts      # Product cards: price lookup, add to cart
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts       # Information, overview and complete steps
│   ├── fixtures/
│   │   └── pageFixtures.ts       # Injects page objects into tests
│   └── Tests/
│       ├── API/
│       │   └── booking.spec.ts   # Create booking -> get by id -> compare
│       └── UI/
│           └── checkout.spec.ts  # Login -> add 2 products -> checkout -> item total
├── .env.example                  # Required environment variables
├── playwright.config.ts          # "UI Tests" and "API Tests" projects
└── tsconfig.json
```

## Install and run

```bash
git clone https://github.com/Nikkydee/saucedemo-ui-playwright.git
cd saucedemo-ui-playwright
npm install
npx playwright install chromium
cp .env.example .env              # then set SAUCE_USERNAME=standard_user and SAUCE_PASSWORD=secret_sauce
npm test
```

Other useful commands:

```bash
npm run test:ui                   # UI tests only
npm run test:api                  # API tests only
npx playwright test --headed      # watch the browser
npx playwright show-report        # open the HTML report
npm run test:report               # build a single-file Allure report (see Allure report below)
```

## Allure report (local)

Every test run writes raw results to `allure-results/` through the `allure-playwright` reporter, which `npm install` already installs. To turn those results into a readable HTML report you also need the Allure command-line tool, which runs on Java.

1. **Install Java 8 or newer (17 LTS recommended)** and make sure it is on your `PATH`.

   ```bash
   # macOS (Homebrew)
   brew install openjdk@17
   sudo ln -sfn "$(brew --prefix)/opt/openjdk@17/libexec/openjdk.jdk" /Library/Java/JavaVirtualMachines/openjdk-17.jdk
   ```

   On Windows or Linux, install a JDK (for example [Eclipse Temurin](https://adoptium.net/)). Then set `JAVA_HOME` to the install folder and add `%JAVA_HOME%\bin` (Windows) or `$JAVA_HOME/bin` (Linux) to `PATH`.

   Verify:

   ```bash
   java -version
   ```

2. **Install the Allure CLI globally** (the same version CI uses):

   ```bash
   npm install -g allure-commandline@2.30.0
   ```

   Verify:

   ```bash
   allure --version
   ```

3. **Run the tests and build the report:**

   ```bash
   npm run test:test-report        # runs the tests, then generates the report
   # or, if you already have results in allure-results/:
   npm run test:report
   ```

   This creates a single-file report at `reports/index.html`. Open it in any browser.

   ```bash
   open reports/index.html         # macOS
   start reports/index.html        # Windows
   xdg-open reports/index.html     # Linux
   ```

   If `allure` is not found, the global npm `bin` folder is not on your `PATH`. Run `npm prefix -g` and add its `bin` subfolder to `PATH`. If you see `JAVA_HOME is not set`, repeat step 1.

`allure-results/` and `reports/` are in `.gitignore`, so reports are never committed.

## CI

`.github/workflows/playwright.yml` runs the suite on pushes and pull requests to `main` and uploads the Allure and Playwright reports as build artifacts. Credentials come from the repository secrets `SAUCE_USERNAME` and `SAUCE_PASSWORD`.

## Defects and questionable behaviours

### 1. SauceDemo: an order can be completed with an empty cart

**Severity:** High. The core purchase flow lets a user place an order containing nothing.

**Steps**
1. Log in as `standard_user` / `secret_sauce`.
2. Without adding any product, click the cart icon.
3. Click **Checkout**, enter a first name, last name and postal code, and click **Continue**.
4. Click **Finish**.

**Expected:** Checkout is blocked while the cart is empty (the Checkout button is disabled, or a message such as "Your cart is empty" appears).

**Actual:** The overview shows `Item total: $0` and `Total: $0.00`. Clicking Finish shows "Thank you for your order!"

### 2. Restful-booker: bookings with a checkout date before the checkin date and a negative price are accepted

**Severity:** Medium. Invalid booking data is stored and returned as a valid booking, which would corrupt availability and billing.

**Steps**
1. Send `POST https://restful-booker.herokuapp.com/booking` with headers `Content-Type: application/json` and `Accept: application/json` and this body:
   ```json
   {
     "firstname": "A", "lastname": "B", "totalprice": -50, "depositpaid": true,
     "bookingdates": { "checkin": "2026-12-10", "checkout": "2026-12-01" },
     "additionalneeds": "x"
   }
   ```

**Expected:** `400 Bad Request` with a validation error (checkout must be after checkin, and the price must not be negative).

**Actual:** `200 OK`. The booking is created with a new `bookingid` and the invalid values are stored as sent.

### Other observations

- **SauceDemo:** the checkout information form accepts whitespace-only values (a single space) for first name, last name and postal code.
- **SauceDemo:** the overview formats an empty subtotal as `Item total: $0`, while the total on the same page shows `Total: $0.00`.
- **Restful-booker:** `POST /booking` with required fields missing (for example only `firstname`) returns `500 Internal Server Error` instead of `400 Bad Request`.
