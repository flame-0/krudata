import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import {
    Route,
    Clock,
    Landmark,
    Fuel,
    Wallet,
    Coffee,
    RefreshCcw,
    Loader2,
    Send,
    Minus,
    Plus,
    RotateCcw,
    PhilippinePeso,
    User,
    Calendar,
    MapPin,
    Users,
    Car,
    Timer,
    HeartPulse,
} from "lucide-react";
import { submitToGoogleSheets } from "@/lib/googlesheets";
import type { SheetPayload } from "@/lib/googlesheets";
import { useTheme } from "@/lib/useTheme";

interface FormData {
    name: string;
    age: number | "";
    address: string;
    familyBackground: string;
    jeepOwned: string;
    yearsDriving: number | "";
    medicalHistory: string;
    ruta: string;
    hours: number | "";
    boundary: number | "";
    fuelExpense: number | "";
    pasahe: number | "";
    misc: number | "";
    tripRounds: number;
}

const initialFormData: FormData = {
    name: "",
    age: "",
    address: "",
    familyBackground: "",
    jeepOwned: "",
    yearsDriving: "",
    medicalHistory: "",
    ruta: "",
    hours: "",
    boundary: "",
    fuelExpense: "",
    pasahe: "",
    misc: "",
    tripRounds: 0,
};

function toNum(val: number | ""): number {
    return val === "" ? 0 : val;
}

function formatAmount(amount: number): string {
    const abs = Math.abs(amount);
    const formatted = abs.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${amount < 0 ? "-" : ""}${formatted}`;
}

// shared input class - light defaults, dark overrides
const inputCls =
    "h-12 rounded-xl border-zinc-300 bg-zinc-100 pl-10 text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus-visible:ring-[#4ade80]/30";

const inputMonoCls =
    "h-12 rounded-xl border-zinc-300 bg-zinc-100 pl-10 font-mono text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus-visible:ring-[#4ade80]/30";

export default function App() {
    const [form, setForm] = useState<FormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const { isDark } = useTheme();
    const [showStickyNet, setShowStickyNet] = useState(false);
    const netCardRef = useRef<HTMLDivElement>(null);

    const net =
        toNum(form.pasahe) -
        (toNum(form.fuelExpense) + toNum(form.boundary) + toNum(form.misc));

    // show sticky bar when net card leaves viewport
    useEffect(() => {
        const el = netCardRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setShowStickyNet(!entry.isIntersecting),
            { threshold: 0 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleNumberInput(key: keyof FormData, raw: string) {
        if (raw === "") {
            updateField(key, "" as FormData[typeof key]);
            return;
        }
        const parsed = parseFloat(raw);
        if (!isNaN(parsed)) {
            updateField(key, parsed as FormData[typeof key]);
        }
    }

    function handleClear() {
        setForm(initialFormData);
    }

    async function handleSubmit() {
        if (!form.ruta.trim()) {
            toast.error("enter a route first");
            return;
        }

        setLoading(true);

        const payload: SheetPayload = {
            timestamp: new Date().toISOString(),
            name: form.name.trim(),
            age: toNum(form.age),
            address: form.address.trim(),
            family_background: form.familyBackground.trim(),
            jeep_owned: form.jeepOwned.trim(),
            years_driving: toNum(form.yearsDriving),
            medical_history: form.medicalHistory.trim(),
            route: form.ruta.trim(),
            hours: toNum(form.hours),
            boundary: toNum(form.boundary),
            fuel_expense: toNum(form.fuelExpense),
            pasahe: toNum(form.pasahe),
            misc: toNum(form.misc),
            trip_rounds: form.tripRounds,
            net_take_home: net,
        };

        try {
            await submitToGoogleSheets(payload);
            toast.success("data sent to google sheets");
            handleClear();
        } catch {
            toast.error("failed to submit - check your script url");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Toaster
                position="top-center"
                theme={isDark ? "dark" : "light"}
            />

            {/* sticky net overlay - slides in when card scrolls away */}
            <div
                className={`fixed left-0 right-0 top-[49px] z-40 transition-all duration-200 ${showStickyNet
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0 pointer-events-none"
                    }`}
            >
                <div className="border-b border-zinc-200/60 bg-zinc-50/95 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/95">
                    <div className="mx-auto max-w-lg flex items-center justify-between px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                            net take-home
                        </p>
                        <p
                            className={`font-mono text-2xl font-bold tracking-tight ${net >= 0
                                ? "text-emerald-600 dark:text-[#4ade80]"
                                : "text-red-500 dark:text-red-400"
                                }`}
                        >
                            ₱{formatAmount(net)}
                        </p>
                    </div>
                </div>
            </div>

            {/* form */}
            <main className="mx-auto max-w-lg space-y-3 px-4 pb-10 pt-6">
                {/* net take-home card */}
                <div ref={netCardRef} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                        net take-home pay
                    </p>
                    <p
                        className={`flex items-center font-mono text-3xl font-bold tracking-tight ${net >= 0 ? "text-emerald-600 dark:text-[#4ade80]" : "text-red-500 dark:text-red-400"
                            }`}
                        style={{
                            textShadow: isDark
                                ? net >= 0
                                    ? "0 0 20px rgba(74,222,128,0.3)"
                                    : "0 0 20px rgba(248,113,113,0.3)"
                                : "none",
                        }}
                    >
                        <PhilippinePeso className="h-7 w-7" />
                        {formatAmount(net)}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                        net = pasahe - (fuel + boundary + misc)
                    </p>
                </div>

                {/* driver profile section */}
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400 pt-1">
                    driver profile
                </p>

                {/* name */}
                <FieldWrapper icon={<User className="h-4 w-4" />} label="name">
                    <Input
                        id="name"
                        type="text"
                        placeholder="e.g., juan dela cruz"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className={inputCls}
                    />
                </FieldWrapper>

                {/* age */}
                <FieldWrapper icon={<Calendar className="h-4 w-4" />} label="age">
                    <Input
                        id="age"
                        type="number"
                        inputMode="numeric"
                        placeholder="0"
                        value={form.age}
                        onChange={(e) => handleNumberInput("age", e.target.value)}
                        className={inputMonoCls}
                    />
                </FieldWrapper>

                {/* address */}
                <FieldWrapper icon={<MapPin className="h-4 w-4" />} label="address">
                    <Input
                        id="address"
                        type="text"
                        placeholder="e.g., quezon city"
                        value={form.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className={inputCls}
                    />
                </FieldWrapper>

                {/* family background */}
                <FieldWrapper icon={<Users className="h-4 w-4" />} label="family background">
                    <Input
                        id="familyBackground"
                        type="text"
                        placeholder="e.g., married, 3 kids"
                        value={form.familyBackground}
                        onChange={(e) => updateField("familyBackground", e.target.value)}
                        className={inputCls}
                    />
                </FieldWrapper>

                {/* jeep owned */}
                <div className="space-y-1.5">
                    <Label className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                        <Car className="h-3.5 w-3.5" />
                        jeep owned
                    </Label>
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => updateField("jeepOwned", "yes")}
                            className={`h-12 flex-1 rounded-xl text-base font-medium active:scale-95 ${form.jeepOwned === "yes"
                                ? "bg-emerald-100 border-emerald-400 text-emerald-700 dark:bg-[#4ade80]/15 dark:border-[#4ade80]/40 dark:text-[#4ade80]"
                                : "border-zinc-300 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                }`}
                        >
                            oo
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => updateField("jeepOwned", "no")}
                            className={`h-12 flex-1 rounded-xl text-base font-medium active:scale-95 ${form.jeepOwned === "no"
                                ? "bg-red-100 border-red-400 text-red-700 dark:bg-red-400/15 dark:border-red-400/40 dark:text-red-400"
                                : "border-zinc-300 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                }`}
                        >
                            hindi
                        </Button>
                    </div>
                </div>

                {/* years driving */}
                <FieldWrapper icon={<Timer className="h-4 w-4" />} label="how many years driving">
                    <Input
                        id="yearsDriving"
                        type="number"
                        inputMode="numeric"
                        placeholder="0"
                        value={form.yearsDriving}
                        onChange={(e) => handleNumberInput("yearsDriving", e.target.value)}
                        className={inputMonoCls}
                    />
                </FieldWrapper>

                {/* medical history */}
                <FieldWrapper icon={<HeartPulse className="h-4 w-4" />} label="medical history">
                    <Input
                        id="medicalHistory"
                        type="text"
                        placeholder="e.g., none, hypertension"
                        value={form.medicalHistory}
                        onChange={(e) => updateField("medicalHistory", e.target.value)}
                        className={inputCls}
                    />
                </FieldWrapper>

                {/* daily run section */}
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400 pt-3">
                    today's byahe
                </p>

                {/* ruta */}
                <FieldWrapper icon={<Route className="h-4 w-4" />} label="ruta">
                    <Input
                        id="ruta"
                        type="text"
                        placeholder="e.g., bayan-lagro"
                        value={form.ruta}
                        onChange={(e) => updateField("ruta", e.target.value)}
                        className={inputCls}
                    />
                </FieldWrapper>

                {/* hours */}
                <FieldWrapper
                    icon={<Clock className="h-4 w-4" />}
                    label="total hours traveled"
                >
                    <Input
                        id="hours"
                        type="number"
                        inputMode="decimal"
                        placeholder="0"
                        value={form.hours}
                        onChange={(e) =>
                            handleNumberInput("hours", e.target.value)
                        }
                        className={inputMonoCls}
                    />
                </FieldWrapper>

                {/* boundary */}
                <FieldWrapper
                    icon={<Landmark className="h-4 w-4" />}
                    label="boundary"
                >
                    <Input
                        id="boundary"
                        type="number"
                        inputMode="decimal"
                        placeholder="0"
                        value={form.boundary}
                        onChange={(e) =>
                            handleNumberInput("boundary", e.target.value)
                        }
                        className={inputMonoCls}
                    />
                </FieldWrapper>

                {/* fuel expense */}
                <FieldWrapper
                    icon={<Fuel className="h-4 w-4" />}
                    label="fuel expense"
                >
                    <Input
                        id="fuel"
                        type="number"
                        inputMode="decimal"
                        placeholder="0"
                        value={form.fuelExpense}
                        onChange={(e) =>
                            handleNumberInput("fuelExpense", e.target.value)
                        }
                        className={inputMonoCls}
                    />
                </FieldWrapper>

                {/* pasahe */}
                <FieldWrapper
                    icon={<Wallet className="h-4 w-4" />}
                    label="pasahe"
                >
                    <Input
                        id="pasahe"
                        type="number"
                        inputMode="decimal"
                        placeholder="0"
                        value={form.pasahe}
                        onChange={(e) =>
                            handleNumberInput("pasahe", e.target.value)
                        }
                        className={inputMonoCls}
                    />
                </FieldWrapper>

                {/* misc */}
                <FieldWrapper
                    icon={<Coffee className="h-4 w-4" />}
                    label="misc / pila / snacks"
                >
                    <Input
                        id="misc"
                        type="number"
                        inputMode="decimal"
                        placeholder="0"
                        value={form.misc}
                        onChange={(e) =>
                            handleNumberInput("misc", e.target.value)
                        }
                        className={inputMonoCls}
                    />
                </FieldWrapper>

                {/* trip rounds stepper */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="trips"
                        className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300"
                    >
                        <RefreshCcw className="h-3.5 w-3.5" />
                        trip rounds
                    </Label>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="decrease trip rounds"
                            onClick={() =>
                                updateField(
                                    "tripRounds",
                                    Math.max(0, form.tripRounds - 1),
                                )
                            }
                            className="h-12 w-12 shrink-0 rounded-xl border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex h-12 flex-1 items-center justify-center rounded-xl border border-zinc-300 bg-zinc-100 font-mono text-xl font-bold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                            {form.tripRounds}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="increase trip rounds"
                            onClick={() =>
                                updateField("tripRounds", form.tripRounds + 1)
                            }
                            className="h-12 w-12 shrink-0 rounded-xl border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* action buttons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClear}
                        className="h-12 flex-1 rounded-xl border-zinc-300 bg-zinc-100 font-medium text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        clear
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="h-12 flex-[2] rounded-xl bg-emerald-600 font-medium text-white hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 dark:bg-[#4ade80] dark:text-zinc-950 dark:hover:bg-[#22c55e]"
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-4 w-4" />
                        )}
                        {loading ? "sending..." : "submit"}
                    </Button>
                </div>

            </main>
        </>
    );
}

// reusable field wrapper with icon overlay
function FieldWrapper({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                {icon}
                {label}
            </Label>
            <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                    {icon}
                </div>
                {children}
            </div>
        </div>
    );
}
