import type { Metadata } from "next";
import "./styles/index.css";

export const metadata: Metadata = {
    title: "Eco Citizen Game",
    description: "A city management game focused on environmental sustainability",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
