import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationContainerComponent } from './notification-container.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NotificationContainerComponent],
  template: `
    <app-notification-container></app-notification-container>
  `
})
export class AppNotificationsComponent {
  // This component exists solely to wrap the notification container for global use
}
