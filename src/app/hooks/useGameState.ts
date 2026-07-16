import { useState, useEffect } from "react";
// Đổi đường dẫn này sang file type thuần túy để tránh kéo theo thư viện mongodb vào Client
import { GameEvent } from "../game"; 
import { useSettings } from "../contexts/SettingsContext";

export function useGameState() {
    const [appState, setAppState] = useState<"home" | "story" | "game" | "victory" | "defeat" | "tutorial" >("home");
    const [mounted, setMounted] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // --- Game State Management ---
    const [metrics, setMetrics] = useState({ energy: 50, environment: 50, budget: 50, trust: 50 });
    const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [turnResult, setTurnResult] = useState<{
        analysis: string;
        suggestion: string;
        changes?: any;
    } | null>(null);
    const [gameOver, setGameOver] = useState<string | null>(null);
    const [isVictory, setIsVictory] = useState(false);
    const [month, setMonth] = useState(1);

    const { language } = useSettings();

    const fetchNewEvent = async () => {
    setIsLoading(true);
    try {
        const response = await fetch("http://127.0.0.1:8000/api/random-event", {
            cache: "no-store",
            headers: {
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            }
        });
        const data = await response.json();
        
        if (response.ok) {
            setCurrentEvent(data);
            return data;
        } else {
            console.error("Lỗi API lấy sự kiện (Toàn bộ Object):", data);
            
            // Hoặc hiển thị thông minh hơn:
            console.error("Chi tiết lỗi:", data.detail || data.error || "Lỗi không xác định");
        }
    } catch (error) {
        console.error("Lỗi kết nối API:", error);
    } finally {
        setIsLoading(false);
    }
};

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
            } catch (e) {
                console.error("Failed to parse saved game state");
                fetchNewEvent();
            }
        } else {
            fetchNewEvent();
        }

        setMounted(true);
    }, []);

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
        };
        localStorage.setItem("ecoCitizenGameState", JSON.stringify(gameState));
    }, [appState, metrics, currentEvent, turnResult, gameOver, isVictory, month, mounted]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!userInput.trim() || isLoading || !currentEvent) return;

        setIsLoading(true);
            try {
                    const res = await fetch("http://127.0.0.1:8000/api/evaluate", {
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
                    responseData.consequence ||
                    (language === "vi" ? "Không có phân tích từ AI." : "No analysis from AI."),
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


        // if (e) e.preventDefault();
        // if (!userInput.trim() || isLoading || !currentEvent) return;

        // setIsLoading(true);
        // try {
        //     // --- ĐOẠN GIẢ LẬP KẾT QUẢ (MOCK DATA) ---
        //     // Giả vờ đợi 1 giây giống như AI đang suy nghĩ thật
        //     await new Promise((resolve) => setTimeout(resolve, 1000));

        //     // Tự tạo dữ liệu chấm điểm ngẫu nhiên để test
        //     const responseData = {
        //         analysis: language === "vi" 
        //             ? `Hệ thống đã ghi nhận giải pháp: "${userInput}". Phân tích giả lập: Giải pháp có tiềm năng đóng góp vào việc bảo vệ môi trường thành phố.` 
        //             : `System recorded solution: "${userInput}". Mock analysis: This solution shows potential for the city's environment.`,
        //         suggestion: language === "vi"
        //             ? "Gợi ý: Hãy chú ý cân bằng thêm giữa ngân sách và niềm tin của người dân ở các lượt sau."
        //             : "Suggestion: Remember to balance budget and public trust in upcoming turns.",
        //         changes: {
        //             energy: -10,      // Trừ 10 năng lượng
        //             environment: 15,  // Tăng 15 môi trường
        //             budget: -5,       // Trừ 5 tiền
        //             trust: 10         // Tăng 10 uy tín
        //         }
        //     };
        //     // ----------------------------------------

        //     const changes = responseData.changes || {};

        //     const newMetrics = {
        //         energy: Math.max(0, Math.min(100, metrics.energy + (changes.energy || 0))),
        //         environment: Math.max(
        //             0,
        //             Math.min(100, metrics.environment + (changes.environment || 0)),
        //         ),
        //         budget: Math.max(0, Math.min(100, metrics.budget + (changes.budget || 0))),
        //         trust: Math.max(0, Math.min(100, metrics.trust + (changes.trust || 0))),
        //     };

        //     setMetrics(newMetrics);
        //     setTurnResult({
        //         analysis: responseData.analysis,
        //         suggestion: responseData.suggestion,
        //         changes: changes,
        //     });

        //     // Handling Game Over
        //     if (
        //         newMetrics.energy <= 0 ||
        //         newMetrics.environment <= 0 ||
        //         newMetrics.budget <= 0 ||
        //         newMetrics.trust <= 0
        //     ) {
        //         setGameOver(
        //             language === "vi"
        //                 ? "Thành phố đã sụp đổ vì những quyết định sai lầm của bạn. Người dân phải rời bỏ quê hương để tìm nơi sống mới."
        //                 : "The city has collapsed due to your poor decisions. Citizens are forced to abandon their homes.",
        //         );
        //     }
        // } catch (error) {
        //     console.error("Lỗi giả lập:", error);
        // } finally {
        //     setIsLoading(false);
        // }
    };


    // Next Turn
    const handleNextTurn = async () => {
        if (month >= 12) {
            setIsVictory(true);
            return;
        }
        setTurnResult(null);
        setUserInput("");
        const newEvent = await fetchNewEvent();
            
        console.log("Sự kiện mới chạy vào State:", newEvent);
        setMonth((prev) => prev + 1);
    };

    // Restart Game
    const handleRestart = async () => {
        setMetrics({ energy: 50, environment: 50, budget: 50, trust: 50 });
        setTurnResult(null);
        setUserInput("");
        setGameOver(null);
        setIsVictory(false);
        setMonth(1);
        await fetchNewEvent();
        setAppState("story");
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
        appState, setAppState,
        mounted,
        isSettingsOpen, setIsSettingsOpen,
        metrics, setMetrics,
        currentEvent, setCurrentEvent,
        userInput, setUserInput,
        isLoading,
        turnResult, setTurnResult,
        gameOver, setGameOver,
        isVictory, setIsVictory,
        month, setMonth,
        language,
        handleSubmit, handleNextTurn, handleRestart, handleGoHome, handleWinAlways
    };
}