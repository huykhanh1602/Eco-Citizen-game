import { Dashboard } from "./components/Dashboard";
import { InformerModule } from "./components/InformerModule";

export default function Page() {
    return (
        <div className="h-screen w-full flex flex-col bg-gradient-to-b from-sky-50 to-emerald-50 text-slate-800 font-sans overflow-hidden">
            <Dashboard />
            <InformerModule />
        </div>
    );
}
