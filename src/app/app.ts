import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LoadingComponent } from './components/loading.component';
import { NotificationContainerComponent } from './components/notification-container.component';
import { Observable, Subscription } from 'rxjs';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoadingComponent, NotificationContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngClass]="{'dark': isDarkMode$ | async}" class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <div *ngIf="isLoading$ | async">
        <app-loading></app-loading>
      </div>
      <div *ngIf="!(isLoading$ | async)">
        <router-outlet />
      </div>
      <!-- Global notification container -->
      <app-notification-container></app-notification-container>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected title = 'CityApp';
  public isLoading$: Observable<boolean>;
  public isDarkMode$: Observable<boolean>;
  private authSubscription: Subscription | undefined;
  private lastAuthState: boolean = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.authService.isLoading$;
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit() {
    // The AuthService will automatically handle authentication state
    console.log('App initialized, checking authentication state...');
    
    // Listen for auth state changes to handle theme
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      // Only handle theme changes on actual auth state changes
      if (isAuthenticated !== this.lastAuthState) {
        this.lastAuthState = isAuthenticated;
        
        if (isAuthenticated) {
          // On new login, initialize from session (which will be empty, defaulting to light)
          // On refresh with existing session, restore the session theme
          this.themeService.initializeFromSession();
        } else {
          // On logout, reset to light mode and clear preferences
          this.themeService.resetToLightMode();
        }
        
        // Trigger change detection after theme changes
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  
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
