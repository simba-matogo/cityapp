import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppNotificationsComponent } from './components/app-notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppNotificationsComponent],
  templateUrl: './app-router.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'CityApp';
  
  protected features = [
    {
      icon: '🚀',
      title: 'Fast Development',
      description: 'Build user interfaces quickly with utility-first CSS classes that eliminate the need to write custom CSS.'
    },
    {
      icon: '🎨',
      title: 'Customizable Design',
      description: 'Easily customize your design system with configuration files and create consistent, beautiful interfaces.'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Create responsive layouts effortlessly with mobile-first utilities and responsive variants.'
    },
    {
      icon: '⚡',
      title: 'Performance Optimized',
      description: 'Automatically removes unused CSS in production builds, resulting in smaller bundle sizes.'
    },
    {
      icon: '🔧',
      title: 'Developer Experience',
      description: 'Excellent IntelliSense support, comprehensive documentation, and an active community.'
    },
    {
      icon: '🌟',
      title: 'Modern Workflow',
      description: 'Integrates seamlessly with modern build tools and frameworks like Angular, React, and Vue.'
    }
  ];
}
