import { SettingsModal } from "../components/SettingsModal";
import { Dashboard } from "../components/Dashboard";
import { GameStage } from "../components/GameStage";
import { ActionBar } from "../components/ActionBar";
import { Zap, Leaf, Coins, Heart, Lightbulb, AlertCircle, Search, ChevronDown } from "lucide-react";
import { GameEvent } from "../../utils/eventBank";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface GameScreenProps {
    language: string;
    isSettingsOpen: boolean;
    setIsSettingsOpen: (isOpen: boolean) => void;
    metrics: { energy: number; environment: number; budget: number; trust: number };
    month: number;
    isVictory: boolean;
    gameOver: string | null;
    turnResult: {
        analysis: string;
        consequence: string;
        suggestion: string;
        changes?: any;
    } | null;
    handleRestart: () => void;
    handleGoHome: () => void;
    handleWinAlways: () => void;
    handleNextTurn: () => void;
    currentEvent: GameEvent | null;
    userInput: string;
    setUserInput: (input: string) => void;
    isLoading: boolean;
    handleSubmit: (e?: React.FormEvent) => void;
}

export function GameScreen({
    language,
    isSettingsOpen,
    setIsSettingsOpen,
    metrics,
    month,
    isVictory,
    gameOver,
    turnResult,
    handleRestart,
    handleGoHome,
    handleWinAlways,
    handleNextTurn,
    currentEvent,
    userInput,
    setUserInput,
    isLoading,
    handleSubmit,
}: GameScreenProps) {
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const renderStatBadge = (Icon: any, value: number, label: string, idx: number) => {
        if (!value) return null;
        const isPositive = value > 0;
        const sign = isPositive ? "+" : "";
        const baseColor = isPositive
            ? "text-emerald-700 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300"
            : "text-rose-700 bg-gradient-to-br from-rose-50 to-rose-100 border-rose-300";
        return (
            <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 + idx * 0.1 }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 ${baseColor} shadow-md min-w-[130px]`}
            >
                <Icon className="w-5 h-5 shrink-0" />
                <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-bold opacity-70 uppercase tracking-wider">
                        {label}
                    </span>
                    <motion.span
                        className="text-base md:text-lg font-black leading-none mt-0.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                        {sign}
                        {value}
                    </motion.span>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="h-screen w-full flex flex-col text-slate-800 font-sans overflow-hidden">
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                allowLanguageChange={true}
                onRestart={handleRestart}
                onGoHome={handleGoHome}
                onWinAlways={handleWinAlways}
            />
            {/* Always show Top Resource Bar */}
            <Dashboard
                month={month}
                metrics={metrics}
                onSettingsClick={() => setIsSettingsOpen(true)}
            />

            {isVictory ? (
                /* ── VICTORY SCREEN ── */
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                    {/* BG: town.png + lush green tint */}
                    <div
                        className="absolute -inset-4 bg-cover bg-center blur-[10px] brightness-[0.7] scale-110"
                        style={{ backgroundImage: "url('/backgrounds/town.png')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/40 via-teal-400/20 to-sky-900/60" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

                    {/* Celebration particles (confetti) */}
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute top-[-5vh] w-2 h-4 md:w-3 md:h-6 rounded-sm"
                            style={{
                                left: `${Math.random() * 100}%`,
                                backgroundColor: [
                                    "#10b981",
                                    "#3b82f6",
                                    "#f59e0b",
                                    "#ec4899",
                                    "#8b5cf6",
                                ][Math.floor(Math.random() * 5)],
                            }}
                            animate={{
                                y: ["0vh", "110vh"],
                                x: [0, (Math.random() - 0.5) * 200],
                                rotate: [0, 720],
                                opacity: [0, 1, 1, 0],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 4,
                                delay: Math.random() * i * 0.2,
                                repeat: Infinity,
                                ease: "easeOut",
                            }}
                        />
                    ))}

                    {/* Card */}
                    <motion.div
                        className="relative z-10 bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-[40px] shadow-[0_0_80px_rgba(16,185,129,0.4)] border-4 border-emerald-200 max-w-2xl w-full"
                        initial={{ opacity: 0, scale: 0.7, y: 60 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.2 }}
                    >
                        {/* Trophy icon */}
                        <motion.div
                            className="text-7xl md:text-8xl mb-4 select-none"
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: [0, 1.3, 1], y: [20, -10, 0] }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "backOut" }}
                        >
                            🏆
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            className="text-3xl md:text-6xl font-black text-emerald-600 mb-6 tracking-tight drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            {language === "vi" ? "Thành Phố Phồn Vinh!" : "City of Prosperity!"}
                        </motion.h1>

                        {/* Achievement badge */}
                        <motion.div
                            className="mb-8 inline-block bg-emerald-50 px-8 py-3 rounded-full border-2 border-emerald-200 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <span className="text-emerald-700 font-extrabold text-xl md:text-2xl">
                                ✨{" "}
                                {language === "vi"
                                    ? "Đã Hoàn Thành 1 Năm Nhiệm Kỳ"
                                    : "Completed 1 Year Term"}{" "}
                                ✨
                            </span>
                        </motion.div>

                        {/* Summary message */}
                        <motion.p
                            className="text-lg md:text-xl text-slate-700 mb-10 font-medium leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.0, duration: 0.8 }}
                        >
                            {language === "vi"
                                ? "Dưới sự lãnh đạo tài tình của bạn, thành phố không chỉ vượt qua khủng hoảng mà còn trở thành hình mẫu về phát triển bền vững. Người dân mãi nhớ ơn vị Thị trưởng vĩ đại!"
                                : "Under your brilliant leadership, the city has not only survived the crisis but also become a model for sustainable development. The citizens will forever remember their great Mayor!"}
                        </motion.p>

                        {/* Buttons */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <motion.button
                                onClick={handleGoHome}
                                className="flex-1 relative group bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xl py-5 rounded-2xl transition-colors shadow-[0_8px_0_rgb(5,150,105)] hover:translate-y-1 hover:shadow-[0_4px_0_rgb(5,150,105)] active:translate-y-2 active:shadow-none overflow-hidden"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2 }}
                            >
                                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                🏠 {language === "vi" ? "Về Trang Chủ" : "Home"}
                            </motion.button>

                            <motion.button
                                onClick={handleRestart}
                                className="flex-1 relative group bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xl py-5 rounded-2xl transition-colors shadow-[0_8px_0_rgb(2,132,199)] hover:translate-y-1 hover:shadow-[0_4px_0_rgb(2,132,199)] active:translate-y-2 active:shadow-none overflow-hidden"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.3 }}
                            >
                                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                🔄 {language === "vi" ? "Nhiệm Kỳ Mới" : "New Term"}
                            </motion.button>
                        </div>
                    </motion.div>
                </main>
            ) : gameOver ? (
                /* ── GAME OVER SCREEN ── */
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                    {/* BG: town.png + heavy red tint */}
                    <div
                        className="absolute -inset-4 bg-cover bg-center blur-[20px] brightness-[0.3] scale-110"
                        style={{ backgroundImage: "url('/backgrounds/town.png')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-rose-950/80 via-rose-900/60 to-black/90" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,black_90%)]" />

                    {/* Falling debris particles */}
                    {[...Array(16)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute top-0 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-400/60"
                            style={{ left: `${Math.random() * 100}%` }}
                            animate={{
                                y: ["0vh", "110vh"],
                                opacity: [0, 0.8, 0],
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 2.5 + Math.random() * 3,
                                delay: Math.random() * 2,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    ))}

                    {/* Pulsing red vignette */}
                    <motion.div
                        className="pointer-events-none absolute inset-0 border-[20px] border-rose-600/40"
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Card */}
                    <motion.div
                        className="relative z-10 bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-[40px] shadow-[0_0_80px_rgba(225,29,72,0.4)] border-4 border-rose-200 max-w-2xl w-full"
                        initial={{ opacity: 0, scale: 0.7, y: 60 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
                    >
                        {/* Explosion icon */}
                        <motion.div
                            className="text-7xl md:text-8xl mb-4 select-none"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: [0, 1.4, 1], rotate: [30, 10, 0] }}
                            transition={{ duration: 0.7, delay: 0.5, ease: "backOut" }}
                        >
                            💥
                        </motion.div>

                        {/* Title with red glow */}
                        <motion.h1
                            className="text-3xl md:text-5xl font-black text-rose-600 mb-5 tracking-tight drop-shadow-[0_0_20px_rgba(225,29,72,0.5)]"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                        >
                            {language === "vi" ? "Thảm Họa Xảy Ra!" : "Disaster Strikes!"}
                        </motion.h1>

                        {/* Months in office */}
                        <motion.div
                            className="mb-5 inline-block bg-rose-50 px-6 py-2.5 rounded-full border-2 border-rose-200 shadow-inner"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            <span className="text-rose-700 font-extrabold text-lg md:text-xl">
                                🗓️{" "}
                                {language === "vi"
                                    ? `Tại vị: ${month} tháng`
                                    : `Months in Office: ${month}`}
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
                        <motion.div
                            className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent mb-6"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1.3, duration: 0.5 }}
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
                            🔄 {language === "vi" ? "Chơi lại từ đầu" : "Play Again"}
                        </motion.button>
                    </motion.div>
                </main>
            ) : turnResult ? (
                (() => {
                    // Determine if this turn was net positive or negative
                    const changes = turnResult.changes || {};
                    const netScore =
                        (changes.energy || 0) +
                        (changes.environment || 0) +
                        (changes.budget || 0) +
                        (changes.trust || 0);
                    const isGoodTurn = netScore >= 0;
                    return (
                        /* ── AI RESULT SCREEN ── */
                        <main className="flex-1 overflow-y-auto w-full flex flex-col items-center p-4 md:p-8 relative overflow-hidden">
                            {/* BG: town.png with tinted overlay */}
                            <div
                                className="absolute inset-0 bg-cover bg-center blur-[3px] brightness-[0.55] scale-105"
                                style={{ backgroundImage: "url('/backgrounds/town.png')" }}
                            />
                            <div
                                className={`absolute inset-0 bg-gradient-to-b ${
                                    isGoodTurn
                                        ? "from-emerald-950/50 via-sky-950/30 to-slate-950/60"
                                        : "from-rose-950/50 via-slate-950/30 to-slate-950/60"
                                }`}
                            />

                            {/* Floating sparkle particles */}
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={`absolute bottom-0 rounded-full ${isGoodTurn ? "bg-emerald-400" : "bg-rose-400"}`}
                                    style={{
                                        left: `${10 + i * 9}%`,
                                        width: 4 + (i % 3) * 3,
                                        height: 4 + (i % 3) * 3,
                                    }}
                                    animate={{ y: [0, -(120 + i * 30)], opacity: [0, 0.7, 0] }}
                                    transition={{
                                        duration: 3 + i * 0.3,
                                        delay: i * 0.2,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                        ease: "easeOut",
                                    }}
                                />
                            ))}

                            {/* Summary banner */}
                            <motion.div
                                className={`relative z-10 mt-4 mb-4 px-8 py-3 rounded-2xl border-2 flex items-center gap-3 shadow-lg ${
                                    isGoodTurn
                                        ? "bg-emerald-600/90 border-emerald-400 text-white"
                                        : "bg-rose-600/90 border-rose-400 text-white"
                                }`}
                                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                            >
                                <span className="text-2xl">{isGoodTurn ? "✅" : "⚠️"}</span>
                                <span className="font-extrabold text-lg tracking-wide">
                                    {isGoodTurn
                                        ? language === "vi"
                                            ? `Tháng ${month}: Quyết định tốt! (+${netScore})`
                                            : `Month ${month}: Good decision! (+${netScore})`
                                        : language === "vi"
                                          ? `Tháng ${month}: Cần cải thiện (${netScore})`
                                          : `Month ${month}: Needs improvement (${netScore})`}
                                </span>
                            </motion.div>

                            {/* Main card */}
                            <motion.div
                                className="relative z-10 max-w-3xl w-full bg-white/95 backdrop-blur-md rounded-[32px] p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.25)] border-4 border-white/80 mb-6"
                                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 250,
                                    damping: 22,
                                    delay: 0.1,
                                }}
                            >
                                {/* Header */}
                                <motion.h2
                                    className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6 flex items-center gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <span className="bg-sky-100 text-sky-500 p-2.5 rounded-2xl text-2xl">
                                        📊
                                    </span>
                                    {language === "vi" ? "Báo Cáo Tháng" : "Monthly Report"}
                                </motion.h2>

                                <div id="tutorial-advice-panel" className="space-y-5 mb-8">
                                    {/* Stat changes */}
                                    {turnResult.changes &&
                                        Object.values(turnResult.changes).some(
                                            (val) => val !== 0,
                                        ) && (
                                            <motion.div
                                                className="mt-5 pt-5 border-t-2 border-slate-200"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                                    {language === "vi"
                                                        ? "⚡ Biến Động Chỉ Số"
                                                        : "⚡ Stat Changes"}
                                                </h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {renderStatBadge(
                                                        Zap,
                                                        turnResult.changes.energy,
                                                        language === "vi" ? "Năng lượng" : "Energy",
                                                        0,
                                                    )}
                                                    {renderStatBadge(
                                                        Leaf,
                                                        turnResult.changes.environment,
                                                        language === "vi"
                                                            ? "Môi trường"
                                                            : "Environment",
                                                        1,
                                                    )}
                                                    {renderStatBadge(
                                                        Coins,
                                                        turnResult.changes.budget,
                                                        language === "vi" ? "Ngân sách" : "Budget",
                                                        2,
                                                    )}
                                                    {renderStatBadge(
                                                        Heart,
                                                        turnResult.changes.trust,
                                                        language === "vi" ? "Lòng tin" : "Trust",
                                                        3,
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    {/* Consequence section */}
                                    <motion.div
                                        className="bg-rose-50/60 rounded-2xl p-5 md:p-6 border-2 border-rose-100 shadow-sm"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25, duration: 0.5 }}
                                    >
                                        <h3 className="text-lg font-bold text-rose-700 mb-3 flex items-center gap-2.5">
                                            <span className="p-2 bg-rose-100/80 rounded-lg text-rose-600">
                                                <AlertCircle size={20} className="animate-pulse" />
                                            </span>
                                            {language === "vi" ? "Kết Quả" : "Consequence"}
                                        </h3>
                                        <motion.p
                                            className="text-rose-950 text-base md:text-lg leading-relaxed whitespace-pre-wrap pl-1 font-medium"
                                            initial={{ opacity: 0, filter: "blur(4px)" }}
                                            animate={{ opacity: 1, filter: "blur(0px)" }}
                                            transition={{ delay: 0.5, duration: 0.6 }}
                                        >
                                            {turnResult.consequence}
                                        </motion.p>
                                    </motion.div>

                                    {/* Analysis section */}
                                    <motion.div
                                        className={`rounded-2xl border-2 transition-all duration-300 shadow-sm overflow-hidden ${
                                            isAnalysisOpen
                                                ? "bg-sky-50/70 border-sky-200"
                                                : "bg-sky-50/30 border-sky-100 hover:border-sky-200"
                                        }`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35, duration: 0.5 }}
                                    >
                                        <button
                                            onClick={() => setIsAnalysisOpen(!isAnalysisOpen)}
                                            className="w-full p-5 md:p-6 flex items-center justify-between text-left focus:outline-none"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span
                                                    className={`p-2 rounded-lg transition-colors duration-300 ${
                                                        isAnalysisOpen
                                                            ? "bg-sky-200/80 text-sky-700"
                                                            : "bg-sky-100 text-sky-600"
                                                    }`}
                                                >
                                                    <Search size={20} />
                                                </span>
                                                <div>
                                                    <h3 className="text-lg font-bold text-sky-700">
                                                        {language === "vi"
                                                            ? "Phân Tích"
                                                            : "Analysis"}
                                                    </h3>
                                                    <p className="text-xs text-sky-600/70 mt-0.5 font-medium">
                                                        {language === "vi"
                                                            ? "Bấm để xem chi tiết lý do"
                                                            : "Click to view detailed insights"}
                                                    </p>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: isAnalysisOpen ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="text-sky-500 p-1 hover:text-sky-700"
                                            >
                                                <ChevronDown size={20} />
                                            </motion.div>
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isAnalysisOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        ease: "easeInOut",
                                                    }}
                                                >
                                                    <div className="px-5 md:px-6 pb-6 pt-2 border-t border-sky-100">
                                                        <motion.p
                                                            className="text-sky-950 text-base md:text-lg leading-relaxed whitespace-pre-wrap pl-1 font-medium"
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {turnResult.analysis}
                                                        </motion.p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Suggestion section */}
                                    <motion.div
                                        className="bg-emerald-50/60 rounded-2xl p-5 md:p-6 border-2 border-emerald-100 shadow-sm"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.45, duration: 0.5 }}
                                    >
                                        <h3 className="text-lg font-bold text-emerald-700 mb-3 flex items-center gap-2.5">
                                            <span className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                                <Lightbulb size={20} />
                                            </span>
                                            {language === "vi" ? "Gợi Ý Cải Thiện" : "Suggestions"}
                                        </h3>
                                        <motion.p
                                            className="text-emerald-950 text-base md:text-lg leading-relaxed whitespace-pre-wrap pl-1 font-medium"
                                            initial={{ opacity: 0, filter: "blur(4px)" }}
                                            animate={{ opacity: 1, filter: "blur(0px)" }}
                                            transition={{ delay: 0.6, duration: 0.6 }}
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
                                    <span className="relative">
                                        {language === "vi" ? "Tháng Tiếp Theo" : "Next Month"}
                                    </span>
                                    <motion.span
                                        className="relative text-2xl"
                                        animate={{ x: [0, 6, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.2,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        ➡️
                                    </motion.span>
                                </motion.button>
                            </motion.div>
                        </main>
                    );
                })()
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
