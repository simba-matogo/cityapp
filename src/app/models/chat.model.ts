export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AIResponse {
  response: string;
  confidence: number;
  model: string;
  timestamp: Date;
}

export interface HarareCityData {
  population: string;
  suburbs: string[];
  mayor: string;
  services: string[];
  complaints?: any[];
  announcements?: any[];
} 