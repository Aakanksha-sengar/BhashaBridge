import { BotCharacter } from './types';

export const BOT_CHARACTERS: BotCharacter[] = [
  {
    id: 'lukas',
    name: 'Lukas Mueller',
    flag: '🇩🇪',
    language: 'German',
    personality: 'Professional, formal, precise',
    country: 'Germany',
    avatarColor: '#3B82F6',
    bio: 'Professional colleague from Berlin',
    initial: 'L',
    exampleMessage: 'Guten Tag. Ich bin bereit für unser Meeting.'
  },
  {
    id: 'yuki',
    name: 'Yuki Tanaka',
    flag: '🇯🇵',
    language: 'Japanese',
    personality: 'Polite, indirect, uses honorifics',
    country: 'Japan',
    avatarColor: '#EC4899',
    bio: 'Strategic partner from Tokyo',
    initial: 'Y',
    exampleMessage: 'はじめまして。よろしくお願いいたします。'
  },
  {
    id: 'emma',
    name: 'Emma Wilson',
    flag: '🇬🇧',
    language: 'English',
    personality: 'Friendly, uses British idioms and sarcasm occasionally',
    country: 'United Kingdom',
    avatarColor: '#10B981',
    bio: 'Creative lead from London',
    initial: 'E',
    exampleMessage: 'Brilliant! That is a bit of a sticky wicket, isn’t it?'
  }
];

export const SUPPORTED_LANGUAGES = [
  { name: 'Hindi', flag: '🇮🇳', code: 'hi-IN' },
  { name: 'English', flag: '🇺🇸', code: 'en-US' },
  { name: 'German', flag: '🇩🇪', code: 'de-DE' },
  { name: 'Japanese', flag: '🇯🇵', code: 'ja-JP' },
  { name: 'French', flag: '🇫🇷', code: 'fr-FR' },
  { name: 'Spanish', flag: '🇪🇸', code: 'es-ES' },
  { name: 'Chinese', flag: '🇨🇳', code: 'zh-CN' },
  { name: 'Arabic', flag: '🇸🇦', code: 'ar-SA' },
  { name: 'Korean', flag: '🇰🇷', code: 'ko-KR' },
  { name: 'Portuguese', flag: '🇧🇷', code: 'pt-BR' }
];

export const LANGUAGE_CODE_MAP: Record<string, string> = {
  'Hindi': 'hi-IN',
  'English': 'en-US',
  'German': 'de-DE',
  'Japanese': 'ja-JP',
  'French': 'fr-FR',
  'Spanish': 'es-ES',
  'Chinese': 'zh-CN',
  'Arabic': 'ar-SA',
  'Korean': 'ko-KR',
  'Portuguese': 'pt-BR'
};
