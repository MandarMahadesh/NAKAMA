import React, { useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Navigation, MapPin, Clock, Route, Search, Locate, Target } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';

interface NavigationScreenProps {
  onBack: () => void;
}

export function NavigationScreen({ onBack }: NavigationScreenProps) {
  const [selectedRoute, setSelectedRoute] = useState<'walking' | 'driving' | 'transit'>('driving');
  const [currentLocation, setCurrentLocation] = useState('Thousand Sunny Harbor');
  const [destination, setDestination] = useState('Grand Line Resort');
  const [editingCurrent, setEditingCurrent] = useState(false);
  const [editingDestination, setEditingDestination] = useState(false);

  const routes = {
    walking: { time: '15 min', distance: '1.2 km', icon: '🚶‍♂️' },
    driving: { time: '5 min', distance: '1.2 km', icon: '🚗' },
    transit: { time: '8 min', distance: '1.2 km', icon: '🚌' }
  };

  const handleStartNavigation = () => {
    // Open in Google Maps with directions
    const origin = encodeURIComponent(currentLocation);
    const dest = encodeURIComponent(destination);
    const mode = selectedRoute === 'walking' ? 'walking' : selectedRoute === 'transit' ? 'transit' : 'driving';
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=${mode}`,
      '_blank'
    );
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enter it manually.');
        }
      );
    }
  };

  return (
    <div className="size-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-orange-400 dark:bg-orange-700 px-4 py-6 shadow-sm shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="text-orange-900 dark:text-orange-100 hover:bg-orange-300 dark:hover:bg-orange-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-orange-900 dark:text-orange-100">Navigation</h1>
          </div>
          <div className="w-10 h-10 bg-orange-600 dark:bg-orange-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
        </div>
      </div>

      {/* Navigator's Tip */}
      <div className="px-4 py-4 bg-orange-50 dark:bg-gray-800 shrink-0">
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white dark:bg-gray-700 rotate-45"></div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm">
                <span className="font-semibold text-orange-600 dark:text-orange-400">Navigator:</span> 
                Take this route for faster travel! I've calculated the best path! 🗺️
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Location Selection */}
        <div className="px-4 mb-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 space-y-3">
              {/* Current Location */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Current Location</label>
                </div>
                {editingCurrent ? (
                  <div className="flex gap-2">
                    <Input
                      value={currentLocation}
                      onChange={(e) => setCurrentLocation(e.target.value)}
                      placeholder="Enter your location"
                      className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <Button
                      onClick={() => setEditingCurrent(false)}
                      size="sm"
                      className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 active:bg-gray-300 dark:active:bg-gray-600"
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm dark:text-white">
                      {currentLocation}
                    </div>
                    <Button
                      onClick={getCurrentLocation}
                      variant="outline"
                      size="sm"
                      className="shrink-0 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"
                    >
                      <Locate className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setEditingCurrent(true)}
                      variant="outline"
                      size="sm"
                      className="shrink-0 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Destination */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Destination</label>
                </div>
                {editingDestination ? (
                  <div className="flex gap-2">
                    <Input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Enter destination"
                      className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <Button
                      onClick={() => setEditingDestination(false)}
                      size="sm"
                      className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 active:bg-gray-300 dark:active:bg-gray-600"
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm dark:text-white">
                      {destination}
                    </div>
                    <Button
                      onClick={() => setEditingDestination(true)}
                      variant="outline"
                      size="sm"
                      className="shrink-0 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Embedded Google Map */}
        <div className="mx-4 mb-4">
          <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="h-80 relative">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${encodeURIComponent(currentLocation)}&destination=${encodeURIComponent(destination)}&mode=${selectedRoute === 'walking' ? 'walking' : selectedRoute === 'transit' ? 'transit' : 'driving'}`}
              ></iframe>
            </div>
          </Card>
        </div>

        {/* Route Options */}
        <div className="px-4">
          <h3 className="font-semibold mb-3 dark:text-white">Choose Your Route</h3>
          <div className="space-y-3">
            {Object.entries(routes).map(([type, info]) => (
              <Card 
                key={type}
                className={`cursor-pointer transition-all ${
                  selectedRoute === type 
                    ? 'ring-2 ring-orange-500 dark:ring-orange-600 bg-orange-50 dark:bg-gray-700' 
                    : 'hover:shadow-md dark:bg-gray-800 dark:border-gray-700'
                }`}
                onClick={() => setSelectedRoute(type as any)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{info.icon}</span>
                      <div>
                        <p className="font-medium capitalize dark:text-white">{type}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{info.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Route className="w-4 h-4" />
                            <span>{info.distance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedRoute === type 
                        ? 'border-orange-500 dark:border-orange-600 bg-orange-500 dark:bg-orange-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedRoute === type && (
                        <div className="w-full h-full bg-white rounded-full scale-50"></div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Start Navigation Button */}
        <div className="px-4 mt-4">
          <Button 
            onClick={handleStartNavigation}
            className="w-full bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 active:bg-gray-300 dark:active:bg-gray-600 text-white h-14"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Open in Google Maps
          </Button>
        </div>
      </div>
    </div>
  );
}