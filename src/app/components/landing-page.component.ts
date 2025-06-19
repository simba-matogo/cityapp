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
    <div class="min-h-screen bg-gradient-to-r from-blue-600 to-green-500 flex flex-col items-center justify-center">
      <nav class="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center fixed top-0">
        <div class="flex items-center">
          <img src="assets/city-logo.png" alt="City Logo" class="h-10 w-10 mr-4">
          <h1 class="text-3xl font-bold text-gray-800">Harare City Council</h1>
        </div>
        <button (click)="openLoginModal()" class="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition">Get Started</button>
      </nav>

      <div class="text-center mt-16">
        <h2 class="text-5xl font-extrabold text-white mb-6">Your Voice Matters to Us</h2>
        <p class="text-lg text-white max-w-2xl mx-auto">Empowering Harare residents to make a difference. Submit complaints, track progress, and help us improve our city together.</p>
      </div>

      <div class="mt-12 text-center">
        <h3 class="text-4xl font-bold text-white mb-4">AI-Powered Features</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h4 class="text-xl font-bold text-gray-800 mb-2">Feedback Analysis</h4>
            <p class="text-gray-600">Analyze user feedback to identify trends and improve services.</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h4 class="text-xl font-bold text-gray-800 mb-2">Complaint Classification</h4>
            <p class="text-gray-600">Automatically classify complaints to route them to the correct department.</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h4 class="text-xl font-bold text-gray-800 mb-2">Automated Responses</h4>
            <p class="text-gray-600">Provide instant responses to common queries using AI.</p>
          </div>
        </div>
      </div>

      <!-- Login Modal -->
      <div *ngIf="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-8 w-96">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">Login</h3>
          <form (ngSubmit)="login()">
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" [(ngModel)]="email" name="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" [(ngModel)]="password" name="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            <button type="submit" class="w-full px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition">Login</button>
          </form>
          <div class="mt-4 text-center">
            <a href="#" (click)="openSignUpModal()" class="text-blue-600 hover:underline">Sign Up</a>
            <span class="mx-2">|</span>
            <a href="#" class="text-blue-600 hover:underline">Forgot Password?</a>
          </div>
        </div>
      </div>

      <!-- Sign-Up Modal -->
      <div *ngIf="showSignUpModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-8 w-96">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">Sign Up</h3>
          <form (ngSubmit)="signUp()">
            <div class="mb-4">
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" id="username" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="mb-4">
              <label for="surname" class="block text-sm font-medium text-gray-700">Surname</label>
              <input type="text" id="surname" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" [(ngModel)]="email" name="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" [(ngModel)]="password" name="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            <div class="mb-4">
              <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
              <select id="role" [(ngModel)]="role" name="role" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="generaluser">General User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Sign Up</button>
          </form>
          <div class="mt-4 text-center">
            <a href="#" (click)="openLoginModal()" class="text-blue-600 hover:underline">Back to Login</a>
          </div>
          <div *ngIf="signUpErrorMessage" class="mt-4 text-red-600 text-center">
            {{ signUpErrorMessage }}
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
