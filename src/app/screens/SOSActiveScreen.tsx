import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, MapPin, Phone, Volume2, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';

export function SOSActiveScreen() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsActive(true);
    }
  }, [countdown]);

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <header className="bg-white border-b border-red-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Safety App</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                EMERGENCY ACTIVE
                <Volume2 className="w-4 h-4 animate-pulse" />
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          {/* SOS Activated Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-red-500 rounded-full mb-6"
            >
              <Shield className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900 mb-3"
            >
              SOS ACTIVATED
            </motion.h1>
            <p className="text-lg text-gray-600">Help is on the way. Stay calm.</p>
          </div>

          {/* Countdown Timer */}
          <div className="flex justify-center mb-12">
            <motion.div
              className="relative w-64 h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-64 h-64 -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="112"
                  stroke="#fee2e2"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="112"
                  stroke="#ef4444"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={703}
                  strokeDashoffset={703 * (countdown / 5)}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 703 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-7xl font-bold text-red-600"
                >
                  {countdown > 0 ? countdown : '✓'}
                </motion.div>
                <p className="text-sm text-gray-600 mt-2">
                  {countdown > 0 ? 'seconds' : 'Active'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Cancel Button */}
          <div className="text-center mb-12">
            <Button
              onClick={handleCancel}
              variant="danger"
              size="large"
              className="px-12"
            >
              Cancel SOS
            </Button>
          </div>

          {/* Emergency Status */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Emergency Status</h3>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Live location is being shared</p>
                  <p className="text-sm text-gray-600">GPS tracking enabled and active</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">SMS alerts sent to 3 contacts</p>
                  <p className="text-sm text-gray-600">Emergency contacts have been notified</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Audio recording in progress</p>
                  <p className="text-sm text-gray-600">Recording environment for evidence</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Navigate to Police Station */}
          <div className="mt-8 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Navigate to Nearest Police Station</p>
                  <p className="text-sm text-gray-600">Civil Lines Police Station • 1.2 km away</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/navigation')}
                variant="primary"
                size="medium"
                className="flex-shrink-0"
              >
                Start Navigation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
