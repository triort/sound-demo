"use client";

import { useState, useRef } from "react";
import { useAudioData } from "@/context/AudioContext";
import Navigation from "@/components/Navigation";
import Waveform from "@/components/Waveform";
import R from "@/components/Ruby";

export default function RecordPage() {
  const { audioBlob, setAudioBlob, setProcessedAudioBlob, setProcessedType } = useAudioData();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setProcessedAudioBlob(null);
        setProcessedType(null);
        mediaStream.getTracks().forEach((track) => track.stop());
        setStream(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("マイクへのアクセスに失敗しました:", error);
      alert("マイクへのアクセスを許可してください");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playAudio = () => {
    if (audioBlob && !isPlaying) {
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
      audio.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">
        <R rt="こえ">声</R>を<R rt="ろくおん">録音</R>しよう
      </h1>

      <div className="flex flex-col items-center gap-6">
        <p className="text-lg text-center">
          {isRecording ? (
            <>
              <R rt="ろくおん">録音</R><R rt="ちゅう">中</R>... もう<R rt="いちど">一度</R>ボタンをおすと<R rt="と">止</R>まるよ
            </>
          ) : (
            <>
              ボタンをおして、マイクにむかって<R rt="はな">話</R>してね
            </>
          )}
        </p>

        {/* 波形表示 */}
        <div className="w-full max-w-md">
          <Waveform stream={stream} isRecording={isRecording} />
        </div>

        <button
          onClick={toggleRecording}
          className={`px-8 py-4 text-xl rounded-lg text-white ${
            isRecording ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {isRecording ? (
            <><R rt="ろくおん">録音</R>を<R rt="と">止</R>める</>
          ) : (
            <><R rt="ろくおん">録音</R>をはじめる</>
          )}
        </button>

        {audioBlob && !isRecording && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <p className="text-lg text-green-600">
              <R rt="ろくおん">録音</R><R rt="かんりょう">完了</R>！
            </p>
            <button
              onClick={isPlaying ? stopAudio : playAudio}
              className="px-6 py-3 bg-purple-500 text-white text-lg rounded-lg"
            >
              {isPlaying ? (
                <><R rt="ていし">停止</R></>
              ) : (
                <><R rt="ろくおん">録音</R>した<R rt="こえ">声</R>を<R rt="き">聞</R>く</>
              )}
            </button>
          </div>
        )}
      </div>

      <Navigation
        prevHref="/"
        prevLabel="トップへ"
        nextHref={audioBlob ? "/process" : undefined}
        nextLabel={<><R rt="こえ">声</R>を<R rt="かこう">加工</R></>}
      />
    </div>
  );
}
