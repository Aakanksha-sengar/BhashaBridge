"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { BOT_CHARACTERS, SUPPORTED_LANGUAGES } from '@/lib/constants';
import { UserProfile } from '@/lib/types';

export function Splash({ onStart }: { onStart: (profile: UserProfile) => void }) {
  const [name, setName] = useState('Aakanksha');
  const [language, setLanguage] = useState('Hindi');

  return (
    <div className="min-h-screen bg-[#0D0D2B] flex flex-col items-center justify-between p-6 overflow-y-auto">
      {/* Top Section */}
      <div className="flex flex-col items-center text-center mt-12 space-y-4">
        <div className="text-6xl animate-pulse-diamond mb-2">💎</div>
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight" style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>
          BhashaBridge
        </h1>
        <p className="text-[#06B6D4] italic text-xl">
          Not just translation. Cultural Intelligence.
        </p>
      </div>

      {/* Middle Section - Bots Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full my-12">
        {BOT_CHARACTERS.map((bot) => (
          <Card key={bot.id} className="bg-[#1A1F4B] border-white/10 p-6 flex flex-col items-center space-y-4 hover:border-primary/50 transition-colors">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
              style={{ backgroundColor: bot.avatarColor }}
            >
              {bot.initial}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">{bot.name}</h3>
              <p className="text-sm text-slate-400">{bot.flag} {bot.language}</p>
            </div>
            <div className="bg-[#0D0D2B] p-3 rounded-lg w-full">
              <p className="text-xs italic text-slate-300 line-clamp-2">"{bot.exampleMessage}"</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-green-500 font-medium">Online</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Section - Onboarding Form */}
      <div className="w-full max-w-md bg-[#1A1F4B] p-8 rounded-2xl shadow-2xl border border-white/5 space-y-6 mb-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Your Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="bg-[#12163A] border-white/10 text-white placeholder:text-slate-600 focus:ring-primary"
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Your Native Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-[#12163A] border-white/10 text-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1F4B] border-white/10">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.name} value={lang.name} className="text-white hover:bg-primary/20">
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={() => onStart({ name, nativeLanguage: language })}
          className="w-full py-6 text-lg font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xl shadow-primary/20"
        >
          Start Chatting 💎
        </Button>

        <div className="text-center">
          <p className="text-xs text-slate-500 font-medium">Team VaaniTech · AceHack 5.0</p>
        </div>
      </div>
    </div>
  );
}
