import type { Metadata } from "next";
import "./styles/index.css";

export const metadata: Metadata = {
    title: "Eco Citizen Game",
    description: "A city management game focused on environmental sustainability",
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
};

import { SettingsProvider } from "./contexts/SettingsContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <SettingsProvider>
                    {children}
                </SettingsProvider>
            </body>
        </html>
    );
}
