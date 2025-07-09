import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../services/notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 space-y-2 flex flex-col items-center w-full max-w-full">
      <div 
        *ngFor="let notification of notifications; trackBy: trackByFn"
        class="notification-toast transform transition-all duration-300 ease-in-out"
        [ngClass]="getNotificationClasses(notification.type)"
        (click)="removeNotification(notification.id)"
      >
        <div class="flex items-start">
          <div class="notification-icon mr-3">
            {{ getNotificationIcon(notification.type) }}
          </div>
          <div class="flex-1">
            <div class="notification-message text-sm font-medium whitespace-pre-line">
              {{ notification.message }}
            </div>
            <div class="notification-timestamp text-xs opacity-70 mt-1">
              {{ formatTimestamp(notification.timestamp) }}
            </div>
          </div>
          <button 
            class="ml-2 text-current opacity-70 hover:opacity-100 focus:outline-none"
            (click)="removeNotification(notification.id); $event.stopPropagation()"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-toast {
      min-width: 320px;
      max-width: 90vw;
      margin-left: auto;
      margin-right: auto;
      padding: 14px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      animation: slideInCenter 0.3s cubic-bezier(0.4,0,0.2,1);
    }

    .notification-toast.success {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%);
      color: white;
    }

    .notification-toast.error {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%);
      color: white;
    }

    .notification-toast.warning {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%);
      color: white;
    }

    .notification-toast.info {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%);
      color: white;
    }

    .notification-toast:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    @keyframes slideInCenter {
      from {
        transform: translateY(-40px) scale(0.98);
        opacity: 0;
      }
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }

    .notification-icon {
      font-size: 18px;
      line-height: 1;
    }

    .notification-message {
      line-height: 1.4;
    }

    .notification-timestamp {
      font-family: 'Courier New', monospace;
    }
  `]
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$
      .subscribe((notifications: Notification[]) => {
        this.notifications = notifications;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }

  getNotificationClasses(type: string): string {
    return `notification-toast ${type}`;
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  }

  formatTimestamp(timestamp: Date): string {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  }

  trackByFn(index: number, notification: Notification): string {
    return notification.id;
  }
}
