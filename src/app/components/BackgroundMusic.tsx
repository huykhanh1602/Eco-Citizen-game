"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "../contexts/SettingsContext";

interface BackgroundMusicProps {
    /** Current app state to determine when to play/pause music */
    appState: "home" | "story" | "game";
}

/**
 * Manages background music playback.
 * Plays Home.mp3 when on the home screen, pauses when navigating away,
 * and resumes when returning to the home screen.
 */
export function BackgroundMusic({ appState }: BackgroundMusicProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { masterVolume, musicVolume } = useSettings();

    // Calculate effective volume (master * music)
    const effectiveVolume = (masterVolume / 100) * (musicVolume / 100);

    // Initialize audio element once
    useEffect(() => {
        const audio = new Audio("/sound/Home.mp3");
        audio.loop = true;
        audio.preload = "auto";
        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = "";
            audioRef.current = null;
        };
    }, []);

    // Play/pause based on appState
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (appState === "home") {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    // Autoplay may be blocked by browser; silently ignore
                    console.warn("Home music autoplay blocked:", err);
                });
            }
        } else {
            audio.pause();
        }
    }, [appState]);

    // Update volume whenever the effective volume changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = effectiveVolume;
    }, [effectiveVolume]);

    // This component renders nothing visually
    return null;
}
