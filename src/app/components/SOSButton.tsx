import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface SOSButtonProps {
  onActivate: () => void;
  holdDuration?: number;
}

export function SOSButton({ onActivate, holdDuration = 3000 }: SOSButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [progressTimer, setProgressTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHolding) {
      const startTime = Date.now();
      
      const timer = setTimeout(() => {
        onActivate();
        setIsHolding(false);
        setProgress(0);
      }, holdDuration);
      
      const updateProgress = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / holdDuration) * 100, 100);
        setProgress(newProgress);
      }, 16);

      setHoldTimer(timer);
      setProgressTimer(updateProgress);
    } else {
      if (holdTimer) clearTimeout(holdTimer);
      if (progressTimer) clearInterval(progressTimer);
      setProgress(0);
    }

    return () => {
      if (holdTimer) clearTimeout(holdTimer);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [isHolding, holdDuration, onActivate]);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseDown={() => setIsHolding(true)}
      onMouseUp={() => setIsHolding(false)}
      onMouseLeave={() => setIsHolding(false)}
      onTouchStart={() => setIsHolding(true)}
      onTouchEnd={() => setIsHolding(false)}
      className="relative w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-2xl flex items-center justify-center cursor-pointer group"
    >
      {/* Animated Pulse */}
      <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></div>
      
      {/* Progress Ring */}
      {isHolding && (
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeDasharray={565}
            strokeDashoffset={565 - (565 * progress) / 100}
            className="transition-all"
          />
        </svg>
      )}

      {/* Button Content */}
      <div className="relative z-10 text-center">
        <p className="text-white text-5xl font-bold mb-1">SOS</p>
        <p className="text-red-100 text-sm">
          {isHolding ? `${Math.ceil((holdDuration - (progress / 100) * holdDuration) / 1000)}s` : 'Tap & Hold for 3 sec'}
        </p>
      </div>
    </motion.button>
  );
}
