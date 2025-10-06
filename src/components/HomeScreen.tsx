import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Screen } from '../App';
import { useAuth } from './AuthContext';
import { getUserProfile } from '../utils/supabase/client';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { 
  Ship, 
  Calendar, 
  Users, 
  MapPin, 
  ChefHat, 
  AlertTriangle,
  Zap,
  LogOut,
  Cloud,
  Stethoscope,
  Car,
  ShoppingBag,
  Landmark,
  Search,
  X,
  Anchor,
  Compass,
  Languages
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadProfile() {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const { profile } = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.log('Profile load skipped:', error instanceof Error ? error.message : 'Unknown error');
      }
    }
    
    if (user) {
      loadProfile();
    }
  }, [user]);

  // Feature categories
  const essentialServices = [
    { id: 'hotels', name: 'Hotels', description: 'Haven', icon: Ship, gradient: 'from-yellow-400 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700', textColor: 'text-yellow-900 dark:text-yellow-100' },
    { id: 'events', name: 'Events', description: 'Crew', icon: Calendar, gradient: 'from-purple-400 to-purple-500 dark:from-purple-600 dark:to-purple-700', textColor: 'text-purple-900 dark:text-purple-100' },
    { id: 'weather', name: 'Weather', description: 'Navigator', icon: Cloud, gradient: 'from-cyan-400 to-cyan-500 dark:from-cyan-600 dark:to-cyan-700', textColor: 'text-cyan-900 dark:text-cyan-100' },
    { id: 'medical', name: 'Medical', description: 'Medic', icon: Stethoscope, gradient: 'from-pink-400 to-pink-500 dark:from-pink-600 dark:to-pink-700', textColor: 'text-pink-900 dark:text-pink-100' },
  ];

  const travelDining = [
    { id: 'navigation', name: 'Navigation', description: 'Helmsman', icon: MapPin, gradient: 'from-orange-400 to-orange-500 dark:from-orange-600 dark:to-orange-700', textColor: 'text-orange-900 dark:text-orange-100' },
    { id: 'restaurants', name: 'Restaurants', description: 'Chef', icon: ChefHat, gradient: 'from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700', textColor: 'text-blue-900 dark:text-blue-100' },
    { id: 'travel', name: 'Travel', description: 'Helmsman', icon: Car, gradient: 'from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800', textColor: 'text-blue-100' },
    { id: 'translator', name: 'Translator', description: 'Scholar', icon: Languages, gradient: 'from-emerald-400 to-emerald-500 dark:from-emerald-600 dark:to-emerald-700', textColor: 'text-emerald-900 dark:text-emerald-100' },
  ];

  const shopping = [
    { id: 'marketplace', name: 'Marketplace', description: 'Shopping', icon: ShoppingBag, gradient: 'from-teal-400 to-cyan-500 dark:from-teal-600 dark:to-cyan-700', textColor: 'text-teal-900 dark:text-teal-100' },
    { id: 'electronics', name: 'Electronics', description: 'Engineer', icon: Zap, gradient: 'from-cyan-400 to-teal-400 dark:from-cyan-600 dark:to-teal-600', textColor: 'text-cyan-900 dark:text-cyan-100' },
  ];

  const community = [
    { id: 'crewmates', name: 'Crewmates', description: 'Community', icon: Users, gradient: 'from-pink-400 to-rose-400 dark:from-pink-600 dark:to-rose-600', textColor: 'text-pink-900 dark:text-pink-100' },
    { id: 'robin', name: 'History', description: 'Archaeologist', icon: Landmark, gradient: 'from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-800', textColor: 'text-purple-100' },
    { id: 'sos', name: 'SOS', description: 'Guardian', icon: AlertTriangle, gradient: 'from-red-500 to-red-600 dark:from-red-700 dark:to-red-800', textColor: 'text-red-100' },
  ];

  const allFeatures = [...essentialServices, ...travelDining, ...shopping, ...community];

  const filteredFeatures = searchQuery.trim() 
    ? allFeatures.filter(feature => 
        feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const renderFeatureGrid = (features: typeof allFeatures) => (
    <div className="grid grid-cols-2 gap-3">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <Button
            key={feature.id}
            onClick={() => onNavigate(feature.id as Screen)}
            className={`bg-gradient-to-br ${feature.gradient} ${feature.textColor} h-32 flex flex-col items-center justify-center gap-2 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all border-0`}
            variant="ghost"
          >
            <Icon className="w-8 h-8" />
            <div className="text-center">
              <div className="font-bold">{feature.name}</div>
              <div className="text-xs opacity-75">{feature.description}</div>
            </div>
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className="size-full flex flex-col relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Waves */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-200/30 to-transparent dark:from-blue-900/20"></div>
        {/* Compass Rose - Top Right */}
        <div className="absolute top-20 right-4 w-16 h-16 opacity-10 dark:opacity-5">
          <Compass className="w-full h-full text-blue-800 dark:text-blue-200 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        {/* Anchor - Bottom Left */}
        <div className="absolute bottom-20 left-4 w-12 h-12 opacity-10 dark:opacity-5">
          <Anchor className="w-full h-full text-blue-800 dark:text-blue-200" />
        </div>
      </div>

      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-900 px-4 py-6 shadow-lg shrink-0 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Ship className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Nakama</h1>
              {userProfile && (
                <p className="text-blue-100 text-sm">Welcome, {userProfile.name}!</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {userProfile && (
              <button
                onClick={() => onNavigate('profile')}
                className={`w-11 h-11 ${userProfile.avatar_color || 'bg-gray-500'} rounded-full flex items-center justify-center hover:ring-2 hover:ring-white/50 transition-all cursor-pointer shadow-lg`}
              >
                <span className="text-white font-bold">
                  {userProfile.username ? userProfile.username[0].toUpperCase() : userProfile.name?.[0] || 'C'}
                </span>
              </button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Welcome Message */}
        <Card className="mt-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 shadow-md border-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold">C</span>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-200 mb-1">
                <span className="font-semibold text-red-600 dark:text-red-400">Captain:</span> 
                Welcome to our adventure, nakama! What do you want to explore today?
              </p>
              <span className="text-sm text-gray-500 dark:text-gray-400">Just now</span>
            </div>
          </div>
        </Card>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 relative z-10 custom-scrollbar">
        <div className="space-y-6 pb-6">
          {/* Search Results */}
          {filteredFeatures ? (
            <div>
              <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Search Results ({filteredFeatures.length})
              </h2>
              {filteredFeatures.length === 0 ? (
                <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 p-6 text-center backdrop-blur-sm">
                  <p className="text-gray-500 dark:text-gray-400">No features found matching "{searchQuery}"</p>
                </Card>
              ) : (
                renderFeatureGrid(filteredFeatures)
              )}
            </div>
          ) : (
            <>
              {/* Essential Services */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <Anchor className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-bold text-gray-800 dark:text-gray-200">
                    Essential Services
                  </h2>
                </div>
                {renderFeatureGrid(essentialServices)}
              </div>

              {/* Travel & Dining */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center shadow-md">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-bold text-gray-800 dark:text-gray-200">
                    Travel & Dining
                  </h2>
                </div>
                {renderFeatureGrid(travelDining)}
              </div>

              {/* Shopping */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-teal-500 dark:bg-teal-600 rounded-full flex items-center justify-center shadow-md">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-bold text-gray-800 dark:text-gray-200">
                    Shopping
                  </h2>
                </div>
                {renderFeatureGrid(shopping)}
              </div>

              {/* Community & Safety */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-pink-500 dark:bg-pink-600 rounded-full flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-bold text-gray-800 dark:text-gray-200">
                    Community & Safety
                  </h2>
                </div>
                {renderFeatureGrid(community)}
              </div>

              {/* Captain's Tip */}
              <Card className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 p-4 shadow-lg border-2 border-blue-300 dark:border-blue-700 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center justify-center shrink-0">
                    <Ship className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">Captain's Tip</h4>
                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                      Set sail and explore all our features! Each category is designed to help you on your journey. ⚓
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}