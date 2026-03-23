import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface RefreshContextValue {
    refresh: () => void;
    loading: boolean;
    /** called by Dashboard to register its refresh function */
    register: (fn: () => Promise<void>) => void;
}

const RefreshContext = createContext<RefreshContextValue>({
    refresh: () => {},
    loading: false,
    register: () => {},
});

export function RefreshProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [refreshFn, setRefreshFn] = useState<(() => Promise<void>) | null>(null);

    const register = useCallback((fn: () => Promise<void>) => {
        setRefreshFn(() => fn);
    }, []);

    const refresh = useCallback(async () => {
        if (!refreshFn) return;
        setLoading(true);
        try {
            await refreshFn();
        } finally {
            setLoading(false);
        }
    }, [refreshFn]);

    return (
        <RefreshContext.Provider value={{ refresh, loading, register }}>
            {children}
        </RefreshContext.Provider>
    );
}

export function useRefreshContext() {
    return useContext(RefreshContext);
}
