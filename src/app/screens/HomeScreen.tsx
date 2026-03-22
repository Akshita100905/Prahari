import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Shield,
  Bell,
  MapPin,
  Mic,
  Navigation,
  Phone,
  MessageSquare,
  ChevronRight,
  Plus,
  Volume2,
  Lock,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import prahariLogo from 'figma:asset/33b3731ce40c63c1db6c6a94c068ef292ecf20e7.png';

export function HomeScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'home' | 'contacts' | 'settings'>('home');

  const handleSOSActivation = () => {
    navigate('/sos-active');
  };

  const emergencyContacts = [
    { name: 'Priya Sharma', phone: '+91 98765 43210', initial: 'P', color: 'bg-blue-500', badge: 'Primary' },
    { name: 'Rahul Verma', phone: '+91 87654 32109', initial: 'R', color: 'bg-purple-500', badge: null },
    { name: 'Mom', phone: '+91 76543 21098', initial: 'M', color: 'bg-green-500', badge: null },
    { name: 'Best Friend', phone: '+91 65432 10987', initial: 'B', color: 'bg-red-500', badge: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={prahariLogo} alt="Prahari Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-gray-900">प्रhari</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <button className="text-gray-900 font-medium border-b-2 border-blue-600 pb-1">
                Home
              </button>
              <button className="text-gray-600 hover:text-gray-900">Features</button>
              <button className="text-gray-600 hover:text-gray-900">How It Works</button>
              <button className="text-gray-600 hover:text-gray-900">About</button>
            </nav>

            <Button
              variant="danger"
              size="medium"
              onClick={handleSOSActivation}
              icon={<Phone className="w-5 h-5" />}
            >
              Emergency SOS
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <Card className="text-center">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <img src={prahariLogo} alt="Prahari Logo" className="w-6 h-6 object-contain" />
                  <span className="font-medium text-gray-900">प्रhari</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                    System Active
                  </span>
                  <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Stay Safe 💙</h2>
              <p className="text-gray-600 mb-8">You are protected. Tap SOS in case of emergency.</p>

              {/* SOS Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSOSActivation}
                className="relative mx-auto w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-2xl flex items-center justify-center cursor-pointer group"
              >
                <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></div>
                <div className="relative z-10 text-center">
                  <p className="text-white text-5xl font-bold mb-1">SOS</p>
                  <p className="text-red-100 text-sm">Tap & Hold for 3 sec</p>
                </div>
              </motion.button>

              {/* Status Cards */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-600">Live Location</span>
                  </div>
                  <p className="text-sm font-semibold text-green-600">Tracking</p>
                  <p className="text-xs text-gray-500">GPS active • Sharing enabled</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-600">Nearest Police</span>
                  </div>
                  <p className="text-sm font-semibold text-blue-600">1.2 km away</p>
                  <p className="text-xs text-gray-500">Get Directions</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-gray-600">Voice Command</span>
                  </div>
                  <p className="text-sm font-semibold text-purple-600">Enabled</p>
                  <p className="text-xs text-gray-500">Say "Help me" to trigger SOS</p>
                </div>
              </div>
            </Card>

            {/* Live Location Preview */}
            <Card title="Live Location Preview">
              <div className="relative h-64 bg-gray-100 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600 font-medium mb-1">Your Current Location</p>
                    <p className="text-sm text-gray-500">GPS Enabled • Live Tracking</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Tracking Active
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" className="flex-1">
                  <MapPin className="w-4 h-4" />
                  Add Contact
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4" />
                  View All Contacts
                </Button>
              </div>
            </Card>

            {/* Emergency Contacts */}
            {activeTab === 'home' && (
              <Card
                title="Emergency Contacts"
                action={
                  <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm">
                    Add New <Plus className="w-4 h-4" />
                  </button>
                }
              >
                <div className="space-y-3">
                  {emergencyContacts.map((contact) => (
                    <div
                      key={contact.phone}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                          {contact.initial}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{contact.name}</p>
                            {contact.badge && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                {contact.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors">
                          <Phone className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors">
                          <MessageSquare className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings & Preferences */}
            <Card title="Settings & Preferences">
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mic className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Voice Activation</p>
                      <p className="text-xs text-gray-500">Customize trigger words</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Lock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Change PIN</p>
                      <p className="text-xs text-gray-500">Update your security PIN</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Notification Settings</p>
                      <p className="text-xs text-gray-500">Manage alert preferences</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <SettingsIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">App Preferences</p>
                      <p className="text-xs text-gray-500">Theme, language, and more</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full mt-4 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-600 font-medium flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Your safety is our priority</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Live tracking active</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Voice commands enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Emergency response ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}