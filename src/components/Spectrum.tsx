"use client";

import { useEffect, useRef, useState } from "react";
import FFT from "fft.js";

import R from "@/components/Ruby";

interface SpectrumProps {
  audioBlob: Blob | null;
  processedBlob: Blob | null;
}

export default function Spectrum({ audioBlob, processedBlob }: SpectrumProps) {
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeAudio = async (blob: Blob, canvas: HTMLCanvasElement) => {
    const audioContext = new AudioContext();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const channelData = audioBuffer.getChannelData(0);
    const fftSize = 2048;
    const numColumns = Math.min(canvas.width, 200);
    const samplesPerColumn = Math.floor(channelData.length / numColumns);

    // FFTインスタンスを作成
    const fft = new FFT(fftSize);

    // 背景を描画
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 周波数ビンの数（ナイキスト周波数まで）
    const numFreqBins = fftSize / 2;
    // 表示する周波数ビン数（低周波から高周波まで）
    const displayBins = 128;

    for (let col = 0; col < numColumns; col++) {
      const startSample = col * samplesPerColumn;

      // FFT入力用の配列を準備
      const input = new Array(fftSize).fill(0);
      for (let i = 0; i < fftSize && startSample + i < channelData.length; i++) {
        // ハニング窓を適用
        const windowValue = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (fftSize - 1)));
        input[i] = channelData[startSample + i] * windowValue;
      }

      // FFTを実行
      const out = fft.createComplexArray();
      fft.realTransform(out, input);
      fft.completeSpectrum(out);

      // 周波数ごとのマグニチュードを計算
      const magnitudes = new Array(numFreqBins);
      for (let i = 0; i < numFreqBins; i++) {
        const re = out[2 * i];
        const im = out[2 * i + 1];
        magnitudes[i] = Math.sqrt(re * re + im * im);
      }

      // 対数スケールで周波数をマッピング（人間の聴覚に近い）
      for (let bin = 0; bin < displayBins; bin++) {
        // 対数スケールで周波数インデックスを計算
        const minFreq = 20; // 20Hz
        const maxFreq = audioBuffer.sampleRate / 2; // ナイキスト周波数
        const logMin = Math.log10(minFreq);
        const logMax = Math.log10(maxFreq);
        const logFreq = logMin + (bin / displayBins) * (logMax - logMin);
        const freq = Math.pow(10, logFreq);
        const freqIndex = Math.floor((freq / maxFreq) * numFreqBins);

        if (freqIndex >= 0 && freqIndex < numFreqBins) {
          const magnitude = magnitudes[freqIndex];
          // dBスケールに変換
          const db = 20 * Math.log10(magnitude + 1e-10);
          // 正規化（-60dB to 0dB を 0 to 1 に）
          const normalizedDb = Math.max(0, Math.min(1, (db + 60) / 60));
          const intensity = normalizedDb * 255;

          // 色相をマッピング（青→緑→黄→赤）
          const hue = 240 - (intensity / 255) * 240;
          ctx.fillStyle = `hsl(${hue}, 100%, ${30 + (intensity / 255) * 40}%)`;

          const x = (col / numColumns) * canvas.width;
          const y = canvas.height - ((bin + 1) / displayBins) * canvas.height;
          const width = canvas.width / numColumns + 1;
          const height = canvas.height / displayBins + 1;

          ctx.fillRect(x, y, width, height);
        }
      }
    }

    // 軸ラベル
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px sans-serif";
    ctx.fillText("高", 2, 15);
    ctx.fillText("低", 2, canvas.height - 5);

    await audioContext.close();
  };

  useEffect(() => {
    const analyze = async () => {
      setIsAnalyzing(true);

      if (audioBlob && originalCanvasRef.current) {
        await analyzeAudio(audioBlob, originalCanvasRef.current);
      }

      if (processedBlob && processedCanvasRef.current) {
        await analyzeAudio(processedBlob, processedCanvasRef.current);
      } else if (processedCanvasRef.current) {
        const ctx = processedCanvasRef.current.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#1f2937";
          ctx.fillRect(0, 0, processedCanvasRef.current.width, processedCanvasRef.current.height);
          ctx.fillStyle = "#6b7280";
          ctx.font = "14px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("加工後の音声がありません", processedCanvasRef.current.width / 2, processedCanvasRef.current.height / 2);
        }
      }

      setIsAnalyzing(false);
    };

    analyze();
  }, [audioBlob, processedBlob]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-2xl text-center font-extrabold text-gray-600 mb-1 "><R rt="もと">元</R>の<R rt="こえ">声</R></p>
        <canvas
          ref={originalCanvasRef}
          width={300}
          height={150}
          className="w-full rounded-lg border border-gray-300"
        />
      </div>
      <div>
        <p className="text-2xl text-center font-extrabold text-gray-600 mb-1 "><R rt="かこうご">加工後</R>の<R rt="こえ">声</R></p>
        <canvas
          ref={processedCanvasRef}
          width={300}
          height={150}
          className="w-full rounded-lg border border-gray-300"
        />
      </div>
      {isAnalyzing && (
        <p className="text-center text-sm text-gray-500">解析中...</p>
      )}
      <p className="text-md text-gray-800 text-center">
        縦軸: 周波数（上が高音、下が低音）/ 横軸: 時間
      </p>
    </div>
  );
}
