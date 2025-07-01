import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { ToastNotificationComponent } from './toast-notification.component';
import { NotificationService } from '../services/notification.service';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

@Component({  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule, ToastNotificationComponent],  template: `
    <div class="fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col space-y-3 pointer-events-none min-w-96">
      <div *ngIf="toasts.length === 0" class="hidden">No toasts</div>
      @for (toast of toasts; track toast.id) {
        <div class="relative pointer-events-auto">
          <app-toast-notification 
            [message]="toast.message" 
            [type]="toast.type" 
            [duration]="toast.duration"
            (click)="removeToast(toast.id)"
          ></app-toast-notification>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483647; /* Highest possible z-index for visibility */
      pointer-events: none;
      min-width: 384px; /* 96 in rem */
    }
    .fixed {
      z-index: 2147483647 !important;
      pointer-events: none;
    }
    .relative.pointer-events-auto {
      pointer-events: auto;
    }
  `]
})
export class NotificationContainerComponent implements OnDestroy {
  toasts: ToastNotification[] = [];
  private subscription: Subscription;
  private destroy$ = new Subject<void>();
  
  constructor(private notificationService: NotificationService, private cdr: ChangeDetectorRef) {
    console.log('NotificationContainerComponent initialized');
    // Subscribe to the toast notifications
    this.subscription = this.notificationService.getNotifications()
      .subscribe(toast => {
        console.log('NotificationContainer received toast:', toast);
        this.addToast(toast);
      });
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }    

  addToast(toast: ToastNotification): void {
    console.log('Adding toast to container:', toast);
    
    // If the message is empty, it's a dismiss request
    if (!toast.message) {
      this.removeToast(toast.id);
      return;
    }
    
    // Check if we already have this toast (by id)
    const existingIndex = this.toasts.findIndex(t => t.id === toast.id);
    if (existingIndex !== -1) {
      // Replace the existing toast
      this.toasts[existingIndex] = toast;
    } else {
      // Add new toast
      this.toasts = [...this.toasts, toast]; // Create new array to trigger change detection
      console.log(`Toast added. Current toast count: ${this.toasts.length}`);
    }
    this.cdr.detectChanges();
    
    // Auto-remove toast after its duration
    if (toast.duration > 0) {
      setTimeout(() => {
        console.log(`Auto-removing toast ${toast.id} after ${toast.duration}ms`);
        this.removeToast(toast.id);
      }, toast.duration);
    }
  }

  removeToast(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.cdr.detectChanges();
  }
}
