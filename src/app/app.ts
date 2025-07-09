import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LoadingComponent } from './components/loading.component';
import { NotificationContainerComponent } from './components/notification-container.component';
import { Observable, Subscription } from 'rxjs';
import { ThemeService } from './services/theme.service';

/**
 * Main App Component - Root Component for Harare City Complaints System
 * 
 * This component serves as the application shell and handles:
 * - Authentication state management
 * - Theme switching (dark/light mode)
 * - Loading screen display during authentication
 * - Global notification container
 * - Route outlet for navigation
 * 
 * Features:
 * - OnPush change detection for performance
 * - Reactive authentication state handling
 * - Automatic theme restoration on login
 * - Global notification system
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoadingComponent, NotificationContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Main application container with theme support -->
    <div [ngClass]="{'dark': isDarkMode$ | async}" class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <!-- Loading screen displayed during authentication -->
      <div *ngIf="isLoading$ | async">
        <app-loading></app-loading>
      </div>
      <!-- Main application content when not loading -->
      <div *ngIf="!(isLoading$ | async)">
        <router-outlet />
      </div>
      <!-- Global notification container for system-wide notifications -->
      <app-notification-container></app-notification-container>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected title = 'CityApp';
  
  // Observable streams for reactive UI updates
  public isLoading$: Observable<boolean>;      // Controls loading screen visibility
  public isDarkMode$: Observable<boolean>;     // Controls theme state
  
  // Subscription management for cleanup
  private authSubscription: Subscription | undefined;
  private lastAuthState: boolean = false;      // Tracks previous auth state to prevent unnecessary updates

  constructor(
    private authService: AuthService,          // Handles authentication logic
    private themeService: ThemeService,        // Manages theme preferences
    private cdr: ChangeDetectorRef             // For manual change detection with OnPush strategy
  ) {
    // Initialize observable streams from services
    this.isLoading$ = this.authService.isLoading$;
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  /**
   * Initialize the application on startup
   * Sets up authentication state monitoring and theme management
   */
  ngOnInit() {
    console.log('App initialized, checking authentication state...');
    
    // Subscribe to authentication state changes to handle theme management
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      // Only process theme changes when auth state actually changes
      if (isAuthenticated !== this.lastAuthState) {
        this.lastAuthState = isAuthenticated;
        
        if (isAuthenticated) {
          // User logged in: restore theme from session or use default
          this.themeService.initializeFromSession();
        } else {
          // User logged out: reset to light mode and clear preferences
          this.themeService.resetToLightMode();
        }
        
        // Trigger change detection since we're using OnPush strategy
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Cleanup subscriptions when component is destroyed
   * Prevents memory leaks and ensures proper cleanup
   */
  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  
  /**
   * Feature list for development/testing purposes
   * These features highlight the system's capabilities
   */
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
