/**
 * google apps script - doPost handler for krudata
 *
 * setup:
 * 1. open google sheets > extensions > apps script
 * 2. paste this code into Code.gs
 * 3. click deploy > new deployment > web app
 * 4. set "who has access" to "anyone"
 * 5. copy the web app url and set it as VITE_GOOGLE_SCRIPT_URL in your .env file
 */

function doPost(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
        sheet.appendRow([
            "timestamp",
            "name",
            "age",
            "address",
            "family_background",
            "jeep_owned",
            "years_driving",
            "medical_history",
            "route",
            "hours",
            "boundary",
            "fuel_expense",
            "pasahe",
            "misc",
            "trip_rounds",
            "net_take_home"
        ]);
    }

    sheet.appendRow([
        data.timestamp,
        data.name,
        data.age,
        data.address,
        data.family_background,
        data.jeep_owned,
        data.years_driving,
        data.medical_history,
        data.route,
        data.hours,
        data.boundary,
        data.fuel_expense,
        data.pasahe,
        data.misc,
        data.trip_rounds,
        data.net_take_home
    ]);

    return ContentService
        .createTextOutput(JSON.stringify({ status: "success" }))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * doGet - returns all sheet data as JSON for the dashboard
 * strips PII fields (name, address, family_background)
 *
 * IMPORTANT: after adding this, you must create a NEW deployment
 * (deploy > new deployment > web app) for the GET endpoint to work
 */
function doGet() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
        return ContentService
            .createTextOutput(JSON.stringify([]))
            .setMimeType(ContentService.MimeType.JSON);
    }

    var headers = data[0];
    var records = [];

    for (var i = 1; i < data.length; i++) {
        var row = {};
        for (var j = 0; j < headers.length; j++) {
            row[headers[j]] = data[i][j];
        }

        // only return analytics fields - no PII
        records.push({
            timestamp: row.timestamp || "",
            age: Number(row.age) || 0,
            jeep_owned: String(row.jeep_owned).toLowerCase() === "yes" || String(row.jeep_owned).toLowerCase() === "true",
            years_driving: Number(row.years_driving) || 0,
            medical_history: row.medical_history || "none",
            route: row.route || "",
            hours: Number(row.hours) || 0,
            boundary: Number(row.boundary) || 0,
            fuel_expense: Number(row.fuel_expense) || 0,
            pasahe: Number(row.pasahe) || 0,
            misc: Number(row.misc) || 0,
            trip_rounds: Number(row.trip_rounds) || 0,
            net_take_home: Number(row.net_take_home) || 0
        });
    }

    return ContentService
        .createTextOutput(JSON.stringify(records))
        .setMimeType(ContentService.MimeType.JSON);
}
