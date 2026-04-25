"use client";

import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { GameStage } from "./components/GameStage";
import { ActionBar } from "./components/ActionBar";
import { getRandomEvent, GameEvent } from "../utils/eventBank";

export default function Page() {
    // --- App Navigation State ---
    const [appState, setAppState] = useState<'home' | 'story' | 'game'>('home');
    const [mounted, setMounted] = useState(false);
    const [particles, setParticles] = useState<any[]>([]);

    // --- Game State Management ---
    const [metrics, setMetrics] = useState({ energy: 100, environment: 100, budget: 100, trust: 100 });
    const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [turnResult, setTurnResult] = useState<{ analysis: string, suggestion: string } | null>(null);
    const [gameOver, setGameOver] = useState<string | null>(null);
    const [month, setMonth] = useState(1);

    // Initialization & Load from LocalStorage
    useEffect(() => {
        const savedState = localStorage.getItem('ecoCitizenGameState');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.appState) setAppState(parsed.appState);
                if (parsed.metrics) setMetrics(parsed.metrics);
                if (parsed.currentEvent) setCurrentEvent(parsed.currentEvent);
                if (parsed.turnResult !== undefined) setTurnResult(parsed.turnResult);
                if (parsed.gameOver !== undefined) setGameOver(parsed.gameOver);
                if (parsed.month !== undefined) setMonth(parsed.month);
            } catch (e) {
                console.error("Failed to parse saved game state");
                setCurrentEvent(getRandomEvent());
            }
        } else {
            setCurrentEvent(getRandomEvent());
        }

        setMounted(true);
        // Generate random values on client side for particles
        const newParticles = [...Array(20)].map(() => ({
            width: Math.random() * 6 + 2 + 'px',
            height: Math.random() * 6 + 2 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            animationDelay: `-${Math.random() * 10}s`
        }));
        setParticles(newParticles);
    }, []);

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        if (!mounted) return;
        
        const gameState = {
            appState,
            metrics,
            currentEvent,
            turnResult,
            gameOver,
            month
        };
        localStorage.setItem('ecoCitizenGameState', JSON.stringify(gameState));
    }, [appState, metrics, currentEvent, turnResult, gameOver, month, mounted]);

    // Handling Submission
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!userInput.trim() || isLoading || !currentEvent) return;

        setIsLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            const res = await fetch(`${baseUrl}/api/evaluate`, {
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
            
            // FastAPI wraps HTTPException details in a `detail` key
            const responseData = data.detail || data;
            
            const changes = responseData.changes || {};
            
            const newMetrics = {
                energy: metrics.energy + (changes.energy || 0),
                environment: metrics.environment + (changes.environment || 0),
                budget: metrics.budget + (changes.budget || 0),
                trust: metrics.trust + (changes.trust || 0),
            };

            setMetrics(newMetrics);
            setTurnResult({
                analysis: responseData.analysis || responseData.consequence || "Không có phân tích từ AI.",
                suggestion: responseData.suggestion || "Không có gợi ý."
            });

            // Handling Game Over
            if (newMetrics.energy <= 0 || newMetrics.environment <= 0 || newMetrics.budget <= 0 || newMetrics.trust <= 0) {
                setGameOver('lose');
            }
        } catch (error) {
            console.error("Lỗi khi gọi AI:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Next Turn
    const handleNextTurn = () => {
        setTurnResult(null);
        setUserInput("");
        setCurrentEvent(getRandomEvent());
        setMonth(prev => prev + 1);
    };

    if (!mounted) return null;

    // ==========================================
    // 1. HOME SCREEN
    // ==========================================
    if (appState === 'home') {
        return (
            <div className="relative h-screen w-full overflow-hidden bg-slate-900 flex items-center justify-center font-sans">
                {/* Background Animated Gradient */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/30 blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-sky-600/30 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {particles.map((style, i) => (
                        <div key={i} className="absolute bg-white/20 rounded-full" style={style} />
                    ))}
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                    <div className="mb-12 relative group cursor-default">
                        <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 tracking-tighter drop-shadow-lg transition-transform duration-500 group-hover:scale-105">
                            Eco Citizen
                        </h1>
                        <p className="mt-6 text-xl md:text-2xl font-medium text-slate-300 tracking-wide opacity-90 max-w-2xl mx-auto">
                            Trở thành Thị trưởng, cân bằng Sinh thái & Phát triển.
                        </p>
                    </div>

                    <button 
                        onClick={() => setAppState('story')} 
                        className="group relative inline-flex items-center justify-center"
                    >
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 opacity-70 blur-lg transition duration-500 group-hover:opacity-100 group-hover:duration-200"></div>
                        <div className="relative flex items-center gap-3 px-12 py-5 bg-slate-900 border border-slate-700 rounded-2xl transition-all duration-300 group-hover:bg-slate-800">
                            <span className="text-2xl font-bold text-white tracking-wider">
                                Start Game
                            </span>
                        </div>
                    </button>
                    
                    <p className="mt-16 text-sm text-slate-500 font-medium">
                        AI-Powered City Management Simulator
                    </p>
                </div>

                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes float {
                        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                    }
                `}} />
            </div>
        );
    }

    // ==========================================
    // 2. STORY / TUTORIAL SCREEN
    // ==========================================
    if (appState === 'story') {
        return (
            <div className="relative h-screen w-full bg-slate-950 flex flex-col items-center justify-center font-sans p-6 text-center overflow-hidden">
                {/* Cinematic background */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-10" />
                    {/* Fake rain / static effect */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
                </div>

                <div className="relative z-10 max-w-3xl flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-400 mb-8 tracking-tight drop-shadow-md">
                        Khởi Đầu Mới
                    </h2>
                    
                    <div className="space-y-6 text-xl md:text-2xl text-slate-300 leading-relaxed font-light mb-12">
                        <p className="opacity-0 animate-[fadeIn_1s_ease-in_forwards] delay-[500ms]">
                            Thành phố đang đứng trên bờ vực khủng hoảng...
                        </p>
                        <p className="opacity-0 animate-[fadeIn_1s_ease-in_forwards]" style={{ animationDelay: '2s' }}>
                            Năng lượng dần cạn kiệt, môi trường ô nhiễm nặng nề, và niềm tin của người dân đang sụt giảm từng ngày.
                        </p>
                        <p className="opacity-0 animate-[fadeIn_1s_ease-in_forwards]" style={{ animationDelay: '4s' }}>
                            Với tư cách là <span className="text-sky-400 font-bold">Tân Thị trưởng</span>, nhiệm vụ của bạn là đưa ra những quyết định khó khăn để thay đổi số phận của nơi này.
                        </p>
                        <p className="opacity-0 animate-[fadeIn_1s_ease-in_forwards]" style={{ animationDelay: '6s' }}>
                            Bạn sẽ phải cân bằng giữa 4 yếu tố cốt lõi: 
                            <br/>
                            <span className="text-amber-400 font-bold">Năng lượng</span>, 
                            <span className="text-emerald-500 font-bold"> Môi trường</span>, 
                            <span className="text-blue-400 font-bold"> Ngân sách</span>, và 
                            <span className="text-purple-400 font-bold"> Lòng tin</span>.
                        </p>
                        <p className="opacity-0 animate-[fadeIn_1s_ease-in_forwards] text-white font-medium" style={{ animationDelay: '8s' }}>
                            Sự tồn vong của thành phố nằm trong tay bạn. Chúc may mắn!
                        </p>
                    </div>

                    <button 
                        onClick={() => setAppState('game')} 
                        className="opacity-0 animate-[fadeIn_1s_ease-in_forwards] px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:shadow-[0_0_30px_rgba(5,150,105,0.6)] hover:-translate-y-1"
                        style={{ animationDelay: '10s' }}
                    >
                        Tiếp Nhận Chức Vụ
                    </button>
                </div>

                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}} />
            </div>
        );
    }

    // ==========================================
    // 3. MAIN GAME SCREEN
    // ==========================================
    return (
        <div className="h-screen w-full flex flex-col bg-gradient-to-b from-sky-50 to-emerald-50 text-slate-800 font-sans overflow-hidden">
            {/* Always show Top Resource Bar */}
            <Dashboard month={month} metrics={metrics} />

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
                            onClick={() => {
                                setMetrics({ energy: 100, environment: 100, budget: 100, trust: 100 });
                                setCurrentEvent(getRandomEvent());
                                setTurnResult(null);
                                setUserInput("");
                                setGameOver(null);
                                setMonth(1);
                                setAppState('home');
                            }}
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
