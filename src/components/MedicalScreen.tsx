import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  ArrowLeft, 
  Hospital, 
  Plus,
  Phone,
  MapPin,
  Clock,
  Star,
  Stethoscope,
  Pill,
  Ambulance,
  Languages,
  Heart
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Screen } from '../App';
import { loadFavoritesForType, toggleFavoriteItem } from '../utils/favorites';

interface MedicalScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

interface MedicalFacility {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy' | 'clinic';
  address: string;
  distance: string;
  phone: string;
  emergencyPhone?: string;
  rating: number;
  openHours: string;
  services: string[];
  availability: 'Open' | 'Closed' | '24/7';
}

export function MedicalScreen({ onBack, onNavigate }: MedicalScreenProps) {
  const [activeTab, setActiveTab] = useState<'hospitals' | 'pharmacies'>('hospitals');

  const hospitals: MedicalFacility[] = [
    {
      id: '1',
      name: 'Grand Line General Hospital',
      type: 'hospital',
      address: '123 Marine Boulevard, Water 7',
      distance: '0.8 km',
      phone: '+81-3-1234-5678',
      emergencyPhone: '119',
      rating: 4.8,
      openHours: '24/7',
      services: ['Emergency', 'Surgery', 'ICU', 'Pediatrics'],
      availability: '24/7'
    },
    {
      id: '2',
      name: 'Thousand Sunny Medical Center',
      type: 'hospital',
      address: '456 Dock Street, Sabaody',
      distance: '1.2 km',
      phone: '+81-3-2345-6789',
      emergencyPhone: '119',
      rating: 4.6,
      openHours: '08:00 - 22:00',
      services: ['General', 'Dental', 'Orthopedics'],
      availability: 'Open'
    },
    {
      id: '3',
      name: 'Drum Island Clinic',
      type: 'clinic',
      address: '789 Cherry Blossom Lane, East Blue',
      distance: '2.1 km',
      phone: '+81-3-3456-7890',
      rating: 4.9,
      openHours: '09:00 - 18:00',
      services: ['Family Medicine', 'Vaccinations'],
      availability: 'Open'
    },
    {
      id: '4',
      name: 'New World Emergency Hospital',
      type: 'hospital',
      address: '321 Red Port Avenue, Fish-Man Island',
      distance: '3.5 km',
      phone: '+81-3-4567-8901',
      emergencyPhone: '119',
      rating: 4.7,
      openHours: '24/7',
      services: ['Trauma', 'Emergency', 'ICU', 'Burn Unit'],
      availability: '24/7'
    }
  ];

  const pharmacies: MedicalFacility[] = [
    {
      id: '5',
      name: "Chopper's Pharmacy",
      type: 'pharmacy',
      address: '111 Rumble Ball Street, Sakura Kingdom',
      distance: '0.3 km',
      phone: '+81-3-5678-9012',
      rating: 4.9,
      openHours: '08:00 - 21:00',
      services: ['Prescription', 'OTC Medicines', 'Medical Supplies'],
      availability: 'Open'
    },
    {
      id: '6',
      name: 'Medical Plus Drugstore',
      type: 'pharmacy',
      address: '222 Health Avenue, Alabasta',
      distance: '0.7 km',
      phone: '+81-3-6789-0123',
      rating: 4.5,
      openHours: '24/7',
      services: ['24hr Pharmacy', 'Home Delivery', 'Consultation'],
      availability: '24/7'
    },
    {
      id: '7',
      name: 'Sakura Medical Supplies',
      type: 'pharmacy',
      address: '333 Doctor Lane, Drum Island',
      distance: '1.1 km',
      phone: '+81-3-7890-1234',
      rating: 4.6,
      openHours: '09:00 - 20:00',
      services: ['Medical Equipment', 'First Aid', 'Wheelchairs'],
      availability: 'Open'
    },
    {
      id: '8',
      name: 'Health Care Pharmacy',
      type: 'pharmacy',
      address: '444 Wellness Street, Dressrosa',
      distance: '1.8 km',
      phone: '+81-3-8901-2345',
      rating: 4.4,
      openHours: '08:00 - 22:00',
      services: ['Prescription', 'Vitamins', 'Health Screening'],
      availability: 'Open'
    }
  ];

  const emergencyContacts = [
    { name: 'Ambulance', number: '119', icon: Ambulance, color: 'bg-red-500' },
    { name: 'Police', number: '110', icon: Phone, color: 'bg-blue-500' },
    { name: 'Fire Department', number: '119', icon: Phone, color: 'bg-orange-500' },
  ];

  const currentFacilities = activeTab === 'hospitals' ? hospitals : pharmacies;
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<number | null>(null);

  useEffect(() => {
    loadFavoritesForType('medical').then(setFavorites);
  }, []);

  const handleToggleFavorite = async (facility: MedicalFacility) => {
    setFavoriteLoading(parseInt(facility.id));
    try {
      const newFavorites = await toggleFavoriteItem(
        parseInt(facility.id),
        facility.name,
        'medical',
        facility.address,
        favorites
      );
      setFavorites(newFavorites);
    } finally {
      setFavoriteLoading(null);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case '24/7':
        return 'bg-green-500';
      case 'Open':
        return 'bg-blue-500';
      case 'Closed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-pink-100 to-rose-200 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-700 dark:to-rose-700 px-4 py-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">Medical Services</h1>
            <p className="text-pink-100 dark:text-pink-200 text-sm">Medic's Healthcare Hub</p>
          </div>
          <div className="w-12 h-12 bg-pink-600 dark:bg-pink-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
        </div>

        {/* Medic's Message */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-3 relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white/90 dark:bg-gray-800/90 rotate-45"></div>
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-pink-600 dark:bg-pink-700 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              <span className="font-semibold text-pink-600 dark:text-pink-400">Medic:</span> Your health is my priority! I'll help you find medical care nearby!
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => onNavigate('translator')}
            className="bg-pink-500 dark:bg-pink-600 hover:bg-pink-600 dark:hover:bg-pink-700 active:bg-gray-300 dark:active:bg-gray-600 text-white h-auto py-3 flex flex-col items-center gap-1"
          >
            <Languages className="w-5 h-5" />
            <span className="text-xs">Translator</span>
          </Button>
          {emergencyContacts.slice(0, 2).map((contact) => {
            const IconComponent = contact.icon;
            return (
              <a
                key={contact.name}
                href={`tel:${contact.number}`}
                className={`${contact.color} hover:opacity-90 active:opacity-75 text-white rounded-lg h-auto py-3 flex flex-col items-center gap-1 transition-transform hover:scale-105`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs">{contact.name}</span>
                <span className="text-xs font-bold">{contact.number}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1 shadow-md">
          <Button
            onClick={() => setActiveTab('hospitals')}
            className={`flex-1 ${
              activeTab === 'hospitals'
                ? 'bg-pink-500 dark:bg-pink-600 text-white'
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30'
            }`}
          >
            <Hospital className="w-4 h-4 mr-2" />
            Hospitals
          </Button>
          <Button
            onClick={() => setActiveTab('pharmacies')}
            className={`flex-1 ${
              activeTab === 'pharmacies'
                ? 'bg-pink-500 dark:bg-pink-600 text-white'
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30'
            }`}
          >
            <Pill className="w-4 h-4 mr-2" />
            Pharmacies
          </Button>
        </div>
      </div>

      {/* Facilities List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4 py-4">
          <div className="space-y-3 pb-4">
          {currentFacilities.map((facility) => (
            <Card key={facility.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 shadow-lg border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 flex-1">{facility.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(facility)}
                      disabled={favoriteLoading === parseInt(facility.id)}
                      className="p-1 h-auto ml-2"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.has(parseInt(facility.id))
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400'
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getAvailabilityColor(facility.availability)} text-white text-xs`}>
                      {facility.availability}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{facility.rating}</span>
                    </div>
                  </div>
                </div>
                {facility.type === 'hospital' && (
                  <Hospital className="w-8 h-8 text-pink-500 dark:text-pink-400" />
                )}
                {facility.type === 'pharmacy' && (
                  <Plus className="w-8 h-8 text-pink-500 dark:text-pink-400" />
                )}
                {facility.type === 'clinic' && (
                  <Stethoscope className="w-8 h-8 text-pink-500 dark:text-pink-400" />
                )}
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-pink-500 dark:text-pink-400" />
                  <div>
                    <p>{facility.address}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{facility.distance} away</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                  <span>{facility.openHours}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {facility.services.map((service, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-pink-50 dark:bg-pink-900/40 border-pink-200 dark:border-pink-700 text-pink-700 dark:text-pink-300">
                    {service}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${facility.phone}`}
                  className="flex-1 bg-pink-500 dark:bg-pink-600 hover:bg-pink-600 dark:hover:bg-pink-700 text-white rounded-lg py-2 px-3 flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Call</span>
                </a>
                {facility.emergencyPhone && (
                  <a
                    href={`tel:${facility.emergencyPhone}`}
                    className="flex-1 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg py-2 px-3 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Ambulance className="w-4 h-4" />
                    <span className="text-sm">Emergency</span>
                  </a>
                )}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(facility.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg py-2 px-3 flex items-center justify-center transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                </a>
              </div>
            </Card>
          ))}
          </div>
        </ScrollArea>
      </div>

      {/* Emergency Banner */}
      <div className="px-4 pb-4">
        <Card className="bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 p-3 shadow-lg border-2 border-red-300 dark:border-red-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ambulance className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <h4 className="font-bold text-red-900 dark:text-red-200 text-sm">Emergency Hotline</h4>
                <p className="text-xs text-red-700 dark:text-red-300">Available 24/7</p>
              </div>
            </div>
            <a
              href="tel:119"
              className="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white px-4 py-2 rounded-lg font-bold"
            >
              119
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}