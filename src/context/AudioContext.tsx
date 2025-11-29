"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type DifficultyMode = "easy" | "advanced";

interface AudioContextType {
  audioBlob: Blob | null;
  setAudioBlob: (blob: Blob | null) => void;
  processedAudioBlob: Blob | null;
  setProcessedAudioBlob: (blob: Blob | null) => void;
  processedType: string | null;
  setProcessedType: (type: string | null) => void;
  mode: DifficultyMode;
  setMode: (mode: DifficultyMode) => void;
}

const AudioDataContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [processedAudioBlob, setProcessedAudioBlob] = useState<Blob | null>(null);
  const [processedType, setProcessedType] = useState<string | null>(null);
  const [mode, setMode] = useState<DifficultyMode>("easy");

  return (
    <AudioDataContext.Provider
      value={{
        audioBlob,
        setAudioBlob,
        processedAudioBlob,
        setProcessedAudioBlob,
        processedType,
        setProcessedType,
        mode,
        setMode,
      }}
    >
      {children}
    </AudioDataContext.Provider>
  );
}

export function useAudioData() {
  const context = useContext(AudioDataContext);
  if (context === undefined) {
    throw new Error("useAudioData must be used within an AudioProvider");
  }
  return context;
}
