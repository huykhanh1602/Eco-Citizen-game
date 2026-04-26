"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
        const storyLines = [
            {
                delay: 1.6,
                vi: 'Thành phố đang đứng trên bờ vực khủng hoảng...',
                en: 'The city is on the brink of crisis...',
            },
            {
                delay: 3.2,
                vi: 'Năng lượng dần cạn kiệt, môi trường ô nhiễm nặng nề, và niềm tin của người dân đang sụt giảm từng ngày.',
                en: 'Energy is depleting, the environment is heavily polluted, and public trust is dropping every day.',
            },
            {
                delay: 5.0,
                vi: (<>Với tư cách là <span className="text-sky-400 font-bold">Tân Thị trưởng</span>, nhiệm vụ của bạn là đưa ra những quyết định khó khăn để thay đổi số phận của nơi này.</>),
                en: (<>As the <span className="text-sky-400 font-bold">New Mayor</span>, your mission is to make tough decisions to change the fate of this place.</>),
            },
            {
                delay: 6.8,
                vi: (<>Bạn sẽ phải cân bằng giữa 4 yếu tố cốt lõi:<br/><span className="text-amber-400 font-bold">Năng lượng</span>, <span className="text-emerald-400 font-bold">Môi trường</span>, <span className="text-blue-400 font-bold">Ngân sách</span>, và <span className="text-purple-400 font-bold">Lòng tin</span>.</>),
                en: (<>You must balance 4 core metrics:<br/><span className="text-amber-400 font-bold">Energy</span>, <span className="text-emerald-400 font-bold">Environment</span>, <span className="text-blue-400 font-bold">Budget</span>, and <span className="text-purple-400 font-bold">Trust</span>.</>),
            },
            {
                delay: 8.4,
                vi: 'Sự tồn vong của thành phố nằm trong tay bạn. Chúc may mắn!',
                en: 'The survival of the city is in your hands. Good luck!',
                bold: true,
            },
        ];

        return (
            <div className="relative h-screen w-full flex flex-col items-center justify-center font-sans p-6 text-center overflow-hidden">

                {/* ── Skip button (always on top) ── */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    onClick={() => setAppState('game')}
                    className="absolute top-8 right-8 z-[60] px-6 py-2 text-slate-300 hover:text-white text-sm font-semibold transition-all bg-white/10 hover:bg-white/20 rounded-full border border-white/20 backdrop-blur-md"
                >
                    {language === 'vi' ? 'Bỏ qua ›' : 'Skip ›'}
                </motion.button>

                {/* ── LAYER 1: Town background blurred ── */}
                <div
                    className="absolute -inset-8 z-0 bg-cover bg-center scale-110 blur-[28px] brightness-[0.45]"
                    style={{ backgroundImage: "url('/backgrounds/town.png')" }}
                />

                {/* ── LAYER 2: Dark gradient overlay ── */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

                {/* ── LAYER 3: Radial vignette ── */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,black_100%)]" />

                {/* ── LAYER 4: Scanlines ── */}
                <div className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.08)_3px,rgba(0,0,0,0.08)_4px)]" />

                {/* ── LAYER 5: Ambient color glows ── */}
                <motion.div
                    className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-emerald-500/15 blur-[120px] z-0"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-sky-500/15 blur-[140px] z-0"
                    animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
                />

                {/* ── CINEMATIC LETTERBOX BARS ── */}
                <motion.div
                    className="absolute top-0 left-0 right-0 z-20 bg-black origin-top"
                    initial={{ height: '15%' }}
                    animate={{ height: '8%' }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 right-0 z-20 bg-black origin-bottom"
                    initial={{ height: '15%' }}
                    animate={{ height: '8%' }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                />

                {/* ── CONTENT ── */}
                <div className="relative z-30 max-w-2xl w-full flex flex-col items-center">

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -24, letterSpacing: '0.4em' }}
                        animate={{ opacity: 1, y: 0, letterSpacing: '0.04em' }}
                        transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                        className="mb-2"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_40px_rgba(52,211,153,0.7)]">
                            {language === 'vi' ? 'Khởi Đầu Mới' : 'A New Beginning'}
                        </h2>
                    </motion.div>

                    {/* Divider line */}
                    <motion.div
                        className="h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent mb-10"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '100%', opacity: 1 }}
                        transition={{ duration: 1.2, delay: 1.1, ease: "easeOut" }}
                    />

                    {/* Story paragraphs */}
                    <div className="space-y-5 text-lg md:text-xl text-slate-200 leading-relaxed font-light mb-14">
                        {storyLines.map((line, i) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 1.1, delay: line.delay, ease: "easeOut" }}
                                className={line.bold ? 'text-white font-semibold text-xl md:text-2xl' : ''}
                            >
                                {language === 'vi' ? line.vi : line.en}
                            </motion.p>
                        ))}
                    </div>

                    {/* Accept button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 10.2, ease: "backOut" }}
                        whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(52,211,153,0.6)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setAppState('game')}
                        className="relative group px-14 py-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-extrabold rounded-2xl transition-colors duration-300 shadow-[0_0_30px_rgba(5,150,105,0.5)] border border-emerald-400/30 overflow-hidden"
                    >
                        {/* Shimmer */}
                        <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <span className="relative z-10">
                            {language === 'vi' ? '⚖️  Tiếp Nhận Chức Vụ' : '⚖️  Accept Office'}
                        </span>
                    </motion.button>
                </div>
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

    // Pre-compute turn result summary (safe even when turnResult is null)
    const resultChanges = turnResult?.changes || {};
    const netScore = (resultChanges.energy||0) + (resultChanges.environment||0) + (resultChanges.budget||0) + (resultChanges.trust||0);
    const isGoodTurn = netScore >= 0;

    const renderStatBadge = (Icon: any, value: number, label: string, idx: number) => {
        if (!value) return null;
        const isPositive = value > 0;
        const sign = isPositive ? '+' : '';
        const baseColor = isPositive
            ? 'text-emerald-700 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300'
            : 'text-rose-700 bg-gradient-to-br from-rose-50 to-rose-100 border-rose-300';
        return (
            <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 + idx * 0.1 }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 ${baseColor} shadow-md min-w-[130px]`}
            >
                <Icon className="w-5 h-5 shrink-0" />
                <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-bold opacity-70 uppercase tracking-wider">{label}</span>
                    <motion.span
                        className="text-base md:text-lg font-black leading-none mt-0.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                        {sign}{value}
                    </motion.span>
                </div>
            </motion.div>
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
                /* ── GAME OVER SCREEN ── */
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                    {/* BG: town.png + heavy red tint */}
                    <div className="absolute -inset-4 bg-cover bg-center blur-[20px] brightness-[0.3] scale-110" style={{ backgroundImage: "url('/backgrounds/town.png')" }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-rose-950/80 via-rose-900/60 to-black/90" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,black_90%)]" />

                    {/* Falling debris particles */}
                    {[...Array(16)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute top-0 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-400/60"
                            style={{ left: `${Math.random() * 100}%` }}
                            animate={{ y: ['0vh', '110vh'], opacity: [0, 0.8, 0], rotate: [0, 360] }}
                            transition={{ duration: 2.5 + Math.random() * 3, delay: Math.random() * 2, repeat: Infinity, ease: 'linear' }}
                        />
                    ))}

                    {/* Pulsing red vignette */}
                    <motion.div
                        className="pointer-events-none absolute inset-0 border-[20px] border-rose-600/40"
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Card */}
                    <motion.div
                        className="relative z-10 bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-[40px] shadow-[0_0_80px_rgba(225,29,72,0.4)] border-4 border-rose-200 max-w-2xl w-full"
                        initial={{ opacity: 0, scale: 0.7, y: 60 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
                    >
                        {/* Explosion icon */}
                        <motion.div
                            className="text-7xl md:text-8xl mb-4 select-none"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: [0, 1.4, 1], rotate: [30, 10, 0] }}
                            transition={{ duration: 0.7, delay: 0.5, ease: 'backOut' }}
                        >💥</motion.div>

                        {/* Title with red glow */}
                        <motion.h1
                            className="text-3xl md:text-5xl font-black text-rose-600 mb-5 tracking-tight drop-shadow-[0_0_20px_rgba(225,29,72,0.5)]"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                        >
                            {language === 'vi' ? 'Thảm Họa Xảy Ra!' : 'Disaster Strikes!'}
                        </motion.h1>

                        {/* Months in office */}
                        <motion.div
                            className="mb-5 inline-block bg-rose-50 px-6 py-2.5 rounded-full border-2 border-rose-200 shadow-inner"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            <span className="text-rose-700 font-extrabold text-lg md:text-xl">
                                🗓️ {language === 'vi' ? `Tại vị: ${month} tháng` : `Months in Office: ${month}`}
                            </span>
                        </motion.div>

                        {/* AI story */}
                        <motion.p
                            className="text-lg md:text-xl text-slate-700 mb-8 font-medium italic leading-relaxed border-l-4 border-rose-300 pl-4 text-left"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1, duration: 0.6 }}
                        >
                            &ldquo;{gameOver}&rdquo;
                        </motion.p>

                        {/* Divider */}
                        <motion.div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent mb-6"
                            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.3, duration: 0.5 }}
                        />

                        {/* Button */}
                        <motion.button
                            onClick={handleGoHome}
                            className="relative group w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xl py-5 rounded-2xl transition-colors shadow-[0_8px_0_rgb(190,18,60)] hover:translate-y-1 hover:shadow-[0_4px_0_rgb(190,18,60)] active:translate-y-2 active:shadow-none overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            🔄 {language === 'vi' ? 'Chơi lại từ đầu' : 'Play Again'}
                        </motion.button>
                    </motion.div>
                </main>
            ) : turnResult ? (() => {
                // Determine if this turn was net positive or negative
                const changes = turnResult.changes || {};
                const netScore = (changes.energy||0)+(changes.environment||0)+(changes.budget||0)+(changes.trust||0);
                const isGoodTurn = netScore >= 0;
                return (
                /* ── AI RESULT SCREEN ── */
                <main className="flex-1 overflow-y-auto w-full flex flex-col items-center p-4 md:p-8 relative overflow-hidden">
                    {/* BG: town.png with tinted overlay */}
                    <div className="absolute inset-0 bg-cover bg-center blur-[3px] brightness-[0.55] scale-105" style={{ backgroundImage: "url('/backgrounds/town.png')" }} />
                    <div className={`absolute inset-0 bg-gradient-to-b ${
                        isGoodTurn ? 'from-emerald-950/50 via-sky-950/30 to-slate-950/60' : 'from-rose-950/50 via-slate-950/30 to-slate-950/60'
                    }`} />

                    {/* Floating sparkle particles */}
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute bottom-0 rounded-full ${isGoodTurn ? 'bg-emerald-400' : 'bg-rose-400'}`}
                            style={{ left: `${10 + i * 9}%`, width: 4 + (i % 3) * 3, height: 4 + (i % 3) * 3 }}
                            animate={{ y: [0, -(120 + i * 30)], opacity: [0, 0.7, 0] }}
                            transition={{ duration: 3 + i * 0.3, delay: i * 0.2, repeat: Infinity, repeatDelay: 1, ease: 'easeOut' }}
                        />
                    ))}

                    {/* Summary banner */}
                    <motion.div
                        className={`relative z-10 mt-4 mb-4 px-8 py-3 rounded-2xl border-2 flex items-center gap-3 shadow-lg ${
                            isGoodTurn
                            ? 'bg-emerald-600/90 border-emerald-400 text-white'
                            : 'bg-rose-600/90 border-rose-400 text-white'
                        }`}
                        initial={{ opacity: 0, y: -30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    >
                        <span className="text-2xl">{isGoodTurn ? '✅' : '⚠️'}</span>
                        <span className="font-extrabold text-lg tracking-wide">
                            {isGoodTurn
                                ? (language === 'vi' ? `Tháng ${month}: Quyết định tốt! (+${netScore})` : `Month ${month}: Good decision! (+${netScore})`)
                                : (language === 'vi' ? `Tháng ${month}: Cần cải thiện (${netScore})` : `Month ${month}: Needs improvement (${netScore})`)}
                        </span>
                    </motion.div>

                    {/* Main card */}
                    <motion.div
                        className="relative z-10 max-w-3xl w-full bg-white/95 backdrop-blur-md rounded-[32px] p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.25)] border-4 border-white/80 mb-6"
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 22, delay: 0.1 }}
                    >
                        {/* Header */}
                        <motion.h2
                            className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6 flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="bg-sky-100 text-sky-500 p-2.5 rounded-2xl text-2xl">📊</span>
                            {language === 'vi' ? 'Báo Cáo Tháng' : 'Monthly Report'}
                        </motion.h2>

                        <div className="space-y-5 mb-8">
                            {/* Analysis section */}
                            <motion.div
                                className="bg-slate-50 rounded-2xl p-5 md:p-6 border-2 border-slate-100"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.5 }}
                            >
                                <h3 className="text-lg font-bold text-sky-600 mb-3 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                                    {language === 'vi' ? 'Phân Tích Hậu Quả' : 'Consequence Analysis'}
                                </h3>
                                <motion.p
                                    className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap"
                                    initial={{ opacity: 0, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    {turnResult.analysis}
                                </motion.p>

                                {/* Stat changes */}
                                {turnResult.changes && Object.values(turnResult.changes).some(val => val !== 0) && (
                                    <motion.div
                                        className="mt-5 pt-5 border-t-2 border-slate-200"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                            {language === 'vi' ? '⚡ Biến Động Chỉ Số' : '⚡ Stat Changes'}
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {renderStatBadge(Zap,   turnResult.changes.energy,      language === 'vi' ? 'Năng lượng' : 'Energy',      0)}
                                            {renderStatBadge(Leaf,  turnResult.changes.environment,  language === 'vi' ? 'Môi trường' : 'Environment',  1)}
                                            {renderStatBadge(Coins, turnResult.changes.budget,       language === 'vi' ? 'Ngân sách' : 'Budget',       2)}
                                            {renderStatBadge(Heart, turnResult.changes.trust,        language === 'vi' ? 'Lòng tin' : 'Trust',         3)}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Suggestion section */}
                            <motion.div
                                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 md:p-6 border-2 border-emerald-100"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <h3 className="text-lg font-bold text-emerald-600 mb-3 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    {language === 'vi' ? 'Gợi Ý Cải Thiện' : 'Suggestions'}
                                </h3>
                                <motion.p
                                    className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap"
                                    initial={{ opacity: 0, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                                    transition={{ delay: 0.55, duration: 0.6 }}
                                >
                                    {turnResult.suggestion}
                                </motion.p>
                            </motion.div>
                        </div>

                        {/* Next turn button */}
                        <motion.button
                            onClick={handleNextTurn}
                            className="relative group w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xl py-5 rounded-2xl transition-colors shadow-[0_8px_0_rgb(2,132,199)] hover:translate-y-1 hover:shadow-[0_4px_0_rgb(2,132,199)] active:translate-y-2 active:shadow-none flex items-center justify-center gap-3 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <span className="relative">{language === 'vi' ? 'Tháng Tiếp Theo' : 'Next Month'}</span>
                            <motion.span
                                className="relative text-2xl"
                                animate={{ x: [0, 6, 0] }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                            >➡️</motion.span>
                        </motion.button>
                    </motion.div>
                </main>
                );
            })(
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
