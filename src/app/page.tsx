"use client";

import { useGameState } from "./hooks/useGameState";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { HomeScreen } from "./screens/HomeScreen";
import { StoryScreen } from "./screens/StoryScreen";
import { GameScreen } from "./screens/GameScreen";

export default function Page() {
    const gameState = useGameState();

    if (!gameState.mounted) return null;

    return (
        <>
            <BackgroundMusic appState={gameState.isVictory ? "victory" : gameState.gameOver ? "defeat" : gameState.appState} />
            {gameState.appState === "home" && (
                <HomeScreen
                    language={gameState.language}
                    setAppState={gameState.setAppState}
                    isSettingsOpen={gameState.isSettingsOpen}
                    setIsSettingsOpen={gameState.setIsSettingsOpen}
                    handleWinAlways={gameState.handleWinAlways}
                />
            )}
            {gameState.appState === "story" && (
                <StoryScreen
                    language={gameState.language}
                    setAppState={gameState.setAppState}
                />
            )}
            {gameState.appState === "game" && (
                <GameScreen
                    language={gameState.language}
                    isSettingsOpen={gameState.isSettingsOpen}
                    setIsSettingsOpen={gameState.setIsSettingsOpen}
                    metrics={gameState.metrics}
                    month={gameState.month}
                    isVictory={gameState.isVictory}
                    gameOver={gameState.gameOver}
                    turnResult={gameState.turnResult}
                    handleRestart={gameState.handleRestart}
                    handleGoHome={gameState.handleGoHome}
                    handleWinAlways={gameState.handleWinAlways}
                    handleNextTurn={gameState.handleNextTurn}
                    currentEvent={gameState.currentEvent}
                    userInput={gameState.userInput}
                    setUserInput={gameState.setUserInput}
                    isLoading={gameState.isLoading}
                    handleSubmit={gameState.handleSubmit}
                />
            )}
        </>
    );
}
