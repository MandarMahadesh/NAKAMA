import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Star, ChefHat, MapPin, Phone, Navigation, Heart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { loadFavoritesForType, toggleFavoriteItem } from '../utils/favorites';

interface RestaurantsScreenProps {
  onBack: () => void;
}

const mockRestaurants = [
  {
    id: 1,
    name: "Baratie Floating Restaurant",
    image: "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcmVzdGF1cmFudCUyMGRpbmluZ3xlbnwxfHx8fDE3NTkwNTM0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    cuisine: "All Blue Cuisine",
    rating: 4.9,
    location: "East Blue Sea",
    specialty: "Sea King Steaks",
    address: "100 Floating Dock, East Blue Sea Port, EB 54321",
    phone: "+1-555-0201",
    distance: "1.2 km away"
  },
  {
    id: 2,
    name: "Thousand Sunny Kitchen",
    image: "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcmVzdGF1cmFudCUyMGRpbmluZ3xlbnwxfHx8fDE3NTkwNTM0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    cuisine: "Pirate Feast",
    rating: 4.8,
    location: "Grand Line",
    specialty: "Meat on the Bone",
    address: "777 Adventure Plaza, Grand Line District, GL 99887",
    phone: "+1-555-0202",
    distance: "0.8 km away"
  },
  {
    id: 3,
    name: "Fish-Man Island Delicacies",
    image: "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcmVzdGF1cmFudCUyMGRpbmluZ3xlbnwxfHx8fDE3NTkwNTM0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    cuisine: "Seafood",
    rating: 4.7,
    location: "Fish-Man Island",
    specialty: "Bubble Coral Sushi",
    address: "500 Coral Way, Fish-Man Island, FM 44556",
    phone: "+1-555-0203",
    distance: "2.1 km away"
  }
];

export function RestaurantsScreen({ onBack }: RestaurantsScreenProps) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<number | null>(null);

  useEffect(() => {
    loadFavoritesForType('restaurant').then(setFavorites);
  }, []);

  const handleToggleFavorite = async (restaurant: typeof mockRestaurants[0]) => {
    setFavoriteLoading(restaurant.id);
    try {
      const newFavorites = await toggleFavoriteItem(
        restaurant.id,
        restaurant.name,
        'restaurant',
        restaurant.address,
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
      <div className="bg-blue-400 dark:bg-blue-700 px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="text-blue-900 dark:text-blue-100 hover:bg-blue-300 dark:hover:bg-blue-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-blue-900 dark:text-blue-100">Restaurants</h1>
          </div>
          <div className="w-10 h-10 bg-blue-600 dark:bg-blue-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
        </div>
      </div>

      {/* Chef's Tip */}
      <div className="px-4 py-4 bg-blue-50 dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white dark:bg-gray-700 rotate-45"></div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Chef:</span> 
                Mademoiselle/Monsieur, these are the finest establishments! Bon appétit! 👨‍🍳
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Cards */}
      <div className="flex-1 px-4 pb-6 space-y-4 overflow-y-auto">
        {mockRestaurants.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="aspect-video relative">
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                {restaurant.cuisine}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg flex-1 dark:text-white">{restaurant.name}</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(restaurant)}
                    disabled={favoriteLoading === restaurant.id}
                    className="p-1 h-auto"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(restaurant.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    />
                  </Button>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <p>{restaurant.address}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{restaurant.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                  <ChefHat className="w-4 h-4" />
                  <span>Specialty: {restaurant.specialty}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 active:bg-gray-300 dark:active:bg-gray-600 text-white col-span-3">
                  Dine Here 🍴
                </Button>
                <a
                  href={`tel:${restaurant.phone}`}
                  className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 active:bg-gray-300 dark:active:bg-gray-600 text-white rounded-md py-2 px-3 flex items-center justify-center gap-1 text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 active:bg-gray-300 dark:active:bg-gray-600 text-white rounded-md py-2 px-3 flex items-center justify-center gap-1 text-sm transition-colors col-span-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Chef Hat */}
      <div className="absolute top-32 right-8 text-blue-300 text-2xl animate-bounce">👨‍🍳</div>
      <div className="absolute top-48 right-16 text-blue-200 text-lg animate-pulse">🍽️</div>
      <div className="absolute top-64 right-12 text-blue-300 text-xl animate-bounce delay-300">🥘</div>
    </div>
  );
}