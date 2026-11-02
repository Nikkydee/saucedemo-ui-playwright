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
git clone <repo-url>
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
npm run test:report               # build a single-file Allure report (requires the Allure CLI)
```

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
