import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  ArrowLeft, 
  Landmark,
  MapPin,
  Clock,
  Star,
  Phone,
  Compass,
  BookOpen,
  Shirt,
  Camera,
  History,
  Gem,
  Heart
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { loadFavoritesForType, toggleFavoriteItem } from '../utils/favorites';

interface RobinScreenProps {
  onBack: () => void;
}

interface HistoricalSite {
  id: string;
  name: string;
  type: 'archaeological' | 'historical' | 'vintage';
  address: string;
  distance: string;
  rating: number;
  openHours: string;
  status: 'Open Now' | 'Closes Soon' | 'Closed';
  phone: string;
  era: string;
  highlights: string[];
  description: string;
  entryFee?: string;
}

export function RobinScreen({ onBack }: RobinScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'sites' | 'vintage'>('all');

  const historicalPlaces: HistoricalSite[] = [
    {
      id: '1',
      name: 'Ancient Harbor Ruins',
      type: 'archaeological',
      address: '100 Old Port Road, Historic District',
      distance: '1.5 km',
      rating: 4.8,
      openHours: '9:00 AM - 6:00 PM',
      status: 'Open Now',
      phone: '+1-555-0201',
      era: '3rd Century BCE',
      highlights: ['Roman Architecture', 'Ancient Artifacts', 'Guided Tours'],
      description: 'Well-preserved Roman harbor with excavated trade routes and ancient warehouses',
      entryFee: '$15'
    },
    {
      id: '2',
      name: 'Vintage Treasures Boutique',
      type: 'vintage',
      address: '234 Retro Avenue',
      distance: '0.9 km',
      rating: 4.6,
      openHours: '10:00 AM - 8:00 PM',
      status: 'Open Now',
      phone: '+1-555-0202',
      era: '1920s-1980s',
      highlights: ['Vintage Clothing', 'Antique Jewelry', 'Rare Collectibles'],
      description: 'Curated collection of authentic vintage fashion and accessories from bygone eras'
    },
    {
      id: '3',
      name: 'Museum of Ancient Civilizations',
      type: 'historical',
      address: '567 Heritage Boulevard',
      distance: '2.3 km',
      rating: 4.9,
      openHours: '10:00 AM - 7:00 PM',
      status: 'Open Now',
      phone: '+1-555-0203',
      era: 'Multiple Eras',
      highlights: ['Egyptian Artifacts', 'Greek Pottery', 'Medieval Manuscripts'],
      description: 'Comprehensive museum showcasing artifacts from ancient civilizations worldwide',
      entryFee: '$20'
    },
    {
      id: '4',
      name: 'The Time Capsule Shop',
      type: 'vintage',
      address: '789 Memory Lane',
      distance: '1.2 km',
      rating: 4.5,
      openHours: '11:00 AM - 7:00 PM',
      status: 'Open Now',
      phone: '+1-555-0204',
      era: '1950s-1990s',
      highlights: ['Vinyl Records', 'Vintage Cameras', 'Retro Furniture'],
      description: 'Nostalgic store featuring mid-century modern items and pop culture memorabilia'
    },
    {
      id: '5',
      name: 'Old Town Archaeological Park',
      type: 'archaeological',
      address: '321 Excavation Site Road',
      distance: '3.5 km',
      rating: 4.7,
      openHours: '8:00 AM - 5:00 PM',
      status: 'Open Now',
      phone: '+1-555-0205',
      era: '5th Century CE',
      highlights: ['Byzantine Mosaics', 'Ancient Wells', 'Historical Gardens'],
      description: 'Active archaeological site with ongoing excavations and educational programs',
      entryFee: '$12'
    },
    {
      id: '6',
      name: 'Heritage Lighthouse Museum',
      type: 'historical',
      address: '456 Coastal Heritage Drive',
      distance: '2.8 km',
      rating: 4.4,
      openHours: '9:00 AM - 6:00 PM',
      status: 'Open Now',
      phone: '+1-555-0206',
      era: '18th Century',
      highlights: ['Maritime History', 'Navigation Tools', 'Panoramic Views'],
      description: 'Historic lighthouse converted into museum with stunning coastal views',
      entryFee: '$10'
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
      highlights: ['Victorian Clothing', 'Art Deco Items', 'Vintage Books'],
      description: 'Premier vintage store specializing in high-quality period pieces and rare finds'
    },
    {
      id: '8',
      name: 'Poneglyph Research Center',
      type: 'archaeological',
      address: '999 Scholar Road',
      distance: '4.0 km',
      rating: 5.0,
      openHours: '9:00 AM - 8:00 PM',
      status: 'Open Now',
      phone: '+1-555-0208',
      era: 'Ancient Era',
      highlights: ['Ancient Scripts', 'Research Library', 'Expert Lectures'],
      description: 'Specialized center for ancient languages and mysterious historical texts',
      entryFee: '$25'
    }
  ];

  const getCurrentPlaces = () => {
    if (activeTab === 'sites') {
      return historicalPlaces.filter(p => p.type === 'archaeological' || p.type === 'historical');
    } else if (activeTab === 'vintage') {
      return historicalPlaces.filter(p => p.type === 'vintage');
    }
    return historicalPlaces;
  };

  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<number | null>(null);

  useEffect(() => {
    loadFavoritesForType('historical').then(setFavorites);
  }, []);

  const handleToggleFavorite = async (place: HistoricalSite) => {
    setFavoriteLoading(parseInt(place.id));
    try {
      const newFavorites = await toggleFavoriteItem(
        parseInt(place.id),
        place.name,
        'historical',
        place.address,
        favorites
      );
      setFavorites(newFavorites);
    } finally {
      setFavoriteLoading(null);
    }
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
      case 'archaeological':
        return <Compass className="w-8 h-8 text-purple-500 dark:text-purple-400" />;
      case 'historical':
        return <Landmark className="w-8 h-8 text-purple-500 dark:text-purple-400" />;
      case 'vintage':
        return <Shirt className="w-8 h-8 text-purple-500 dark:text-purple-400" />;
      default:
        return <BookOpen className="w-8 h-8 text-purple-500 dark:text-purple-400" />;
    }
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-purple-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-800 px-4 py-6 shadow-lg">
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
            <h1 className="text-white text-2xl font-bold">Historical Archives</h1>
            <p className="text-purple-100 dark:text-purple-200 text-sm">Scholar's Knowledge Hub</p>
          </div>
          <div className="w-12 h-12 bg-purple-800 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
        </div>

        {/* Scholar's Message */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-3 relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white/90 dark:bg-gray-800/90 rotate-45"></div>
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-purple-800 dark:bg-purple-900 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              <span className="font-semibold text-purple-700 dark:text-purple-400">Scholar:</span> The past holds many secrets. Let me guide you through history's treasures and forgotten wonders.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4">
        <div className="flex gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1 shadow-md">
          <Button
            onClick={() => setActiveTab('all')}
            className={`flex-1 ${
              activeTab === 'all'
                ? 'bg-purple-600 dark:bg-purple-700 text-white'
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            All
          </Button>
          <Button
            onClick={() => setActiveTab('sites')}
            className={`flex-1 ${
              activeTab === 'sites'
                ? 'bg-purple-600 dark:bg-purple-700 text-white'
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
            }`}
          >
            <Landmark className="w-4 h-4 mr-2" />
            Sites
          </Button>
          <Button
            onClick={() => setActiveTab('vintage')}
            className={`flex-1 ${
              activeTab === 'vintage'
                ? 'bg-purple-600 dark:bg-purple-700 text-white'
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
            }`}
          >
            <Shirt className="w-4 h-4 mr-2" />
            Vintage
          </Button>
        </div>
      </div>

      {/* Historical Places List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="space-y-3 pb-4">
            {getCurrentPlaces().map((place) => (
              <Card key={place.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 shadow-lg border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-gray-800 dark:text-gray-200 flex-1">{place.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(place)}
                        disabled={favoriteLoading === parseInt(place.id)}
                        className="p-1 h-auto ml-2"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.has(parseInt(place.id))
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400'
                          }`}
                        />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getStatusColor(place.status)} text-white text-xs`}>
                        {place.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{place.rating}</span>
                      </div>
                      {place.entryFee && (
                        <Badge className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs border-purple-200 dark:border-purple-700">
                          {place.entryFee}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {getTypeIcon(place.type)}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{place.description}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">{place.era}</span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-purple-500 dark:text-purple-400" />
                    <div>
                      <p>{place.address}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{place.distance} away</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span>{place.openHours}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {place.highlights.map((highlight, index) => (
                    <Badge key={index} className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs border-purple-200 dark:border-purple-700">
                      {highlight}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${place.phone}`}
                    className="bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg py-2 px-3 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Call</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg py-2 px-3 flex items-center justify-center gap-2 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Directions</span>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Historical Tip */}
      <div className="px-4 pb-4">
        <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 p-3 shadow-lg border-2 border-purple-300 dark:border-purple-700">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-800 dark:bg-purple-900 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold">R</span>
            </div>
            <div>
              <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-1">Scholar's Tip</h4>
              <p className="text-purple-800 dark:text-purple-300 text-sm">
                Many historical sites offer free entry on certain days. Check their schedules and take your time to appreciate the history.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
