import React from 'react';
import { Home } from 'lucide-react';
import { Screen } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const isHome = currentScreen === 'home';
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 max-w-md mx-auto">
      <div className="flex justify-center h-16">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-all px-8 ${
            isHome ? 'bg-gray-50 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <div className={`${isHome ? 'bg-blue-500 dark:bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'} p-2 rounded-full transition-colors`}>
            <Home className={`w-5 h-5 ${isHome ? 'text-white' : 'text-blue-600 dark:text-gray-300'}`} />
          </div>
          <span className={`text-xs ${isHome ? 'text-blue-600 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
            Home
          </span>
        </button>
      </div>
    </div>
  );
}
