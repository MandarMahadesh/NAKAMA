import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  ArrowLeft, 
  ShoppingBag,
  MapPin,
  Clock,
  Star,
  Phone,
  Store,
  Shirt,
  Sparkles,
  Heart
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { loadFavoritesForType, toggleFavoriteItem } from '../utils/favorites';

interface MarketplaceScreenProps {
  onBack: () => void;
}

interface MarketItem {
  id: string;
  name: string;
  type: 'mall' | 'plaza' | 'market' | 'vintage';
  address: string;
  distance: string;
  rating: number;
  openHours: string;
  status: 'Open Now' | 'Closes Soon' | 'Closed';
  phone: string;
  specialties: string[];
  description: string;
  era?: string;
}

export function MarketplaceScreen({ onBack }: MarketplaceScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'shopping' | 'vintage'>('all');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<number | null>(null);

  useEffect(() => {
    loadFavoritesForType('marketplace').then(setFavorites);
  }, []);

  const handleToggleFavorite = async (item: MarketItem) => {
    setFavoriteLoading(parseInt(item.id));
    try {
      const newFavorites = await toggleFavoriteItem(
        parseInt(item.id),
        item.name,
        'marketplace',
        item.address,
        favorites
      );
      setFavorites(newFavorites);
    } finally {
      setFavoriteLoading(null);
    }
  };

  const marketItems: MarketItem[] = [
    {
      id: '1',
      name: 'Grand Plaza Shopping Mall',
      type: 'mall',
      address: '123 Central Avenue, Downtown',
      distance: '0.8 km',
      rating: 4.7,
      openHours: '10:00 AM - 10:00 PM',
      status: 'Open Now',
      phone: '+1-555-0101',
      specialties: ['Fashion', 'Electronics', 'Food Court'],
      description: 'Premium shopping destination with international brands'
    },
    {
      id: '2',
      name: 'Harbor View Market',
      type: 'market',
      address: '456 Waterfront Road',
      distance: '1.2 km',
      rating: 4.5,
      openHours: '8:00 AM - 8:00 PM',
      status: 'Open Now',
      phone: '+1-555-0102',
      specialties: ['Fresh Produce', 'Local Crafts', 'Seafood'],
      description: 'Traditional market with local vendors and fresh goods'
    },
    {
      id: '3',
      name: 'Vintage Treasures Boutique',
      type: 'vintage',
      address: '234 Retro Avenue',
      distance: '0.9 km',
      rating: 4.6,
      openHours: '10:00 AM - 8:00 PM',
      status: 'Open Now',
      phone: '+1-555-0202',
      era: '1920s-1980s',
      specialties: ['Vintage Clothing', 'Antique Jewelry', 'Rare Collectibles'],
      description: 'Curated collection of authentic vintage fashion and accessories from bygone eras'
    },
    {
      id: '4',
      name: 'Skyline Shopping Center',
      type: 'mall',
      address: '789 North Boulevard',
      distance: '2.0 km',
      rating: 4.8,
      openHours: '9:00 AM - 11:00 PM',
      status: 'Open Now',
      phone: '+1-555-0103',
      specialties: ['Luxury Brands', 'Cinema', 'Restaurants'],
      description: 'Upscale mall featuring designer boutiques and entertainment'
    },
    {
      id: '5',
      name: 'The Time Capsule Shop',
      type: 'vintage',
      address: '789 Memory Lane',
      distance: '1.2 km',
      rating: 4.5,
      openHours: '11:00 AM - 7:00 PM',
      status: 'Open Now',
      phone: '+1-555-0204',
      era: '1950s-1990s',
      specialties: ['Vinyl Records', 'Vintage Cameras', 'Retro Furniture'],
      description: 'Nostalgic treasure trove of mid-century collectibles and memorabilia'
    },
    {
      id: '6',
      name: 'East Side Plaza',
      type: 'plaza',
      address: '321 East Street',
      distance: '1.5 km',
      rating: 4.3,
      openHours: '10:00 AM - 9:00 PM',
      status: 'Closes Soon',
      phone: '+1-555-0104',
      specialties: ['Books', 'Cafe', 'Gifts'],
      description: 'Cozy shopping plaza with bookstores and cafes'
    },
    {
      id: '7',
      name: 'Elegant Era Vintage Emporium',
      type: 'vintage',
      address: '888 Antique Row',
      distance: '1.7 km',
      rating: 4.7,
      openHours: '10:00 AM - 9:00 PM',
      status: 'Open Now',
      phone: '+1-555-0207',
      era: '1800s-1940s',
      specialties: ['Victorian Clothing', 'Art Deco Items', 'Vintage Books'],
      description: 'Premier vintage store specializing in high-quality period pieces and rare finds'
    },
    {
      id: '8',
      name: 'Central Market District',
      type: 'market',
      address: '555 Market Lane',
      distance: '1.8 km',
      rating: 4.6,
      openHours: '7:00 AM - 7:00 PM',
      status: 'Open Now',
      phone: '+1-555-0105',
      specialties: ['Artisan Foods', 'Handicrafts', 'Organic Produce'],
      description: 'Vibrant marketplace featuring local artisans and specialty goods'
    }
  ];

  const getCurrentItems = () => {
    if (activeTab === 'shopping') {
      return marketItems.filter(item => item.type === 'mall' || item.type === 'plaza' || item.type === 'market');
    } else if (activeTab === 'vintage') {
      return marketItems.filter(item => item.type === 'vintage');
    }
    return marketItems;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open Now':
        return 'bg-green-500 dark:bg-green-600';
      case 'Closes Soon':
        return 'bg-orange-500 dark:bg-orange-600';
      case 'Closed':
        return 'bg-red-500 dark:bg-red-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mall':
      case 'plaza':
        return <Store className="w-8 h-8 text-teal-500 dark:text-teal-400" />;
      case 'market':
        return <ShoppingBag className="w-8 h-8 text-teal-500 dark:text-teal-400" />;
      case 'vintage':
        return <Shirt className="w-8 h-8 text-teal-500 dark:text-teal-400" />;
      default:
        return <Sparkles className="w-8 h-8 text-teal-500 dark:text-teal-400" />;
    }
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-teal-100 to-cyan-200 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-400 to-cyan-500 dark:from-teal-600 dark:to-cyan-700 px-4 py-6 shadow-lg shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-teal-900 dark:text-teal-100 hover:bg-teal-300 dark:hover:bg-teal-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">Marketplace</h1>
            <p className="text-teal-100 dark:text-teal-200 text-sm">Shopping Centers & Vintage Stores</p>
          </div>
          <div className="w-12 h-12 bg-teal-600 dark:bg-teal-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-3 relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white/90 dark:bg-gray-800/90 rotate-45"></div>
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-teal-600 dark:bg-teal-700 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              <span className="font-semibold text-teal-600 dark:text-teal-400">Marketplace:</span> 
              Discover treasures old and new! From modern malls to vintage gems! 🛍️✨
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="size-full flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-gray-800/80">
              <TabsTrigger value="all" className="dark:data-[state=active]:bg-gray-700">All</TabsTrigger>
              <TabsTrigger value="shopping" className="dark:data-[state=active]:bg-gray-700">Shopping Centers</TabsTrigger>
              <TabsTrigger value="vintage" className="dark:data-[state=active]:bg-gray-700">Vintage Stores</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full px-4 py-4">
              <div className="space-y-3 pb-4">
                {getCurrentItems().map((item) => (
                  <Card key={item.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 shadow-lg border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-gray-800 dark:text-gray-100 flex-1">{item.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(item)}
                            disabled={favoriteLoading === parseInt(item.id)}
                            className="p-1 h-auto ml-2"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                favorites.has(parseInt(item.id))
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400'
                              }`}
                            />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getStatusColor(item.status)} text-white text-xs`}>
                            {item.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                      {getTypeIcon(item.type)}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>
                    
                    {item.era && (
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">{item.era}</span>
                      </div>
                    )}

                    <div className="space-y-2 mb-3">
                      <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-teal-500 dark:text-teal-400" />
                        <div>
                          <p>{item.address}</p>
                          <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">{item.distance} away</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                        <span>{item.openHours}</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.specialties.map((specialty, index) => (
                        <Badge key={index} className="bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs border-teal-200 dark:border-teal-700">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${item.phone}`}
                        className="bg-teal-500 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-lg py-2 px-3 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">Call</span>
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-cyan-500 dark:bg-cyan-600 hover:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-lg py-2 px-3 flex items-center justify-center gap-2 transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Directions</span>
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}