import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notification$ = new Subject<ToastNotification>();
  private activeNotifications = new Map<string, ToastNotification>();
  
  constructor() {}
  
  // Method to show a success toast
  showSuccess(message: string, duration: number = 5000): void {
    this.show(message, 'success', duration);
  }
  
  // Method to show an error toast
  showError(message: string, duration: number = 5000): void {
    this.show(message, 'error', duration);
  }
  
  // Method to show an info toast
  showInfo(message: string, duration: number = 5000): void {
    this.show(message, 'info', duration);
  }
  
  // Method to show a warning toast
  showWarning(message: string, duration: number = 5000): void {
    this.show(message, 'warning', duration);
  }
  
  // Compatibility methods for existing code
  success(message: string, title?: string, duration: number = 5000): string {
    const fullMessage = title ? `${title}: ${message}` : message;
    return this.show(fullMessage, 'success', duration);
  }
  
  error(message: string, title?: string, duration: number = 5000): string {
    const fullMessage = title ? `${title}: ${message}` : message;
    return this.show(fullMessage, 'error', duration);
  }
  
  info(message: string, title?: string, duration: number = 5000): string {
    const fullMessage = title ? `${title}: ${message}` : message;
    return this.show(fullMessage, 'info', duration);
  }
  
  warning(message: string, title?: string, duration: number = 5000): string {
    const fullMessage = title ? `${title}: ${message}` : message;
    return this.show(fullMessage, 'warning', duration);
  }
  
  dismiss(id: string): void {
    if (this.activeNotifications.has(id)) {
      this.activeNotifications.delete(id);
      // Notify listeners to remove this notification
      this.notification$.next({
        id,
        message: '',
        type: 'info',
        duration: 0
      });
    }
  }  // Generic method to show any type of toast
  show(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number = 5000): string {
    console.log(`Creating notification: ${type} - ${message}`);
    const id = uuidv4();
    const notification = {
      id,
      message,
      type,
      duration
    };
    
    this.activeNotifications.set(id, notification);
    
    // Emit the notification immediately
    try {
      console.log('Dispatching notification:', notification);
      this.notification$.next({...notification}); // Clone to ensure new reference
    } catch (err) {
      console.error('Error dispatching notification:', err);
    }
    
    return id;
  }
  
  // Method to explicitly show a toast after a delay
  showDelayed(message: string, type: 'success' | 'error' | 'info' | 'warning', delay: number = 500, duration: number = 5000): string {
    const id = uuidv4();
    setTimeout(() => {
      this.show(message, type, duration);
    }, delay);
    return id;
  }
  
  // Observable that components can subscribe to
  onNotification(): Observable<ToastNotification> {
    return this.notification$.asObservable();
  }
  // Special method for showing notifications after modal closing
  showSuccessDelayed(message: string, delayMs: number = 300): void {
    console.log(`Scheduling delayed success notification: ${message} after ${delayMs}ms`);
    setTimeout(() => {
      console.log('Now showing delayed notification');
      this.showSuccess(message);
    }, delayMs);
  }
}