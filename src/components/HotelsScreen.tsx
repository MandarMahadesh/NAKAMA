import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Star, Filter, MapPin, Phone, Navigation, Heart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { bookHotel, apiCall } from '../utils/supabase/client';

interface HotelsScreenProps {
  onBack: () => void;
}

const mockHotels = [
  {
    id: 1,
    name: "Grand Line Resort",
    image: "https://images.unsplash.com/photo-1731080647266-85cf1bc27162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc29ydHxlbnwxfHx8fDE3NTg5NTc0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    price: "$120/night",
    location: "East Blue Bay",
    address: "123 Paradise Road, East Blue Bay, GL 12345",
    phone: "+1-555-0101",
    distance: "2.5 km away"
  },
  {
    id: 2,
    name: "Thousand Sunny Hotel",
    image: "https://images.unsplash.com/photo-1699899665723-4c2cd9ddf58d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXJhdGUlMjBzaGlwJTIwc2FpbGluZ3xlbnwxfHx8fDE3NTkwNTMzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    price: "$85/night",
    location: "Water 7 Harbor",
    address: "456 Shipwright Avenue, Water 7 Harbor, GL 67890",
    phone: "+1-555-0102",
    distance: "1.8 km away"
  },
  {
    id: 3,
    name: "Merry Inn",
    image: "https://images.unsplash.com/photo-1731080647266-85cf1bc27162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc29ydHxlbnwxfHx8fDE3NTg5NTc0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    price: "$65/night",
    location: "Syrup Village",
    address: "789 Village Square, Syrup Village, GL 11223",
    phone: "+1-555-0103",
    distance: "3.2 km away"
  }
];

export function HotelsScreen({ onBack }: HotelsScreenProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<number | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await apiCall('/profile/favorites');
      const hotelFavs = res.favorites
        .filter((fav: any) => fav.type === 'hotel')
        .map((fav: any) => parseInt(fav.itemId));
      setFavorites(new Set(hotelFavs));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (hotel: typeof mockHotels[0]) => {
    setFavoriteLoading(hotel.id);
    try {
      if (favorites.has(hotel.id)) {
        // Remove from favorites
        const res = await apiCall('/profile/favorites');
        const fav = res.favorites.find((f: any) => f.itemId === hotel.id.toString() && f.type === 'hotel');
        if (fav) {
          await apiCall('/profile/favorites/remove', {
            method: 'POST',
            body: JSON.stringify({ favoriteId: fav.id })
          });
        }
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(hotel.id);
          return newSet;
        });
      } else {
        // Add to favorites
        await apiCall('/profile/favorites/add', {
          method: 'POST',
          body: JSON.stringify({
            itemId: hotel.id.toString(),
            name: hotel.name,
            type: 'hotel',
            location: hotel.address
          })
        });
        setFavorites(prev => new Set(prev).add(hotel.id));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(null);
    }
  };

  const handleBookHotel = async (hotel: any) => {
    try {
      setBookingLoading(hotel.id);
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + 1); // Tomorrow
      const checkOut = new Date();
      checkOut.setDate(checkOut.getDate() + 3); // Day after tomorrow
      
      await bookHotel(
        hotel.id.toString(),
        hotel.name,
        checkIn.toISOString(),
        checkOut.toISOString(),
        hotel.price
      );
      
      alert(`Successfully booked ${hotel.name}! 🎉`);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <div className="size-full flex flex-col bg-white dark:bg-gray-900">
      {/* Top Bar */}
      <div className="bg-yellow-400 dark:bg-yellow-700 px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="text-yellow-900 dark:text-yellow-100 hover:bg-yellow-300 dark:hover:bg-yellow-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-yellow-900 dark:text-yellow-100">Hotels</h1>
          </div>
          <div className="w-10 h-10 bg-yellow-600 dark:bg-yellow-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
        </div>
      </div>

      {/* Sunny's Tip */}
      <div className="px-4 py-4 bg-yellow-50 dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white dark:bg-gray-700 rotate-45"></div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-yellow-500 dark:bg-yellow-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm">
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">Haven:</span> 
                Ready to find your perfect accommodation, Captain!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Cards */}
      <div className="flex-1 px-4 pb-20 space-y-4 overflow-y-auto">
        {mockHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="aspect-video relative">
              <img 
                src={hotel.image} 
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg dark:text-white">{hotel.name}</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(hotel)}
                    disabled={favoriteLoading === hotel.id}
                    className="p-1 h-auto"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(hotel.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    />
                  </Button>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium dark:text-white">{hotel.rating}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-1 text-gray-600 dark:text-gray-300 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <p>{hotel.address}</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">{hotel.distance}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{hotel.price}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  className="bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 active:bg-gray-300 dark:active:bg-gray-600 text-white col-span-3"
                  onClick={() => handleBookHotel(hotel)}
                  disabled={bookingLoading === hotel.id.toString()}
                >
                  {bookingLoading === hotel.id.toString() ? 'Booking...' : 'Set Sail ⚓'}
                </Button>
                <a
                  href={`tel:${hotel.phone}`}
                  className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 active:bg-gray-300 dark:active:bg-gray-600 text-white rounded-md py-2 px-3 flex items-center justify-center gap-1 text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 active:bg-gray-300 dark:active:bg-gray-600 text-white rounded-md py-2 px-3 flex items-center justify-center gap-1 text-sm transition-colors col-span-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Filters Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-around">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Price
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Distance
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Rating
          </Button>
        </div>
      </div>
    </div>
  );
}