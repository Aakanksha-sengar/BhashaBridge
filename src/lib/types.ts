export type BotId = 'lukas' | 'yuki' | 'emma';

export interface BotCharacter {
  id: BotId;
  name: string;
  flag: string;
  language: string;
  personality: string;
  country: string;
  avatarColor: string;
  bio: string;
  initial: string;
  exampleMessage: string;
}

export interface Message {
  id: string;
  type: 'user' | 'bot';
  originalText: string;
  translatedText: string;
  tone: string;
  nuanceDetected: boolean;
  nuanceType: string | null;
  nuanceExplanation: string | null;
  sensitivityAlert: boolean;
  sensitivityReason: string | null;
  culturalTip: string | null;
  adaptedMessage: string | null;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  nativeLanguage: string;
}
