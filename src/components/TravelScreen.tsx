import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  ArrowLeft, 
  Car,
  Bus,
  Bike,
  Phone,
  MapPin,
  Clock,
  Star,
  DollarSign,
  Users,
  Fuel
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface TravelScreenProps {
  onBack: () => void;
}

interface TravelService {
  id: string;
  name: string;
  type: 'cab' | 'bus' | 'rental';
  rating: number;
  phone: string;
  whatsapp?: string;
  priceRange: string;
  services: string[];
  availability: 'Available' | 'Busy' | 'Limited';
  vehicles?: string[];
  features: string[];
  address?: string;
  distance: string;
}

export function TravelScreen({ onBack }: TravelScreenProps) {
  const [activeTab, setActiveTab] = useState<'cabs' | 'buses' | 'rentals'>('cabs');

  const cabs: TravelService[] = [
    {
      id: '1',
      name: 'Thousand Sunny Taxi',
      type: 'cab',
      rating: 4.9,
      phone: '+81-3-1111-2222',
      whatsapp: '+81-90-1111-2222',
      priceRange: '¥500 - ¥3000',
      services: ['Airport Transfer', '24/7 Service', 'English Speaking'],
      availability: 'Available',
      features: ['GPS Tracking', 'AC Cars', 'Card Payment'],
      address: '123 Harbor Street, Grand Line District, GL 55001',
      distance: '0.5 km away'
    },
    {
      id: '2',
      name: 'Marine Cab Service',
      type: 'cab',
      rating: 4.7,
      phone: '+81-3-2222-3333',
      whatsapp: '+81-90-2222-3333',
      priceRange: '¥400 - ¥2500',
      services: ['City Tours', 'Hourly Booking', 'Pet Friendly'],
      availability: 'Available',
      features: ['Clean Vehicles', 'Professional Drivers', 'Mobile App'],
      address: '456 Ocean Avenue, Marine Plaza, MP 55002',
      distance: '1.2 km away'
    },
    {
      id: '3',
      name: 'Grand Line Riders',
      type: 'cab',
      rating: 4.8,
      phone: '+81-3-3333-4444',
      whatsapp: '+81-90-3333-4444',
      priceRange: '¥600 - ¥4000',
      services: ['Luxury Cars', 'VIP Service', 'Long Distance'],
      availability: 'Limited',
      features: ['Premium Vehicles', 'WiFi', 'Refreshments'],
      address: '789 Premium Boulevard, Luxury District, LD 55003',
      distance: '2.0 km away'
    }
  ];

  const buses: TravelService[] = [
    {
      id: '4',
      name: 'Sea Train Tours',
      type: 'bus',
      rating: 4.6,
      phone: '+81-3-4444-5555',
      priceRange: '¥1500 - ¥8000',
      services: ['City Tours', 'Day Trips', 'Multi-Day Tours'],
      availability: 'Available',
      vehicles: ['45-Seater', '30-Seater', 'Mini Bus'],
      features: ['AC Bus', 'Tour Guide', 'Lunch Included'],
      address: '200 Station Road, Water 7 Terminal, W7 55004',
      distance: '3.5 km away'
    },
    {
      id: '5',
      name: 'Island Hopper Express',
      type: 'bus',
      rating: 4.5,
      phone: '+81-3-5555-6666',
      priceRange: '¥2000 - ¥12000',
      services: ['Airport Shuttle', 'Group Tours', 'Private Charter'],
      availability: 'Available',
      vehicles: ['60-Seater', '40-Seater', 'Luxury Coach'],
      features: ['Reclining Seats', 'Entertainment', 'Restroom'],
      address: '350 Island Circuit, Archipelago Hub, AH 55005',
      distance: '4.0 km away'
    },
    {
      id: '6',
      name: 'Adventure Bus Tours',
      type: 'bus',
      rating: 4.7,
      phone: '+81-3-6666-7777',
      priceRange: '¥3000 - ¥15000',
      services: ['Mountain Tours', 'Beach Tours', 'Cultural Tours'],
      availability: 'Limited',
      vehicles: ['Open Top Bus', 'Standard Coach'],
      features: ['Photography Stops', 'Multilingual Guide', 'Snacks'],
      address: '500 Adventure Way, Mountain Base, MB 55006',
      distance: '5.5 km away'
    }
  ];

  const rentals: TravelService[] = [
    {
      id: '7',
      name: 'Going Merry Rentals',
      type: 'rental',
      rating: 4.8,
      phone: '+81-3-7777-8888',
      whatsapp: '+81-90-7777-8888',
      priceRange: '¥3000 - ¥15000/day',
      services: ['Daily', 'Weekly', 'Monthly Rental'],
      availability: 'Available',
      vehicles: ['Economy Cars', 'SUVs', 'Vans', 'Motorcycles'],
      features: ['Insurance Included', 'GPS', '24/7 Support'],
      address: '100 Rental Plaza, East Blue Center, EB 55007',
      distance: '2.2 km away'
    },
    {
      id: '8',
      name: 'New World Auto Rentals',
      type: 'rental',
      rating: 4.6,
      phone: '+81-3-8888-9999',
      whatsapp: '+81-90-8888-9999',
      priceRange: '¥5000 - ¥25000/day',
      services: ['Self Drive', 'With Driver', 'Airport Pickup'],
      availability: 'Available',
      vehicles: ['Luxury Cars', 'Electric Cars', 'Sports Cars'],
      features: ['New Models', 'Unlimited Mileage', 'Free Delivery'],
      address: '250 Auto Street, New World District, NW 55008',
      distance: '3.8 km away'
    },
    {
      id: '9',
      name: 'Bike & Ride',
      type: 'rental',
      rating: 4.9,
      phone: '+81-3-9999-0000',
      whatsapp: '+81-90-9999-0000',
      priceRange: '¥1000 - ¥5000/day',
      services: ['Bike Rental', 'Scooter Rental', 'Guided Tours'],
      availability: 'Available',
      vehicles: ['Bicycles', 'Electric Bikes', 'Scooters'],
      features: ['Helmets Included', 'Maps Provided', 'Group Discounts'],
      distance: '1.5 km away'
    }
  ];

  const getCurrentServices = () => {
    switch (activeTab) {
      case 'cabs':
        return cabs;
      case 'buses':
        return buses;
      case 'rentals':
        return rentals;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-500 dark:bg-green-600';
      case 'Busy':
        return 'bg-orange-500 dark:bg-orange-600';
      case 'Limited':
        return 'bg-yellow-500 dark:bg-yellow-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cab':
        return <Car className="w-8 h-8 text-blue-500 dark:text-blue-400" />;
      case 'bus':
        return <Bus className="w-8 h-8 text-blue-500 dark:text-blue-400" />;
      case 'rental':
        return <Bike className="w-8 h-8 text-blue-500 dark:text-blue-400" />;
      default:
        return <Car className="w-8 h-8 text-blue-500 dark:text-blue-400" />;
    }
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-blue-100 to-cyan-200 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-700 dark:to-cyan-700 px-4 py-6 shadow-lg">
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
            <h1 className="text-white text-2xl font-bold">Travel Services</h1>
            <p className="text-blue-100 dark:text-blue-200 text-sm">Helmsman's Transportation Hub</p>
          </div>
          <div className="w-12 h-12 bg-blue-700 dark:bg-blue-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">H</span>
          </div>
        </div>

        {/* Helmsman's Message */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-3 relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white/90 dark:bg-gray-800/90 rotate-45"></div>
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-blue-700 dark:bg-blue-800 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              <span className="font-semibold text-blue-700 dark:text-blue-400">Helmsman:</span> Let me help you navigate these waters! Safe travels, my friend!
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4">
        <div className="flex gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1 shadow-md">
          <Button
            onClick={() => setActiveTab('cabs')}
            className={`flex-1 ${
              activeTab === 'cabs'
                ? 'bg-blue-500 dark:bg-blue-600 text-white'
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
            }`}
          >
            <Car className="w-4 h-4 mr-2" />
            Cabs
          </Button>
          <Button
            onClick={() => setActiveTab('buses')}
            className={`flex-1 ${
              activeTab === 'buses'
                ? 'bg-blue-500 dark:bg-blue-600 text-white'
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
            }`}
          >
            <Bus className="w-4 h-4 mr-2" />
            Buses
          </Button>
          <Button
            onClick={() => setActiveTab('rentals')}
            className={`flex-1 ${
              activeTab === 'rentals'
                ? 'bg-blue-500 dark:bg-blue-600 text-white'
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
            }`}
          >
            <Bike className="w-4 h-4 mr-2" />
            Rentals
          </Button>
        </div>
      </div>

      {/* Services List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="space-y-3 pb-4">
          {getCurrentServices().map((service) => (
            <Card key={service.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 shadow-lg border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{service.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getAvailabilityColor(service.availability)} text-white text-xs`}>
                      {service.availability}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{service.rating}</span>
                    </div>
                  </div>
                </div>
                {getTypeIcon(service.type)}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <DollarSign className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span className="font-semibold">{service.priceRange}</span>
              </div>

              {service.distance && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span>{service.distance}</span>
                </div>
              )}

              {/* Services */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Services:</p>
                <div className="flex flex-wrap gap-1">
                  {service.services.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Vehicles (if applicable) */}
              {service.vehicles && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vehicles:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.vehicles.map((vehicle, index) => (
                      <Badge key={index} className="text-xs bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-0">
                        {vehicle}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {service.features.map((feature, index) => (
                    <span key={index} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      • {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex gap-2">
                <a
                  href={`tel:${service.phone}`}
                  className="flex-1 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg py-2 px-3 flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Call</span>
                </a>
                {service.whatsapp && (
                  <a
                    href={`https://wa.me/${service.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg py-2 px-3 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">WhatsApp</span>
                  </a>
                )}
              </div>
            </Card>
          ))}
          </div>
        </ScrollArea>
      </div>

      {/* Travel Tip */}
      <div className="px-4 pb-4">
        <Card className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 p-3 shadow-lg border-2 border-blue-300 dark:border-blue-700">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-700 dark:bg-blue-800 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold">H</span>
            </div>
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm">Helmsman's Tip</h4>
              <p className="text-blue-800 dark:text-blue-300 text-xs">
                Always confirm prices before starting your journey. Safe travels across the Grand Line!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}