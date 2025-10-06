import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, MoreVertical, Mic, Globe, Send } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from './AuthContext';
import { getChatMessages, sendMessage } from '../utils/supabase/client';

interface ChatScreenProps {
  onBack: () => void;
  buddyName: string;
  buddyId: string;
}

const mockMessages = [
  { id: 1, sender: 'buddy', text: "Hey! How's your adventure going?", time: "10:30 AM" },
  { id: 2, sender: 'me', text: "Great! Just found an amazing hotel near the harbor", time: "10:32 AM" },
  { id: 3, sender: 'buddy', text: "That's awesome! Are you planning to check out the music festival tomorrow?", time: "10:35 AM" },
  { id: 4, sender: 'me', text: "Definitely! Brook recommended it 🎵", time: "10:36 AM" },
  { id: 5, sender: 'buddy', text: "Perfect! Let's meet up there. I know the best spot to watch!", time: "10:38 AM" }
];

export function ChatScreen({ onBack, buddyName, buddyId }: ChatScreenProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [buddyId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { messages: chatMessages } = await getChatMessages(buddyId);
      const formattedMessages = chatMessages.map((msg: any) => ({
        id: msg.id,
        sender: msg.senderId === user?.id ? 'me' : 'buddy',
        text: msg.message,
        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && user) {
      try {
        const tempMessage = {
          id: 'temp-' + Date.now(),
          sender: 'me' as const,
          text: message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, tempMessage]);
        setMessage('');

        await sendMessage(buddyId, message);
        // Reload messages to get the actual message with proper ID
        loadMessages();
      } catch (error) {
        console.error('Failed to send message:', error);
        // Remove the temporary message on error
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      }
    }
  };

  const getBuddyAvatar = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getBuddyColor = (name: string) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-blue-500', 'bg-pink-500', 'bg-cyan-500', 'bg-purple-500'];
    return colors[name.length % colors.length];
  };

  return (
    <div className="size-full flex flex-col bg-white dark:bg-gray-900">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className={`w-10 h-10 ${getBuddyColor(buddyName)} rounded-full flex items-center justify-center relative`}>
              <span className="text-white font-bold text-sm">{getBuddyAvatar(buddyName)}</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="font-bold">{buddyName}</h1>
              <span className="text-sm text-green-600">Online</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-red-600">
                Unfriend
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Block
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500 text-center">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${
                msg.sender === 'me' 
                  ? 'bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl' 
                  : 'bg-gray-100 text-gray-800 rounded-r-2xl rounded-tl-2xl'
              } px-4 py-2`}>
                <p className="text-sm">{msg.text}</p>
                <span className={`text-xs ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'} block mt-1`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chopper's Translation Tip */}
      <div className="px-4 py-2">
        <div className="bg-pink-50 rounded-2xl p-3 relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-pink-50 rotate-45"></div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <p className="text-pink-700 text-xs">
              <span className="font-semibold">Medic:</span> Tap the translate button if you need help understanding! 🌐
            </p>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="pr-20"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-blue-500">
                <Mic className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-green-500">
                <Globe className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button 
            onClick={handleSendMessage} 
            size="sm" 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}