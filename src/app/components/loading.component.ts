import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Loading Component - Modern Loading Screen for Harare City Complaints System
 * 
 * This component displays a professional, animated loading screen during authentication
 * and system initialization. It features:
 * - Animated city logo with rotating ring
 * - Gradient text and modern design
 * - Feature highlights with icons
 * - Status messages and progress indicators
 * - Responsive design for all screen sizes
 * 
 * Used during:
 * - User login/signup process
 * - Page refresh with existing session
 * - System initialization
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Main loading container with gradient background -->
    <div class="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center z-50">
      <!-- Main Loading Container -->
      <div class="text-center space-y-8 p-8">
        
        <!-- Logo and Title Section -->
        <div class="space-y-6">
          <!-- Animated Logo with rotating ring and bouncing effect -->
          <div class="relative mx-auto w-24 h-24">
            <!-- Pulsing background circle -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
            <!-- White circle containing the city logo -->
            <div class="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <img src="/city.png" alt="Harare City Logo" class="w-12 h-12 object-contain animate-bounce" style="animation-delay: 0.2s;">
            </div>
            <!-- Rotating ring animation around the logo -->
            <div class="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          
          <!-- System Title with gradient text effect -->
          <div class="space-y-2">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              Harare City Complaints System
            </h1>
            <p class="text-gray-600 text-lg font-medium">Smart City Management Platform</p>
          </div>
        </div>

        <!-- Loading Animation Section -->
        <div class="space-y-4">
          <!-- Animated dots with staggered timing for wave effect -->
          <div class="flex justify-center space-x-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
            <div class="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
            <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
          </div>
          
          <!-- Loading progress indicator -->
          <div class="space-y-2">
            <p class="text-gray-700 font-medium">Initializing System</p>
            <!-- Animated progress bar -->
            <div class="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
              <div class="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Feature Icons Section - Highlights system capabilities -->
        <div class="flex justify-center space-x-8 pt-4">
          <!-- Complaint Management Feature -->
          <div class="text-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <p class="text-xs text-gray-600">Complaints</p>
          </div>
          
          <!-- Real-time Updates Feature -->
          <div class="text-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <p class="text-xs text-gray-600">Real-time</p>
          </div>
          
          <!-- AI Features -->
          <div class="text-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <p class="text-xs text-gray-600">AI Powered</p>
          </div>
        </div>

        <!-- Status Messages Section -->
        <div class="space-y-2 text-sm text-gray-500">
          <p class="animate-pulse">Connecting to city services...</p>
          <p class="text-xs">Powered by Angular & Firebase</p>
        </div>

      </div>

      <!-- Background Decorative Elements for visual appeal -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Floating decorative circles with staggered animations -->
        <div class="absolute top-20 left-20 w-8 h-8 bg-blue-200 rounded-full opacity-20 animate-bounce" style="animation-delay: 0.5s;"></div>
        <div class="absolute top-40 right-32 w-6 h-6 bg-indigo-200 rounded-full opacity-20 animate-bounce" style="animation-delay: 1s;"></div>
        <div class="absolute bottom-32 left-32 w-10 h-10 bg-purple-200 rounded-full opacity-20 animate-bounce" style="animation-delay: 1.5s;"></div>
        <div class="absolute bottom-20 right-20 w-4 h-4 bg-blue-200 rounded-full opacity-20 animate-bounce" style="animation-delay: 2s;"></div>
        
        <!-- Subtle grid pattern background -->
        <div class="absolute inset-0 opacity-5">
          <div class="w-full h-full" style="background-image: radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0); background-size: 20px 20px;"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Custom CSS animations for enhanced visual effects */
    
    /* Rotating animation for the logo ring */
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    /* Bouncing animation for various elements */
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0,0,0);
      }
      40%, 43% {
        transform: translate3d(0, -30px, 0);
      }
      70% {
        transform: translate3d(0, -15px, 0);
      }
      90% {
        transform: translate3d(0, -4px, 0);
      }
    }
    
    /* Pulsing animation for breathing effect */
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
    
    /* Apply animations to utility classes */
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    .animate-bounce {
      animation: bounce 1s infinite;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `]
})
export class LoadingComponent {
  // This component is purely presentational and doesn't require any logic
  // All functionality is handled through template bindings and CSS animations
}
