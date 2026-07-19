import { useState, useEffect, useCallback } from "react";
import { getRandomEventBySeverity, GameEvent } from "../../utils/eventBank";
import { useSettings } from "../contexts/SettingsContext";

export function useGameState() {
    const [appState, setAppState] = useState<
        "home" | "story" | "game" | "victory" | "defeat" | "tutorial"
    >("home");
    const [mounted, setMounted] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // --- Game State Management ---
    const [metrics, setMetrics] = useState({ energy: 50, environment: 50, budget: 50, trust: 50 });
    const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [turnResult, setTurnResult] = useState<{
        analysis: string;
        consequence: string;
        suggestion: string;
        changes?: any;
    } | null>(null);
    const [gameOver, setGameOver] = useState<string | null>(null);
    const [isVictory, setIsVictory] = useState(false);
    const [month, setMonth] = useState(1);
    const [usedEventIds, setUsedEventIds] = useState<Set<string>>(new Set());

    const { language } = useSettings();

    // ── Round → Severity mapping ──────────────────────────────────────────
    const getSeverityForMonth = useCallback((m: number): 1 | 2 | 3 => {
        return Math.ceil(m / 4) as 1 | 2 | 3;
    }, []);

    // ── Helper: pick an event by severity and track it ────────────────────
    const pickAndTrackEvent = useCallback(
        (severity: 1 | 2 | 3, existingUsedIds: Set<string>): GameEvent => {
            const event = getRandomEventBySeverity(severity, existingUsedIds);
            setUsedEventIds(new Set(existingUsedIds).add(event.id));
            return event;
        },
        [],
    );

    // Initialization & Load from LocalStorage
    useEffect(() => {
        const savedState = localStorage.getItem("ecoCitizenGameState");
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.appState) setAppState(parsed.appState);
                if (parsed.metrics) setMetrics(parsed.metrics);
                if (parsed.currentEvent) setCurrentEvent(parsed.currentEvent);
                if (parsed.turnResult !== undefined) setTurnResult(parsed.turnResult);
                if (parsed.gameOver !== undefined) setGameOver(parsed.gameOver);
                if (parsed.isVictory !== undefined) setIsVictory(parsed.isVictory);
                if (parsed.month !== undefined) setMonth(parsed.month);
                if (parsed.usedEventIds) {
                    setUsedEventIds(new Set(parsed.usedEventIds));
                } else if (parsed.currentEvent) {
                    // Migration: ensure the current event is in the set
                    setUsedEventIds(new Set([parsed.currentEvent.id]));
                }
            } catch (e) {
                console.error("Failed to parse saved game state");
                const freshEvent = getRandomEventBySeverity(1, new Set());
                setCurrentEvent(freshEvent);
                setUsedEventIds(new Set([freshEvent.id]));
            }
        } else {
            const freshEvent = getRandomEventBySeverity(1, new Set());
            setCurrentEvent(freshEvent);
            setUsedEventIds(new Set([freshEvent.id]));
        }

        setMounted(true);
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
            isVictory,
            month,
            usedEventIds: Array.from(usedEventIds),
        };
        localStorage.setItem("ecoCitizenGameState", JSON.stringify(gameState));
    }, [
        appState,
        metrics,
        currentEvent,
        turnResult,
        gameOver,
        isVictory,
        month,
        usedEventIds,
        mounted,
    ]);

    // Handling Submission
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!userInput.trim() || isLoading || !currentEvent) return;

        setIsLoading(true);
        try {
            const baseUrl =
                process.env.NEXT_PUBLIC_API_URL ||
                (process.env.NODE_ENV === "production" ? "" : "http://127.0.0.1:8000");
            const res = await fetch(`${baseUrl}/api/evaluate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    event_context: currentEvent.event_context[language],
                    scientific_rules: currentEvent.scientific_rules[language],
                    user_input: userInput,
                    language: language,
                    current_metrics: metrics,
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`API error: ${res.status} ${errorText}`);
            }

            const data = await res.json();

            // FastAPI wraps HTTPException details in a `detail` key
            const responseData = data.detail || data;

            const changes = responseData.changes || {};

            const newMetrics = {
                energy: Math.max(0, Math.min(100, metrics.energy + (changes.energy || 0))),
                environment: Math.max(
                    0,
                    Math.min(100, metrics.environment + (changes.environment || 0)),
                ),
                budget: Math.max(0, Math.min(100, metrics.budget + (changes.budget || 0))),
                trust: Math.max(0, Math.min(100, metrics.trust + (changes.trust || 0))),
            };

            setMetrics(newMetrics);
            setTurnResult({
                analysis:
                    responseData.analysis ||
                    (language === "vi" ? "Không có phân tích từ AI." : "No analysis from AI."),
                consequence:
                    responseData.consequence ||
                    (language === "vi" ? "Không có hậu quả từ AI." : "No consequence from AI."),
                suggestion:
                    responseData.suggestion ||
                    (language === "vi" ? "Không có gợi ý." : "No suggestion."),
                changes: changes,
            });

            // Handling Game Over
            if (
                newMetrics.energy <= 0 ||
                newMetrics.environment <= 0 ||
                newMetrics.budget <= 0 ||
                newMetrics.trust <= 0
            ) {
                setGameOver(
                    responseData.game_over_story ||
                        (language === "vi"
                            ? "Thành phố đã sụp đổ vì những quyết định sai lầm của bạn. Người dân phải rời bỏ quê hương để tìm nơi sống mới."
                            : "The city has collapsed due to your poor decisions. Citizens are forced to abandon their homes."),
                );
            }
        } catch (error) {
            console.error("Lỗi khi gọi AI:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Next Turn
    const handleNextTurn = () => {
        if (month >= 12) {
            setIsVictory(true);
            return;
        }
        const nextMonth = month + 1;
        const severity = getSeverityForMonth(nextMonth);
        setTurnResult(null);
        setUserInput("");
        setCurrentEvent(pickAndTrackEvent(severity, usedEventIds));
        setMonth(nextMonth);
    };

    const handleRestart = () => {
        setMetrics({ energy: 50, environment: 50, budget: 50, trust: 50 });
        setTurnResult(null);
        setUserInput("");
        setGameOver(null);
        setIsVictory(false);
        setMonth(1);
        setAppState("story");
        const freshEvent = getRandomEventBySeverity(1, new Set());
        setCurrentEvent(freshEvent);
        setUsedEventIds(new Set([freshEvent.id]));
    };

    const handleGoHome = () => {
        handleRestart();
        setAppState("home");
    };

    const handleWinAlways = () => {
        setIsVictory(true);
        setIsSettingsOpen(false);
    };

    return {
        appState,
        setAppState,
        mounted,
        isSettingsOpen,
        setIsSettingsOpen,
        metrics,
        setMetrics,
        currentEvent,
        setCurrentEvent,
        userInput,
        setUserInput,
        isLoading,
        turnResult,
        setTurnResult,
        gameOver,
        setGameOver,
        isVictory,
        setIsVictory,
        month,
        setMonth,
        language,
        handleSubmit,
        handleNextTurn,
        handleRestart,
        handleGoHome,
        handleWinAlways,
    };
}
