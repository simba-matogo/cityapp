import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private ngZone: NgZone) {}

  /**
   * Show a success notification
   */
  showSuccess(messageOrTitle: string, messageOrDuration?: string | number, duration: number = 5000): string {
    if (typeof messageOrDuration === 'number') {
      return this.addNotification('success', messageOrTitle, messageOrDuration);
    } else if (typeof messageOrDuration === 'string') {
      const message = `${messageOrTitle}\n${messageOrDuration}`;
      return this.addNotification('success', message, duration);
    }
    return this.addNotification('success', messageOrTitle, duration);
  }

  /**
   * Show an error notification
   */
  showError(messageOrTitle: string, messageOrDuration?: string | number, duration: number = 7000): string {
    if (typeof messageOrDuration === 'number') {
      return this.addNotification('error', messageOrTitle, messageOrDuration);
    } else if (typeof messageOrDuration === 'string') {
      const message = `${messageOrTitle}\n${messageOrDuration}`;
      return this.addNotification('error', message, duration);
    }
    return this.addNotification('error', messageOrTitle, duration);
  }

  /**
   * Show a warning notification
   */
  showWarning(messageOrTitle: string, messageOrDuration?: string | number, duration: number = 6000): string {
    if (typeof messageOrDuration === 'number') {
      return this.addNotification('warning', messageOrTitle, messageOrDuration);
    } else if (typeof messageOrDuration === 'string') {
      const message = `${messageOrTitle}\n${messageOrDuration}`;
      return this.addNotification('warning', message, duration);
    }
    return this.addNotification('warning', messageOrTitle, duration);
  }

  /**
   * Show an info notification
   */
  showInfo(messageOrTitle: string, messageOrDuration?: string | number, duration: number = 5000): string {
    if (typeof messageOrDuration === 'number') {
      return this.addNotification('info', messageOrTitle, messageOrDuration);
    } else if (typeof messageOrDuration === 'string') {
      const message = `${messageOrTitle}\n${messageOrDuration}`;
      return this.addNotification('info', message, duration);
    }
    return this.addNotification('info', messageOrTitle, duration);
  }

  /**
   * Show notification with flexible parameters
   */
  show(message: string, type?: string, duration?: number): string {
    // Handle different call signatures
    if (typeof type === 'number') {
      // show(message, duration)
      return this.showInfo(message, type);
    } else if (type === 'success') {
      return this.showSuccess(message, duration || 5000);
    } else if (type === 'error') {
      return this.showError(message, duration || 7000);
    } else if (type === 'warning') {
      return this.showWarning(message, duration || 6000);
    } else {
      // Default to info
      return this.showInfo(message, duration || 5000);
    }
  }

  /**
   * Show info notification (alternative signature)
   */
  info(title: string, message?: string, duration: number = 5000): string {
    const fullMessage = message ? `${title}\n${message}` : title;
    return this.showInfo(fullMessage, duration);
  }

  /**
   * Show success notification (alternative signature)
   */
  success(title: string, message?: string, duration: number = 5000): string {
    const fullMessage = message ? `${title}\n${message}` : title;
    return this.showSuccess(fullMessage, duration);
  }

  /**
   * Add a notification to the list
   */
  private addNotification(type: Notification['type'], message: string, duration: number): string {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      duration,
      timestamp: new Date()
    };

    // Use NgZone to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.ngZone.run(() => {
      const currentNotifications = this.notificationsSubject.value;
      this.notificationsSubject.next([...currentNotifications, notification]);
    });

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }

    return notification.id;
  }

  /**
   * Remove a notification by ID
   */
  removeNotification(id: string): void {
    this.ngZone.run(() => {
      const currentNotifications = this.notificationsSubject.value;
      const updatedNotifications = currentNotifications.filter(n => n.id !== id);
      this.notificationsSubject.next(updatedNotifications);
    });
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Dismiss a specific notification (alias for removeNotification)
   */
  dismiss(id: string): void {
    this.removeNotification(id);
  }

  /**
   * Show error notification (alias for showError)
   */
  error(title: string, message?: string, duration: number = 7000): string {
    const fullMessage = message ? `${title}\n${message}` : title;
    return this.showError(fullMessage, duration);
  }

  /**
   * Generate a unique ID for notifications
   */
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
