"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'vi' | 'en';

export interface SettingsState {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    language: Language;
}

interface SettingsContextType extends SettingsState {
    setMasterVolume: (val: number) => void;
    setMusicVolume: (val: number) => void;
    setSfxVolume: (val: number) => void;
    setLanguage: (val: Language) => void;
}

const defaultSettings: SettingsState = {
    masterVolume: 100,
    musicVolume: 100,
    sfxVolume: 100,
    language: 'vi'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettingsState] = useState<SettingsState>(defaultSettings);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('ecoCitizenSettings');
        if (stored) {
            try {
                setSettingsState({ ...defaultSettings, ...JSON.parse(stored) });
            } catch (e) {
                console.error('Failed to parse settings');
            }
        }
        setMounted(true);
    }, []);

    const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
        setSettingsState(prev => {
            const next = { ...prev, [key]: value };
            localStorage.setItem('ecoCitizenSettings', JSON.stringify(next));
            return next;
        });
    };

    if (!mounted) {
        return null;
    }

    return (
        <SettingsContext.Provider value={{
            ...settings,
            setMasterVolume: (val) => updateSetting('masterVolume', val),
            setMusicVolume: (val) => updateSetting('musicVolume', val),
            setSfxVolume: (val) => updateSetting('sfxVolume', val),
            setLanguage: (val) => updateSetting('language', val)
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
