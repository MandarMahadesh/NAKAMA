import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Calendar, MapPin, Music, Phone, Navigation, Heart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { rsvpEvent, apiCall } from '../utils/supabase/client';

interface EventsScreenProps {
  onBack: () => void;
}

const mockEvents = [
  {
    id: 1,
    title: "Grand Line Music Festival",
    date: "Dec 15, 2024",
    time: "7:00 PM",
    location: "Sabaody Archipelago",
    image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NTg5NjQ3MjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    genre: "Soul Music",
    address: "1 Archipelago Plaza, Sabaody Archipelago, SA 88990",
    phone: "+1-555-0301",
    distance: "4.5 km away"
  },
  {
    id: 2,
    title: "Bink's Sake Concert",
    date: "Dec 20, 2024",
    time: "8:30 PM",
    location: "Thriller Bark",
    image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NTg5NjQ3MjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    genre: "Pirate Shanties",
    address: "666 Haunted Ship Boulevard, Thriller Bark, TB 77665",
    phone: "+1-555-0302",
    distance: "6.8 km away"
  },
  {
    id: 3,
    title: "New World Orchestra",
    date: "Dec 25, 2024",
    time: "6:00 PM",
    location: "Fish-Man Island",
    image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NTg5NjQ3MjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    genre: "Classical",
    address: "300 Coral Concert Hall, Fish-Man Island, FM 33221",
    phone: "+1-555-0303",
    distance: "5.2 km away"
  }
];

export function EventsScreen({ onBack }: EventsScreenProps) {
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<number | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await apiCall('/profile/favorites');
      const eventFavs = res.favorites
        .filter((fav: any) => fav.type === 'event')
        .map((fav: any) => parseInt(fav.itemId));
      setFavorites(new Set(eventFavs));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (event: typeof mockEvents[0]) => {
    setFavoriteLoading(event.id);
    try {
      if (favorites.has(event.id)) {
        const res = await apiCall('/profile/favorites');
        const fav = res.favorites.find((f: any) => f.itemId === event.id.toString() && f.type === 'event');
        if (fav) {
          await apiCall('/profile/favorites/remove', {
            method: 'POST',
            body: JSON.stringify({ favoriteId: fav.id })
          });
        }
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(event.id);
          return newSet;
        });
      } else {
        await apiCall('/profile/favorites/add', {
          method: 'POST',
          body: JSON.stringify({
            itemId: event.id.toString(),
            name: event.title,
            type: 'event',
            location: event.address
          })
        });
        setFavorites(prev => new Set(prev).add(event.id));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(null);
    }
  };

  const handleRsvpEvent = async (event: any) => {
    try {
      setRsvpLoading(event.id.toString());
      await rsvpEvent(event.id.toString(), event.title);
      alert(`You're going to ${event.title}! 🎵`);
    } catch (error) {
      console.error('RSVP failed:', error);
      alert('RSVP failed. Please try again.');
    } finally {
      setRsvpLoading(null);
    }
  };
  return (
    <div className="size-full flex flex-col bg-white dark:bg-gray-900">
      {/* Top Bar */}
      <div className="bg-purple-400 dark:bg-purple-700 px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="text-purple-900 dark:text-purple-100 hover:bg-purple-300 dark:hover:bg-purple-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-purple-900 dark:text-purple-100">Events</h1>
          </div>
          <div className="w-10 h-10 bg-purple-600 dark:bg-purple-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
        </div>
      </div>

      {/* Brook's Tip */}
      <div className="px-4 py-4 bg-purple-50 dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white dark:bg-gray-700 rotate-45"></div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-500 dark:bg-purple-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm">
                <span className="font-semibold text-purple-600 dark:text-purple-400">Musician:</span> 
                Yohohoho! Don't miss these spectacular shows! 🎵
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Music Notes */}
      <div className="absolute top-32 right-8 text-purple-300 dark:text-purple-500 text-2xl animate-bounce">♪</div>
      <div className="absolute top-48 right-16 text-purple-200 dark:text-purple-600 text-lg animate-pulse">♫</div>
      <div className="absolute top-64 right-12 text-purple-300 dark:text-purple-500 text-xl animate-bounce delay-300">♪</div>

      {/* Event Cards */}
      <div className="flex-1 px-4 pb-6 space-y-4 overflow-y-auto">
        {mockEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="aspect-video relative">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {event.genre}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg flex-1 dark:text-white">{event.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(event)}
                  disabled={favoriteLoading === event.id}
                  className="p-1 h-auto"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.has(event.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  />
                </Button>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <p>{event.address}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{event.distance}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button 
                  className="bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700 active:bg-gray-300 dark:active:bg-gray-600 text-white col-span-3"
                  onClick={() => handleRsvpEvent(event)}
                  disabled={rsvpLoading === event.id.toString()}
                >
                  {rsvpLoading === event.id.toString() ? 'Joining...' : 'Join 🎼'}
                </Button>
                <a
                  href={`tel:${event.phone}`}
                  className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 active:bg-gray-300 dark:active:bg-gray-600 text-white rounded-md py-2 px-3 flex items-center justify-center gap-1 text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 active:bg-gray-300 dark:active:bg-gray-600 text-white rounded-md py-2 px-3 flex items-center justify-center gap-1 text-sm transition-colors col-span-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}