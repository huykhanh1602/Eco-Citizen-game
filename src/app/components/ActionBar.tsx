"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export function ActionBar() {
    const [input, setInput] = useState("");

    return (
        <footer className="w-full bg-white border-t-[3px] border-slate-200 px-4 py-4 md:px-8 md:py-6 z-20">
            <div className="max-w-5xl mx-auto">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setInput("");
                    }}
                    className="flex items-end gap-3 md:gap-5"
                >
                    {/* Duolingo style text input */}
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your policy or decision here, Mayor..."
                        className="w-full bg-slate-50 border-2 border-slate-200 border-b-[6px] rounded-2xl px-5 py-4 md:py-5 text-lg text-slate-700 font-bold placeholder:text-slate-400 placeholder:font-semibold focus:outline-none focus:border-sky-400 focus:border-b-[6px] focus:bg-white transition-colors resize-none h-16 md:h-20 leading-tight"
                    />

                    {/* Duolingo style submit button */}
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="bg-sky-400 hover:bg-sky-400 active:bg-sky-500 border-2 border-sky-500 border-b-[6px] active:border-b-2 active:translate-y-[4px] disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-[6px] text-white rounded-2xl px-6 md:px-8 h-16 md:h-20 flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    >
                        <span className="font-extrabold text-lg md:text-xl hidden md:inline tracking-wide">
                            Execute
                        </span>
                        <Send className="w-6 h-6 md:w-7 md:h-7" strokeWidth={3} />
                    </button>
                </form>
            </div>
        </footer>
    );
}
