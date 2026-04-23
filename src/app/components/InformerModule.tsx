"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Send, AlertCircle, Loader2 } from "lucide-react";

interface Event {
    id: string;
    title: string;
    description: string;
    avatarUrl: string;
    persona: string;
}

export function InformerModule() {
    // State Management
    const [currentEvent, setCurrentEvent] = useState<Event>({
        id: "ev_flood_01",
        title: "Báo động lũ khẩn cấp!",
        description: "Thưa Thị trưởng! Mực nước sông đang dâng cao bất thường do bão lớn. Khu vực hạ lưu có nguy cơ ngập nặng trong vài giờ tới. Chúng ta cần sơ tán người dân hoặc mở đập xả lũ ngay lập tức. Quyết định của ngài là gì?",
        avatarUrl: "", // placeholder
        persona: "Advisor Bot"
    });

    const [userInput, setUserInput] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Interaction Logic
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!userInput.trim() || isAnalyzing) return;

        setIsAnalyzing(true);
        const inputText = userInput;
        setUserInput("");

        try {
            const res = await fetch("http://localhost:8000/api/evaluate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    event_context: "",
                    scientific_rules: "",
                    user_input: inputText
                })
            });
            
            const data = await res.json();
            console.log("Kết quả từ AI:", data);
        } catch (error) {
            console.error("Lỗi khi gọi AI:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col flex-1 overflow-hidden relative w-full h-full">
            {/* Event Stage (Center/Top area) */}
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

            {/* Action Bar (Fixed Bottom area) */}
            <footer className="w-full bg-white border-t-[3px] border-slate-200 px-4 py-4 md:px-8 md:py-6 z-20 shrink-0 shadow-[0_-10px_40px_rgb(0,0,0,0.05)]">
                <div className="max-w-5xl mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-end gap-3 md:gap-5"
                    >
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập quyết định của Thị trưởng vào đây..."
                            disabled={isAnalyzing}
                            className="w-full bg-slate-50 border-2 border-slate-200 border-b-[6px] rounded-2xl px-5 py-4 md:py-5 text-lg text-slate-700 font-bold placeholder:text-slate-400 placeholder:font-semibold focus:outline-none focus:border-sky-400 focus:border-b-[6px] focus:bg-white transition-colors resize-none h-20 md:h-24 leading-tight disabled:opacity-60 disabled:cursor-not-allowed"
                        />

                        <button
                            type="submit"
                            disabled={!userInput.trim() || isAnalyzing}
                            className={`
                                text-white rounded-2xl px-6 md:px-8 h-20 md:h-24 flex flex-col items-center justify-center gap-1 transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-80
                                ${isAnalyzing 
                                    ? "bg-amber-400 border-2 border-amber-500 border-b-[6px] translate-y-[4px] border-b-2" 
                                    : "bg-sky-400 hover:bg-sky-400 active:bg-sky-500 border-2 border-sky-500 border-b-[6px] active:border-b-2 active:translate-y-[4px]"
                                }
                            `}
                        >
                            <span className="font-extrabold text-lg md:text-xl tracking-wide whitespace-nowrap">
                                {isAnalyzing ? "AI đang phân tích..." : "Ra lệnh"}
                            </span>
                            {isAnalyzing ? (
                                <Loader2 className="w-6 h-6 animate-spin" strokeWidth={3} />
                            ) : (
                                <Send className="w-6 h-6" strokeWidth={3} />
                            )}
                        </button>
                    </form>
                </div>
            </footer>
        </div>
    );
}
