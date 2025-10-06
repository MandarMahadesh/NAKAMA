import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Zap, MapPin, Wrench, Phone, Navigation, Heart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { loadFavoritesForType, toggleFavoriteItem } from '../utils/favorites';

interface ElectronicsScreenProps {
  onBack: () => void;
}

const mockShops = [
  {
    id: 1,
    name: "Engineer's Super Workshop",
    image: "https://images.unsplash.com/photo-1731080647266-85cf1bc27162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc29ydHxlbnwxfHx8fDE3NTg5NTc0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Ultimate cyborg parts and ship modifications",
    location: "Water 7",
    specialties: ["Cyborg Parts", "Ship Upgrades", "Cola-Powered Devices"],
    address: "7 Galley-La Street, Water 7, W7 10001",
    phone: "+1-555-0401",
    distance: "3.0 km away"
  },
  {
    id: 2,
    name: "Vegapunk Tech Store",
    image: "https://images.unsplash.com/photo-1731080647266-85cf1bc27162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc29ydHxlbnwxfHx8fDE3NTg5NTc0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Advanced scientific equipment and gadgets",
    location: "Egghead Island",
    specialties: ["Scientific Instruments", "Den Den Mushi", "Weather Control"],
    address: "2 Future Lab Avenue, Egghead Island, EG 20002",
    phone: "+1-555-0402",
    distance: "8.5 km away"
  },
  {
    id: 3,
    name: "Storyteller's Invention Shop",
    image: "https://images.unsplash.com/photo-1731080647266-85cf1bc27162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc29ydHxlbnwxfHx8fDE3NTg5NTc0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Creative gadgets and slingshot accessories",
    location: "Syrup Village",
    specialties: ["Slingshots", "Pop Greens", "Kabuto Upgrades"],
    address: "50 Inventor Road, Syrup Village, SV 30003",
    phone: "+1-555-0403",
    distance: "4.2 km away"
  }
];

export function ElectronicsScreen({ onBack }: ElectronicsScreenProps) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<number | null>(null);

  useEffect(() => {
    loadFavoritesForType('electronics').then(setFavorites);
  }, []);

  const handleToggleFavorite = async (shop: typeof mockShops[0]) => {
    setFavoriteLoading(shop.id);
    try {
      const newFavorites = await toggleFavoriteItem(
        shop.id,
        shop.name,
        'electronics',
        shop.address,
        favorites
      );
      setFavorites(newFavorites);
    } finally {
      setFavoriteLoading(null);
    }
  };

  return (
    <div className="size-full flex flex-col bg-white dark:bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-cyan-400 to-teal-400 dark:from-cyan-600 dark:to-teal-600 px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="text-cyan-900 dark:text-cyan-100 hover:bg-cyan-300 dark:hover:bg-cyan-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-cyan-900 dark:text-cyan-100">Electronics</h1>
          </div>
          <div className="w-10 h-10 bg-cyan-600 dark:bg-cyan-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
        </div>
      </div>

      {/* Engineer's Tip */}
      <div className="px-4 py-4 bg-cyan-50 dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white dark:bg-gray-700 rotate-45"></div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-cyan-500 dark:bg-cyan-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm">
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">Engineer:</span> 
                SUPERRR! You'll find your tools here, bro! 🔧⚡
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Cards */}
      <div className="flex-1 px-4 pb-6 space-y-4 overflow-y-auto">
        {mockShops.map((shop) => (
          <Card key={shop.id} className="overflow-hidden shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="aspect-video relative">
              <img 
                src={shop.image} 
                alt={shop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-cyan-500 dark:bg-cyan-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Electronics
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg flex-1 dark:text-gray-200">{shop.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleFavorite(shop)}
                  disabled={favoriteLoading === shop.id}
                  className="p-1 h-auto dark:hover:bg-gray-700"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.has(shop.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400'
                    }`}
                  />
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{shop.description}</p>
              
              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 dark:text-cyan-400" />
                <div>
                  <p>{shop.address}</p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold">{shop.distance}</p>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-3">
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Wrench className="w-4 h-4" />
                  Specialties:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {shop.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 text-xs px-2 py-1 rounded-full border border-cyan-200 dark:border-cyan-700"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button className="bg-cyan-500 dark:bg-cyan-600 hover:bg-cyan-600 dark:hover:bg-cyan-700 text-white col-span-3">
                  Visit Shop 🔧
                </Button>
                <a
                  href={`tel:${shop.phone}`}
                  className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md py-2 px-3 flex items-center justify-center gap-1 text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white rounded-md py-2 px-3 flex items-center justify-center gap-1 text-sm transition-colors col-span-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Tech Icons */}
      <div className="absolute top-32 right-8 text-cyan-300 dark:text-cyan-600 text-2xl animate-bounce">⚡</div>
      <div className="absolute top-48 right-16 text-cyan-200 dark:text-cyan-700 text-lg animate-pulse">🔧</div>
      <div className="absolute top-64 right-12 text-cyan-300 dark:text-cyan-600 text-xl animate-bounce delay-300">🛠️</div>
    </div>
  );
}