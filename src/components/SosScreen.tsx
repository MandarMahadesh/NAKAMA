import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, AlertTriangle, Phone, MapPin, Clock, Heart } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface SosScreenProps {
  onBack: () => void;
}

const emergencyContacts = [
  { name: "Police", number: "110", icon: "🚔", color: "bg-blue-500 dark:bg-blue-600" },
  { name: "Fire Department", number: "119", icon: "🚒", color: "bg-red-500 dark:bg-red-600" },
  { name: "Ambulance", number: "118", icon: "🚑", color: "bg-green-500 dark:bg-green-600" }
];

const nearbyFacilities = [
  {
    id: 1,
    name: "Grand Line Hospital",
    type: "Hospital",
    distance: "0.8 km",
    time: "3 min",
    icon: "🏥",
    available: true,
    address: "123 Marine Boulevard, Water 7"
  },
  {
    id: 2,
    name: "Marine Medical Center",
    type: "Emergency Room",
    distance: "1.2 km", 
    time: "5 min",
    icon: "⚕️",
    available: true,
    address: "456 Dock Street, Sabaody"
  },
  {
    id: 3,
    name: "Chopper's Pharmacy",
    type: "Pharmacy",
    distance: "0.3 km",
    time: "1 min",
    icon: "💊",
    available: true,
    address: "111 Rumble Ball Street, Sakura Kingdom"
  },
  {
    id: 4,
    name: "Water 7 Medical Clinic",
    type: "Clinic",
    distance: "2.1 km",
    time: "8 min",
    icon: "🩺",
    available: false,
    address: "789 Cherry Blossom Lane, East Blue"
  }
];

export function SosScreen({ onBack }: SosScreenProps) {
  return (
    <div className="size-full flex flex-col bg-white dark:bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-400 to-red-500 dark:from-red-600 dark:to-red-700 px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="text-red-900 dark:text-red-100 hover:bg-red-300 dark:hover:bg-red-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-red-900 dark:text-red-100">SOS & Medical</h1>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-red-600 dark:bg-red-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <div className="w-8 h-8 bg-pink-500 dark:bg-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Character Tips */}
      <div className="px-4 py-4 bg-red-50 dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm relative mb-3">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white dark:bg-gray-700 rotate-45"></div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-500 dark:bg-pink-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm">
                <span className="font-semibold text-pink-600 dark:text-pink-400">Medic:</span> 
                Stay safe, I found a hospital nearby! Don't worry, I'll help! 🏥
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white dark:bg-gray-700 rotate-45"></div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-600 dark:bg-red-700 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm">
                <span className="font-semibold text-red-600 dark:text-red-400">Guardian:</span> 
                In case of emergency, don't hesitate to call for backup! ⚔️
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {/* Emergency SOS Button */}
        <div className="mb-6">
          <a
            href="tel:911"
            className="block w-full"
          >
            <Button className="w-full h-24 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white text-xl font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
              <div className="flex flex-col items-center gap-2">
                <AlertTriangle className="w-8 h-8" />
                <span>SOS 🚨</span>
              </div>
            </Button>
          </a>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-6">
          <h2 className="font-bold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Phone className="w-5 h-5 text-red-500 dark:text-red-400" />
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {emergencyContacts.map((contact) => (
              <a
                key={contact.name}
                href={`tel:${contact.number}`}
                className="block"
              >
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-3">
                    <div className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-2xl">{contact.icon}</span>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm dark:text-gray-200">{contact.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{contact.number}</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Nearby Medical Facilities */}
        <div>
          <h2 className="font-bold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Heart className="w-5 h-5 text-pink-500 dark:text-pink-400" />
            Nearby Medical Facilities
          </h2>
          <div className="space-y-3">
            {nearbyFacilities.map((facility) => (
              <Card 
                key={facility.id} 
                className={`${
                  facility.available ? 'hover:shadow-md cursor-pointer' : 'opacity-60'
                } transition-shadow dark:bg-gray-800 dark:border-gray-700`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{facility.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium dark:text-gray-200">{facility.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{facility.type}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{facility.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{facility.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        facility.available 
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {facility.available ? 'Open' : 'Closed'}
                      </div>
                      {facility.available && (
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(facility.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" className="mt-2 bg-pink-500 dark:bg-pink-600 hover:bg-pink-600 dark:hover:bg-pink-700 text-white">
                            Navigate
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}