import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, MessageCircle, UserPlus, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Screen } from '../App';
import { getBuddies, getBuddyRequests, acceptBuddyRequest, declineBuddyRequest } from '../utils/supabase/client';

interface BuddyListScreenProps {
  onBack: () => void;
  onOpenChat: (screen: Screen, buddyName: string) => void;
}

export function BuddyListScreen({ onBack, onOpenChat }: BuddyListScreenProps) {
  const [buddies, setBuddies] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [buddiesData, requestsData] = await Promise.all([
        getBuddies(),
        getBuddyRequests()
      ]);
      setBuddies(buddiesData.buddies);
      setPendingRequests(requestsData.requests || []);
    } catch (error) {
      console.error('Failed to load buddies data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await acceptBuddyRequest(requestId);
      // Reload data to update the lists
      await loadData();
    } catch (error) {
      console.error('Failed to accept buddy request:', error);
      alert('Failed to accept request. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await declineBuddyRequest(requestId);
      // Reload data to update the lists
      await loadData();
    } catch (error) {
      console.error('Failed to decline buddy request:', error);
      alert('Failed to decline request. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };
  return (
    <div className="size-full flex flex-col bg-white">
      {/* Top Bar */}
      <div className="bg-pink-400 px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="text-pink-900 hover:bg-pink-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-pink-900">Buddies</h1>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medic & Storyteller's Tip */}
      <div className="px-4 py-4 bg-pink-50">
        <div className="bg-white rounded-2xl p-4 shadow-sm relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white rotate-45"></div>
          <div className="flex items-start gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white font-bold text-xs">U</span>
              </div>
            </div>
            <div>
              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-pink-600">Chopper & Usopp:</span> 
                Your nakama are here to support you! 💪
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="px-4 pb-4">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Requests
            </h2>
            <div className="space-y-2">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${request.avatar_color || 'bg-gray-500'} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-bold">
                            {request.character ? request.character[0].toUpperCase() : request.name[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{request.name}</div>
                          <div className="text-sm text-gray-500">
                            {request.character ? `Playing as ${request.character}` : request.status}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleAcceptRequest(request.id)}
                          disabled={actionLoading === request.id}
                        >
                          {actionLoading === request.id ? 'Accepting...' : 'Accept'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeclineRequest(request.id)}
                          disabled={actionLoading === request.id}
                        >
                          {actionLoading === request.id ? 'Declining...' : 'Decline'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Buddy List */}
        <div className="px-4 pb-6">
          <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Your Nakama
          </h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading your crew...</div>
            </div>
          ) : buddies.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">
                <p>No nakama yet!</p>
                <p className="text-sm">Find other users to add as buddies</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {buddies.map((buddy) => (
                <Card key={buddy.id} className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onOpenChat('chat', buddy.id)}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${buddy.avatar_color || 'bg-gray-500'} rounded-full flex items-center justify-center relative`}>
                          <span className="text-white font-bold">
                            {buddy.character ? buddy.character[0].toUpperCase() : buddy.name[0]}
                          </span>
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{buddy.name}</div>
                          <div className="text-sm text-gray-500">
                            {buddy.character ? `Playing as ${buddy.character}` : 'Straw Hat Crew Member'}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-green-600 font-medium">{buddy.status || 'Online'}</span>
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}