"use client";

import React, { useState, useEffect, useRef } from "react";
import { GameScreen } from "./GameScreen";
import { tutorialDict } from "../utils/tutorialDict";
import { motion, AnimatePresence } from "motion/react";

interface TutorialScreenProps {
    language: string;
    setAppState: (state: "home" | "story" | "game" | "tutorial") => void;
    isSettingsOpen: boolean;
    setIsSettingsOpen: (isOpen: boolean) => void;
}

// Fixed mock data for the tutorial
const MOCK_EVENT = {
    _id: "tut_event",
    title: {
        en: "Tutorial Event",
        vi: "Sự kiện Hướng dẫn",
    },
    description: {
        en: "The city needs a new policy to reduce emissions.",
        vi: "Thành phố cần một chính sách mới để giảm lượng khí thải.",
    },
    severity: 1,
    persona: {
        en: "Advisor",
        vi: "Cố vấn",
    },
    avatarUrl: "",
    event_context: { en: "", vi: "" },
    scientific_rules: { en: "", vi: "" },
};

const MOCK_TURN_RESULT = {
    analysis: "You implemented a good policy.",
    suggestion: "Keep an eye on the budget.",
    changes: {
        energy: -5,
        environment: 15,
        budget: -10,
        trust: 5,
    },
};

// Overlay component
function TutorialOverlay({
    step,
    language,
    onNext,
    onFinish,
}: {
    step: number;
    language: string;
    onNext: () => void;
    onFinish: () => void;
}) {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const stepTargets: Record<number, string> = {
        1: "tutorial-indicator-bars",
        2: "tutorial-event-area",
        3: "tutorial-input-area",
        4: "tutorial-indicator-bars", // Highlight bars again for stat changes
        5: "tutorial-advice-panel",
    };

    useEffect(() => {
        const updateRect = () => {
            if (step === 6) {
                setTargetRect(null);
                return;
            }
            const elId = stepTargets[step];
            const el = document.getElementById(elId);
            if (el) {
                setTargetRect(el.getBoundingClientRect());
            } else {
                setTargetRect(null);
            }
        };

        // Initial update and delayed update to handle transitions
        updateRect();
        const timeout = setTimeout(updateRect, 300);

        window.addEventListener("resize", updateRect);
        window.addEventListener("scroll", updateRect, true);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("resize", updateRect);
            window.removeEventListener("scroll", updateRect, true);
        };
    }, [step]);

    // Step 6: Center Congratulatory Screen
    if (step === 6) {
        return (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-900 border border-slate-700 p-10 rounded-3xl text-center max-w-md w-full shadow-2xl"
                >
                    <div className="text-6xl mb-6">🎉</div>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {language === "vi" ? "Chúc mừng!" : "Congratulations!"}
                    </h2>
                    <p className="text-slate-300 mb-8">{(tutorialDict.step6 as any)[language]}</p>
                    <button
                        onClick={onFinish}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-colors w-full"
                    >
                        {language === "vi" ? "Bắt Đầu Chơi" : "Start Game"}
                    </button>
                </motion.div>
            </div>
        );
    }

    // Step 1-5 Overlay
    return (
        <div className="absolute inset-0 z-[100] pointer-events-none">
            {/* SVG Mask to create the spotlight */}
            <svg width="100%" height="100%" className="absolute inset-0 z-0">
                <defs>
                    <mask id="spotlight-mask">
                        {/* Fill the whole screen with white (visible) */}
                        <rect width="100%" height="100%" fill="white" />
                        {/* Draw a black rectangle (invisible) over the target */}
                        {targetRect && (
                            <rect
                                x={targetRect.left - 8}
                                y={targetRect.top - 8}
                                width={targetRect.width + 16}
                                height={targetRect.height + 16}
                                fill="black"
                                rx="16"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.75)"
                    mask="url(#spotlight-mask)"
                />
            </svg>

            {/* Tooltip */}
            <AnimatePresence>
                {targetRect && (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute z-10 pointer-events-auto bg-white text-slate-800 p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] max-w-sm"
                        style={{
                            top:
                                targetRect.bottom + 20 + 150 > window.innerHeight
                                    ? targetRect.top - 20 - 150 // show above if not enough space
                                    : targetRect.bottom + 20, // show below by default
                            left: Math.max(
                                20,
                                Math.min(
                                    targetRect.left + targetRect.width / 2 - 192,
                                    window.innerWidth - 400,
                                ),
                            ),
                        }}
                    >
                        <p className="text-base font-medium mb-4 leading-relaxed">
                            {(tutorialDict as any)[`step${step}`][language]}
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={onNext}
                                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                            >
                                {language === "vi" ? "Tiếp tục" : "Next"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function TutorialScreen({
    language,
    setAppState,
    isSettingsOpen,
    setIsSettingsOpen,
}: TutorialScreenProps) {
    const [step, setStep] = useState(1);

    // Mock State for GameScreen
    const [metrics, setMetrics] = useState({ energy: 50, environment: 50, budget: 50, trust: 50 });
    const [userInput, setUserInput] = useState("");
    const [turnResult, setTurnResult] = useState<any>(null);

    // Apply mock turn results when entering phase 2
    useEffect(() => {
        if (step === 4) {
            setTurnResult(MOCK_TURN_RESULT);
            setMetrics({
                energy: 50 + MOCK_TURN_RESULT.changes.energy,
                environment: 50 + MOCK_TURN_RESULT.changes.environment,
                budget: 50 + MOCK_TURN_RESULT.changes.budget,
                trust: 50 + MOCK_TURN_RESULT.changes.trust,
            });
        }
    }, [step]);

    const handleNext = () => {
        setStep((s) => s + 1);
    };

    const handleFinish = () => {
        setAppState("game"); // Or "story" if you prefer
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* The actual mocked game screen below */}
            <div className="absolute inset-0">
                <GameScreen
                    language={language}
                    isSettingsOpen={isSettingsOpen}
                    setIsSettingsOpen={setIsSettingsOpen}
                    metrics={metrics}
                    month={1}
                    isVictory={false}
                    gameOver={null}
                    turnResult={turnResult}
                    handleRestart={() => {}}
                    handleGoHome={() => setAppState("home")}
                    handleWinAlways={() => {}}
                    handleNextTurn={() => {}}
                    currentEvent={MOCK_EVENT}
                    userInput={userInput}
                    setUserInput={setUserInput}
                    isLoading={false}
                    handleSubmit={() => {}} // Disabled logic, only advanced via tutorial next button
                />
            </div>

            {/* The interactive overlay */}
            <TutorialOverlay
                step={step}
                language={language}
                onNext={handleNext}
                onFinish={handleFinish}
            />
        </div>
    );
}
