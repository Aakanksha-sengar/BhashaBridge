"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile, BotCharacter, Message } from '@/lib/types';
import { ArrowLeft, Mic, Send, Shield, Volume2, Sparkles, AlertTriangle, Lightbulb, Info } from 'lucide-react';
import { chatWithTranslatedBots } from '@/ai/flows/chat-with-translated-bots';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { LANGUAGE_CODE_MAP } from '@/lib/constants';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function ChatWindow({ userProfile, bot, onBack }: { userProfile: UserProfile, bot: BotCharacter, onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(`bhashabridge_chat_${bot.id}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, [bot.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    localStorage.setItem(`bhashabridge_chat_${bot.id}`, JSON.stringify(messages));
  }, [messages, bot.id]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE_CODE_MAP[userProfile.nativeLanguage] || 'hi-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSTT = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is only supported in Chrome browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = LANGUAGE_CODE_MAP[userProfile.nativeLanguage] || 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev + ' ' + transcript);
    };

    recognition.start();
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      originalText: inputValue,
      translatedText: '', // Will be handled by the flow call effectively
      tone: '',
      nuanceDetected: false,
      nuanceType: null,
      nuanceExplanation: null,
      sensitivityAlert: false,
      sensitivityReason: null,
      culturalTip: null,
      adaptedMessage: null,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await chatWithTranslatedBots({
        userMessage: userMessage.originalText,
        userLanguage: userProfile.nativeLanguage,
        botName: bot.name,
        botLanguage: bot.language,
        botPersonality: bot.personality,
        botCountry: bot.country
      });

      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        originalText: result.botReplyOriginal,
        translatedText: result.translatedText,
        tone: result.tone,
        nuanceDetected: result.nuanceDetected,
        nuanceType: result.nuanceType,
        nuanceExplanation: result.nuanceExplanation,
        sensitivityAlert: result.sensitivityAlert,
        sensitivityReason: result.sensitivityReason,
        culturalTip: result.culturalTip,
        adaptedMessage: result.adaptedMessage,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getToneColor = (tone: string) => {
    switch(tone.toLowerCase()) {
      case 'friendly':
      case 'enthusiastic': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      case 'formal': return 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30';
      case 'casual':
      case 'neutral': return 'bg-slate-500/20 text-slate-500 border-slate-500/30';
      case 'sarcastic':
      case 'aggressive': return 'bg-rose-500/20 text-rose-500 border-rose-500/30';
      case 'apologetic': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-500 border-slate-500/30';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0D0D2B]">
      {/* Navbar */}
      <header className="h-16 border-b border-white/5 bg-[#1A1F4B]/80 backdrop-blur-md flex items-center px-4 shrink-0 sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/5">
          <ArrowLeft />
        </Button>
        <div className="flex items-center ml-2 space-x-3 flex-1">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
            style={{ backgroundColor: bot.avatarColor }}
          >
            {bot.initial}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-sm md:text-base leading-none">{bot.name}</h3>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <p className="text-[10px] md:text-xs text-slate-400">{bot.language} · Online</p>
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full hidden sm:flex items-center space-x-2">
          <Shield className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Cultural Shield Active</span>
        </div>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 chat-scroll-area bg-gradient-to-b from-transparent to-[#0D0D2B]/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-sm mx-auto opacity-70">
             <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl"
              style={{ backgroundColor: bot.avatarColor }}
            >
              {bot.initial}
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Start chatting with {bot.name}!</h2>
              <p className="text-sm text-slate-400">
                Send a message in Hindi — {bot.name} will reply in {bot.language} and BhashaBridge will translate everything for you.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {["Kal meeting kaisi rahi?", "Kya tum kal free ho?", "Yeh project kab complete hoga?"].map(suggestion => (
                <button 
                  key={suggestion}
                  onClick={() => setInputValue(suggestion)}
                  className="bg-white/5 hover:bg-white/10 text-xs text-slate-300 py-2 px-4 rounded-full border border-white/10 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={cn("flex flex-col max-w-[85%]", msg.type === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
              {/* Message Header */}
              <div className="flex items-center space-x-2 mb-1">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   {msg.type === 'user' ? `${userProfile.name} 🇮🇳` : `${bot.name} ${bot.flag}`}
                 </span>
              </div>

              {/* Message Bubble */}
              <div className={cn(
                "rounded-2xl p-4 shadow-xl border relative",
                msg.type === 'user' 
                  ? "bg-[#7C3AED] border-white/10 text-white rounded-tr-none" 
                  : "bg-[#1A1F4B] border-l-4 border-l-primary border-white/10 text-white rounded-tl-none w-full"
              )}>
                <p className="font-bold text-sm md:text-base leading-relaxed">
                  {msg.originalText}
                </p>

                {msg.type === 'bot' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider">🌐 Translated to {userProfile.nativeLanguage}:</span>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 text-slate-400 hover:text-white"
                        onClick={() => speak(msg.translatedText)}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-slate-300 text-sm italic">
                      {msg.translatedText}
                    </p>
                  </div>
                )}
                
                <div className="text-[9px] text-slate-400 mt-2 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Bot Nuance Cards */}
              {msg.type === 'bot' && (
                <div className="mt-3 space-y-2 w-full">
                  {/* Tone Badge */}
                  <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider", getToneColor(msg.tone))}>
                    Tone: {msg.tone}
                  </div>

                  {/* Nuance Detection */}
                  {msg.nuanceDetected && (
                    <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-xl space-y-1">
                      <div className="flex items-center text-amber-500 space-x-2 font-bold text-xs">
                        <Info className="w-3.5 h-3.5" />
                        <span>⚠️ Nuance Detected: {msg.nuanceType}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 pl-5">{msg.nuanceExplanation}</p>
                    </div>
                  )}

                  {/* Sensitivity Alert */}
                  {msg.sensitivityAlert && (
                    <div className="bg-rose-500/5 border border-rose-500/20 p-3 rounded-xl space-y-1">
                      <div className="flex items-center text-rose-500 space-x-2 font-bold text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>🚨 Sensitivity Alert</span>
                      </div>
                      <p className="text-[11px] text-slate-300 pl-5">{msg.sensitivityReason}</p>
                    </div>
                  )}

                  {/* Cultural Tip */}
                  {msg.culturalTip && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl space-y-1">
                      <div className="flex items-center text-emerald-500 space-x-2 font-bold text-xs">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>💡 Cultural Tip</span>
                      </div>
                      <p className="text-[11px] text-slate-300 pl-5">{msg.culturalTip}</p>
                    </div>
                  )}

                  {/* Adapted Message */}
                  {msg.adaptedMessage && (
                    <div className="bg-primary/5 border border-primary/20 p-3 rounded-xl space-y-1">
                      <div className="flex items-center text-primary space-x-2 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>✨ Suggested Cultural Adaptation</span>
                      </div>
                      <p className="text-[11px] text-slate-300 pl-5">{msg.adaptedMessage}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex flex-col items-start max-w-[85%] space-y-2">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{bot.name} is thinking...</span>
            </div>
            <div className="bg-[#1A1F4B] p-4 rounded-2xl rounded-tl-none border border-white/10 flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs text-slate-400">✨ Cultural analysis running...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <footer className="bg-[#1A1F4B] p-4 border-t border-white/5 shrink-0 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center space-x-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sending in:</span>
              <span className="text-[10px] font-bold text-white uppercase">🇮🇳 {userProfile.nativeLanguage}</span>
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-widest", inputValue.length > 450 ? "text-rose-500" : "text-slate-500")}>
              {inputValue.length}/500
            </span>
          </div>

          <div className="flex items-center space-x-3">
             <Button 
                onClick={handleSTT}
                size="icon" 
                variant="ghost" 
                className={cn(
                  "h-12 w-12 rounded-full shrink-0 border border-white/10 transition-all duration-300",
                  isListening ? "bg-rose-500 hover:bg-rose-600 scale-110 shadow-lg shadow-rose-500/20" : "bg-white/5 hover:bg-white/10 text-white"
                )}
              >
                <Mic className={cn("w-6 h-6", isListening ? "animate-pulse" : "")} />
              </Button>

              <div className="relative flex-1">
                <Input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.slice(0, 500))}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={`Type in ${userProfile.nativeLanguage}...`}
                  className="h-12 bg-[#12163A] border-white/5 rounded-xl px-4 py-2 text-white placeholder:text-slate-500 pr-12 focus:ring-primary focus:border-primary/50"
                  disabled={isLoading}
                />
                {isListening && (
                  <div className="absolute top-[-40px] left-0 right-0 text-center text-rose-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                    Listening in {userProfile.nativeLanguage}... tap mic to stop
                  </div>
                )}
              </div>

              <Button 
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon" 
                className="h-12 w-12 rounded-full shrink-0 bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
