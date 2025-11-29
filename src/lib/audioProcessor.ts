export type ProcessType =
  | "lowCut"
  | "highCut"
  | "female"
  | "male"
  | "robot";

async function blobToAudioBuffer(
  blob: Blob,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  const arrayBuffer = await blob.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const samples = buffer.length;
  const dataSize = samples * blockAlign;
  const bufferSize = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);

  // WAV header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, bufferSize - 8, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  // Write audio data
  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }

  let offset = 44;
  for (let i = 0; i < samples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

async function applyFilter(
  audioBuffer: AudioBuffer,
  type: BiquadFilterType,
  frequency: number
): Promise<AudioBuffer> {
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;

  const filter = offlineContext.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;

  source.connect(filter);
  filter.connect(offlineContext.destination);

  source.start(0);
  return await offlineContext.startRendering();
}

async function pitchShift(
  audioBuffer: AudioBuffer,
  pitchFactor: number
): Promise<AudioBuffer> {
  const newLength = Math.floor(audioBuffer.length / pitchFactor);
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    newLength,
    audioBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = pitchFactor;

  source.connect(offlineContext.destination);
  source.start(0);

  return await offlineContext.startRendering();
}

async function applyRobotEffect(audioBuffer: AudioBuffer): Promise<AudioBuffer> {
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;

  // Ring modulation for robot effect
  const oscillator = offlineContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = 50; // Low frequency for metallic sound

  const gainNode = offlineContext.createGain();
  gainNode.gain.value = 0.5;

  const modulatorGain = offlineContext.createGain();
  modulatorGain.gain.value = 0;

  // Connect oscillator to modulate the gain
  oscillator.connect(modulatorGain.gain);

  source.connect(gainNode);
  gainNode.connect(modulatorGain);
  modulatorGain.connect(offlineContext.destination);

  // Also add some of the original signal
  const dryGain = offlineContext.createGain();
  dryGain.gain.value = 0.5;
  source.connect(dryGain);
  dryGain.connect(offlineContext.destination);

  source.start(0);
  oscillator.start(0);

  return await offlineContext.startRendering();
}

export async function processAudio(
  blob: Blob,
  processType: ProcessType
): Promise<Blob> {
  const audioContext = new AudioContext();
  const audioBuffer = await blobToAudioBuffer(blob, audioContext);

  let processedBuffer: AudioBuffer;

  switch (processType) {
    case "lowCut":
      // High-pass filter to remove low frequencies
      processedBuffer = await applyFilter(audioBuffer, "highpass", 1000);
      break;
    case "highCut":
      // Low-pass filter to remove high frequencies
      processedBuffer = await applyFilter(audioBuffer, "lowpass", 500);
      break;
    case "female":
      // Pitch up for female voice
      processedBuffer = await pitchShift(audioBuffer, 1.3);
      break;
    case "male":
      // Pitch down for male voice
      processedBuffer = await pitchShift(audioBuffer, 0.75);
      break;
    case "robot":
      // Apply robot effect
      processedBuffer = await applyRobotEffect(audioBuffer);
      break;
    default:
      processedBuffer = audioBuffer;
  }

  await audioContext.close();
  return audioBufferToWav(processedBuffer);
}

export function getProcessLabel(type: ProcessType): string {
  const labels: Record<ProcessType, string> = {
    lowCut: "低音を消す",
    highCut: "高音を消す",
    female: "女の人の声にする",
    male: "男の人の声にする",
    robot: "ロボットにする",
  };
  return labels[type];
}

// むずかしいモード用：パラメータ調整可能な加工
export interface AdvancedParams {
  pitchShift: number; // -50 to 50 (0 = no change)
  lowCutFreq: number; // 0 to 2000 Hz
  highCutFreq: number; // 500 to 8000 Hz
  robotEffect: number; // 0 to 100
}

export async function processAudioAdvanced(
  blob: Blob,
  params: AdvancedParams
): Promise<Blob> {
  const audioContext = new AudioContext();
  let audioBuffer = await blobToAudioBuffer(blob, audioContext);

  // ピッチシフト
  if (params.pitchShift !== 0) {
    // -50 to 50 -> 0.5 to 2.0
    const pitchFactor = Math.pow(2, params.pitchShift / 50);
    audioBuffer = await pitchShift(audioBuffer, pitchFactor);
  }

  // ハイパスフィルター（低音カット）
  if (params.lowCutFreq > 20) {
    audioBuffer = await applyFilter(audioBuffer, "highpass", params.lowCutFreq);
  }

  // ローパスフィルター（高音カット）
  if (params.highCutFreq < 8000) {
    audioBuffer = await applyFilter(audioBuffer, "lowpass", params.highCutFreq);
  }

  // ロボットエフェクト
  if (params.robotEffect > 0) {
    audioBuffer = await applyRobotEffectWithAmount(audioBuffer, params.robotEffect / 100);
  }

  await audioContext.close();
  return audioBufferToWav(audioBuffer);
}

async function applyRobotEffectWithAmount(audioBuffer: AudioBuffer, amount: number): Promise<AudioBuffer> {
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;

  const oscillator = offlineContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = 30 + amount * 70; // 30-100Hz

  const gainNode = offlineContext.createGain();
  gainNode.gain.value = amount * 0.8;

  const modulatorGain = offlineContext.createGain();
  modulatorGain.gain.value = 0;

  oscillator.connect(modulatorGain.gain);

  source.connect(gainNode);
  gainNode.connect(modulatorGain);
  modulatorGain.connect(offlineContext.destination);

  const dryGain = offlineContext.createGain();
  dryGain.gain.value = 1 - amount * 0.5;
  source.connect(dryGain);
  dryGain.connect(offlineContext.destination);

  source.start(0);
  oscillator.start(0);

  return await offlineContext.startRendering();
}
