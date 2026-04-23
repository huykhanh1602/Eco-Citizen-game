"use client";

import { useState } from "react";
import { GameStage } from "./GameStage";
import { ActionBar } from "./ActionBar";

export interface Event {
    id: string;
    title: string;
    description: string;
    avatarUrl: string;
    persona: string;
}

export function InformerModule() {
    // State Management
    const [currentEvent, setCurrentEvent] = useState<Event>({
        id: "ev_flood_01",
        title: "Báo động lũ khẩn cấp!",
        description: "Thưa Thị trưởng! Mực nước sông đang dâng cao bất thường do bão lớn. Khu vực hạ lưu có nguy cơ ngập nặng trong vài giờ tới. Chúng ta cần sơ tán người dân hoặc mở đập xả lũ ngay lập tức. Quyết định của ngài là gì?",
        avatarUrl: "", // placeholder
        persona: "Advisor Bot"
    });

    const [userInput, setUserInput] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Interaction Logic
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!userInput.trim() || isAnalyzing) return;

        setIsAnalyzing(true);
        const inputText = userInput;
        setUserInput("");

        try {
            const res = await fetch("http://localhost:8000/api/evaluate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    event_context: "",
                    scientific_rules: "",
                    user_input: inputText
                })
            });
            
            const data = await res.json();
            console.log("Kết quả từ AI:", data);
        } catch (error) {
            console.error("Lỗi khi gọi AI:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 overflow-hidden relative w-full h-full">
            <GameStage currentEvent={currentEvent} />
            <ActionBar 
                userInput={userInput}
                setUserInput={setUserInput}
                isAnalyzing={isAnalyzing}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
