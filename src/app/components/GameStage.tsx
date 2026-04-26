"use client";

import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";
import { GameEvent } from "../../utils/eventBank";
import { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";

interface GameStageProps {
    currentEvent: GameEvent;
}

export function GameStage({ currentEvent }: GameStageProps) {
    const [showAlarm, setShowAlarm] = useState(false);
    const { language } = useSettings();

    useEffect(() => {
        // Trigger alarm every time a new event appears
        setShowAlarm(true);
        const timer = setTimeout(() => setShowAlarm(false), 4000); // Show for 4 seconds
        return () => clearTimeout(timer);
    }, [currentEvent]);

    return (
        <main className="flex-1 overflow-y-auto w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Town background image with blur */}
            <div
                className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat blur-[4px] scale-105"
                style={{ backgroundImage: "url('/backgrounds/town.png')" }}
            />
            {/* Overlay to keep content readable while showing town background */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-black/10 to-black/30" />

            {/* Flashing red screen edge effect during alarm */}
            {showAlarm && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0, 1, 0] }}
                    transition={{ duration: 4 }}
                    className="pointer-events-none absolute inset-0 z-40 border-[16px] border-rose-500/40" 
                />
            )}

            {/* ALARM BANNER */}
            {showAlarm && (
                <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: [0, 20, 20, 20, -100], opacity: [0, 1, 1, 1, 0] }}
                    transition={{ duration: 4, times: [0, 0.1, 0.5, 0.8, 1] }}
                    className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-rose-600 text-white px-6 md:px-10 py-3 md:py-5 rounded-3xl shadow-[0_0_50px_rgba(225,29,72,0.8)] border-4 border-rose-400 flex items-center gap-4 w-[90%] md:w-auto justify-center"
                >
                    <AlertCircle className="w-8 h-8 md:w-12 md:h-12 animate-pulse text-rose-200" />
                    <div className="flex flex-col items-center text-center">
                        <span className="text-xl md:text-3xl font-black tracking-widest uppercase text-white drop-shadow-md">
                            {language === 'vi' ? 'Báo Động Khẩn Cấp!' : 'Emergency Alert!'}
                        </span>
                        <span className="text-xs md:text-sm font-bold text-rose-200 uppercase tracking-widest mt-1">
                            {language === 'vi' ? 'Sự kiện mới phát sinh' : 'New event occurred'}
                        </span>
                    </div>
                    <AlertCircle className="w-8 h-8 md:w-12 md:h-12 animate-pulse text-rose-200" />
                </motion.div>
            )}

            <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 pb-10 mt-12 md:mt-0">
                {/* Avatar Section */}
                <motion.div
                    className="relative flex-shrink-0 z-10"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                    <div className="relative w-48 h-48 md:w-72 md:h-72 rounded-[40px] border-[12px] border-white shadow-xl overflow-hidden bg-sky-100 rotate-[-2deg] flex items-center justify-center">
                        {currentEvent.avatarUrl ? (
                            <img src={currentEvent.avatarUrl} alt={currentEvent.persona[language]} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-sky-400 text-6xl md:text-8xl">🤖</div>
                        )}
                    </div>
                    {/* Status Badge */}
                    <div className="absolute -bottom-4 -right-4 bg-white px-5 py-2.5 rounded-2xl border-4 border-slate-100 shadow-lg transform rotate-6">
                        <span className="font-extrabold text-sky-600 text-sm md:text-base uppercase tracking-wide">
                            {currentEvent.persona[language]}
                        </span>
                    </div>
                </motion.div>

                {/* Speech Bubble */}
                <motion.div
                    className="relative bg-white rounded-[32px] p-6 md:p-10 shadow-[0_12px_40px_rgb(0,0,0,0.08)] border-4 border-white flex-1 max-w-xl"
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                >
                    {/* Chat bubble tail - Desktop */}
                    <div className="hidden md:block absolute -left-8 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[24px] border-t-transparent border-r-[32px] border-r-white border-b-[24px] border-b-transparent drop-shadow-sm" />
                    {/* Chat bubble tail - Mobile */}
                    <div className="md:hidden absolute -top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[24px] border-l-transparent border-b-[32px] border-b-white border-r-[24px] border-r-transparent drop-shadow-sm" />

                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-rose-100 p-2.5 rounded-2xl">
                            <AlertCircle className="w-7 h-7 text-rose-500" strokeWidth={3} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                            {currentEvent.title[language]}
                        </h2>
                    </div>

                    <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed mb-2">
                        &ldquo;{currentEvent.description[language]}&rdquo;
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
