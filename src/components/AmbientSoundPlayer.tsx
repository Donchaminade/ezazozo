import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Flame, Waves, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AmbientSoundPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.4);
  const [showToast, setShowToast] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const crackleIntervalRef = useRef<number | null>(null);

  // Initialize or resume audio synthesis
  const startAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 1. Synthèse Océan / Vagues de Lomé (Pink Noise ondulant avec LFO)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low pass filter for gentle deep surf
      const oceanFilter = ctx.createBiquadFilter();
      oceanFilter.type = 'lowpass';
      oceanFilter.frequency.setValueAtTime(320, ctx.currentTime);

      // Wave swell LFO (respiration lente de la mer ~7s)
      const waveGain = ctx.createGain();
      waveGain.gain.setValueAtTime(0.2, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.14, ctx.currentTime); // ~7 seconds wave period
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.18, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(waveGain.gain);

      whiteNoise.connect(oceanFilter);
      oceanFilter.connect(waveGain);
      waveGain.connect(masterGain);

      lfo.start();
      whiteNoise.start();

      // 2. Synthèse Crépitement de Braise / Charbon de bois (Random Sparks & Crackles)
      const playSingleCrackle = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const now = ctx.currentTime;
        
        // Random micro burst of noise + filtered resonance
        const crackleDuration = 0.025 + Math.random() * 0.04;
        const osc = ctx.createBufferSource();
        const crackleBuf = ctx.createBuffer(1, ctx.sampleRate * crackleDuration, ctx.sampleRate);
        const cOut = crackleBuf.getChannelData(0);
        for (let j = 0; j < cOut.length; j++) {
          cOut[j] = (Math.random() * 2 - 1) * Math.exp(-j / (ctx.sampleRate * 0.01));
        }
        osc.buffer = crackleBuf;

        const cFilter = ctx.createBiquadFilter();
        cFilter.type = 'bandpass';
        cFilter.frequency.setValueAtTime(1400 + Math.random() * 2600, now);
        cFilter.Q.setValueAtTime(3.5, now);

        const cGain = ctx.createGain();
        const sparkVolume = 0.12 + Math.random() * 0.22;
        cGain.gain.setValueAtTime(sparkVolume, now);
        cGain.gain.exponentialRampToValueAtTime(0.001, now + crackleDuration);

        osc.connect(cFilter);
        cFilter.connect(cGain);
        cGain.connect(masterGain);

        osc.start(now);
      };

      // Periodic & randomized sparks firing
      crackleIntervalRef.current = window.setInterval(() => {
        if (Math.random() > 0.35) {
          playSingleCrackle();
        }
        if (Math.random() > 0.65) {
          setTimeout(playSingleCrackle, 80 + Math.random() * 150);
        }
      }, 240);

      setIsPlaying(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3800);
    } catch {
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (crackleIntervalRef.current) {
      clearInterval(crackleIntervalRef.current);
      crackleIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Update volume live
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <>
      {/* Discreet floating sound controller */}
      <div className="fixed bottom-24 right-5 z-40 flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#181615]/90 backdrop-blur-md border border-[#332e2b] shadow-2xl hover:border-[#e11d48]/60 transition-colors"
        >
          <button
            onClick={toggleAudio}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer relative ${
              isPlaying
                ? 'bg-[#e11d48] text-white shadow-lg shadow-[#e11d48]/30'
                : 'bg-[#242120] text-[#c4bfb9] hover:text-[#f5f3f0]'
            }`}
            title={isPlaying ? "Désactiver l'ambiance sonore" : "Activer l'ambiance sonore Braise & Océan"}
            aria-label={isPlaying ? "Couper le son de la braise" : "Écouter l'ambiance sonore de la braise et de l'océan"}
          >
            {isPlaying ? (
              <div className="flex items-center justify-center relative">
                <Volume2 className="w-4 h-4 text-white" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Equalizer animation & Label */}
          <div className="flex flex-col cursor-pointer select-none" onClick={toggleAudio}>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#f5f3f0] leading-none">
                {isPlaying ? 'Braise & Océan' : 'Ambiance Braise'}
              </span>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3 w-3">
                  <span className="w-0.5 bg-[#e11d48] rounded-full animate-bounce [animation-delay:0ms] h-full" />
                  <span className="w-0.5 bg-[#fda4af] rounded-full animate-bounce [animation-delay:150ms] h-2/3" />
                  <span className="w-0.5 bg-[#e11d48] rounded-full animate-bounce [animation-delay:300ms] h-4/5" />
                </div>
              )}
            </div>
            <span className="text-[9px] text-[#8f8883] leading-tight">
              {isPlaying ? 'Son 3D en direct' : 'Lomé en audio'}
            </span>
          </div>

          {/* Volume slider when active */}
          {isPlaying && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 bg-[#2e2a28] rounded-lg appearance-none cursor-pointer accent-[#e11d48] ml-1"
              title="Ajuster le volume"
              aria-label="Volume de l'ambiance sonore"
            />
          )}
        </motion.div>
      </div>

      {/* Floating Info Toast notification upon activation */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-36 right-5 z-50 p-4 rounded-2xl bg-[#1a1817] border border-[#e11d48]/50 shadow-2xl backdrop-blur-md max-w-xs text-left"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#e11d48]/20 text-[#e11d48] shrink-0 mt-0.5">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#f5f3f0] font-display flex items-center gap-1.5">
                  <span>Ambiance Braise & Océan Active</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#fda4af]" />
                </div>
                <p className="text-[11px] text-[#c4bfb9] mt-1 leading-relaxed">
                  Vous écoutez la douce houle de la côte de Lomé combinée aux crépitements du charbon de bois d’Eza Zozo.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
