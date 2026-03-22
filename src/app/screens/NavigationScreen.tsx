import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, MapPin, Navigation, Phone, Clock, Shield } from 'lucide-react';
import { Button } from '../components/Button';

export function NavigationScreen() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleStartNavigation = () => {
    setIsNavigating(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/sos-active')}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-gray-900">Navigate to Nearest Police Station</span>
            </div>

            <Button variant="primary" size="small" icon={<Navigation className="w-4 h-4" />}>
              Recenter
            </Button>
          </div>
        </div>
      </header>

      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Mock Map */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
          {/* Map Grid Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>

          {/* Route Line */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 150 650 Q 250 500, 300 400 T 500 200"
              stroke="#2563eb"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="10 5"
            />
          </svg>

          {/* Current Location Marker */}
          <div className="absolute bottom-32 left-24 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 w-16 h-16 bg-blue-400 rounded-full animate-ping opacity-30"></div>
              <div className="relative w-16 h-16 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1 rounded-lg shadow-lg text-sm font-semibold">
                You
              </div>
            </div>
          </div>

          {/* Destination Marker */}
          <div className="absolute top-32 right-64 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-12 h-12 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-4 py-2 rounded-lg shadow-xl border-2 border-red-500">
                <p className="font-bold text-gray-900 text-sm">Civil Lines Police Station</p>
                <p className="text-xs text-gray-600">1.2 km • 4 min</p>
              </div>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-24 right-6 bg-white rounded-lg shadow-lg overflow-hidden">
            <button className="block w-12 h-12 hover:bg-gray-50 border-b border-gray-200 flex items-center justify-center text-xl font-bold text-gray-700">
              +
            </button>
            <button className="block w-12 h-12 hover:bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-700">
              −
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Card */}
      <div className="bg-white border-t border-gray-200 shadow-2xl">
        <div className="px-6 py-6">
          {!isNavigating ? (
            <div>
              <div className="mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-7 h-7 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Civil Lines Police Station</h3>
                    <p className="text-sm text-gray-600 mb-2">Main Street, Downtown Area</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">1.2 km</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">4 minutes</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-blue-600" />
                    Fastest Route
                  </h4>
                  <p className="text-sm text-gray-600">
                    Take Main Street, turn right on Park Avenue, destination will be on your left.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleStartNavigation}
                variant="primary"
                size="large"
                className="w-full"
                icon={<Navigation className="w-5 h-5" />}
              >
                Start Navigation
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">4 min</p>
                    <p className="text-sm text-gray-600">1.2 km remaining</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Arrival Time</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Date(Date.now() + 4 * 60000).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Navigation className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Continue on Main Street</p>
                      <p className="text-sm text-gray-600">Then turn right in 200 m</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button className="bg-gray-100 hover:bg-gray-200 rounded-lg py-3 text-sm font-medium text-gray-700 transition-colors">
                    Mute
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 rounded-lg py-3 text-sm font-medium text-gray-700 transition-colors">
                    Overview
                  </button>
                  <button
                    onClick={() => setIsNavigating(false)}
                    className="bg-red-100 hover:bg-red-200 rounded-lg py-3 text-sm font-medium text-red-700 transition-colors"
                  >
                    End
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
