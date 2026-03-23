import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar.tsx";
import App from "./App.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { RefreshProvider } from "./lib/RefreshContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <RefreshProvider>
                <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/collect" element={<App />} />
                    </Routes>
                </div>
            </RefreshProvider>
        </BrowserRouter>
    </StrictMode>,
);
