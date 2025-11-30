"use client";

import { useState, useRef, ReactNode } from "react";
import { useAudioData } from "@/context/AudioContext";
import Navigation from "@/components/Navigation";
import Spectrum from "@/components/Spectrum";
import { processAudio, processAudioAdvanced, ProcessType, AdvancedParams } from "@/lib/audioProcessor";
import R from "@/components/Ruby";

const processLabels: Record<ProcessType, ReactNode> = {
  lowCut: <><R rt="ていおん">低音</R>を<R rt="け">消</R>す</>,
  highCut: <><R rt="こうおん">高音</R>を<R rt="け">消</R>す</>,
  female: <><R rt="おんな">女</R>の<R rt="ひと">人</R>の<R rt="こえ">声</R>にする</>,
  male: <><R rt="おとこ">男</R>の<R rt="ひと">人</R>の<R rt="こえ">声</R>にする</>,
  robot: <>ロボットにする</>,
};

const processTypes: ProcessType[] = ["lowCut", "highCut", "female", "male", "robot"];

export default function ProcessPage() {
  const { audioBlob, processedAudioBlob, setProcessedAudioBlob, processedType, setProcessedType, mode } =
    useAudioData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingProcessed, setIsPlayingProcessed] = useState(false);
  const originalAudioRef = useRef<HTMLAudioElement | null>(null);
  const processedAudioRef = useRef<HTMLAudioElement | null>(null);

  // むずかしいモード用のパラメータ
  const [advancedParams, setAdvancedParams] = useState<AdvancedParams>({
    pitchShift: 0,
    lowCutFreq: 0,
    highCutFreq: 8000,
    robotEffect: 0,
  });

  const handleProcess = async (type: ProcessType) => {
    if (!audioBlob || isProcessing) return;

    setIsProcessing(true);
    try {
      const processed = await processAudio(audioBlob, type);
      setProcessedAudioBlob(processed);
      setProcessedType(type);
    } catch (error) {
      console.error("音声加工に失敗しました:", error);
      alert("音声の加工に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdvancedProcess = async () => {
    if (!audioBlob || isProcessing) return;

    setIsProcessing(true);
    try {
      const processed = await processAudioAdvanced(audioBlob, advancedParams);
      setProcessedAudioBlob(processed);
      setProcessedType("advanced");
    } catch (error) {
      console.error("音声加工に失敗しました:", error);
      alert("音声の加工に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const playOriginal = () => {
    if (audioBlob && !isPlayingOriginal) {
      stopProcessed();
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      originalAudioRef.current = audio;
      audio.onended = () => {
        setIsPlayingOriginal(false);
        URL.revokeObjectURL(url);
      };
      audio.play();
      setIsPlayingOriginal(true);
    }
  };

  const stopOriginal = () => {
    if (originalAudioRef.current) {
      originalAudioRef.current.pause();
      originalAudioRef.current.currentTime = 0;
      setIsPlayingOriginal(false);
    }
  };

  const playProcessed = () => {
    if (processedAudioBlob && !isPlayingProcessed) {
      stopOriginal();
      const url = URL.createObjectURL(processedAudioBlob);
      const audio = new Audio(url);
      processedAudioRef.current = audio;
      audio.onended = () => {
        setIsPlayingProcessed(false);
        URL.revokeObjectURL(url);
      };
      audio.play();
      setIsPlayingProcessed(true);
    }
  };

  const stopProcessed = () => {
    if (processedAudioRef.current) {
      processedAudioRef.current.pause();
      processedAudioRef.current.currentTime = 0;
      setIsPlayingProcessed(false);
    }
  };

  if (!audioBlob) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-center">
          <R rt="こえ">声</R>を<R rt="かこう">加工</R>しよう
        </h1>
        <p className="text-center text-lg">
          <R rt="さき">先</R>に<R rt="こえ">声</R>を<R rt="ろくおん">録音</R>してね
        </p>
        <Navigation prevHref="/record" prevLabel={<><R rt="ろくおん">録音</R>へ</>} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">
        <R rt="こえ">声</R>を<R rt="かこう">加工</R>しよう
      </h1>

      {mode === "easy" ? (
        // かんたんモード
        <div className="mb-8 max-w-4xl mx-auto">
          <p className="text-lg text-center mb-4">
            <R rt="す">好</R>きなボタンをおしてね
          </p>
          <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
            {processTypes.map((type) => (

              <button
                key={type}
                onClick={() => handleProcess(type)}
                disabled={isProcessing}
                className={`px-6 py-4 text-lg rounded-lg text-white ${processedType === type
                  ? "bg-orange-500"
                  : "bg-blue-500"
                  } disabled:opacity-50`}
              >
                {processLabels[type]}
                {processedType === type && " ✓"}
              </button>

            ))}
          </div>
        </div>
      ) : (
        // むずかしいモード
        <div className="mb-8 space-y-6">
          <p className="text-lg text-center mb-4">
            どのくらい加工しよう？<R rt='じぶん'>自分</R>で<R rt="ちょうせい">調整</R>してね
          </p>

          {/* スライダー群 */}
          <div className="grid grid-cols-2 gap-16">
            <div>
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <R rt="こえ">声</R>の<R rt="たか">高</R>さ: {advancedParams.pitchShift > 0 ? "+" : ""}{advancedParams.pitchShift}
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={advancedParams.pitchShift}
                    onChange={(e) => setAdvancedParams({ ...advancedParams, pitchShift: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span><R rt="ひく">低</R>い</span>
                    <span><R rt="たか">高</R>い</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    <R rt="ていおん">低音</R>カット: {advancedParams.lowCutFreq}Hz
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={advancedParams.lowCutFreq}
                    onChange={(e) => setAdvancedParams({ ...advancedParams, lowCutFreq: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>なし</span>
                    <span><R rt="つよ">強</R>い</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    <R rt="こうおん">高音</R>カット: {advancedParams.highCutFreq}Hz
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="8000"
                    step="100"
                    value={advancedParams.highCutFreq}
                    onChange={(e) => setAdvancedParams({ ...advancedParams, highCutFreq: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span><R rt="つよ">強</R>い</span>
                    <span>なし</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    ロボット<R rt="こうか">効果</R>: {advancedParams.robotEffect}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={advancedParams.robotEffect}
                    onChange={(e) => setAdvancedParams({ ...advancedParams, robotEffect: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>なし</span>
                    <span><R rt="つよ">強</R>い</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAdvancedProcess}
                disabled={isProcessing}
                className="w-full px-6 py-4 text-lg rounded-lg text-white bg-purple-500 disabled:opacity-50"
              >
                <R rt="かこう">加工</R>する
              </button>
            </div>
            <div>
              {/* スペクトラム表示 */}
              <Spectrum audioBlob={audioBlob} processedBlob={processedAudioBlob} />
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <p className="text-center mt-4 text-gray-600">
          <R rt="かこう">加工</R><R rt="ちゅう">中</R>...
        </p>
      )}

      <div className="border-t pt-6">
        <p className="text-lg text-center mb-4">
          <R rt="き">聞</R>きくらべてみよう
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={isPlayingOriginal ? stopOriginal : playOriginal}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg"
          >
            {isPlayingOriginal ? (
              <><R rt="ていし">停止</R></>
            ) : (
              <>もとの<R rt="こえ">声</R></>
            )}
          </button>
          <button
            onClick={isPlayingProcessed ? stopProcessed : playProcessed}
            disabled={!processedAudioBlob}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg disabled:opacity-50"
          >
            {isPlayingProcessed ? (
              <><R rt="ていし">停止</R></>
            ) : (
              <><R rt="かこう">加工</R>した<R rt="こえ">声</R></>
            )}
          </button>
        </div>
      </div>

      <Navigation
        prevHref="/record"
        prevLabel={<><R rt="ろくおん">録音</R>へ</>}
        nextHref="/explanation"
        nextLabel={<>しくみを<R rt="まな">学</R>ぶ</>}
      />
    </div>
  );
}
