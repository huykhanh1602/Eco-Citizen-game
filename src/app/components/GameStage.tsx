"use client";

import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";
import { Event } from "./InformerModule";

interface GameStageProps {
    currentEvent: Event;
}

export function GameStage({ currentEvent }: GameStageProps) {
    return (
        <main className="flex-1 overflow-y-auto w-full flex items-center justify-center p-4 md:p-8 relative">
            {/* Decorative background blobs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-300/20 rounded-full blur-[80px] -z-10 mix-blend-multiply" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-300/20 rounded-full blur-[100px] -z-10 mix-blend-multiply" />

            <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 pb-10">
                {/* Avatar Section */}
                <motion.div
                    className="relative flex-shrink-0 z-10"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                    <div className="relative w-48 h-48 md:w-72 md:h-72 rounded-[40px] border-[12px] border-white shadow-xl overflow-hidden bg-sky-100 rotate-[-2deg] flex items-center justify-center">
                        {currentEvent.avatarUrl ? (
                            <img src={currentEvent.avatarUrl} alt={currentEvent.persona} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-sky-400 text-6xl md:text-8xl">🤖</div>
                        )}
                    </div>
                    {/* Status Badge */}
                    <div className="absolute -bottom-4 -right-4 bg-white px-5 py-2.5 rounded-2xl border-4 border-slate-100 shadow-lg transform rotate-6">
                        <span className="font-extrabold text-sky-600 text-sm md:text-base uppercase tracking-wide">
                            {currentEvent.persona}
                        </span>
                    </div>
                </motion.div>

                {/* Speech Bubble */}
                <motion.div
                    className="relative bg-white rounded-[32px] p-6 md:p-10 shadow-[0_12px_40px_rgb(0,0,0,0.08)] border-4 border-white flex-1 max-w-xl"
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                            {currentEvent.title}
                        </h2>
                    </div>

                    <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed mb-2">
                        &ldquo;{currentEvent.description}&rdquo;
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
