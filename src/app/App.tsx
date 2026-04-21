import { Dashboard } from "./components/Dashboard";
import { GameStage } from "./components/GameStage";
import { ActionBar } from "./components/ActionBar";

export default function App() {
  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-sky-50 to-emerald-50 text-slate-800 font-sans overflow-hidden">
      <Dashboard />
      <GameStage />
      <ActionBar />
    </div>
  );
}