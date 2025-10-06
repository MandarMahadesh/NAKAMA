import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, MessageCircle, UserPlus, Clock, Users, Plus, Search, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Screen } from '../App';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { getBuddies, getBuddyRequests, acceptBuddyRequest, declineBuddyRequest, apiCall } from '../utils/supabase/client';
import { useAuth } from './AuthContext';

interface CrewmatesScreenProps {
  onBack: () => void;
  onOpenChat: (screen: Screen, buddyNameOrGroupId: string, groupId?: string) => void;
}

export function CrewmatesScreen({ onBack, onOpenChat }: CrewmatesScreenProps) {
  const { user } = useAuth();
  const [buddies, setBuddies] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedBuddies, setSelectedBuddies] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddCrewDialog, setShowAddCrewDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [crewmateSearchQuery, setCrewmateSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [buddiesData, requestsData, groupsData] = await Promise.all([
        getBuddies(),
        getBuddyRequests(),
        apiCall('/groups')
      ]);
      setBuddies(buddiesData.buddies || []);
      setPendingRequests(requestsData.requests || []);
      setGroups(groupsData.groups || []);
    } catch (error) {
      console.error('Failed to load crewmates data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      const response = await apiCall(`/users/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.users || []);
    } catch (error) {
      console.error('Failed to search users:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      setActionLoading(userId);
      await apiCall('/buddies/request', {
        method: 'POST',
        body: JSON.stringify({ toUserId: userId })
      });
      alert('Crewmate request sent!');
      setSearchResults(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Failed to send request:', error);
      alert('Failed to send request. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await acceptBuddyRequest(requestId);
      await loadData();
    } catch (error) {
      console.error('Failed to accept crewmate request:', error);
      alert('Failed to accept request. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await declineBuddyRequest(requestId);
      await loadData();
    } catch (error) {
      console.error('Failed to decline crewmate request:', error);
      alert('Failed to decline request. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName || selectedBuddies.length === 0) return;

    try {
      await apiCall('/groups/create', {
        method: 'POST',
        body: JSON.stringify({
          name: newGroupName,
          members: selectedBuddies
        })
      });
      
      setShowCreateDialog(false);
      setNewGroupName('');
      setSelectedBuddies([]);
      loadData();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create fleet. Please try again.');
    }
  };

  const toggleBuddySelection = (buddyId: string) => {
    setSelectedBuddies(prev => 
      prev.includes(buddyId) 
        ? prev.filter(id => id !== buddyId)
        : [...prev, buddyId]
    );
  };

  // Filter buddies based on search
  const filteredBuddies = buddies.filter(buddy => 
    crewmateSearchQuery.trim() === '' ||
    buddy.name?.toLowerCase().includes(crewmateSearchQuery.toLowerCase()) ||
    buddy.username?.toLowerCase().includes(crewmateSearchQuery.toLowerCase())
  );

  return (
    <div className="size-full flex flex-col bg-white dark:bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-pink-400 to-rose-400 dark:from-pink-600 dark:to-rose-600 px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="text-pink-900 dark:text-pink-100 hover:bg-pink-300 dark:hover:bg-pink-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-pink-900 dark:text-pink-100">Crewmates</h1>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-pink-600 dark:bg-pink-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div className="w-8 h-8 bg-amber-500 dark:bg-amber-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="px-4 py-4 bg-pink-50 dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white dark:bg-gray-700 rotate-45"></div>
          <div className="flex items-start gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-pink-500 dark:bg-pink-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-700">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <div className="w-8 h-8 bg-amber-500 dark:bg-amber-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-700">
                <span className="text-white font-bold text-xs">S</span>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              <span className="font-semibold text-pink-600 dark:text-pink-400">Crewmates:</span> 
              Travel with friends! Create fleets and chat together on your adventures! ⚓
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="crewmates" className="size-full flex flex-col">
          <TabsList className="mx-4 grid w-auto grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="crewmates" className="dark:data-[state=active]:bg-gray-700">Crewmates</TabsTrigger>
            <TabsTrigger value="fleets" className="dark:data-[state=active]:bg-gray-700">Fleets</TabsTrigger>
            <TabsTrigger value="requests" className="dark:data-[state=active]:bg-gray-700">
              Requests
              {pendingRequests.length > 0 && (
                <Badge className="ml-2 bg-red-500">{pendingRequests.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Crewmates Tab */}
          <TabsContent value="crewmates" className="flex-1 overflow-y-auto px-4 py-4 mt-0">
            <div className="space-y-3">
              {/* Add Crewmate Button */}
              <Dialog open={showAddCrewDialog} onOpenChange={setShowAddCrewDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-600 dark:to-rose-600 hover:from-pink-600 hover:to-rose-600 dark:hover:from-pink-700 dark:hover:to-rose-700 text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New Crewmate
                  </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">Find Crewmates</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search by username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <Button
                        onClick={handleSearch}
                        disabled={searchLoading || !searchQuery.trim()}
                        className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {searchLoading ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">Searching...</p>
                      ) : searchResults.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                          {searchQuery ? 'No users found' : 'Search for crewmates by username'}
                        </p>
                      ) : (
                        searchResults.map((user) => (
                          <Card key={user.id} className="dark:bg-gray-700 dark:border-gray-600">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 ${user.avatar_color || 'bg-gray-500'} rounded-full flex items-center justify-center`}>
                                    <span className="text-white text-sm font-bold">
                                      {user.name?.charAt(0).toUpperCase() || '?'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm dark:text-white">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleSendRequest(user.id)}
                                  disabled={actionLoading === user.id}
                                  className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
                                >
                                  {actionLoading === user.id ? 'Sending...' : 'Add'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Search Crewmates */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search your crewmates..."
                  value={crewmateSearchQuery}
                  onChange={(e) => setCrewmateSearchQuery(e.target.value)}
                  className="pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                {crewmateSearchQuery && (
                  <button
                    onClick={() => setCrewmateSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {loading ? (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-600 dark:text-gray-400">Loading crewmates...</div>
                  </CardContent>
                </Card>
              ) : filteredBuddies.length === 0 ? (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-8 text-center">
                    <UserPlus className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {crewmateSearchQuery ? 'No crewmates found' : 'No crewmates yet!'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {crewmateSearchQuery ? 'Try a different search' : 'Add crewmates to start your adventure together'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredBuddies.map((buddy) => (
                  <Card key={buddy.id} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${buddy.avatar_color || 'bg-blue-500'} rounded-full flex items-center justify-center`}>
                            <span className="text-white font-bold">
                              {buddy.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold dark:text-white">{buddy.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">@{buddy.username || 'crewmate'}</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => onOpenChat('chat', buddy.id)}
                          className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Fleets Tab */}
          <TabsContent value="fleets" className="flex-1 overflow-y-auto px-4 py-4 mt-0">
            <div className="space-y-3">
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-600 dark:to-rose-600 hover:from-pink-600 hover:to-rose-600 dark:hover:from-pink-700 dark:hover:to-rose-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Fleet
                  </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">Create a New Fleet</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block dark:text-gray-200">Fleet Name</label>
                      <Input
                        placeholder="e.g., Captain's Fleet, Adventure Squad"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block dark:text-gray-200">Select Crewmates</label>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {buddies.map((buddy) => (
                          <div
                            key={buddy.id}
                            onClick={() => toggleBuddySelection(buddy.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all dark:border-gray-600 ${
                              selectedBuddies.includes(buddy.id)
                                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 dark:border-pink-500'
                                : 'border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 ${buddy.avatar_color || 'bg-blue-500'} rounded-full flex items-center justify-center`}>
                                <span className="text-white text-sm font-bold">
                                  {buddy.name?.charAt(0).toUpperCase() || '?'}
                                </span>
                              </div>
                              <span className="font-medium dark:text-white">{buddy.name || 'Unknown'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={handleCreateGroup}
                      disabled={!newGroupName || selectedBuddies.length === 0}
                      className="w-full bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
                    >
                      Create Fleet
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {groups.length === 0 ? (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">No fleets yet!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Create a fleet to chat with multiple crewmates</p>
                  </CardContent>
                </Card>
              ) : (
                groups.map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 dark:from-pink-600 dark:to-rose-600 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold dark:text-white">{group.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{group.memberCount} members</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => onOpenChat('groupChat', '', group.id)}
                          className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="flex-1 overflow-y-auto px-4 py-4 mt-0">
            <div className="space-y-3">
              {pendingRequests.length === 0 ? (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-8 text-center">
                    <Clock className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">No pending requests</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">New crewmate requests will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                pendingRequests.map((request) => (
                  <Card key={request.id} className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {request.fromName?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold dark:text-white">{request.fromName || 'Unknown'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">wants to join your crew</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(request.id)}
                            disabled={actionLoading === request.id}
                            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeclineRequest(request.id)}
                            disabled={actionLoading === request.id}
                            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}