"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BOT_CHARACTERS, SUPPORTED_LANGUAGES } from '@/lib/constants';
import { UserProfile, BotId } from '@/lib/types';
import { ChevronRight, Globe, MessageSquare, Cpu } from 'lucide-react';

export function ChatSelection({ userProfile, onSelectBot }: { userProfile: UserProfile, onSelectBot: (botId: BotId) => void }) {
  const userLangObj = SUPPORTED_LANGUAGES.find(l => l.name === userProfile.nativeLanguage);

  return (
    <div className="min-h-screen bg-[#0D0D2B] flex flex-col">
      {/* Navbar */}
      <nav className="h-16 border-b border-white/5 bg-[#1A1F4B]/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">💎</span>
          <span className="font-bold text-white hidden md:block">BhashaBridge</span>
        </div>
        <div className="text-white font-medium">
          Hey, {userProfile.name}! 👋
        </div>
        <div className="flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <span className="text-sm">{userLangObj?.flag} {userProfile.nativeLanguage}</span>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-8">
        <header className="space-y-2 mt-4">
          <h2 className="text-3xl font-bold text-white">Choose your conversation</h2>
          <p className="text-slate-400">Real-time cultural intelligence for every chat</p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {BOT_CHARACTERS.map((bot) => (
            <Card 
              key={bot.id} 
              className="bg-[#1A1F4B] border-white/5 hover:border-primary/40 transition-all group overflow-hidden cursor-pointer"
              onClick={() => onSelectBot(bot.id)}
            >
              <div className="flex flex-col md:flex-row p-6 items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl shrink-0"
                  style={{ backgroundColor: bot.avatarColor }}
                >
                  {bot.initial}
                </div>
                
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
                    <h3 className="text-2xl font-bold text-white">{bot.name} {bot.flag}</h3>
                    <div className="bg-white/5 px-3 py-0.5 rounded-full border border-white/10 text-xs text-primary font-medium inline-block mx-auto md:mx-0">
                      {bot.language} Native
                    </div>
                  </div>
                  
                  <p className="text-slate-300">{bot.bio}</p>
                  
                  <div className="flex items-center justify-center md:justify-start space-x-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-slate-400">Online</span>
                    </div>
                    <p className="text-xs text-slate-500 italic">"Guten Tag, wie kann ich helfen?"</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <Button 
                    variant="ghost" 
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-6 h-auto text-lg rounded-xl group-hover:scale-105 transition-transform"
                  >
                    Chat Now <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <footer className="mt-auto border-t border-white/5 bg-[#1A1F4B]/30 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-12">
          <div className="flex items-center space-x-2 text-slate-400">
            <MessageSquare size={16} className="text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider">Real-time</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Globe size={16} className="text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider">10+ Languages</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Cpu size={16} className="text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider">Agentic AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
