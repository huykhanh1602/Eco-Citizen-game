import { Zap, Leaf, Coins, Heart, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "../contexts/SettingsContext";

interface DashboardProps {
    month: number;
    metrics: {
        energy: number;
        environment: number;
        budget: number;
        trust: number;
    };
    onSettingsClick: () => void;
}

type StatId = "energy" | "environment" | "budget" | "trust";

interface DeltaIndicator {
    id: string;
    statId: StatId;
    delta: number;
}

export function Dashboard({ month, metrics, onSettingsClick }: DashboardProps) {
    const { language } = useSettings();
    const prevMetrics = useRef(metrics);
    const [deltas, setDeltas] = useState<DeltaIndicator[]>([]);
    const counterRef = useRef(0);

    // Detect metric changes and create delta indicators
    useEffect(() => {
        const prev = prevMetrics.current;
        const changes: DeltaIndicator[] = [];

        const check: [StatId, number][] = [
            ["energy", prev.energy],
            ["environment", prev.environment],
            ["budget", prev.budget],
            ["trust", prev.trust],
        ];

        check.forEach(([statId, oldVal]) => {
            const newVal = metrics[statId];
            const delta = Math.round(newVal - oldVal);
            if (delta !== 0) {
                counterRef.current += 1;
                changes.push({
                    id: `${statId}-${counterRef.current}`,
                    statId,
                    delta,
                });
            }
        });

        if (changes.length > 0) {
            setDeltas((prev) => [...prev, ...changes]);
        }

        prevMetrics.current = metrics;
    }, [metrics]);

    // Remove a delta indicator after its animation completes
    const removeDelta = (id: string) => {
        setDeltas((prev) => prev.filter((d) => d.id !== id));
    };

    const stats = [
        {
            id: "energy" as StatId,
            label: language === "vi" ? "Năng lượng" : "Energy",
            icon: Zap,
            value: metrics.energy,
            color: "bg-yellow-400",
            track: "bg-yellow-100",
            iconColor: "text-yellow-500",
            deltaBg: "bg-yellow-500",
        },
        {
            id: "environment" as StatId,
            label: language === "vi" ? "Môi trường" : "Environment",
            icon: Leaf,
            value: metrics.environment,
            color: "bg-emerald-400",
            track: "bg-emerald-100",
            iconColor: "text-emerald-500",
            deltaBg: "bg-emerald-500",
        },
        {
            id: "budget" as StatId,
            label: language === "vi" ? "Ngân sách" : "Budget",
            icon: Coins,
            value: metrics.budget,
            color: "bg-sky-400",
            track: "bg-sky-100",
            iconColor: "text-sky-500",
            deltaBg: "bg-sky-500",
        },
        {
            id: "trust" as StatId,
            label: language === "vi" ? "Lòng tin" : "Trust",
            icon: Heart,
            value: metrics.trust,
            color: "bg-rose-400",
            track: "bg-rose-100",
            iconColor: "text-rose-500",
            deltaBg: "bg-rose-500",
        },
    ];

    return (
        <header className="sticky top-0 z-10 w-full px-4 py-4 md:px-8 bg-white/70 backdrop-blur-xl border-b-[3px] border-slate-200">
            <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center justify-center bg-slate-800 text-white rounded-2xl px-5 py-2.5 shadow-md shadow-slate-200 min-w-[100px]">
                    <div className="text-center">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                            {language === "vi" ? "Tháng" : "Month"}
                        </div>
                        <div className="text-xl font-black">{month}</div>
                    </div>
                </div>
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    const statDeltas = deltas.filter((d) => d.statId === stat.id);
                    return (
                        <div
                            key={stat.id}
                            className="flex flex-col flex-1 min-w-[120px] items-start gap-1.5 relative"
                        >
                            {/* Delta indicators floating above the bar */}
                            <AnimatePresence>
                                {statDeltas.map((delta) => {
                                    const isPositive = delta.delta > 0;
                                    const sign = isPositive ? "+" : "";
                                    return (
                                        <motion.div
                                            key={delta.id}
                                            initial={{ opacity: 1, y: 0, scale: 1 }}
                                            animate={{ opacity: 0, y: -40, scale: 0.6 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 1.4, ease: "easeOut" }}
                                            onAnimationComplete={() => removeDelta(delta.id)}
                                            className={`absolute -top-1 right-0 z-20 pointer-events-none text-[11px] font-black px-1.5 py-0.5 rounded-md ${
                                                isPositive
                                                    ? "text-emerald-700 bg-emerald-100 border border-emerald-300"
                                                    : "text-rose-700 bg-rose-100 border border-rose-300"
                                            }`}
                                        >
                                            {sign}
                                            {delta.delta}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            <div className="flex items-center gap-1.5 px-1 w-full">
                                <Icon
                                    className={`w-5 h-5 ${stat.iconColor} fill-current/20 shrink-0`}
                                    strokeWidth={2.5}
                                />
                                <span className="font-extrabold text-slate-700 text-sm uppercase tracking-wide">
                                    {stat.label}
                                </span>
                            </div>
                            <div className={`w-full h-5 rounded-full ${stat.track} p-1 relative`}>
                                <div
                                    className={`h-full ${stat.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                                    style={{ width: `${Math.max(0, Math.min(100, stat.value))}%` }}
                                >
                                    {/* Subtle 3D highlight */}
                                    <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/40 rounded-full" />
                                </div>
                                {/* Pulse glow when value changes */}
                                {statDeltas.length > 0 && (
                                    <motion.div
                                        className={`absolute inset-0 rounded-full ${stat.color} opacity-40`}
                                        initial={{ scale: 1 }}
                                        animate={{ scale: [1, 1.15, 1] }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
                <button
                    onClick={onSettingsClick}
                    className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors text-slate-600 shadow-sm"
                >
                    <Settings className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
}
