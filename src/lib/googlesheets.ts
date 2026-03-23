const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "";

export interface SheetPayload {
    timestamp: string;
    name: string;
    age: number;
    address: string;
    family_background: string;
    jeep_owned: string;
    years_driving: number;
    medical_history: string;
    route: string;
    hours: number;
    boundary: number;
    fuel_expense: number;
    pasahe: number;
    misc: number;
    trip_rounds: number;
    net_take_home: number;
}

export async function submitToGoogleSheets(data: SheetPayload): Promise<void> {
    if (!GOOGLE_SCRIPT_URL) {
        throw new Error("GOOGLE_SCRIPT_URL is not set");
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
        mode: "no-cors",
    });

    // google apps script with no-cors returns opaque response
    // we can't read the body, but if fetch didn't throw, we assume success
    if (response.type === "opaque") {
        return;
    }

    if (!response.ok) {
        throw new Error(`submission failed: ${response.statusText}`);
    }
}

export async function fetchDriverData(): Promise<import("@/data/drivers").DriverRecord[]> {
    if (!GOOGLE_SCRIPT_URL) {
        throw new Error("GOOGLE_SCRIPT_URL is not set");
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "GET",
        redirect: "follow",
    });

    if (!response.ok) {
        throw new Error(`fetch failed: ${response.statusText}`);
    }

    return response.json();
}
