"use client"

import { useState, useEffect } from 'react';
import { Splash } from '@/components/chat/Splash';
import { ChatSelection } from '@/components/chat/ChatSelection';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { UserProfile, BotId, BotCharacter } from '@/lib/types';
import { BOT_CHARACTERS } from '@/lib/constants';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'selection' | 'chat'>('splash');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedBotId, setSelectedBotId] = useState<BotId | null>(null);

  // Hydration handling for user profile
  useEffect(() => {
    const savedProfile = localStorage.getItem('bhashabridge_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setCurrentScreen('selection');
    }
  }, []);

  const handleOnboardingStart = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('bhashabridge_profile', JSON.stringify(profile));
    setCurrentScreen('selection');
  };

  const handleSelectBot = (botId: BotId) => {
    setSelectedBotId(botId);
    setCurrentScreen('chat');
  };

  const selectedBot = BOT_CHARACTERS.find(b => b.id === selectedBotId);

  return (
    <main className="min-h-screen">
      {currentScreen === 'splash' && (
        <Splash onStart={handleOnboardingStart} />
      )}

      {currentScreen === 'selection' && userProfile && (
        <ChatSelection 
          userProfile={userProfile} 
          onSelectBot={handleSelectBot} 
        />
      )}

      {currentScreen === 'chat' && userProfile && selectedBot && (
        <ChatWindow 
          userProfile={userProfile} 
          bot={selectedBot} 
          onBack={() => setCurrentScreen('selection')} 
        />
      )}
    </main>
  );
}
