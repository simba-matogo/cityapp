import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { FirebaseError } from 'firebase/app';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-r from-blue-600 to-green-500 flex flex-col items-center justify-center">      <nav class="w-full bg-white bg-opacity-70 backdrop-blur-md shadow-md py-4 px-6 flex justify-between items-center fixed top-0 z-50">
        <div class="flex items-center">
          <img src="/city.png" alt="City Logo" class="h-10 w-10 mr-4">
          <h1 class="text-3xl font-bold text-gray-800">Harare City Council</h1>
        </div>
        <button (click)="openLoginModal()" class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">
          Get Started
        </button>
      </nav>

      <div class="text-center mt-36 pt-20">
        <!-- Increased padding-top (pt-20) to add 2.5cm space between sections -->
        <h2 class="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 drop-shadow-lg mb-6">
          Your Voice Matters to Us
        </h2>
        <p class="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed tracking-wide">
          Empowering Harare residents to make a difference. Submit complaints, track progress, and help us improve our city together.
        </p>
      </div>
      
      <div class="mt-12 text-center relative overflow-hidden py-8">
        <!-- Modern background with subtle animations -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-md"></div>
        <div class="absolute inset-0">
          <div class="absolute top-10 left-1/4 w-32 h-32 bg-blue-300/20 rounded-full filter blur-xl animate-pulse"></div>
          <div class="absolute bottom-10 right-1/4 w-24 h-24 bg-purple-300/20 rounded-full filter blur-xl animate-pulse" style="animation-delay: 1s"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-teal-300/20 rounded-full filter blur-xl animate-pulse" style="animation-delay: 2s"></div>
        </div>
        
        <!-- Content -->
        <div class="relative z-10 max-w-6xl mx-auto px-14">
          <!-- Increased padding (px-14) to extend section width by 4cm, 2cm on each side -->
          <h3 class="text-4xl font-extrabold text-white mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 drop-shadow-md">Next-Gen AI Features</h3>
          <p class="text-white/80 max-w-2xl mx-auto mb-10">Powered by cutting-edge artificial intelligence to transform your city experience</p>
          
          <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div class="group bg-transparent backdrop-blur-lg border border-white/10 rounded-lg shadow-lg p-4 hover:border-blue-300/50 hover:shadow-blue-500/20 transition-all duration-300 flex flex-col items-center">
              <div class="relative mb-4">
                <div class="absolute -inset-1 bg-blue-600/30 rounded-full blur-md group-hover:bg-blue-500/40"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-400 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">Smart Analytics</h4>
              <p class="text-white/70 text-center group-hover:text-white/90 transition-colors">Trend analysis to optimize city resources and services.</p>
            </div>
            
            <div class="group bg-transparent backdrop-blur-lg border border-white/10 rounded-lg shadow-lg p-4 hover:border-teal-300/50 hover:shadow-teal-500/20 transition-all duration-300 flex flex-col items-center">
              <div class="relative mb-4">
                <div class="absolute -inset-1 bg-teal-600/30 rounded-full blur-md group-hover:bg-teal-500/40"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-teal-400 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h4 clsass="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">Smart Routing</h4>
              <p class="text-white/70 text-center group-hover:text-white/90 transition-colors">Classify and prioritizes issues to ensure rapid response and resolution.</p>
            </div>
            
            <div class="group bg-transparent backdrop-blur-lg border border-white/10 rounded-lg shadow-lg p-4 hover:border-purple-300/50 hover:shadow-purple-500/20 transition-all duration-300 flex flex-col items-center">
              <div class="relative mb-4">
                <div class="absolute -inset-1 bg-purple-600/30 rounded-full blur-md group-hover:bg-purple-500/40"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-purple-400 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">AI Assistant</h4>
              <p class="text-white/70 text-center group-hover:text-white/90 transition-colors">24/7 intelligent virtual assistance with instant predictive responses.</p>
            </div>

            <!-- New Component 1 -->
            <div class="group bg-transparent backdrop-blur-lg border border-white/10 rounded-lg shadow-lg p-4 hover:border-yellow-300/50 hover:shadow-yellow-500/20 transition-all duration-300 flex flex-col items-center">
              <div class="relative mb-4">
                <div class="absolute -inset-1 bg-yellow-600/30 rounded-full blur-md group-hover:bg-yellow-500/40"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-yellow-400 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">Predictive Insights</h4>
              <p class="text-white/70 text-center group-hover:text-white/90 transition-colors">Forecast trends and make data-driven decisions.</p>
            </div>

            <!-- New Component 2 -->
            <div class="group bg-transparent backdrop-blur-lg border border-white/10 rounded-lg shadow-lg p-4 hover:border-red-300/50 hover:shadow-red-500/20 transition-all duration-300 flex flex-col items-center">
              <div class="relative mb-4">
                <div class="absolute -inset-1 bg-red-600/30 rounded-full blur-md group-hover:bg-red-500/40"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-400 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-white mb-2 group-hover:text-red-300 transition-colors">Automated Monitoring</h4>
              <p class="text-white/70 text-center group-hover:text-white/90 transition-colors">Track city metrics in real-time.</p>
            </div>

            <!-- New Component 3 -->
            <div class="group bg-transparent backdrop-blur-lg border border-white/10 rounded-lg shadow-lg p-4 hover:border-green-300/50 hover:shadow-green-500/20 transition-all duration-300 flex flex-col items-center">
              <div class="relative mb-4">
                <div class="absolute -inset-1 bg-green-600/30 rounded-full blur-md group-hover:bg-green-500/40"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-400 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-white mb-2 group-hover:text-green-300 transition-colors">Enhanced Security</h4>
              <p class="text-white/70 text-center group-hover:text-white/90 transition-colors">Detect and prevent security threats proactively.</p>
            </div>
          </div>
        </div>      </div>

      <footer class="w-full bg-gray-800 text-white py-6 mt-0">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
          <!-- Left Section -->
          <div class="text-left">
            <p class="text-lg font-bold mb-4">Contact Us</p>
            <ul class="text-sm text-gray-300 mb-6">
              <li><strong>Phone:</strong> +263 242 751823</li>
              <li><strong>Email:</strong> info&#64;hararecity.gov.zw</li>
              <li><strong>Address:</strong> Town House, Julius Nyerere Way, Harare, Zimbabwe</li>
            </ul>
          </div>

          <!-- Right Section -->
          <div class="text-right">
            <p>&copy; 2025 Harare City Council. All rights reserved.</p>
            <p>Follow us on <a href="#" class="text-blue-400 hover:underline">Twitter</a>, <a href="#" class="text-blue-400 hover:underline">Facebook</a>, and <a href="#" class="text-blue-400 hover:underline">Instagram</a>.</p>
          </div>
        </div>
      </footer>

      <!-- Login Modal -->
      <div *ngIf="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-8 w-96 relative">
          <button (click)="showLoginModal = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="flex justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-6 text-gray-800 text-center"> Welcome , please login</h3>
          <form (ngSubmit)="login()">
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" [(ngModel)]="email" name="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" [(ngModel)]="password" name="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>
            <div class="mb-4">
              <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
              <select id="role" [(ngModel)]="role" name="role" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="generaluser">General User</option>
                <option value="admin">Department Admin</option>
                <option value="overalladmin">Overall Admin</option>
              </select>
            </div>
            <button type="submit" class="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">Login</button>
          </form>
          <div class="mt-4 text-center">
            <a href="#" (click)="openSignUpModal()" class="text-green-600 hover:underline">Sign Up</a>
            <span class="mx-2">|</span>
            <a href="#" class="text-green-600 hover:underline">Forgot Password?</a>
          </div>
        </div>
      </div>

      <!-- Sign-Up Modal -->
      <div *ngIf="showSignUpModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-8 w-96 relative">
          <button (click)="showSignUpModal = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="flex justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-6 text-gray-800 text-center">Sign Up</h3>
          <form (ngSubmit)="signUp()">
            <div class="mb-4">
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" id="username" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>
            <div class="mb-4">
              <label for="surname" class="block text-sm font-medium text-gray-700">Surname</label>
              <input type="text" id="surname" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" [(ngModel)]="email" name="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" [(ngModel)]="password" name="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>
            <div class="mb-4">
              <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
              <select id="role" [(ngModel)]="role" name="role" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="generaluser">General User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" class="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">Sign Up</button>
          </form>
          <div class="mt-4 text-center">
            <a href="#" (click)="openLoginModal()" class="text-green-600 hover:underline">Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LandingPageComponent {
  showLoginModal = false;
  showSignUpModal = false;

  email = '';
  password = '';
  role = 'generaluser';
  signUpErrorMessage = ''; // Add this property to store error messages

  constructor(private authService: AuthService) {}

  openLoginModal() {
    this.showLoginModal = true;
    this.showSignUpModal = false;
  }

  openSignUpModal() {
    this.showLoginModal = false;
    this.showSignUpModal = true;
  }

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.showLoginModal = false;
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async signUp() {
    try {
      await this.authService.signUp(this.email, this.password, this.role);
      this.showSignUpModal = false;
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error('Sign-up failed:', firebaseError);
      this.signUpErrorMessage = firebaseError.message || 'An unexpected error occurred during sign-up.';
    }
  }
}
