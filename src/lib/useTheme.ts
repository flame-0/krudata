import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function applyTheme(theme: Theme) {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem("krudata-theme") as Theme | null;
        return stored || "light";
    });

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem("krudata-theme", theme);
    }, [theme]);

    // listen for system preference changes when in "system" mode
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
            if (theme === "system") applyTheme("system");
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [theme]);

    const isDark =
        theme === "dark" || (theme === "system" && getSystemTheme() === "dark");

    function cycleTheme() {
        setTheme((prev) => {
            if (prev === "light") return "dark";
            if (prev === "dark") return "system";
            return "light";
        });
    }

    return { theme, isDark, setTheme, cycleTheme };
}
