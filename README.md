# krudata

data entry tool and analytics dashboard for jeepney drivers. calculates net take-home pay, logs shift data to google sheets, and visualizes route/financial metrics.

## features
- **collect**: form for drivers to input shift metrics (hours, boundary, fuel, pasahe, misc expenses).
- **dashboard**: live analytics fetching directly from the google sheet, displaying averages, driver demographics, and profitability by route.
- **privacy-focused**: the public dashboard payload strips out all PII (names, addresses, family background) at the Apps Script level.

## stack
- vite + react (typescript)
- tailwind css v4
- shadcn/ui
- lucide-react + recharts

## setup

```bash
npm install
npm run dev
```

create a `.env` file:

```
VITE_GOOGLE_SCRIPT_URL=your_google_apps_script_url
```

## google sheets backend (apps script)

the entire backend is powered by a single Google Sheet and a Google Apps Script.

1. create a new google sheet with the necessary columns matching `DriverRecord`.
2. go to **extensions > apps script**.
3. paste the contents of `google-apps-script.gs` into `Code.gs`.
4. click **deploy > new deployment > web app**.
5. set "execute as" to **me** and "who has access" to **anyone**.
6. click **deploy** and copy the resulting URL into your `.env` file.

*note: if you update the apps script later, you **MUST** select "new deployment" for changes to take effect.*

## formula

```
net = pasahe - (fuel_expense + boundary + misc)
```
