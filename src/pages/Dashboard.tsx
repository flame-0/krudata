import { useEffect } from "react";
import { useTheme } from "@/lib/useTheme";
import { useKrudata } from "@/lib/useKrudata";
import { useRefreshContext } from "@/lib/RefreshContext";
import {
    Users,
    PhilippinePeso,
    Clock,
    Car,
    TrendingUp,
    Activity,
    HeartPulse,
    Calendar,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ScatterChart,
    Scatter,
    Legend,
} from "recharts";

const PIE_COLORS = {
    light: ["#dc2626", "#f59e0b", "#6366f1", "#10b981"],
    dark: ["#ef4444", "#f59e0b", "#818cf8", "#4ade80"],
};

const OWNERSHIP_COLORS = {
    light: ["#10b981", "#94a3b8"],
    dark: ["#4ade80", "#71717a"],
};

export default function Dashboard() {
    const { isDark } = useTheme();
    const {
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
        error,
        refresh,
    } = useKrudata();

    const { register } = useRefreshContext();
    useEffect(() => {
        register(refresh);
    }, [register, refresh]);

    const pieColors = isDark ? PIE_COLORS.dark : PIE_COLORS.light;
    const ownershipColors = isDark ? OWNERSHIP_COLORS.dark : OWNERSHIP_COLORS.light;

    const tooltipStyle = {
        backgroundColor: isDark ? "#18181b" : "#ffffff",
        border: `1px solid ${isDark ? "#27272a" : "#e4e4e7"}`,
        borderRadius: "12px",
        color: isDark ? "#fafafa" : "#18181b",
        fontSize: "13px",
    };

    if (!summary.totalDrivers) {
        return (
            <main className="mx-auto max-w-4xl px-4 pb-12 pt-6 space-y-6 animate-pulse">
                {/* skeleton stat cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
                            <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                            <div className="mt-3 h-7 w-14 rounded bg-zinc-200 dark:bg-zinc-800" />
                        </div>
                    ))}
                </div>

                {/* skeleton bar chart */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <div className="h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="mt-4 space-y-3">
                        {[85, 70, 55, 40, 30].map((w, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                                <div className="h-6 rounded bg-zinc-200 dark:bg-zinc-800" style={{ width: `${w}%` }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* skeleton donut + demographics row */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
                        <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="mx-auto mt-6 h-40 w-40 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
                        <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="mt-4 space-y-3">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="h-3 w-12 rounded bg-zinc-200 dark:bg-zinc-800" />
                                    <div className="h-4 flex-1 mx-3 rounded bg-zinc-200 dark:bg-zinc-800" />
                                    <div className="h-3 w-6 rounded bg-zinc-200 dark:bg-zinc-800" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* skeleton table */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <div className="h-4 w-44 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="mt-4 space-y-2">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="h-8 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
            <main className="mx-auto max-w-4xl px-4 pb-12 pt-6 space-y-6">
                {/* error banner */}
                {error && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400">
                        {error}
                    </div>
                )}

                {/* summary stat cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard
                        icon={<Users className="h-4 w-4" />}
                        label="total drivers"
                        value={summary.totalDrivers.toString()}
                    />
                    <StatCard
                        icon={<PhilippinePeso className="h-4 w-4" />}
                        label="avg net take-home"
                        value={`₱${summary.avgNet.toLocaleString()}`}
                        mono
                    />
                    <StatCard
                        icon={<Clock className="h-4 w-4" />}
                        label="avg hours / shift"
                        value={summary.avgHours.toString()}
                        mono
                    />
                    <StatCard
                        icon={<Car className="h-4 w-4" />}
                        label="jeep ownership"
                        value={`${summary.ownershipRate}%`}
                        mono
                    />
                </div>

                {/* earnings by route */}
                <Section
                    icon={<TrendingUp className="h-4 w-4" />}
                    title="avg take-home by route"
                >
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={earningsByRoute}
                                layout="vertical"
                                margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={isDark ? "#27272a" : "#e4e4e7"}
                                    horizontal={false}
                                />
                                <XAxis
                                    type="number"
                                    tick={{ fill: isDark ? "#a1a1aa" : "#71717a", fontSize: 12 }}
                                    tickFormatter={(v: number) => `₱${v}`}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="route"
                                    width={140}
                                    tick={{ fill: isDark ? "#a1a1aa" : "#71717a", fontSize: 11 }}
                                />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    formatter={(value: any, name: any) => [
                                        `₱${Number(value).toLocaleString()}`,
                                        name === "net" ? "avg net" : "avg gross",
                                    ]}
                                />
                                <Bar
                                    dataKey="net"
                                    fill={isDark ? "#4ade80" : "#10b981"}
                                    radius={[0, 6, 6, 0]}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Section>

                {/* cost structure */}
                <Section
                    icon={<PhilippinePeso className="h-4 w-4" />}
                    title="where does the money go (avg per driver)"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="h-52 w-52 shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={costBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {costBreakdown.map((_, i) => (
                                            <Cell
                                                key={i}
                                                fill={pieColors[i % pieColors.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        formatter={(value: any) => [
                                            `₱${Number(value).toLocaleString()}`,
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center sm:flex-col sm:gap-2">
                            {costBreakdown.map((item, i) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div
                                        className="h-3 w-3 rounded-full"
                                        style={{
                                            backgroundColor: pieColors[i % pieColors.length],
                                        }}
                                    />
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {item.name}
                                    </span>
                                    <span className="font-mono text-sm font-semibold">
                                        ₱{item.value.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* demographics */}
                <Section
                    icon={<Activity className="h-4 w-4" />}
                    title="driver demographics"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* age distribution */}
                        <DemoCard title="age distribution" icon={<Calendar className="h-3.5 w-3.5" />}>
                            <div className="space-y-2">
                                {ageGroups.map((g) => (
                                    <BarRow
                                        key={g.label}
                                        label={g.label}
                                        count={g.count}
                                        total={summary.totalDrivers}
                                        isDark={isDark}
                                    />
                                ))}
                            </div>
                        </DemoCard>

                        {/* experience */}
                        <DemoCard title="years of experience" icon={<Clock className="h-3.5 w-3.5" />}>
                            <div className="space-y-2">
                                {experienceGroups.map((g) => (
                                    <BarRow
                                        key={g.label}
                                        label={g.label}
                                        count={g.count}
                                        total={summary.totalDrivers}
                                        isDark={isDark}
                                    />
                                ))}
                            </div>
                        </DemoCard>

                        {/* ownership */}
                        <DemoCard title="jeep ownership" icon={<Car className="h-3.5 w-3.5" />}>
                            <div className="flex items-center gap-4">
                                <div className="h-28 w-28 shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: "owner", value: ownerCount },
                                                    { name: "renter", value: renterCount },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={28}
                                                outerRadius={48}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                <Cell fill={ownershipColors[0]} />
                                                <Cell fill={ownershipColors[1]} />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: ownershipColors[0] }}
                                        />
                                        <span className="text-zinc-600 dark:text-zinc-400">
                                            owner ({ownerCount})
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: ownershipColors[1] }}
                                        />
                                        <span className="text-zinc-600 dark:text-zinc-400">
                                            renter ({renterCount})
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </DemoCard>

                        {/* medical */}
                        <DemoCard title="medical conditions" icon={<HeartPulse className="h-3.5 w-3.5" />}>
                            <div className="flex flex-wrap gap-2">
                                {medicalConditions.map((m) => (
                                    <span
                                        key={m.condition}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                                    >
                                        {m.condition}
                                        <span className="font-mono font-semibold text-emerald-600 dark:text-[#4ade80]">
                                            {m.count}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </DemoCard>
                    </div>
                </Section>

                {/* route performance table */}
                <Section
                    icon={<TrendingUp className="h-4 w-4" />}
                    title="route performance breakdown"
                >
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                                    {["route", "drivers", "avg gross", "avg fuel", "avg boundary", "avg net", "avg hrs", "expense %"].map(
                                        (h) => (
                                            <th
                                                key={h}
                                                className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                                            >
                                                {h}
                                            </th>
                                        ),
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {routeStats.map((r) => (
                                    <tr
                                        key={r.route}
                                        className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
                                    >
                                        <td className="whitespace-nowrap px-3 py-2.5 font-medium">
                                            {r.route}
                                        </td>
                                        <td className="px-3 py-2.5 font-mono">{r.count}</td>
                                        <td className="px-3 py-2.5 font-mono">
                                            ₱{r.avgGross.toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2.5 font-mono">
                                            ₱{r.avgFuel.toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2.5 font-mono">
                                            ₱{r.avgBoundary.toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2.5 font-mono font-semibold text-emerald-600 dark:text-[#4ade80]">
                                            ₱{r.avgNet.toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2.5 font-mono">{r.avgHours}</td>
                                        <td className="px-3 py-2.5 font-mono text-red-500 dark:text-red-400">
                                            {r.totalExpenseRate}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>

                {/* experience vs earnings scatter */}
                <Section
                    icon={<Activity className="h-4 w-4" />}
                    title="experience vs net take-home"
                >
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={isDark ? "#27272a" : "#e4e4e7"}
                                />
                                <XAxis
                                    type="number"
                                    dataKey="yearsDriving"
                                    name="years driving"
                                    tick={{ fill: isDark ? "#a1a1aa" : "#71717a", fontSize: 12 }}
                                    label={{
                                        value: "years driving",
                                        position: "insideBottom",
                                        offset: -4,
                                        fill: isDark ? "#71717a" : "#a1a1aa",
                                        fontSize: 11,
                                    }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="netTakeHome"
                                    name="net take-home"
                                    tick={{ fill: isDark ? "#a1a1aa" : "#71717a", fontSize: 12 }}
                                    tickFormatter={(v: number) => `₱${v}`}
                                />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    formatter={(value: any, name: any) => [
                                        String(name) === "net take-home"
                                            ? `₱${Number(value).toLocaleString()}`
                                            : `${value} yrs`,
                                        name,
                                    ]}
                                    labelFormatter={() => ""}
                                />
                                <Legend />
                                <Scatter
                                    name="owner"
                                    data={scatterData.filter((d) => d.jeepOwned)}
                                    fill={isDark ? "#4ade80" : "#10b981"}
                                />
                                <Scatter
                                    name="renter"
                                    data={scatterData.filter((d) => !d.jeepOwned)}
                                    fill={isDark ? "#f59e0b" : "#f59e0b"}
                                />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 pt-2">
                        green = jeep owner, orange = renter
                    </p>
                </Section>

            </main>
    );
}

// -- sub-components --

function StatCard({
    icon,
    label,
    value,
    mono,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="rounded-xl border border-zinc-200 bg-zinc-100/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {icon}
                {label}
            </div>
            <p
                className={`mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 ${mono ? "font-mono" : ""
                    }`}
            >
                {value}
            </p>
        </div>
    );
}

function Section({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {icon}
                {title}
            </h2>
            {children}
        </div>
    );
}

function DemoCard({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800/50 dark:bg-zinc-900/50">
            <p className="mb-3 flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {icon}
                {title}
            </p>
            {children}
        </div>
    );
}

function BarRow({
    label,
    count,
    total,
    isDark,
}: {
    label: string;
    count: number;
    total: number;
    isDark: boolean;
}) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                {label}
            </span>
            <div className="flex-1 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all"
                    style={{
                        width: `${Math.max(pct, 4)}%`,
                        backgroundColor: isDark ? "#4ade80" : "#10b981",
                    }}
                />
            </div>
            <span className="w-6 shrink-0 text-right font-mono text-xs font-semibold">
                {count}
            </span>
        </div>
    );
}
