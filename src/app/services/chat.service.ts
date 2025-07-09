import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage, ChatSession, AIResponse, HarareCityData } from '../models/chat.model';
import { Complaint } from '../models/complaint.model';
import { Announcement } from '../models/announcement.model';
import { ComplaintService } from './complaint.service';
import { AnnouncementService } from './announcement.service';
import { AuthService } from './auth.service';
import { OpenRouterService } from './openrouter.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private currentSessionSubject = new BehaviorSubject<ChatSession | null>(null);
  public currentSession$ = this.currentSessionSubject.asObservable();
  
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  
  private isTypingSubject = new BehaviorSubject<boolean>(false);
  public isTyping$ = this.isTypingSubject.asObservable();

  // Harare city data
  private harareData: HarareCityData = {
    population: '2.1 million',
    suburbs: ['Mbare', 'Borrowdale', 'Greendale', 'Highfield', 'Mount Pleasant', 'Avondale', 'Belgravia', 'Belvedere', 'Chisipite', 'Glen Lorne', 'Highlands', 'Hillside', 'Mabelreign', 'Mount Pleasant', 'Pomona', 'Ridgeview', 'Sunningdale', 'Waterfalls'],
    mayor: 'Jacob Mafume',
    services: ['Waste Management', 'Water Supply', 'Roads Maintenance', 'Electricity', 'Public Transport', 'Street Lighting', 'Parks and Recreation', 'Building Permits', 'Business Licenses', 'Public Health', 'Emergency Services', 'Traffic Management'],
    complaints: [],
    announcements: []
  };

  constructor(
    private complaintService: ComplaintService,
    private announcementService: AnnouncementService,
    private authService: AuthService,
    private openRouterService: OpenRouterService
  ) {
    this.loadCityData();
  }

  /**
   * Load city data from services
   */
  private async loadCityData() {
    try {
      // Load complaints data
      const complaints = this.complaintService.getCurrentComplaints();
      this.harareData.complaints = complaints;

      // Load announcements data
      this.announcementService.announcements$.subscribe(announcements => {
        this.harareData.announcements = announcements;
      });
    } catch (error) {
      console.error('Error loading city data:', error);
    }
  }

  /**
   * Generate system message with city data
   */
  private generateSystemMessage(): string {
    const citySummary = `
You are a Smart City AI Assistant for Harare City Council, developed by Simbarashe Matogo, a final year student at Telone Centre for Learning. You have access to the following city information:

CITY OVERVIEW:
- Population: ${this.harareData.population}
- Mayor: Jacob Mafume
- Description: Harare is a clean city known for its beauty and organization

MAJOR SUBURBS:
${this.harareData.suburbs?.join(', ') || 'Various suburbs'}

CITY SERVICES:
${this.harareData.services?.join(', ') || 'Various city services'}

CURRENT COMPLAINTS: ${this.harareData.complaints?.length || 0} active complaints
CURRENT ANNOUNCEMENTS: ${this.harareData.announcements?.length || 0} active announcements

INSTRUCTIONS:
- Always greet users by their name when they start a conversation
- Mention that you're a Smart City AI Assistant developed by Simbarashe Matogo at Telone Centre for Learning
- Emphasize that Harare is a clean city with Mayor Jacob Mafume
- Provide helpful information about Harare city services
- Help users with complaints, announcements, and general city information
- Be friendly, professional, and knowledgeable about Harare
- If you don't know something specific, suggest contacting the relevant city department
- Keep responses concise but informative
- Encourage users to ask freely about any city-related questions
`;

    return citySummary.trim();
  }

  /**
   * Start a new chat session
   */
  async startChatSession(userId: string, userName: string): Promise<ChatSession> {
    const session: ChatSession = {
      id: this.generateId(),
      userId,
      userName,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    // Generate system message with city data
    const systemMessage = this.generateSystemMessage();

    // Add welcome message with user's name and detailed information
    const welcomeMessage: ChatMessage = {
      id: this.generateId(),
      content: `Hello ${userName}! 👋

I'm your Smart City AI Assistant, developed by Simbarashe Matogo, a final year student at Telone Centre for Learning. I'm here to help Harare residents by providing comprehensive city information and assistance.

About Harare: Our beautiful city is known for being a clean city, and our Mayor is Jacob Mafume. I have access to current city information including services, complaints, and announcements to better assist you.

Please feel free to ask me anything about Harare city services, general information, or any other questions you may have today!`,
      sender: 'ai',
      timestamp: new Date()
    };

    session.messages.push(welcomeMessage);
    this.currentSessionSubject.next(session);
    this.messagesSubject.next(session.messages);

    // Store system message in session for future use
    (session as any).systemMessage = systemMessage;

    return session;
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(content: string): Promise<void> {
    if (!this.currentSessionSubject.value) {
      console.error('No active chat session');
      return;
    }

    const session = this.currentSessionSubject.value;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: this.generateId(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    session.messages.push(userMessage);
    this.messagesSubject.next(session.messages);

    // Show typing indicator
    this.isTypingSubject.next(true);

    try {
      // Get system message and user name from session
      const systemMessage = (session as any).systemMessage || this.generateSystemMessage();
      const userName = session.userName;

      // Get AI response using OpenRouter with system message and user context
      const aiText = await this.openRouterService.generateResponse(content, systemMessage, userName);
      
      // Add AI message
      const aiMessage: ChatMessage = {
        id: this.generateId(),
        content: aiText,
        sender: 'ai',
        timestamp: new Date()
      };

      session.messages.push(aiMessage);
      session.updatedAt = new Date();
      
      this.currentSessionSubject.next(session);
      this.messagesSubject.next(session.messages);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: this.generateId(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };

      session.messages.push(errorMessage);
      this.messagesSubject.next(session.messages);
    } finally {
      this.isTypingSubject.next(false);
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): ChatSession | null {
    return this.currentSessionSubject.value;
  }

  /**
   * Get messages
   */
  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }

  /**
   * Clear chat session
   */
  clearSession(): void {
    this.currentSessionSubject.next(null);
    this.messagesSubject.next([]);
    this.isTypingSubject.next(false);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 