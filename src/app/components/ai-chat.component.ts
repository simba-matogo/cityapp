import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { ChatMessage, ChatSession } from '../models/chat.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- AI Chat Modal -->
    <div *ngIf="showChatModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] border border-gray-200 flex flex-col">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold">Harare City AI Assistant</h3>
              <p class="text-sm text-blue-100">Ask me about Harare city services</p>
            </div>
          </div>
          <button (click)="closeChatModal()" class="text-white/80 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Chat Messages -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" #chatContainer>
          <div *ngFor="let message of messages; let last = last" class="flex" [ngClass]="message.sender === 'user' ? 'justify-end' : 'justify-start'">
            <div class="max-w-[80%]" [ngClass]="message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'">
              <div class="rounded-lg px-4 py-2 shadow-sm">
                <p class="text-sm leading-relaxed">{{ message.content }}</p>
                <p class="text-xs mt-1 opacity-70" [ngClass]="message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'">
                  {{ message.timestamp | date:'shortTime' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div *ngIf="isTyping" class="flex justify-start" #typingIndicator>
            <div class="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 shadow-sm">
              <div class="flex items-center gap-1">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
                <span class="text-xs text-gray-500 ml-2">AI is typing...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <form (ngSubmit)="sendMessage()" class="flex gap-2">
            <input
              type="text"
              [(ngModel)]="messageInput"
              name="messageInput"
              placeholder="Ask about Harare city services..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [disabled]="isTyping"
            >
            <button
              type="submit"
              [disabled]="!messageInput.trim() || isTyping"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .scroll-smooth {
      scroll-behavior: smooth;
    }
  `]
})
export class AiChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;
  @ViewChild('typingIndicator', { static: false }) typingIndicator!: ElementRef;
  
  showChatModal: boolean = false;
  messageInput: string = '';
  messages: ChatMessage[] = [];
  isTyping: boolean = false;
  currentSession: ChatSession | null = null;
  private shouldScrollToBottom = true;
  private previousMessageCount = 0;
  private previousTypingState = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Subscribe to chat service observables
    this.subscriptions.push(
      this.chatService.messages$.subscribe(messages => {
        this.messages = messages;
        // Check if new message was added
        if (messages.length > this.previousMessageCount) {
          this.shouldScrollToBottom = true;
        }
        this.previousMessageCount = messages.length;
        this.cdr.detectChanges();
      })
    );

    this.subscriptions.push(
      this.chatService.isTyping$.subscribe(isTyping => {
        this.isTyping = isTyping;
        // Scroll when typing starts
        if (isTyping && !this.previousTypingState) {
          this.shouldScrollToBottom = true;
        }
        this.previousTypingState = isTyping;
        this.cdr.detectChanges();
      })
    );

    this.subscriptions.push(
      this.chatService.currentSession$.subscribe(session => {
        this.currentSession = session;
        this.cdr.detectChanges();
      })
    );
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Open chat modal
   */
  async openChatModal() {
    try {
      // Get current authenticated user
      const currentUser = this.authService.getCurrentUserData();
      
      if (currentUser) {
        // Get user's display name
        const userName = this.authService.getUserName();
        
        // Start a chat session with authenticated user
        await this.chatService.startChatSession(
          currentUser.uid,
          userName
        );
        
        this.showChatModal = true;
        this.shouldScrollToBottom = true;
      } else {
        // Fallback for testing - use default user
        await this.chatService.startChatSession(
          'test-user-id',
          'Test User'
        );
        this.showChatModal = true;
        this.shouldScrollToBottom = true;
      }
    } catch (error) {
      console.error('Error opening chat modal:', error);
    }
  }

  /**
   * Public method to open chat modal from parent component
   */
  public async openChat() {
    await this.openChatModal();
  }

  /**
   * Close chat modal
   */
  closeChatModal() {
    this.showChatModal = false;
    this.chatService.clearSession();
    this.messageInput = '';
    this.shouldScrollToBottom = false;
  }

  /**
   * Send message
   */
  async sendMessage() {
    if (!this.messageInput.trim() || this.isTyping) return;

    const message = this.messageInput.trim();
    this.messageInput = '';
    this.shouldScrollToBottom = true;

    try {
      await this.chatService.sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  /**
   * Scroll to bottom of chat with improved behavior
   */
  private scrollToBottom() {
    if (!this.chatContainer?.nativeElement) return;

    setTimeout(() => {
      const container = this.chatContainer.nativeElement;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      
      // Smooth scroll to bottom
      container.scrollTo({
        top: maxScrollTop,
        behavior: 'smooth'
      });
    }, 50);
  }

  /**
   * Force scroll to bottom (for immediate scrolling)
   */
  private forceScrollToBottom() {
    if (!this.chatContainer?.nativeElement) return;

    const container = this.chatContainer.nativeElement;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const maxScrollTop = scrollHeight - clientHeight;
    
    container.scrollTop = maxScrollTop;
  }
} 