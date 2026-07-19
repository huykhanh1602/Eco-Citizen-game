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
        <header
            id="tutorial-indicator-bars"
            className="sticky top-0 z-10 w-full px-3 py-3 md:px-8 md:py-4 bg-white/70 backdrop-blur-xl border-b-[3px] border-slate-200"
        >
            {/* Container chính bật flex-wrap để cho phép rớt dòng */}
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 md:gap-4 w-full">
                {/* HÀNG 1 (Mobile): Khối hiển thị Tháng */}
                <div className="flex flex-col items-center justify-center bg-slate-800 text-white rounded-xl px-4 py-2 md:px-5 md:py-2.5 shadow-md flex-1 md:flex-none md:max-w-[120px]">
                    <div className="text-center">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                            {language === "vi" ? "Tháng" : "Month"}
                        </div>
                        <div className="text-sm md:text-xl font-black">{month} / 12</div>
                    </div>
                </div>

                {/* HÀNG 1 (Mobile): Nút cài đặt */}
                {/* Ma pháp md:order-last giúp nó tự động chạy về cuối cùng khi mở trên máy tính */}
                <button
                    onClick={onSettingsClick}
                    className="p-2.5 md:p-3 bg-slate-100 hover:bg-slate-200 rounded-xl md:rounded-2xl transition-colors text-slate-600 shadow-sm shrink-0 md:order-last"
                >
                    <Settings className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* HÀNG 2 (Mobile): Bọc 4 chỉ số vào một khối riêng */}
                <div className="flex flex-wrap md:flex-nowrap items-center w-full md:w-auto md:flex-1 gap-2 md:gap-4 order-last md:order-none mt-1 md:mt-0">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        const statDeltas = deltas.filter((d) => d.statId === stat.id);
                        return (
                            <div
                                key={stat.id}
                                // Điểm nhấn đây xám cưng: w-[calc(50%-4px)] ép 2 khối 1 dòng trên mobile!
                                className="flex flex-col w-[calc(50%-4px)] md:w-auto md:flex-1 items-start gap-1 md:gap-1.5 relative"
                            >
                                {/* Delta indicators */}
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
                                                className={`absolute -top-2 md:-top-1 right-0 z-20 pointer-events-none text-[10px] md:text-[11px] font-black px-1 py-0.5 md:px-1.5 rounded-md ${
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

                                <div className="flex items-center gap-1 md:gap-1.5 px-1 w-full">
                                    <Icon
                                        className={`w-4 h-4 md:w-5 md:h-5 ${stat.iconColor} fill-current/20 shrink-0`}
                                        strokeWidth={2.5}
                                    />
                                    <span className="font-extrabold text-slate-700 text-[10px] md:text-sm uppercase tracking-wide truncate w-full">
                                        {stat.label}
                                    </span>
                                </div>
                                <div
                                    className={`w-full h-3.5 md:h-5 rounded-full ${stat.track} p-0.5 md:p-1 relative`}
                                >
                                    <div
                                        className={`h-full ${stat.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden z-0`}
                                        style={{
                                            width: `${Math.max(0, Math.min(100, stat.value))}%`,
                                        }}
                                    >
                                        <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/40 rounded-full" />
                                    </div>

                                    <span className="absolute left-2 md:left-2.5 top-1/2 -translate-y-1/2 font-bold text-white text-[9px] md:text-xs z-10 drop-shadow-md pointer-events-none">
                                        {stat.value}
                                    </span>

                                    {statDeltas.length > 0 && (
                                        <motion.div
                                            className={`absolute inset-0 rounded-full ${stat.color} opacity-40 pointer-events-none`}
                                            initial={{ scale: 1 }}
                                            animate={{ scale: [1, 1.15, 1] }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
