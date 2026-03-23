import { useState, useEffect, useMemo, useCallback } from "react";
import { type DriverRecord } from "@/data/drivers";
import { fetchDriverData } from "@/lib/googlesheets";

export interface RouteStats {
    route: string;
    count: number;
    avgGross: number;
    avgFuel: number;
    avgBoundary: number;
    avgMisc: number;
    avgNet: number;
    avgHours: number;
    avgTrips: number;
    totalExpenseRate: number;
}

export interface AgeGroup {
    label: string;
    count: number;
}

export interface ExperienceGroup {
    label: string;
    count: number;
}

export interface ScatterPoint {
    name: string;
    yearsDriving: number;
    netTakeHome: number;
    jeepOwned: boolean;
}

export interface CostBreakdown {
    name: string;
    value: number;
    fill: string;
}

export interface SummaryStats {
    totalDrivers: number;
    avgNet: number;
    avgHours: number;
    ownershipRate: number;
    avgAge: number;
    avgYearsDriving: number;
    minNet: number;
    maxNet: number;
}

function avg(nums: number[]): number {
    if (nums.length === 0) return 0;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function computeAnalytics(data: DriverRecord[]) {
    // summary stats
    const summary: SummaryStats = {
        totalDrivers: data.length,
        avgNet: Math.round(avg(data.map((d) => d.net_take_home))),
        avgHours: Math.round(avg(data.filter((d) => d.hours > 0).map((d) => d.hours)) * 10) / 10,
        ownershipRate: Math.round((data.filter((d) => d.jeep_owned).length / data.length) * 100),
        avgAge: Math.round(avg(data.map((d) => d.age))),
        avgYearsDriving: Math.round(avg(data.map((d) => d.years_driving))),
        minNet: Math.min(...data.map((d) => d.net_take_home)),
        maxNet: Math.max(...data.map((d) => d.net_take_home)),
    };

    // route stats
    const routeMap = new Map<string, DriverRecord[]>();
    for (const d of data) {
        const existing = routeMap.get(d.route) || [];
        existing.push(d);
        routeMap.set(d.route, existing);
    }

    const routeStats: RouteStats[] = Array.from(routeMap.entries())
        .map(([route, drivers]) => {
            const avgGross = Math.round(avg(drivers.map((d) => d.pasahe)));
            const avgFuel = Math.round(avg(drivers.map((d) => d.fuel_expense)));
            const avgBoundary = Math.round(avg(drivers.map((d) => d.boundary)));
            const avgMisc = Math.round(avg(drivers.map((d) => d.misc)));
            const avgNet = Math.round(avg(drivers.map((d) => d.net_take_home)));
            const totalExpenses = avgFuel + avgBoundary + avgMisc;
            return {
                route,
                count: drivers.length,
                avgGross,
                avgFuel,
                avgBoundary,
                avgMisc,
                avgNet,
                avgHours: Math.round(avg(drivers.filter((d) => d.hours > 0).map((d) => d.hours)) * 10) / 10,
                avgTrips: Math.round(avg(drivers.map((d) => d.trip_rounds)) * 10) / 10,
                totalExpenseRate: avgGross > 0 ? Math.round((totalExpenses / avgGross) * 100) : 0,
            };
        })
        .sort((a, b) => b.avgNet - a.avgNet);

    // cost breakdown
    const costBreakdown: CostBreakdown[] = [
        { name: "fuel", value: Math.round(avg(data.map((d) => d.fuel_expense))), fill: "var(--color-fuel)" },
        { name: "boundary", value: Math.round(avg(data.map((d) => d.boundary))), fill: "var(--color-boundary)" },
        { name: "misc", value: Math.round(avg(data.map((d) => d.misc))), fill: "var(--color-misc)" },
        { name: "net take-home", value: Math.round(avg(data.map((d) => d.net_take_home))), fill: "var(--color-net)" },
    ];

    // age distribution
    const ageGroups: AgeGroup[] = [
        { label: "20-35", count: data.filter((d) => d.age >= 20 && d.age <= 35).length },
        { label: "36-50", count: data.filter((d) => d.age >= 36 && d.age <= 50).length },
        { label: "51-65", count: data.filter((d) => d.age >= 51 && d.age <= 65).length },
        { label: "65+", count: data.filter((d) => d.age > 65).length },
    ];

    // experience groups
    const experienceGroups: ExperienceGroup[] = [
        { label: "0-5 yrs", count: data.filter((d) => d.years_driving <= 5).length },
        { label: "6-15 yrs", count: data.filter((d) => d.years_driving >= 6 && d.years_driving <= 15).length },
        { label: "16-30 yrs", count: data.filter((d) => d.years_driving >= 16 && d.years_driving <= 30).length },
        { label: "30+ yrs", count: data.filter((d) => d.years_driving > 30).length },
    ];

    // ownership
    const ownerCount = data.filter((d) => d.jeep_owned).length;
    const renterCount = data.length - ownerCount;

    // medical conditions
    const medicalMap = new Map<string, number>();
    for (const d of data) {
        const condition = d.medical_history.trim() || "none";
        const normalized = condition.charAt(0) + condition.slice(1).toLowerCase();
        const key = normalized === "none" || normalized === "normal" ? "none" : normalized;
        medicalMap.set(key, (medicalMap.get(key) || 0) + 1);
    }
    const medicalConditions = Array.from(medicalMap.entries())
        .map(([condition, count]) => ({ condition, count }))
        .sort((a, b) => b.count - a.count);

    // scatter
    const scatterData: ScatterPoint[] = data.map((d) => ({
        name: d.route,
        yearsDriving: d.years_driving,
        netTakeHome: d.net_take_home,
        jeepOwned: d.jeep_owned,
    }));

    // earnings by route
    const earningsByRoute = routeStats.map((r) => ({
        route: r.route,
        net: r.avgNet,
        gross: r.avgGross,
    }));

    return {
        data,
        summary,
        routeStats,
        costBreakdown,
        ageGroups,
        experienceGroups,
        ownerCount,
        renterCount,
        medicalConditions,
        scatterData,
        earningsByRoute,
    };
}

let cachedRecords: DriverRecord[] | null = null;
let fetchPromise: Promise<DriverRecord[]> | null = null;

/**
 * fetches live data from Google Sheets, caching it at module level
 * returns loading/error state + all computed analytics
 */
export function useKrudata() {
    const [records, setRecords] = useState<DriverRecord[]>(cachedRecords || []);
    const [loading, setLoading] = useState(cachedRecords === null);
    const [error, setError] = useState<string | null>(null);

    const loadLiveData = useCallback(async (forceRefresh = false) => {
        if (!forceRefresh && cachedRecords) {
            setRecords(cachedRecords);
            setLoading(false);
            return;
        }

        if (!forceRefresh && fetchPromise) {
            setLoading(true);
            try {
                const live = await fetchPromise;
                if (Array.isArray(live) && live.length > 0) {
                    setRecords(live);
                }
            } catch {
                setError("unable to load live data");
            } finally {
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        setError(null);

        const promise = fetchDriverData();
        fetchPromise = promise;

        try {
            const live = await promise;
            if (Array.isArray(live) && live.length > 0) {
                cachedRecords = live;
                setRecords(live);
            }
        } catch {
            setError("unable to load live data");
        } finally {
            if (fetchPromise === promise) {
                fetchPromise = null;
            }
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLiveData(false);
    }, [loadLiveData]);

    const refresh = useCallback(() => loadLiveData(true), [loadLiveData]);

    const analytics = useMemo(() => computeAnalytics(records), [records]);

    return {
        ...analytics,
        loading,
        error,
        refresh,
    };
}
