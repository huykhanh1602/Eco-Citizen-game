"use client";

import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { GameStage } from "./components/GameStage";
import { ActionBar } from "./components/ActionBar";
import { getRandomEvent, GameEvent } from "../utils/eventBank";

export default function Page() {
    // State Management
    const [metrics, setMetrics] = useState({ energy: 100, environment: 100, budget: 100, trust: 100 });
    const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [turnResult, setTurnResult] = useState<{ analysis: string, suggestion: string } | null>(null);
    const [gameOver, setGameOver] = useState<string | null>(null);

    // Initialization
    useEffect(() => {
        setCurrentEvent(getRandomEvent());
    }, []);

    // Handling Submission
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!userInput.trim() || isLoading || !currentEvent) return;

        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/evaluate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    event_context: currentEvent.event_context,
                    scientific_rules: currentEvent.scientific_rules,
                    user_input: userInput
                })
            });

            const data = await res.json();
            
            // Expected backend JSON: { analysis, consequence, changes: { energy, environment, budget, trust }, suggestion }
            const changes = data.changes || {};
            
            const newMetrics = {
                energy: metrics.energy + (changes.energy || 0),
                environment: metrics.environment + (changes.environment || 0),
                budget: metrics.budget + (changes.budget || 0),
                trust: metrics.trust + (changes.trust || 0),
            };

            setMetrics(newMetrics);
            setTurnResult({
                analysis: data.analysis || data.consequence || "Không có phân tích từ AI.",
                suggestion: data.suggestion || "Không có gợi ý."
            });

            // Handling Game Over
            if (newMetrics.energy <= 0 || newMetrics.environment <= 0 || newMetrics.budget <= 0 || newMetrics.trust <= 0) {
                setGameOver('lose');
            }
        } catch (error) {
            console.error("Lỗi khi gọi AI:", error);
            // Optional: Handle error UI here
        } finally {
            setIsLoading(false);
        }
    };

    // Next Turn
    const handleNextTurn = () => {
        setTurnResult(null);
        setUserInput("");
        setCurrentEvent(getRandomEvent());
    };

    return (
        <div className="h-screen w-full flex flex-col bg-gradient-to-b from-sky-50 to-emerald-50 text-slate-800 font-sans overflow-hidden">
            {/* Always show Top Resource Bar */}
            <Dashboard metrics={metrics} />

            {gameOver === 'lose' ? (
                /* Game Over Screen */
                <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
                    <div className="absolute inset-0 bg-rose-500/10 backdrop-blur-sm -z-10" />
                    <div className="bg-white p-12 rounded-[40px] shadow-2xl border-8 border-rose-100 max-w-2xl w-full">
                        <div className="text-6xl mb-6">💥</div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-rose-600 mb-6 tracking-tight">
                            Thảm Họa Xảy Ra!
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 font-medium">
                            Một trong các chỉ số cốt lõi đã cạn kiệt. Với tư cách là Thị trưởng, bạn đã không thể giữ được sự cân bằng sinh thái và xã hội. 
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xl py-5 px-10 rounded-2xl transition-all shadow-[0_8px_0_rgb(225,29,72)] hover:translate-y-[4px] hover:shadow-[0_4px_0_rgb(225,29,72)] active:translate-y-[8px] active:shadow-none w-full"
                        >
                            Chơi lại từ đầu
                        </button>
                    </div>
                </main>
            ) : turnResult ? (
                /* Result Board (Turn Transition) */
                <main className="flex-1 overflow-y-auto w-full flex flex-col items-center p-4 md:p-8 relative">
                    <div className="max-w-3xl w-full bg-white rounded-[32px] p-6 md:p-10 shadow-[0_12px_40px_rgb(0,0,0,0.08)] border-4 border-white mt-4 md:mt-10">
                        <h2 className="text-3xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
                            <span className="bg-sky-100 text-sky-500 p-2 rounded-xl">📊</span> 
                            Báo Cáo Tháng
                        </h2>
                        
                        <div className="space-y-6 mb-10">
                            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100">
                                <h3 className="text-xl font-bold text-sky-600 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                                    Phân Tích Hậu Quả
                                </h3>
                                <p className="text-slate-700 text-lg leading-relaxed">
                                    {turnResult.analysis}
                                </p>
                            </div>

                            <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-100">
                                <h3 className="text-xl font-bold text-emerald-600 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Gợi Ý Cải Thiện
                                </h3>
                                <p className="text-slate-700 text-lg leading-relaxed">
                                    {turnResult.suggestion}
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={handleNextTurn}
                            className="w-full bg-sky-400 hover:bg-sky-500 text-white font-extrabold text-xl py-5 rounded-2xl transition-all shadow-[0_8px_0_rgb(14,165,233)] hover:translate-y-[4px] hover:shadow-[0_4px_0_rgb(14,165,233)] active:translate-y-[8px] active:shadow-none flex items-center justify-center gap-2"
                        >
                            Tiếp Tục (Next Month)
                            <span className="text-2xl">➡️</span>
                        </button>
                    </div>
                </main>
            ) : (
                /* Playing Turn */
                <>
                    {currentEvent && <GameStage currentEvent={currentEvent} />}
                    <ActionBar 
                        userInput={userInput}
                        setUserInput={setUserInput}
                        isAnalyzing={isLoading}
                        onSubmit={handleSubmit}
                    />
                </>
            )}
        </div>
    );
}
