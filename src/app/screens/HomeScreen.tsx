import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { SettingsModal } from "../components/SettingsModal";

interface HomeScreenProps {
    language: string;
    setAppState: (state: "home" | "story" | "game" | "tutorial") => void;
    isSettingsOpen: boolean;
    setIsSettingsOpen: (isOpen: boolean) => void;
    handleWinAlways: () => void;
}

export function HomeScreen({
    language,
    setAppState,
    isSettingsOpen,
    setIsSettingsOpen,
    handleWinAlways,
}: HomeScreenProps) {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        // Generate random values on client side for particles
        const newParticles = [...Array(20)].map(() => ({
            width: Math.random() * 6 + 2 + "px",
            height: Math.random() * 6 + 2 + "px",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            animationDelay: `-${Math.random() * 10}s`,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-900 flex items-center justify-center font-sans">
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                allowLanguageChange={true}
                onWinAlways={handleWinAlways}
            />
            {/* Settings Button & Language Hint */}
            <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
                {/* Dòng chữ gợi ý đổi ngôn ngữ */}
                <span className="hidden sm:inline-block text-xs md:text-sm font-semibold text-emerald-400 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-lg animate-breath-slide pointer-events-none tracking-wide">
                    {language === "vi" ? "Change language here" : "Đổi ngôn ngữ ở đây"}
                </span>

                {/* Nút cài đặt */}
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-full transition-all duration-300 text-slate-300 hover:text-white backdrop-blur-md border border-slate-600 hover:scale-105 shadow-md active:scale-95"
                >
                    <Settings className="w-6 h-6" />
                </button>
            </div>

            {/* Background Animated Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/30 blur-[120px] animate-pulse"></div>
                <div
                    className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-sky-600/30 blur-[150px] animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px] animate-pulse"
                    style={{ animationDelay: "4s" }}
                ></div>
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
                        {language === "vi"
                            ? "Trở thành Thị trưởng, cân bằng Sinh thái & Phát triển."
                            : "Become the Mayor, balance Ecology & Development."}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                    <button
                        onClick={() => setAppState("story")}
                        className="group relative inline-flex items-center justify-center"
                    >
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 opacity-70 blur-lg transition duration-500 group-hover:opacity-100 group-hover:duration-200"></div>
                        <div className="relative flex items-center gap-3 px-12 py-5 bg-slate-900 border border-slate-700 rounded-2xl transition-all duration-300 group-hover:bg-slate-800">
                            <span className="text-2xl font-bold text-white tracking-wider">
                                {language === "vi" ? "Bắt Đầu Mới" : "Start Game"}
                            </span>
                        </div>
                    </button>

                    <button
                        onClick={() => setAppState("tutorial")}
                        className="group relative inline-flex items-center justify-center"
                    >
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 opacity-40 blur-lg transition duration-500 group-hover:opacity-70 group-hover:duration-200"></div>
                        <div className="relative flex items-center gap-3 px-10 py-5 bg-slate-900/80 border border-slate-700 rounded-2xl transition-all duration-300 group-hover:bg-slate-800/80">
                            <span className="text-xl font-bold text-slate-300 tracking-wider group-hover:text-white transition-colors">
                                {language === "vi" ? "Hướng dẫn" : "Tutorial"}
                            </span>
                        </div>
                    </button>
                </div>

                <p className="mt-16 text-sm text-slate-500 font-medium">
                    AI-Powered City Management Simulator
                </p>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
            @keyframes float {
                0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
            
            /* Hiệu ứng nhịp thở (Breathing) kết hợp nhích sang trái phải (Slide) */
            @keyframes breathAndSlide {
                0%, 100% { 
                    opacity: 0.6; 
                    transform: translateX(4px); 
                }
                50% { 
                    opacity: 1; 
                    transform: translateX(-4px); 
                }
            }
            
            .animate-breath-slide {
                animation: breathAndSlide 2s infinite ease-in-out;
            }
        `,
                }}
            />
        </div>
    );
}
