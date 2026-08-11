import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TextToSpeechButtonProps {
  text: string;
  className?: string;
}

export const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({ text, className = '' }) => {
  const { speakText } = useApp();
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speakText(text);
      // Auto reset after expected speaking duration estimate
      const wordCount = text.split(/\s+/).length;
      const durationMs = Math.max(3000, (wordCount / 2) * 1000);
      setTimeout(() => setSpeaking(false), durationMs);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 ${className}`}
      title={speaking ? 'থামান' : 'শুনুন'}
      aria-label="Text to speech"
    >
      {speaking ? (
        <>
          <VolumeX className="w-3.5 h-3.5 animate-pulse text-red-500" />
          <span>থামান</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5" />
          <span>শুনুন</span>
        </>
      )}
    </button>
  );
};
