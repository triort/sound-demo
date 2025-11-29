"use client";

import { useEffect } from "react";
import Link from "next/link";
import R from "@/components/Ruby";
import { useAudioData } from "@/context/AudioContext";

export default function Home() {
  const { setAudioBlob, setProcessedAudioBlob, setProcessedType, mode, setMode } = useAudioData();

  useEffect(() => {
    // トップページに来たら音声データを初期化
    setAudioBlob(null);
    setProcessedAudioBlob(null);
    setProcessedType(null);
  }, [setAudioBlob, setProcessedAudioBlob, setProcessedType]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-6">
        <R rt="おと">音</R>の<R rt="ふしぎ">不思議</R><R rt="たいけん">体験</R>
      </h1>
      <p className="text-xl mb-4">
        <R rt="じぶん">自分</R>の<R rt="こえ">声</R>を<R rt="へんしん">変身</R>させよう！
      </p>
      <p className="text-lg text-gray-600 mb-8">
        マイクで<R rt="こえ">声</R>を<R rt="ろくおん">録音</R>して、
        <br />
        いろいろな<R rt="おと">音</R>に<R rt="か">変</R>えてみよう
      </p>

      {/* モード選択 */}
      <div className="mb-8 w-full max-w-md">
        <p className="text-lg mb-3">モードを<R rt="えら">選</R>んでね</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setMode("easy")}
            className={`px-6 py-4 rounded-lg text-lg flex-1 ${
              mode === "easy"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <div className="font-bold">かんたん</div>
            <div className="text-sm mt-1">
              <R rt="しょうがくせい">小学生</R>むけ
            </div>
          </button>
          <button
            onClick={() => setMode("advanced")}
            className={`px-6 py-4 rounded-lg text-lg flex-1 ${
              mode === "advanced"
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <div className="font-bold">むずかしい</div>
            <div className="text-sm mt-1">
              <R rt="ちゅうこうせい">中高生</R>・<R rt="おとな">大人</R>むけ
            </div>
          </button>
        </div>
      </div>

      <Link
        href="/record"
        className="px-8 py-4 bg-blue-500 text-white text-2xl rounded-lg"
      >
        はじめる
      </Link>
    </div>
  );
}
