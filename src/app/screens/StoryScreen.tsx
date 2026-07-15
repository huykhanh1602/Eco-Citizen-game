import { motion } from "motion/react";

interface StoryScreenProps {
    language: string;
    setAppState: (state: "home" | "story" | "game") => void;
}

export function StoryScreen({ language, setAppState }: StoryScreenProps) {
    const storyLines = [
        {
            delay: 1.6,
            vi: "Thành phố đang đứng trên bờ vực khủng hoảng...",
            en: "The city is on the brink of crisis...",
        },
        {
            delay: 3.2,
            vi: "Năng lượng dần cạn kiệt, môi trường ô nhiễm nặng nề, và niềm tin của người dân đang sụt giảm từng ngày.",
            en: "Energy is depleting, the environment is heavily polluted, and public trust is dropping every day.",
        },
        {
            delay: 5.0,
            vi: (
                <>
                    Với tư cách là <span className="text-sky-400 font-bold">Tân Thị trưởng</span>,
                    nhiệm vụ của bạn là đưa ra những quyết định khó khăn để thay đổi số phận của nơi
                    này.
                </>
            ),
            en: (
                <>
                    As the <span className="text-sky-400 font-bold">New Mayor</span>, your mission
                    is to make tough decisions to change the fate of this place.
                </>
            ),
        },
        {
            delay: 6.8,
            vi: (
                <>
                    Bạn sẽ phải cân bằng giữa 4 yếu tố cốt lõi:
                    <br />
                    <span className="text-amber-400 font-bold">Năng lượng</span>,{" "}
                    <span className="text-emerald-400 font-bold">Môi trường</span>,{" "}
                    <span className="text-blue-400 font-bold">Ngân sách</span>, và{" "}
                    <span className="text-purple-400 font-bold">Lòng tin</span>.
                </>
            ),
            en: (
                <>
                    You must balance 4 core metrics:
                    <br />
                    <span className="text-amber-400 font-bold">Energy</span>,{" "}
                    <span className="text-emerald-400 font-bold">Environment</span>,{" "}
                    <span className="text-blue-400 font-bold">Budget</span>, and{" "}
                    <span className="text-purple-400 font-bold">Trust</span>.
                </>
            ),
        },
        {
            delay: 8.4,
            vi: "Sự tồn vong của thành phố nằm trong tay bạn. Chúc may mắn!",
            en: "The survival of the city is in your hands. Good luck!",
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
                onClick={() => setAppState("game")}
                className="absolute top-8 right-8 z-[60] px-6 py-2 text-slate-300 hover:text-white text-sm font-semibold transition-all bg-white/10 hover:bg-white/20 rounded-full border border-white/20 backdrop-blur-md"
            >
                {language === "vi" ? "Bỏ qua ›" : "Skip ›"}
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
                initial={{ height: "15%" }}
                animate={{ height: "8%" }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
                className="absolute bottom-0 left-0 right-0 z-20 bg-black origin-bottom"
                initial={{ height: "15%" }}
                animate={{ height: "8%" }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            />

            {/* ── CONTENT ── */}
            <div className="relative z-30 max-w-2xl w-full flex flex-col items-center">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -24, letterSpacing: "0.4em" }}
                    animate={{ opacity: 1, y: 0, letterSpacing: "0.04em" }}
                    transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                    className="mb-2"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_40px_rgba(52,211,153,0.7)]">
                        {language === "vi" ? "Khởi Đầu Mới" : "A New Beginning"}
                    </h2>
                </motion.div>

                {/* Divider line */}
                <motion.div
                    className="h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent mb-10"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1.1, ease: "easeOut" }}
                />

                {/* Story paragraphs */}
                <div className="space-y-5 text-lg md:text-xl text-slate-200 leading-relaxed font-light mb-14">
                    {storyLines.map((line, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 1.1, delay: line.delay, ease: "easeOut" }}
                            className={
                                line.bold ? "text-white font-semibold text-xl md:text-2xl" : ""
                            }
                        >
                            {language === "vi" ? line.vi : line.en}
                        </motion.p>
                    ))}
                </div>

                {/* Accept button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 10.2, ease: "backOut" }}
                    whileHover={{ scale: 1.06, boxShadow: "0 0 40px rgba(52,211,153,0.6)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setAppState("game")}
                    className="relative group px-14 py-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-extrabold rounded-2xl transition-colors duration-300 shadow-[0_0_30px_rgba(5,150,105,0.5)] border border-emerald-400/30 overflow-hidden"
                >
                    {/* Shimmer */}
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative z-10">
                        {language === "vi" ? "⚖️  Tiếp Nhận Chức Vụ" : "⚖️  Accept Office"}
                    </span>
                </motion.button>
            </div>
        </div>
    );
}
