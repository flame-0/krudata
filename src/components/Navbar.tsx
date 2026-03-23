import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/useTheme";
import { useRefreshContext } from "@/lib/RefreshContext";
import {
    Sun,
    Moon,
    Monitor,
    BarChart3,
    ClipboardPen,
    RefreshCcw,
} from "lucide-react";

const navItems = [
    { path: "/", label: "dashboard", icon: BarChart3 },
    { path: "/collect", label: "submit data", icon: ClipboardPen },
];

export default function Navbar() {
    const { theme, cycleTheme } = useTheme();
    const location = useLocation();
    const refreshCtx = useRefreshContext();

    const ThemeIcon =
        theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

    const onDashboard = location.pathname === "/";

    return (
        <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-zinc-50/90 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/90">
            <div className="mx-auto max-w-4xl px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* left: logo + nav links */}
                    <div className="flex items-center gap-1">
                        <span className="mr-2 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            krudata
                        </span>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link key={item.path} to={item.path}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-8 gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors ${
                                            isActive
                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                        }`}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        {item.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>

                    {/* right: refresh (dashboard only) + theme toggle */}
                    <div className="flex items-center gap-1">
                        {onDashboard && refreshCtx && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={refreshCtx.refresh}
                                disabled={refreshCtx.loading}
                                className="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                            >
                                <RefreshCcw
                                    className={`h-3.5 w-3.5 ${
                                        refreshCtx.loading ? "animate-spin" : ""
                                    }`}
                                />
                                refresh
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={`switch theme (currently ${theme})`}
                            onClick={cycleTheme}
                            className="h-8 w-8 rounded-lg border-zinc-300 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        >
                            <ThemeIcon className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
