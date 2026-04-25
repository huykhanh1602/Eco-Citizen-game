"use client";

import { useState } from "react";
import { GameStage } from "./GameStage";
import { ActionBar } from "./ActionBar";
import { GameEvent } from "../../utils/eventBank";

export function InformerModule() {
    // State Management
    const [currentEvent, setCurrentEvent] = useState<GameEvent>({
        id: "ev_flood_01",
        title: "Báo động lũ khẩn cấp!",
        description: "Thưa Thị trưởng! Hoàn lưu bão đang trút mưa như trút nước xuống bản của chúng tôi suốt 5 tiếng rồi. Đất trên đồi nứt toác, nguy cơ sạt lở ập xuống trong đêm nay là rất lớn! Nhưng ngoài trời tối đen như mực, đường trơn trượt, sơ tán bây giờ cũng vô cùng nguy hiểm. Chúng tôi phải làm sao đây",
        avatarUrl: "", // placeholder
        persona: "Trưởng bản A Páo",
        event_context: "",
        scientific_rules: "",
        severity: 3
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

        // TEST DATA: Bạn có thể thay đổi các giá trị này để test
        const testEventContext = "Mưa lớn gây nguy cơ sạt lở tại vùng núi. Sơ tán trong đêm rủi ro cao nhưng ở lại có thể mất mạng";
        const testScientificRules = "Nếu Thị trưởng ép sơ tán ngay lập tức trong đêm: An toàn tính mạng nhưng gây hoảng loạn và tốn kém. (Ngân sách -20, Tín nhiệm -10, Môi trường 0, Năng lượng -10).Nếu Thị trưởng cho phép ở lại và chằng chống nhà cửa: Chi phí thấp nhưng thảm họa sạt lở xảy ra gây hậu quả nặng nề. (Ngân sách -5, Tín nhiệm -40, Môi trường -20, Năng lượng -10).Nếu Thị trưởng có phương án thông minh (VD: Dùng điện dự phòng thắp sáng đường, cử dân quân dò đường trước khi đưa người già/trẻ em đi): Tốn tài nguyên nhưng được lòng dân. (Ngân sách -15, Tín nhiệm +20, Môi trường -5, Năng lượng -25";

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
            const res = await fetch(`${apiUrl}/api/py/evaluate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    event_context: testEventContext,
                    scientific_rules: testScientificRules,
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
