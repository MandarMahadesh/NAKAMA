import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ThemeProvider } from './components/ThemeContext';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { HotelsScreen } from './components/HotelsScreen';
import { EventsScreen } from './components/EventsScreen';
import { CrewmatesScreen } from './components/CrewmatesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { GroupChatScreen } from './components/GroupChatScreen';
import { ChatScreen } from './components/ChatScreen';
import { NavigationScreen } from './components/NavigationScreen';
import { RestaurantsScreen } from './components/RestaurantsScreen';
import { ElectronicsScreen } from './components/ElectronicsScreen';
import { SosScreen } from './components/SosScreen';
import { WeatherScreen } from './components/WeatherScreen';
import { TranslatorScreen } from './components/TranslatorScreen';
import { MedicalScreen } from './components/MedicalScreen';
import { TravelScreen } from './components/TravelScreen';
import { RobinScreen } from './components/RobinScreen';
import { MarketplaceScreen } from './components/MarketplaceScreen';


export type Screen = 
  | 'home' 
  | 'hotels' 
  | 'events' 
  | 'crewmates' 
  | 'chat'
  | 'groupChat'
  | 'navigation' 
  | 'restaurants' 
  | 'electronics' 
  | 'sos'
  | 'weather'
  | 'translator'
  | 'medical'
  | 'travel'
  | 'robin'
  | 'marketplace'
  | 'profile';

export interface AppState {
  currentScreen: Screen;
  selectedBuddy?: string;
  selectedGroupId?: string;
}

function AppContent() {
  const { user, loading } = useAuth();
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'home'
  });

  const navigateToScreen = (screen: Screen, selectedBuddy?: string, selectedGroupId?: string) => {
    setAppState({ currentScreen: screen, selectedBuddy, selectedGroupId });
  };

  const goBack = () => {
    if (appState.currentScreen === 'chat' || appState.currentScreen === 'groupChat') {
      setAppState({ currentScreen: 'crewmates' });
    } else {
      setAppState({ currentScreen: 'home' });
    }
  };

  const renderScreen = () => {
    switch (appState.currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigateToScreen} />;
      case 'hotels':
        return <HotelsScreen onBack={goBack} />;
      case 'events':
        return <EventsScreen onBack={goBack} />;
      case 'crewmates':
        return <CrewmatesScreen onBack={goBack} onOpenChat={navigateToScreen} />;
      case 'chat':
        return <ChatScreen onBack={goBack} buddyName={appState.selectedBuddy || 'Unknown'} buddyId={appState.selectedBuddy || ''} />;
      case 'groupChat':
        return <GroupChatScreen onBack={goBack} groupId={appState.selectedGroupId || ''} />;
      case 'profile':
        return <ProfileScreen onBack={goBack} />;
      case 'navigation':
        return <NavigationScreen onBack={goBack} />;
      case 'restaurants':
        return <RestaurantsScreen onBack={goBack} />;
      case 'electronics':
        return <ElectronicsScreen onBack={goBack} />;
      case 'sos':
        return <SosScreen onBack={goBack} />;
      case 'weather':
        return <WeatherScreen onBack={goBack} onNavigate={navigateToScreen} />;
      case 'translator':
        return <TranslatorScreen onBack={goBack} />;
      case 'medical':
        return <MedicalScreen onBack={goBack} onNavigate={navigateToScreen} />;
      case 'travel':
        return <TravelScreen onBack={goBack} />;
      case 'robin':
        return <RobinScreen onBack={goBack} />;
      case 'marketplace':
        return <MarketplaceScreen onBack={goBack} />;
      default:
        return <HomeScreen onNavigate={navigateToScreen} />;
    }
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="text-white text-2xl">⚓</span>
          </div>
          <p className="text-blue-800">Setting sail...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="size-full max-w-md mx-auto bg-gradient-to-b from-blue-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Ocean background */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1723306743319-a7928c2e628d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMG1hcCUyMHRyZWFzdXJlfGVufDF8fHx8MTc1OTA1MzM5NHww&ixlib=rb-4.1.0&q=80&w=1080')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="relative z-10 size-full">
        {renderScreen()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}