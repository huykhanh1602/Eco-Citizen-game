"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "../contexts/SettingsContext";

interface BackgroundMusicProps {
    /** Current app state to determine when to play/pause music */
    appState: "home" | "story" | "game";
}

/**
 * Manages background music playback.
 * Plays Home.mp3 on the home screen, main.mp3 during gameplay,
 * and pauses on all other screens. Restarts main.mp3 from the
 * beginning each time the user enters the game.
 */
export function BackgroundMusic({ appState }: BackgroundMusicProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const prevAppStateRef = useRef<"home" | "story" | "game">(appState);
    const { masterVolume, musicVolume } = useSettings();

    // Calculate effective volume (master * music)
    const effectiveVolume = (masterVolume / 100) * (musicVolume / 100);

    // Initialize audio element once (no fixed src — we set it dynamically)
    useEffect(() => {
        const audio = new Audio();
        audio.loop = true;
        audio.preload = "auto";
        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = "";
            audioRef.current = null;
        };
    }, []);

    // Play/pause & switch track based on appState
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (appState === "home") {
            // Switch to Home.mp3 if not already playing it
            if (!audio.src.endsWith("/sound/Home.mp3")) {
                audio.src = "/sound/Home.mp3";
                audio.load();
            }
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn("Home music autoplay blocked:", err);
                });
            }
        } else if (appState === "game") {
            // Switch to main.mp3
            if (!audio.src.endsWith("/sound/main.mp3")) {
                audio.src = "/sound/main.mp3";
                audio.load();
            }
            // Restart from the beginning every time the game is entered
            audio.currentTime = 0;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn("Game music autoplay blocked:", err);
                });
            }
        } else {
            // story or any other state: pause
            audio.pause();
        }

        prevAppStateRef.current = appState;
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
