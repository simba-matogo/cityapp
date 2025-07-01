import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  inputs: ['message', 'type', 'duration'],  template: `
    <div [@fadeInOut]="visible ? 'visible' : 'hidden'" 
         class="relative p-4 rounded-lg shadow-xl flex items-start space-x-3 transition-all transform w-96 max-w-md backdrop-blur-md border-2 pointer-events-auto"
         [ngClass]="getClassByType()">
      <div class="flex-shrink-0 mt-0.5">
        <ng-container [ngSwitch]="type">
          <svg *ngSwitchCase="'success'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <svg *ngSwitchCase="'error'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg *ngSwitchCase="'info'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg *ngSwitchCase="'warning'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg *ngSwitchDefault class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </ng-container>
      </div>
      <div class="flex-1 text-sm font-medium leading-relaxed" [innerHTML]="getFormattedMessage()"></div>
      <button (click)="close()" class="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `,
  animations: [
    trigger('fadeInOut', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', [
        animate('200ms ease-out')
      ]),
      transition('visible => hidden', [
        animate('200ms ease-in')
      ])
    ])
  ]
})
export class ToastNotificationComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
  @Input() duration: number = 5000; // Default duration in milliseconds
  
  visible: boolean = false;
  private timeoutId: any;
  
  ngOnInit(): void {
    // Show the toast with animation
    setTimeout(() => {
      this.visible = true;
      
      // Auto-dismiss after duration
      if (this.duration > 0) {
        this.timeoutId = setTimeout(() => {
          this.close();
        }, this.duration);
      }
    }, 100);
  }
  
  close(): void {
    this.visible = false;
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  getFormattedMessage(): string {
    // Convert newlines to HTML breaks and handle emojis nicely
    return this.message
      .replace(/\n/g, '<br>')
      .replace(/\\n/g, '<br>')
      // Add some spacing around emojis
      .replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, ' $1 ')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  getClassByType(): string {
    switch(this.type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400 shadow-xl shadow-green-300/30 font-medium';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-xl shadow-red-300/30 font-medium';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 shadow-xl shadow-amber-300/30 font-medium';
      case 'info':
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-xl shadow-blue-300/30 font-medium';
    }
  }
}