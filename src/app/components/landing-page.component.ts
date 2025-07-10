import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { FormsModule } from '@angular/forms';
import { FirebaseError } from 'firebase/app';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white flex flex-col items-center justify-center">      <nav class="sticky top-0 z-50 w-full backdrop-blur-lg border-b shadow-sm bg-white/80 border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-3">
              <img src="/city.png" alt="City Logo" class="h-10 w-10 object-contain">
              <div class="flex flex-col">
                <span class="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Harare City Portal</span>
                <span class="text-xs text-slate-500">Smart City Portal</span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <button (click)="openLoginModal()" class="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="text-center mt-36 pt-20 bg-green-100">
        <h2 class="text-6xl font-extrabold text-blue-700 drop-shadow-lg mb-6">
          Your Voice Matters to Us
        </h2>
        <p class="text-xl text-black max-w-3xl mx-auto leading-relaxed tracking-wide">
          Empowering Harare residents to make a difference. Submit complaints, track progress, and help us improve our city together.
        </p>
      </div>
      
      <div class="mt-12 text-center relative overflow-hidden py-8 bg-green-100">
        <div class="absolute inset-0 bg-white/80"></div>
        <div class="absolute inset-0">
          <div class="absolute top-10 left-1/4 w-32 h-32 bg-gray-200/40 rounded-full filter blur-xl animate-pulse"></div>
          <div class="absolute bottom-10 right-1/4 w-24 h-24 bg-gray-300/30 rounded-full filter blur-xl animate-pulse" style="animation-delay: 1s"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gray-100/30 rounded-full filter blur-xl animate-pulse" style="animation-delay: 2s"></div>
        </div>
        <div class="relative z-10 max-w-6xl mx-auto px-14">
          <h3 class="text-4xl font-extrabold text-blue-700 mb-6 drop-shadow-md">AI Sunshine City</h3>
          <p class="text-blue-700 max-w-2xl mx-auto mb-10">Powered by cutting-edge artificial intelligence to transform your city experience</p>
          <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div class="group bg-green-50/80 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg p-4 hover:border-green-400 hover:shadow-green-300 transition-all duration-300 flex flex-col items-center">
              <div class="relative mb-4">
                <div class="absolute -inset-1 bg-green-200/40 rounded-full blur-md group-hover:bg-green-300/50"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-700 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-black mb-2 group-hover:text-gray-800 transition-colors">Smart Analytics</h4>
              <p class="text-black text-center group-hover:text-gray-800 transition-colors">Trend analysis to optimize city resources and services.</p>
            </div>
            <div class="group bg-green-50/80 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg p-4 hover:border-green-400 hover:shadow-green-300 transition-all duration-300 flex flex-col items-center">
              <div class="relative mb-4">
                <div class="absolute -inset-1 bg-green-200/40 rounded-full blur-md group-hover:bg-green-300/50"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-700 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-black mb-2 group-hover:text-gray-800 transition-colors">Smart Routing</h4>
              <p class="text-black text-center group-hover:text-gray-800 transition-colors">Classify and prioritizes issues to ensure rapid response and resolution.</p>
            </div>
            <div class="group bg-green-50/80 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg p-4 hover:border-green-400 hover:shadow-green-300 transition-all duration-300 flex flex-col items-center">
              <div class="relative mb-4">
                <div class="absolute -inset-1 bg-green-200/40 rounded-full blur-md group-hover:bg-green-300/50"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-700 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-black mb-2 group-hover:text-gray-800 transition-colors">AI Assistant</h4>
              <p class="text-black text-center group-hover:text-gray-800 transition-colors">24/7 intelligent virtual assistance with instant predictive responses.</p>
            </div>
            <div class="group bg-green-50/80 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg p-4 hover:border-green-400 hover:shadow-green-300 transition-all duration-300 flex flex-col items-center">
              <div class="relative mb-4">
                <div class="absolute -inset-1 bg-green-200/40 rounded-full blur-md group-hover:bg-green-300/50"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-700 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-black mb-2 group-hover:text-gray-800 transition-colors">Predictive Insights</h4>
              <p class="text-black text-center group-hover:text-gray-800 transition-colors">Forecast trends and make data-driven decisions.</p>
            </div>
            <div class="group bg-green-50/80 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg p-4 hover:border-green-400 hover:shadow-green-300 transition-all duration-300 flex flex-col items-center">
              <div class="relative mb-4">
                <div class="absolute -inset-1 bg-green-200/40 rounded-full blur-md group-hover:bg-green-300/50"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-700 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-black mb-2 group-hover:text-gray-800 transition-colors">Automated Monitoring</h4>
              <p class="text-black text-center group-hover:text-gray-800 transition-colors">Track city metrics in real-time.</p>
            </div>
            <div class="group bg-green-50/80 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg p-4 hover:border-green-400 hover:shadow-green-300 transition-all duration-300 flex flex-col items-center">
              <div class="relative mb-4">
                <div class="absolute -inset-1 bg-green-200/40 rounded-full blur-md group-hover:bg-green-300/50"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-700 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-black mb-2 group-hover:text-gray-800 transition-colors">Enhanced Security</h4>
              <p class="text-black text-center group-hover:text-gray-800 transition-colors">Detect and prevent security threats proactively.</p>
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
        <div class="bg-white bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-4 w-80 relative">
          <button (click)="showLoginModal = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-gray-800 text-center"> Welcome , please login</h3>
          <form (ngSubmit)="login()">
            <div class="mb-2">
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" [(ngModel)]="email" name="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>
            <div class="mb-2">
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="relative">
                <input [type]="showLoginPassword ? 'text' : 'password'" id="password" [(ngModel)]="password" name="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
                <button type="button" (click)="showLoginPassword = !showLoginPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  <svg *ngIf="!showLoginPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showLoginPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>
            <button type="submit" class="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">Login</button>
          </form>
          <div class="mt-2 text-center">
            <a href="#" (click)="openSignUpModal()" class="text-green-600 hover:underline">Sign Up</a>
            <span class="mx-2">|</span>
            <a href="#" class="text-green-600 hover:underline">Forgot Password?</a>
          </div>
        </div>
      </div>

      <!-- Sign-Up Modal -->
      <div *ngIf="showSignUpModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-4 w-80 relative">
          <button (click)="showSignUpModal = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Loading State -->
          <div *ngIf="isSigningUp" class="flex flex-col items-center justify-center py-8">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mb-4"></div>
            <p class="text-lg font-semibold text-gray-700">Creating your account...</p>
            <p class="text-sm text-gray-500 mt-2">Please wait while we set up your profile</p>
          </div>
          
          <!-- Sign Up Form -->
          <div *ngIf="!isSigningUp">
            <div class="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800 text-center">Sign Up</h3>
            
            <!-- Error Message -->
            <div *ngIf="signUpErrorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {{ signUpErrorMessage }}
            </div>
            
            <form (ngSubmit)="signUp()">
              <div class="mb-2">
                <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" id="username" [(ngModel)]="username" name="username" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>
              <div class="mb-2">
                <label for="surname" class="block text-sm font-medium text-gray-700">Surname</label>
                <input type="text" id="surname" [(ngModel)]="surname" name="surname" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>
              <div class="mb-2">
                <label for="signup-email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="signup-email" [(ngModel)]="signupEmail" name="signupEmail" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
              </div>
              <div class="mb-2">
                <label for="signup-password" class="block text-sm font-medium text-gray-700">Password</label>
                <div class="relative">
                  <input [type]="showSignupPassword ? 'text' : 'password'" id="signup-password" [(ngModel)]="signupPassword" name="signupPassword" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
                  <button type="button" (click)="showSignupPassword = !showSignupPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    <svg *ngIf="!showSignupPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg *ngIf="showSignupPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="mb-2">
                <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                <select id="role" [(ngModel)]="role" name="role" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="generaluser">General User</option>
                  <option value="departmentadmin">Department Admin</option>
                  <option value="overalladmin">Overall Admin</option>
                </select>
              </div>
              <div class="mb-2" *ngIf="role === 'departmentadmin'">
                <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
                <select id="department" [(ngModel)]="department" name="department" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Water and Sanitation">Water and Sanitation</option>
                  <option value="Roads and Transport">Roads and Transport</option>
                  <option value="Waste Management">Waste Management</option>
                </select>
              </div>
              <button type="submit" class="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">Sign Up</button>
            </form>
            <div class="mt-2 text-center">
              <a href="#" (click)="openLoginModal()" class="text-green-600 hover:underline">Back to Login</a>
            </div>
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
  isSigningUp = false;
  showLoginPassword = false;
  showSignupPassword = false;
  
  // Login form fields
  email = '';
  password = '';
  
  // Sign up form fields
  username = '';
  surname = '';
  signupEmail = '';
  signupPassword = '';
  role = 'generaluser';
  department = '';
  signUpErrorMessage = '';

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  openLoginModal() {
    this.showLoginModal = true;
    this.showSignUpModal = false;
    this.clearSignUpForm();
  }

  openSignUpModal() {
    this.showLoginModal = false;
    this.showSignUpModal = true;
    this.clearSignUpForm();
  }

  clearSignUpForm() {
    this.username = '';
    this.surname = '';
    this.signupEmail = '';
    this.signupPassword = '';
    this.role = 'generaluser';
    this.department = '';
    this.signUpErrorMessage = '';
    this.isSigningUp = false;
  }

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.showLoginModal = false;
    } catch (error) {
      console.error('Login failed:', error);
      this.notificationService.showError('Login failed. Please check your credentials.');
    }
  }

  async signUp() {
    if (!this.signupEmail || !this.signupPassword) {
      this.signUpErrorMessage = 'Please fill in all required fields.';
      return;
    }

    this.signUpErrorMessage = '';
    this.isSigningUp = true;

    try {
      await this.authService.createUserAccount(
        this.signupEmail, 
        this.signupPassword, 
        this.role, 
        this.username, 
        this.surname, 
        this.role === 'departmentadmin' ? this.department : ''
      );

      let message = 'Account Created Successfully!';
      let detail = 'Please login with your new credentials.';
      
      if (this.role === 'departmentadmin' || this.role === 'overalladmin') {
        detail = 'Your account requires approval. Please wait for verification before logging in.';
      }

      this.notificationService.showSuccess(message, detail, 5000);
      this.showSignUpModal = false;
      this.openLoginModal();
      
    } catch (error) {
      const firebaseError = error as FirebaseError;
      this.isSigningUp = false;
      if (firebaseError.code === 'auth/email-already-in-use') {
        this.signUpErrorMessage = 'This email address is already registered. Please use a different email or try logging in.';
        this.notificationService.showError(this.signUpErrorMessage, 5000);
        return;
      } else if (firebaseError.code === 'auth/weak-password') {
        this.signUpErrorMessage = 'Password is too weak. Please use at least 6 characters.';
        this.notificationService.showError(this.signUpErrorMessage, 5000);
        return;
      } else if (firebaseError.code === 'auth/invalid-email') {
        this.signUpErrorMessage = 'Please enter a valid email address.';
        this.notificationService.showError(this.signUpErrorMessage, 5000);
        return;
      } else {
        this.signUpErrorMessage = 'An error occurred during sign-up. Please try again.';
        this.notificationService.showError(this.signUpErrorMessage, 5000);
        return;
      }
    } finally {
      this.isSigningUp = false;
    }
  }
}
