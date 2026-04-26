"use client";

import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, ShieldAlert, Flame, Siren } from "lucide-react";
import { GameEvent } from "../../utils/eventBank";
import { useState, useEffect, useMemo } from "react";
import { useSettings } from "../contexts/SettingsContext";

interface GameStageProps {
    currentEvent: GameEvent;
}

// ── Severity theming ──────────────────────────────────────────────────────────
const SEVERITY = {
    1: {
        label:       { vi: "Cảnh Báo",  en: "Warning"  },
        Icon:        ShieldAlert,
        banner:      "bg-amber-500  border-amber-300  shadow-[0_0_50px_rgba(251,191,36,0.8)]",
        bannerText:  "text-amber-100",
        ring:        "shadow-[0_0_0_8px_rgba(251,191,36,0.35),0_0_40px_rgba(251,191,36,0.5)]",
        border:      "border-amber-400",
        bubbleAccent:"bg-amber-50   border-amber-200",
        iconBg:      "bg-amber-100",
        iconColor:   "text-amber-500",
        flash:       "rgba(251,191,36,0.18)",
        overlay:     "from-amber-900/20  to-transparent",
        particleColor:"bg-amber-400",
    },
    2: {
        label:       { vi: "Khẩn Cấp",  en: "Urgent"   },
        Icon:        AlertCircle,
        banner:      "bg-orange-500 border-orange-300 shadow-[0_0_50px_rgba(249,115,22,0.8)]",
        bannerText:  "text-orange-100",
        ring:        "shadow-[0_0_0_8px_rgba(249,115,22,0.35),0_0_40px_rgba(249,115,22,0.5)]",
        border:      "border-orange-400",
        bubbleAccent:"bg-orange-50  border-orange-200",
        iconBg:      "bg-orange-100",
        iconColor:   "text-orange-500",
        flash:       "rgba(249,115,22,0.18)",
        overlay:     "from-orange-900/20 to-transparent",
        particleColor:"bg-orange-400",
    },
    3: {
        label:       { vi: "Nguy Cấp",  en: "Critical" },
        Icon:        Flame,
        banner:      "bg-rose-600   border-rose-400   shadow-[0_0_50px_rgba(225,29,72,0.8)]",
        bannerText:  "text-rose-200",
        ring:        "shadow-[0_0_0_8px_rgba(225,29,72,0.35),0_0_40px_rgba(225,29,72,0.6)]",
        border:      "border-rose-400",
        bubbleAccent:"bg-rose-50    border-rose-200",
        iconBg:      "bg-rose-100",
        iconColor:   "text-rose-500",
        flash:       "rgba(225,29,72,0.22)",
        overlay:     "from-rose-900/25   to-transparent",
        particleColor:"bg-rose-400",
    },
} as const;

// ── Floating particle ─────────────────────────────────────────────────────────
function Particle({ color, delay }: { color: string; delay: number }) {
    const left  = useMemo(() => Math.random() * 100, []);
    const size  = useMemo(() => Math.random() * 6 + 4, []);
    const dur   = useMemo(() => Math.random() * 4 + 5, []);

    return (
        <motion.div
            className={`absolute bottom-0 rounded-full opacity-0 ${color}`}
            style={{ left: `${left}%`, width: size, height: size }}
            animate={{ y: [0, -(Math.random() * 200 + 150)], opacity: [0, 0.7, 0] }}
            transition={{ duration: dur, delay, repeat: Infinity, repeatDelay: Math.random() * 3, ease: "easeOut" }}
        />
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function GameStage({ currentEvent }: GameStageProps) {
    const [showAlarm, setShowAlarm]   = useState(false);
    const [flashKey,  setFlashKey]    = useState(0);
    const { language } = useSettings();

    const sev = SEVERITY[(currentEvent.severity as 1 | 2 | 3) ?? 2];
    const SevIcon = sev.Icon;

    useEffect(() => {
        setShowAlarm(true);
        setFlashKey(k => k + 1);          // re-trigger flash on every new event
        const t = setTimeout(() => setShowAlarm(false), 4500);
        return () => clearTimeout(t);
    }, [currentEvent]);

    const particles = useMemo(() =>
        Array.from({ length: 12 }, (_, i) => ({ id: i, delay: i * 0.4 })),
    [currentEvent.id]);

    return (
        <main className="flex-1 overflow-y-auto w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden">

            {/* ── Background: town image ────────────────────────────────────── */}
            <div
                className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat blur-[4px] scale-105"
                style={{ backgroundImage: "url('/backgrounds/town.png')" }}
            />
            {/* Base dark overlay */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-black/10 to-black/30" />

            {/* ── Severity-tinted atmospheric overlay ──────────────────────── */}
            <div className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-t ${sev.overlay} transition-colors duration-1000`} />

            {/* ── Floating particles ────────────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                {particles.map(p => (
                    <Particle key={`${currentEvent.id}-${p.id}`} color={sev.particleColor} delay={p.delay} />
                ))}
            </div>

            {/* ── Full-screen flash on new event ────────────────────────────── */}
            <AnimatePresence>
                <motion.div
                    key={flashKey}
                    className="pointer-events-none absolute inset-0 z-40"
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    style={{ backgroundColor: sev.flash }}
                />
            </AnimatePresence>

            {/* ── Flashing screen-edge border ───────────────────────────────── */}
            {showAlarm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0, 1, 0, 1, 0] }}
                    transition={{ duration: 4.5 }}
                    className={`pointer-events-none absolute inset-0 z-40 border-[14px] ${sev.border}`}
                />
            )}

            {/* ── Alarm Banner ──────────────────────────────────────────────── */}
            <AnimatePresence>
                {showAlarm && (
                    <motion.div
                        key="banner"
                        initial={{ y: -120, opacity: 0, scale: 0.9 }}
                        animate={{ y: 24,   opacity: 1, scale: 1   }}
                        exit={{    y: -120, opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        className={`absolute top-0 left-1/2 -translate-x-1/2 z-50 ${sev.banner} text-white px-8 md:px-12 py-3 md:py-4 rounded-3xl border-4 flex items-center gap-5 w-[92%] md:w-auto justify-center`}
                    >
                        <motion.div
                            animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                        >
                            <SevIcon className={`w-8 h-8 md:w-11 md:h-11 ${sev.bannerText}`} />
                        </motion.div>

                        <div className="flex flex-col items-center text-center">
                            <span className="text-xl md:text-3xl font-black tracking-widest uppercase drop-shadow-md">
                                {language === 'vi' ? 'Sự Kiện Mới!' : 'New Event!'}
                            </span>
                            <span className={`text-xs md:text-sm font-bold ${sev.bannerText} uppercase tracking-widest mt-0.5`}>
                                {sev.label[language]}
                                {" · "}
                                {language === 'vi' ? `Mức độ ${currentEvent.severity}/3` : `Level ${currentEvent.severity}/3`}
                            </span>
                        </div>

                        <motion.div
                            animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1, delay: 0.3 }}
                        >
                            <SevIcon className={`w-8 h-8 md:w-11 md:h-11 ${sev.bannerText}`} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Main content ──────────────────────────────────────────────── */}
            <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 pb-10 mt-14 md:mt-4 relative z-10">

                {/* Avatar */}
                <motion.div
                    key={currentEvent.id + "-avatar"}
                    className="relative flex-shrink-0"
                    initial={{ opacity: 0, x: -60, rotate: -8, scale: 0.7 }}
                    animate={{ opacity: 1, x: 0,   rotate: 0,  scale: 1   }}
                    transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.15 }}
                >
                    {/* Floating bob */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
                    >
                        {/* Glowing ring */}
                        <div className={`relative w-48 h-48 md:w-72 md:h-72 rounded-[40px] border-[10px] border-white overflow-hidden bg-sky-100 rotate-[-2deg] flex items-center justify-center transition-shadow duration-700 ${sev.ring}`}>
                            {currentEvent.avatarUrl ? (
                                <img
                                    src={currentEvent.avatarUrl}
                                    alt={currentEvent.persona[language]}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-sky-400 text-6xl md:text-8xl">🤖</div>
                            )}
                        </div>

                        {/* Severity badge */}
                        <motion.div
                            initial={{ scale: 0, rotate: 30 }}
                            animate={{ scale: 1, rotate: 6 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.5 }}
                            className={`absolute -top-3 -right-3 ${sev.iconBg} p-2.5 rounded-2xl border-4 border-white shadow-lg`}
                        >
                            <SevIcon className={`w-6 h-6 ${sev.iconColor}`} />
                        </motion.div>

                        {/* Persona name badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white px-5 py-2 rounded-2xl border-4 border-slate-100 shadow-lg whitespace-nowrap"
                        >
                            <span className="font-extrabold text-sky-600 text-sm md:text-base uppercase tracking-wide">
                                {currentEvent.persona[language]}
                            </span>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Speech Bubble */}
                <motion.div
                    key={currentEvent.id + "-bubble"}
                    className={`relative bg-white rounded-[32px] p-6 md:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.12)] border-4 ${sev.border} flex-1 max-w-xl`}
                    initial={{ opacity: 0, x: 60, scale: 0.88 }}
                    animate={{ opacity: 1, x: 0,  scale: 1    }}
                    transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.25 }}
                >
                    {/* Bubble tail – Desktop */}
                    <div className="hidden md:block absolute -left-8 top-1/2 -translate-y-1/2 w-0 h-0
                        border-t-[22px] border-t-transparent
                        border-r-[30px] border-r-white
                        border-b-[22px] border-b-transparent drop-shadow-sm" />
                    {/* Bubble tail – Mobile */}
                    <div className="md:hidden absolute -top-8 left-1/2 -translate-x-1/2 w-0 h-0
                        border-l-[22px] border-l-transparent
                        border-b-[30px] border-b-white
                        border-r-[22px] border-r-transparent drop-shadow-sm" />

                    {/* Header */}
                    <div className="flex items-start gap-3 mb-5">
                        <div className={`${sev.iconBg} p-2.5 rounded-2xl flex-shrink-0 mt-0.5`}>
                            <SevIcon className={`w-6 h-6 md:w-7 md:h-7 ${sev.iconColor}`} strokeWidth={2.5} />
                        </div>
                        <motion.h2
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.5 }}
                            className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight leading-snug"
                        >
                            {currentEvent.title[language]}
                        </motion.h2>
                    </div>

                    {/* Divider */}
                    <motion.div
                        className={`h-[2px] rounded-full mb-5 bg-gradient-to-r from-transparent ${sev.border.replace('border-','via-')} to-transparent`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.55, duration: 0.5 }}
                    />

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                        transition={{ delay: 0.6, duration: 0.65 }}
                        className="text-slate-600 text-base md:text-lg font-medium leading-relaxed"
                    >
                        &ldquo;{currentEvent.description[language]}&rdquo;
                    </motion.p>
                </motion.div>
            </div>
        </main>
    );
}
