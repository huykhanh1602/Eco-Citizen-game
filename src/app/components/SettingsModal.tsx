"use client";

import React from 'react';
import { X, Volume2, Music, Settings2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    allowLanguageChange: boolean;
    onRestart?: () => void;
    onGoHome?: () => void;
}

export function SettingsModal({ isOpen, onClose, allowLanguageChange, onRestart, onGoHome }: SettingsModalProps) {
    const { 
        masterVolume, setMasterVolume,
        musicVolume, setMusicVolume,
        sfxVolume, setSfxVolume,
        language, setLanguage
    } = useSettings();

    if (!isOpen) return null;

    const t = {
        title: language === 'vi' ? 'Cài Đặt' : 'Settings',
        master: language === 'vi' ? 'Âm lượng tổng' : 'Master Volume',
        music: language === 'vi' ? 'Nhạc nền' : 'Music',
        sfx: language === 'vi' ? 'Âm thanh (SFX)' : 'Sound Effects',
        lang: language === 'vi' ? 'Ngôn ngữ' : 'Language',
        close: language === 'vi' ? 'Đóng' : 'Close',
        restart: language === 'vi' ? 'Chơi Lại' : 'Restart',
        home: language === 'vi' ? 'Về Trang Chủ' : 'Home'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-slate-100 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 border-b-2 border-slate-100 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Settings2 className="w-6 h-6 text-sky-500" />
                        {t.title}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Audio Settings */}
                    <div className="space-y-6">
                        {/* Master Volume */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="font-bold text-slate-700 flex items-center gap-2">
                                    <Volume2 className="w-5 h-5 text-slate-400" />
                                    {t.master}
                                </label>
                                <span className="text-slate-500 font-medium text-sm">{masterVolume}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" 
                                value={masterVolume}
                                onChange={(e) => setMasterVolume(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                            />
                        </div>

                        {/* Music Volume */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="font-bold text-slate-700 flex items-center gap-2">
                                    <Music className="w-5 h-5 text-slate-400" />
                                    {t.music}
                                </label>
                                <span className="text-slate-500 font-medium text-sm">{musicVolume}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" 
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        {/* SFX Volume */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="font-bold text-slate-700 flex items-center gap-2">
                                    <Volume2 className="w-5 h-5 text-slate-400" />
                                    {t.sfx}
                                </label>
                                <span className="text-slate-500 font-medium text-sm">{sfxVolume}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" 
                                value={sfxVolume}
                                onChange={(e) => setSfxVolume(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                        </div>
                    </div>

                    {/* Language Settings */}
                    {allowLanguageChange && (
                        <div className="pt-6 border-t-2 border-slate-100">
                            <label className="font-bold text-slate-700 mb-3 block">
                                {t.lang}
                            </label>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setLanguage('vi')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${language === 'vi' ? 'bg-sky-500 text-white shadow-[0_4px_0_rgb(2,132,199)] translate-y-[-2px]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    Tiếng Việt
                                </button>
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${language === 'en' ? 'bg-sky-500 text-white shadow-[0_4px_0_rgb(2,132,199)] translate-y-[-2px]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    English
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Game Controls */}
                    {(onRestart || onGoHome) && (
                        <div className="pt-6 border-t-2 border-slate-100 flex gap-4">
                            {onRestart && (
                                <button
                                    onClick={() => { onClose(); onRestart(); }}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold transition-all bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_0_rgb(217,119,6)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgb(217,119,6)] active:translate-y-[4px] active:shadow-none"
                                >
                                    {t.restart}
                                </button>
                            )}
                            {onGoHome && (
                                <button
                                    onClick={() => { onClose(); onGoHome(); }}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold transition-all bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_0_rgb(225,29,72)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgb(225,29,72)] active:translate-y-[4px] active:shadow-none"
                                >
                                    {t.home}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
