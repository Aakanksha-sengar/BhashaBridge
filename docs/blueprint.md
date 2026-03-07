# **App Name**: BhashaBridge

## Core Features:

- AI-Powered Cultural Chat Mediation: Engage in real-time chat with international bot characters (German, Japanese, British English) while the AI automatically translates user messages (Hindi) and bot replies (native language) using the Gemini API.
- Dynamic Cultural Nuance Analysis Tool: Utilize the AI to automatically detect cultural nuances, trigger sensitivity alerts, offer actionable cultural tips, and suggest culturally adapted messages through interactive 'Nuance Cards' displayed below bot replies.
- Pre-defined Multilingual Bot Personalities: Interact with three distinct bot characters (Lukas 🇩🇪, Yuki 🇯🇵, Emma 🇬🇧), each possessing a unique personality (professional, polite, friendly/sarcastic), native language, and custom avatar, ensuring authentic and context-aware conversations.
- Speech-to-Text & Text-to-Speech: Input messages using voice-to-text recognition (microphone support for Hindi and other languages) and listen to translated bot messages via text-to-speech functionality with a dedicated 'Listen' button.
- Intuitive Multi-Screen User Flow: Navigate seamlessly between a splash/onboarding screen, a chat selection screen displaying character cards, and an individual chat interface with distinct UI elements and clear contextual information for each interaction.
- Client-Side Chat Persistence: All conversation history and associated analysis data for each bot is stored and retrieved locally within the user's browser using localStorage, ensuring message persistence across sessions.

## Style Guidelines:

- Primary color: A vibrant purple (#7C3AED) symbolizing connection and interaction, used for buttons, user message bubbles, and other interactive elements against a dark theme.
- Background color: A deep, dark navy (#0D0D2B) provides a sophisticated and tech-forward canvas for the application, ensuring high contrast with UI components and text.
- Accent color: A bright cyan (#06B6D4) highlights key informational elements such as the tagline ('Cultural Intelligence.') and translation indicators, emphasizing the app's smart features.
- The sole typeface is 'Inter' (sans-serif), a modern and objective font, ideal for both headlines and body text to maintain a clean and consistent aesthetic across the application. Note: currently only Google Fonts are supported.
- The app's logo features a large, animating diamond (💎) emoji, signifying intelligence and value. Bot characters are represented by simple, colored circular avatars with their initial.
- User interface prioritizes a sticky top navbar and bottom input bar, maintaining critical controls. Chat content areas are scrollable, featuring rounded message bubbles (18px) and card elements (12px) for a soft, structured appearance.
- Subtle animations enhance the user experience, including a pulsing effect for the main diamond emoji on the splash screen and a 'typing indicator' of three bouncing dots when a bot is generating a reply.