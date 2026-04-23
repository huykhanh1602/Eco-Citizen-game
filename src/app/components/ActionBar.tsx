"use client";

import { Send, Loader2 } from "lucide-react";
import React from "react";

interface ActionBarProps {
    userInput: string;
    setUserInput: (val: string) => void;
    isAnalyzing: boolean;
    onSubmit: (e?: React.FormEvent) => void;
}

export function ActionBar({ userInput, setUserInput, isAnalyzing, onSubmit }: ActionBarProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <footer className="w-full bg-white border-t-[3px] border-slate-200 px-4 py-4 md:px-8 md:py-6 z-20 shrink-0 shadow-[0_-10px_40px_rgb(0,0,0,0.05)]">
            <div className="max-w-5xl mx-auto">
                <form
                    onSubmit={onSubmit}
                    className="flex items-end gap-3 md:gap-5"
                >
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập quyết định của Thị trưởng vào đây..."
                        disabled={isAnalyzing}
                        className="w-full bg-slate-50 border-2 border-slate-200 border-b-[6px] rounded-2xl px-5 py-4 md:py-5 text-lg text-slate-700 font-bold placeholder:text-slate-400 placeholder:font-semibold focus:outline-none focus:border-sky-400 focus:border-b-[6px] focus:bg-white transition-colors resize-none h-20 md:h-24 leading-tight disabled:opacity-60 disabled:cursor-not-allowed"
                    />

                    <button
                        type="submit"
                        disabled={!userInput.trim() || isAnalyzing}
                        className={`
                            text-white rounded-2xl px-6 md:px-8 h-20 md:h-24 flex flex-col items-center justify-center gap-1 transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-80
                            ${isAnalyzing 
                                ? "bg-amber-400 border-2 border-amber-500 border-b-[6px] translate-y-[4px] border-b-2" 
                                : "bg-sky-400 hover:bg-sky-400 active:bg-sky-500 border-2 border-sky-500 border-b-[6px] active:border-b-2 active:translate-y-[4px]"
                            }
                        `}
                    >
                        <span className="font-extrabold text-lg md:text-xl tracking-wide whitespace-nowrap">
                            {isAnalyzing ? "AI đang phân tích..." : "Ra lệnh"}
                        </span>
                        {isAnalyzing ? (
                            <Loader2 className="w-6 h-6 animate-spin" strokeWidth={3} />
                        ) : (
                            <Send className="w-6 h-6" strokeWidth={3} />
                        )}
                    </button>
                </form>
            </div>
        </footer>
    );
}
