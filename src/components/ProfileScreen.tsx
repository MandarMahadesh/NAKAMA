import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  BookOpen, 
  Heart,
  Upload,
  Download,
  Trash2,
  MapPin,
  Calendar,
  Building,
  Utensils,
  Zap,
  Landmark,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { apiCall } from '../utils/supabase/client';
import { Input } from './ui/input';

interface ProfileScreenProps {
  onBack: () => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

interface Log {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

interface Favorite {
  id: string;
  name: string;
  type: 'hotel' | 'event' | 'restaurant' | 'electronics' | 'medical' | 'historical';
  location: string;
  savedAt: string;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogDescription, setNewLogDescription] = useState('');
  const [newLogLocation, setNewLogLocation] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [docsRes, logsRes, favsRes] = await Promise.all([
        apiCall('/profile/documents'),
        apiCall('/profile/logs'),
        apiCall('/profile/favorites')
      ]);
      
      setDocuments(docsRes.documents || []);
      setLogs(logsRes.logs || []);
      setFavorites(favsRes.favorites || []);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async () => {
    if (!newLogTitle || !newLogDescription) return;

    try {
      await apiCall('/profile/logs/add', {
        method: 'POST',
        body: JSON.stringify({
          title: newLogTitle,
          description: newLogDescription,
          location: newLogLocation
        })
      });

      setNewLogTitle('');
      setNewLogDescription('');
      setNewLogLocation('');
      loadProfileData();
    } catch (error) {
      console.error('Error adding log:', error);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await apiCall('/profile/documents/delete', {
        method: 'POST',
        body: JSON.stringify({ documentId: docId })
      });
      loadProfileData();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleRemoveFavorite = async (favId: string) => {
    try {
      await apiCall('/profile/favorites/remove', {
        method: 'POST',
        body: JSON.stringify({ favoriteId: favId })
      });
      loadProfileData();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <Building className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'restaurant': return <Utensils className="w-4 h-4" />;
      case 'electronics': return <Zap className="w-4 h-4" />;
      case 'medical': return <Heart className="w-4 h-4" />;
      case 'historical': return <Landmark className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-blue-100 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-900 px-4 py-6 shadow-lg shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">Captain's Profile</h1>
            <p className="text-blue-100 text-sm">{user?.email}</p>
          </div>
          <div className="w-12 h-12 bg-blue-700 dark:bg-blue-800 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Theme Toggle */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-600" />
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Dark Theme</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {isDarkMode ? 'Night mode enabled' : 'Day mode enabled'}
                </p>
              </div>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleTheme}
            />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="size-full flex flex-col">
          <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3 bg-white/80 dark:bg-gray-800/80">
            <TabsTrigger value="documents" className="dark:data-[state=active]:bg-gray-700">Documents</TabsTrigger>
            <TabsTrigger value="logs" className="dark:data-[state=active]:bg-gray-700">Captain's Logs</TabsTrigger>
            <TabsTrigger value="favorites" className="dark:data-[state=active]:bg-gray-700">Favorites</TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full px-4 py-4">
              <div className="space-y-3 pb-4">
                <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <Button className="w-full bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Store important travel documents, tickets, and IDs
                    </p>
                  </CardContent>
                </Card>

                {documents.length === 0 ? (
                  <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-8 text-center">
                      <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">No documents yet</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Upload your first document</p>
                    </CardContent>
                  </Card>
                ) : (
                  documents.map((doc) => (
                    <Card key={doc.id} className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">{doc.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">{doc.type}</Badge>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{doc.size}</span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="dark:hover:bg-gray-700">
                              <Download className="w-4 h-4 dark:text-gray-300" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="dark:hover:bg-gray-700"
                            >
                              <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Captain's Logs Tab */}
          <TabsContent value="logs" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full px-4 py-4">
              <div className="space-y-3 pb-4">
                <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Add New Log</h3>
                    <Input
                      placeholder="Adventure title"
                      value={newLogTitle}
                      onChange={(e) => setNewLogTitle(e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <Input
                      placeholder="Location"
                      value={newLogLocation}
                      onChange={(e) => setNewLogLocation(e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <textarea
                      placeholder="Describe your adventure..."
                      value={newLogDescription}
                      onChange={(e) => setNewLogDescription(e.target.value)}
                      className="w-full p-2 border rounded-lg min-h-[80px] text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                    <Button 
                      onClick={handleAddLog}
                      className="w-full bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white"
                      disabled={!newLogTitle || !newLogDescription}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Add Log Entry
                    </Button>
                  </CardContent>
                </Card>

                {logs.length === 0 ? (
                  <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-8 text-center">
                      <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">No logs yet</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Start documenting your adventures</p>
                    </CardContent>
                  </Card>
                ) : (
                  logs.map((log) => (
                    <Card key={log.id} className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <BookOpen className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-1 shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{log.title}</h4>
                            {log.location && (
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">{log.location}</span>
                              </div>
                            )}
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{log.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {new Date(log.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full px-4 py-4">
              <div className="space-y-3 pb-4">
                {favorites.length === 0 ? (
                  <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-8 text-center">
                      <Heart className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">No favorites yet</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Add favorites from hotels, restaurants, events, and more
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  favorites.map((fav) => (
                    <Card key={fav.id} className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center shrink-0">
                              {getTypeIcon(fav.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">{fav.name}</h4>
                              <Badge variant="outline" className="text-xs mt-1 capitalize dark:border-gray-600 dark:text-gray-300">
                                {fav.type}
                              </Badge>
                              <div className="flex items-center gap-1 mt-2">
                                <MapPin className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">{fav.location}</span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Saved {new Date(fav.savedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveFavorite(fav.id)}
                            className="dark:hover:bg-gray-700"
                          >
                            <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}