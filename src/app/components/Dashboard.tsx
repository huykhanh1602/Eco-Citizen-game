import { Zap, Leaf, Coins, Heart } from "lucide-react";

const stats = [
  { id: "energy", label: "Energy", icon: Zap, value: 75, color: "bg-yellow-400", track: "bg-yellow-100", iconColor: "text-yellow-500" },
  { id: "env", label: "Environment", icon: Leaf, value: 45, color: "bg-emerald-400", track: "bg-emerald-100", iconColor: "text-emerald-500" },
  { id: "budget", label: "Budget", icon: Coins, value: 60, color: "bg-sky-400", track: "bg-sky-100", iconColor: "text-sky-500" },
  { id: "trust", label: "Trust", icon: Heart, value: 85, color: "bg-rose-400", track: "bg-rose-100", iconColor: "text-rose-500" },
];

export function Dashboard() {
  return (
    <header className="sticky top-0 z-10 w-full px-4 py-4 md:px-8 bg-white/70 backdrop-blur-xl border-b-[3px] border-slate-200">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="flex flex-col flex-1 min-w-[120px] items-start gap-1.5">
              <div className="flex items-center gap-1.5 px-1">
                <Icon className={`w-5 h-5 ${stat.iconColor} fill-current/20`} strokeWidth={2.5} />
                <span className="font-extrabold text-slate-700 text-sm uppercase tracking-wide">{stat.label}</span>
              </div>
              <div className={`w-full h-5 rounded-full ${stat.track} p-1`}>
                <div 
                  className={`h-full ${stat.color} rounded-full transition-all duration-1000 ease-out relative`} 
                  style={{ width: `${stat.value}%` }}
                >
                  {/* Subtle 3D highlight */}
                  <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
}