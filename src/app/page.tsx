"use client";

import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { GameStage } from "./components/GameStage";
import { ActionBar } from "./components/ActionBar";
import { getRandomEvent, GameEvent } from "../utils/eventBank";
import { SettingsModal } from "./components/SettingsModal";
import { useSettings } from "./contexts/SettingsContext";
import { Settings, Zap, Leaf, Coins, Heart } from "lucide-react";

export default function Page() {
    // --- App Navigation State ---
    const [appState, setAppState] = useState<'home' | 'story' | 'game'>('home');
    const [mounted, setMounted] = useState(false);
    const [particles, setParticles] = useState<any[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { language } = useSettings();

    // --- Game State Management ---
    const [metrics, setMetrics] = useState({ energy: 50, environment: 50, budget: 50, trust: 50 });
    const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [turnResult, setTurnResult] = useState<{ analysis: string, suggestion: string, changes?: any } | null>(null);
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
                    event_context: currentEvent.event_context[language],
                    scientific_rules: currentEvent.scientific_rules[language],
                    user_input: userInput,
                    language: language,
                    current_metrics: metrics
                })
            });

            const data = await res.json();
            
            // FastAPI wraps HTTPException details in a `detail` key
            const responseData = data.detail || data;
            
            const changes = responseData.changes || {};
            
            const newMetrics = {
                energy: Math.max(0, Math.min(100, metrics.energy + (changes.energy || 0))),
                environment: Math.max(0, Math.min(100, metrics.environment + (changes.environment || 0))),
                budget: Math.max(0, Math.min(100, metrics.budget + (changes.budget || 0))),
                trust: Math.max(0, Math.min(100, metrics.trust + (changes.trust || 0))),
            };

            setMetrics(newMetrics);
            setTurnResult({
                analysis: responseData.analysis || responseData.consequence || (language === 'vi' ? "Không có phân tích từ AI." : "No analysis from AI."),
                suggestion: responseData.suggestion || (language === 'vi' ? "Không có gợi ý." : "No suggestion."),
                changes: changes
            });

            // Handling Game Over
            if (newMetrics.energy <= 0 || newMetrics.environment <= 0 || newMetrics.budget <= 0 || newMetrics.trust <= 0) {
                setGameOver(responseData.game_over_story || (language === 'vi' ? "Thành phố đã sụp đổ vì những quyết định sai lầm của bạn. Người dân phải rời bỏ quê hương để tìm nơi sống mới." : "The city has collapsed due to your poor decisions. Citizens are forced to abandon their homes."));
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
                <SettingsModal 
                    isOpen={isSettingsOpen} 
                    onClose={() => setIsSettingsOpen(false)} 
                    allowLanguageChange={true} 
                />
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="absolute top-6 right-6 z-20 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-full transition-colors text-slate-300 backdrop-blur-md border border-slate-600"
                >
                    <Settings className="w-6 h-6" />
                </button>

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
                            {language === 'vi' ? 'Trở thành Thị trưởng, cân bằng Sinh thái & Phát triển.' : 'Become the Mayor, balance Ecology & Development.'}
                        </p>
                    </div>

                    <button 
                        onClick={() => setAppState('story')} 
                        className="group relative inline-flex items-center justify-center"
                    >
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 opacity-70 blur-lg transition duration-500 group-hover:opacity-100 group-hover:duration-200"></div>
                        <div className="relative flex items-center gap-3 px-12 py-5 bg-slate-900 border border-slate-700 rounded-2xl transition-all duration-300 group-hover:bg-slate-800">
                            <span className="text-2xl font-bold text-white tracking-wider">
                                {language === 'vi' ? 'Bắt Đầu Mới' : 'Start Game'}
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
                <button 
                    onClick={() => setAppState('game')} 
                    className="absolute top-6 right-6 z-50 px-6 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors bg-slate-800/50 hover:bg-slate-700/50 rounded-full border border-slate-700 backdrop-blur-md"
                >
                    {language === 'vi' ? 'Bỏ qua' : 'Skip Intro'}
                </button>

                {/* Cinematic background */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-10" />
                    {/* Fake rain / static effect */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
                </div>

                <div className="relative z-10 max-w-3xl flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-400 mb-8 tracking-tight drop-shadow-md">
                        {language === 'vi' ? 'Khởi Đầu Mới' : 'New Beginning'}
                    </h2>
                    
                    <div className="space-y-6 text-xl md:text-2xl text-slate-300 leading-relaxed font-light mb-12">
                        <p className="opacity-0 animate-[fadeIn_1s_ease-in_forwards] delay-[500ms]">
                            {language === 'vi' ? 'Thành phố đang đứng trên bờ vực khủng hoảng...' : 'The city is on the brink of crisis...'}
                        </p>
                        <p className="opacity-0 animate-[fadeIn_1s_ease-in_forwards]" style={{ animationDelay: '2s' }}>
                            {language === 'vi' ? 'Năng lượng dần cạn kiệt, môi trường ô nhiễm nặng nề, và niềm tin của người dân đang sụt giảm từng ngày.' : 'Energy is depleting, the environment is heavily polluted, and public trust is dropping every day.'}
                        </p>
                        <p className="opacity-0 animate-[fadeIn_1s_ease-in_forwards]" style={{ animationDelay: '4s' }}>
                            {language === 'vi' ? <>Với tư cách là <span className="text-sky-400 font-bold">Tân Thị trưởng</span>, nhiệm vụ của bạn là đưa ra những quyết định khó khăn để thay đổi số phận của nơi này.</> : <>As the <span className="text-sky-400 font-bold">New Mayor</span>, your mission is to make tough decisions to change the fate of this place.</>}
                        </p>
                        <p className="opacity-0 animate-[fadeIn_1s_ease-in_forwards]" style={{ animationDelay: '6s' }}>
                            {language === 'vi' ? <>Bạn sẽ phải cân bằng giữa 4 yếu tố cốt lõi: <br/> <span className="text-amber-400 font-bold">Năng lượng</span>, <span className="text-emerald-500 font-bold"> Môi trường</span>, <span className="text-blue-400 font-bold"> Ngân sách</span>, và <span className="text-purple-400 font-bold"> Lòng tin</span>.</> : <>You will have to balance 4 core metrics: <br/> <span className="text-amber-400 font-bold">Energy</span>, <span className="text-emerald-500 font-bold"> Environment</span>, <span className="text-blue-400 font-bold"> Budget</span>, and <span className="text-purple-400 font-bold"> Trust</span>.</>}
                        </p>
                        <p className="opacity-0 animate-[fadeIn_1s_ease-in_forwards] text-white font-medium" style={{ animationDelay: '8s' }}>
                            {language === 'vi' ? 'Sự tồn vong của thành phố nằm trong tay bạn. Chúc may mắn!' : 'The survival of the city is in your hands. Good luck!'}
                        </p>
                    </div>

                    <button 
                        onClick={() => setAppState('game')} 
                        className="opacity-0 animate-[fadeIn_1s_ease-in_forwards] px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:shadow-[0_0_30px_rgba(5,150,105,0.6)] hover:-translate-y-1"
                        style={{ animationDelay: '10s' }}
                    >
                        {language === 'vi' ? 'Tiếp Nhận Chức Vụ' : 'Accept Office'}
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

    const handleRestart = () => {
        setMetrics({ energy: 50, environment: 50, budget: 50, trust: 50 });
        setCurrentEvent(getRandomEvent());
        setTurnResult(null);
        setUserInput("");
        setGameOver(null);
        setMonth(1);
        setAppState('story');
    };

    const handleGoHome = () => {
        handleRestart();
        setAppState('home');
    };

    const renderStatBadge = (Icon: any, value: number, label: string) => {
        if (!value) return null;
        const isPositive = value > 0;
        const sign = isPositive ? '+' : '';
        const baseColor = isPositive ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : 'text-rose-700 bg-rose-100 border-rose-200';
        return (
            <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border-2 ${baseColor} shadow-sm min-w-[120px]`}>
                <Icon className="w-5 h-5 shrink-0" />
                <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-bold opacity-80 uppercase tracking-wider">{label}</span>
                    <span className="text-sm md:text-base font-black leading-none mt-0.5">{sign}{value}</span>
                </div>
            </div>
        );
    };

    // ==========================================
    // 3. MAIN GAME SCREEN
    // ==========================================
    return (
        <div className="h-screen w-full flex flex-col text-slate-800 font-sans overflow-hidden">
            <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
                allowLanguageChange={false} 
                onRestart={handleRestart}
                onGoHome={handleGoHome}
            />
            {/* Always show Top Resource Bar */}
            <Dashboard month={month} metrics={metrics} onSettingsClick={() => setIsSettingsOpen(true)} />

            {gameOver ? (
                /* Game Over Screen */
                <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
                    <div className="absolute inset-0 bg-rose-500/10 backdrop-blur-sm -z-10" />
                    <div className="bg-white p-12 rounded-[40px] shadow-2xl border-8 border-rose-100 max-w-2xl w-full">
                        <div className="text-6xl mb-6">💥</div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-rose-600 mb-6 tracking-tight">
                            {language === 'vi' ? 'Thảm Họa Xảy Ra!' : 'Disaster Strikes!'}
                        </h1>
                        
                        {/* MONTHS IN OFFICE */}
                        <div className="mb-6 inline-block bg-slate-100 px-6 py-2 rounded-full border-2 border-slate-200">
                            <span className="text-slate-600 font-bold text-lg md:text-xl">
                                {language === 'vi' ? `Tại vị: ${month} tháng` : `Months in Office: ${month}`}
                            </span>
                        </div>

                        <p className="text-xl text-slate-700 mb-10 font-medium italic leading-relaxed">
                            "{gameOver}"
                        </p>
                        <button 
                            onClick={handleGoHome}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xl py-5 px-10 rounded-2xl transition-all shadow-[0_8px_0_rgb(225,29,72)] hover:translate-y-[4px] hover:shadow-[0_4px_0_rgb(225,29,72)] active:translate-y-[8px] active:shadow-none w-full"
                        >
                            {language === 'vi' ? 'Chơi lại từ đầu' : 'Play Again'}
                        </button>
                    </div>
                </main>
            ) : turnResult ? (
                /* Result Board (Turn Transition) */
                <main className="flex-1 overflow-y-auto w-full flex flex-col items-center p-4 md:p-8 relative">
                    <div className="max-w-3xl w-full bg-white rounded-[32px] p-6 md:p-10 shadow-[0_12px_40px_rgb(0,0,0,0.08)] border-4 border-white mt-4 md:mt-10">
                        <h2 className="text-3xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
                            <span className="bg-sky-100 text-sky-500 p-2 rounded-xl">📊</span> 
                            {language === 'vi' ? 'Báo Cáo Tháng' : 'Monthly Report'}
                        </h2>
                        
                        <div className="space-y-6 mb-10">
                            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100">
                                <h3 className="text-xl font-bold text-sky-600 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                                    {language === 'vi' ? 'Phân Tích Hậu Quả' : 'Consequence Analysis'}
                                </h3>
                                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                                    {turnResult.analysis}
                                </p>
                                
                                {turnResult.changes && Object.values(turnResult.changes).some(val => val !== 0) && (
                                    <div className="mt-6 pt-5 border-t-2 border-slate-200">
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                                            {language === 'vi' ? 'Biến Động Chỉ Số' : 'Stat Changes'}
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {renderStatBadge(Zap, turnResult.changes.energy, language === 'vi' ? 'Năng lượng' : 'Energy')}
                                            {renderStatBadge(Leaf, turnResult.changes.environment, language === 'vi' ? 'Môi trường' : 'Environment')}
                                            {renderStatBadge(Coins, turnResult.changes.budget, language === 'vi' ? 'Ngân sách' : 'Budget')}
                                            {renderStatBadge(Heart, turnResult.changes.trust, language === 'vi' ? 'Lòng tin' : 'Trust')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-100">
                                <h3 className="text-xl font-bold text-emerald-600 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    {language === 'vi' ? 'Gợi Ý Cải Thiện' : 'Suggestions'}
                                </h3>
                                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                                    {turnResult.suggestion}
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={handleNextTurn}
                            className="w-full bg-sky-400 hover:bg-sky-500 text-white font-extrabold text-xl py-5 rounded-2xl transition-all shadow-[0_8px_0_rgb(14,165,233)] hover:translate-y-[4px] hover:shadow-[0_4px_0_rgb(14,165,233)] active:translate-y-[8px] active:shadow-none flex items-center justify-center gap-2"
                        >
                            {language === 'vi' ? 'Tiếp Tục (Tháng Tiếp Theo)' : 'Continue (Next Month)'}
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
