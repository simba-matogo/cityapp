import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { Complaint } from '../models/complaint.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col">
      <!-- Navbar -->
      <nav class="w-full bg-white text-slate-800 py-4 px-6 flex justify-between items-center shadow">
        <div class="flex items-center">
          <img src="/city.png" alt="City Logo" class="h-8 w-8 mr-3">
          <span class="text-lg font-bold tracking-wide">Harare City Portal</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative group cursor-pointer">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4" />
              </svg>
              <span class="font-semibold">{{ userName }}</span>
            </div>
            <div class="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
              <button (click)="logout()" class="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-800">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col items-center pt-28 pb-8 px-2">
        <!-- Dashboard Title -->
        <div class="w-full max-w-5xl mb-6 mt-2 text-center">
          <h2 class="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 drop-shadow-lg mb-2 leading-tight">
            Your citizen dashboard
          </h2>
          <div class="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 drop-shadow-lg mb-2 leading-tight">
            for managing complaints
          </div>
        </div>        <!-- Stats Overview -->
        <div class="w-full max-w-5xl grid grid-cols-4 gap-1 mb-4">          <div class="bg-white rounded-2xl shadow flex items-center border border-slate-100 w-full min-w-0 h-8">
            <div class="flex items-center justify-between w-full pl-1 pr-1">              <div class="bg-blue-100 text-blue-600 rounded-full h-3.5 w-3.5 flex items-center justify-center flex-shrink-0">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-2.5 w-2.5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>
              </div>
              <span class="text-xs font-extrabold text-slate-800 truncate ml-0 flex-grow text-center">Active</span>
              <span class="text-xs font-extrabold text-blue-600 tabular-nums flex-shrink-0">3</span>
            </div>
          </div>          <div class="bg-white rounded-2xl shadow flex items-center border border-slate-100 w-full min-w-0 h-8">
            <div class="flex items-center justify-between w-full pl-1 pr-1">              <div class="bg-green-100 text-green-600 rounded-full h-3.5 w-3.5 flex items-center justify-center flex-shrink-0">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-2.5 w-2.5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'/></svg>
              </div>
              <span class="text-xs font-extrabold text-slate-800 truncate ml-0 flex-grow text-center">Resolved</span>
              <span class="text-xs font-extrabold text-blue-600 tabular-nums flex-shrink-0">2</span>
            </div>
          </div>          <div class="bg-white rounded-2xl shadow flex items-center border border-slate-100 w-full min-w-0 h-8">
            <div class="flex items-center justify-between w-full pl-1 pr-1">              <div class="bg-yellow-100 text-yellow-600 rounded-full h-3.5 w-3.5 flex items-center justify-center flex-shrink-0">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-2.5 w-2.5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'/></svg>
              </div>
              <span class="text-xs font-extrabold text-slate-800 truncate ml-0 flex-grow text-center">Alerts</span>
              <span class="text-xs font-extrabold text-blue-600 tabular-nums flex-shrink-0">5</span>
            </div>
          </div>          <div class="bg-white rounded-2xl shadow flex items-center border border-slate-100 w-full min-w-0 h-8">
            <div class="flex items-center justify-between w-full pl-1 pr-1">              <div class="bg-purple-100 text-purple-600 rounded-full h-3.5 w-3.5 flex items-center justify-center flex-shrink-0">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-2.5 w-2.5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>
              </div>
              <span class="text-xs font-extrabold text-slate-800 truncate ml-0 flex-grow text-center">Response</span>
              <span class="text-xs font-extrabold text-blue-600 tabular-nums flex-shrink-0">2d</span>
            </div>
          </div>
        </div>

        <!-- Main Cards Section -->
        <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- My Complaints -->          <div class="bg-white rounded-xl border border-slate-100 shadow p-6 col-span-1 md:col-span-2 w-full">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <span class="inline-block bg-yellow-100 text-yellow-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3'/></svg></span>
                <h3 class="text-sm font-semibold text-slate-800">My Complaints</h3>
              </div>
              <button (click)="openComplaintModal()" class="flex items-center bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1 px-3 rounded-full transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New
              </button>
            </div>
            <div *ngIf="loading" class="text-center text-slate-500 py-4 text-xs">Loading complaints...</div>
            <div *ngIf="error" class="text-center text-red-500 py-4 text-xs">{{ error }}</div>
            <div *ngIf="!loading && !error && complaints.length === 0" class="text-center text-slate-400 py-4 text-xs">No complaints found.</div>
            <div class="space-y-2" *ngIf="!loading && !error && complaints.length > 0">
              <div *ngFor="let complaint of (showAllComplaints ? complaints : complaints.slice(-2))" class="bg-slate-50 rounded p-3 flex flex-col md:flex-row md:items-center justify-between border border-slate-100">
                <div class="flex flex-col md:flex-row md:items-center mb-1 md:mb-0 gap-2">
                  <span class="inline-block rounded-full p-1"
                    [ngClass]="{
                      'bg-green-100 text-green-600': complaint.status === 'Resolved',
                      'bg-yellow-100 text-yellow-600': complaint.status === 'PendingReview',
                      'bg-blue-100 text-blue-600': complaint.status === 'InProgress'
                    }">
                    <svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
                      <circle cx='12' cy='12' r='10'/>
                    </svg>
                  </span>
                  <div class="text-xs break-words">
                    <div class="font-bold text-slate-800">{{ complaint.title }}</div>
                    <div class="text-slate-600">{{ complaint.description }}</div>
                    <div class="text-slate-400 mt-1">Submitted: {{ complaint.dates.created | date:'mediumDate' }}</div>
                    <div class="text-slate-500 mt-1">Department: {{ complaint.department }}</div>
                  </div>
                </div>
                <div class="flex flex-col items-end mt-2 md:mt-0">
                  <span class="px-3 py-1 rounded-full font-semibold text-xs mb-1"
                    [ngClass]="{
                      'bg-yellow-400 text-white': getComplaintStatus(complaint) === 'In Progress' || getComplaintStatus(complaint) === 'Pending',
                      'bg-green-400 text-white': getComplaintStatus(complaint) === 'Resolved',
                      'bg-purple-400 text-white': getComplaintStatus(complaint) === 'Reopened',
                      'bg-blue-400 text-white': getComplaintStatus(complaint) === 'New',
                      'bg-gray-300 text-gray-700': getComplaintStatus(complaint) === 'Closed' || getComplaintStatus(complaint) === 'Assigned'
                    }">
                    {{ getComplaintStatus(complaint) }}
                  </span>
                  <span class="text-xs text-slate-400 break-words">ID: {{ complaint.id }}</span>
                </div>
              </div>
            </div>
            <div class="text-center mt-4">
              <button *ngIf="!showAllComplaints" (click)="toggleComplaintsView()" class="px-3 py-1 border border-blue-600 text-blue-600 rounded text-xs font-semibold hover:bg-blue-50">View All</button>
              <button *ngIf="showAllComplaints" (click)="toggleComplaintsView()" class="px-3 py-1 border border-blue-600 text-blue-600 rounded text-xs font-semibold hover:bg-blue-50">View Less</button>
            </div>
          </div>
        </div>

        <!-- Lower Section: Notifications & Quick Access -->
        <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Notifications -->
          <div class="bg-white rounded-xl border border-slate-100 shadow p-6 flex flex-col">
            <div class="flex items-center mb-2">
              <span class="inline-block bg-yellow-100 text-yellow-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'/></svg></span>
              <h3 class="text-base font-semibold text-slate-800">Notifications</h3>
            </div>
            <div class="space-y-2">
              <div class="bg-slate-50 rounded p-3 flex items-start border border-slate-100">
                <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-1 mr-2 mt-1"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/></svg></span>
                <div>
                  <p class="text-sm text-slate-800 font-semibold">Your complaint #C-7829 has been updated</p>
                  <p class="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div class="bg-slate-50 rounded p-3 flex items-start border border-slate-100">
                <span class="inline-block bg-green-100 text-green-600 rounded-full p-1 mr-2 mt-1"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M5 13l4 4L19 7'/></svg></span>
                <div>
                  <p class="text-sm text-slate-800 font-semibold">Your complaint #C-7651 has been resolved</p>
                  <p class="text-xs text-slate-500">1 day ago</p>
                </div>
              </div>
              <div class="bg-slate-50 rounded p-3 flex items-start border border-slate-100">
                <span class="inline-block bg-purple-100 text-purple-600 rounded-full p-1 mr-2 mt-1"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M7 8h10'/></svg></span>
                <div>
                  <p class="text-sm text-slate-800 font-semibold">City water maintenance scheduled</p>
                  <p class="text-xs text-slate-500">2 days ago</p>
                </div>
              </div>
              <button class="w-full text-center text-blue-600 py-1 hover:underline mt-1 text-xs">View All Notifications</button>
            </div>
          </div>
          <!-- Quick Access -->
          <div class="bg-white rounded-xl border border-slate-100 shadow p-6 flex flex-col">
            <div class="flex items-center mb-2">
              <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M5 3v4c0 1.1.9 2 2 2h10a2 2 0 002-2V3M5 3h14M9 14h6m-3-3v6'/></svg></span>
              <h3 class="text-base font-semibold text-slate-800">Quick Access</h3>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button class="bg-slate-50 hover:bg-blue-50 transition rounded p-3 border border-slate-100 flex flex-col items-center shadow">
                <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-1 mb-1"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z'/></svg></span>
                <span class="text-xs text-slate-800 font-semibold">Billing</span>
              </button>
              <button class="bg-slate-50 hover:bg-blue-50 transition rounded p-3 border border-slate-100 flex flex-col items-center shadow">
                <span class="inline-block bg-yellow-100 text-yellow-600 rounded-full p-1 mb-1"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/></svg></span>
                <span class="text-xs text-slate-800 font-semibold">Events</span>
              </button>
              <button class="bg-slate-50 hover:bg-blue-50 transition rounded p-3 border border-slate-100 flex flex-col items-center shadow">
                <span class="inline-block bg-green-100 text-green-600 rounded-full p-1 mb-1"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'/></svg></span>
                <span class="text-xs text-slate-800 font-semibold">Services</span>
              </button>
              <button class="bg-slate-50 hover:bg-blue-50 transition rounded p-3 border border-slate-100 flex flex-col items-center shadow">
                <span class="inline-block bg-purple-100 text-purple-600 rounded-full p-1 mb-1"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'/></svg></span>
                <span class="text-xs text-slate-800 font-semibold">Messages</span>              </button>
            </div>
          </div>
        </div>
      </div>      <!-- Footer -->        <footer class="w-full bg-slate-800 text-slate-200 border-t border-slate-700 py-3 px-6 text-center text-xs">
        <p>© 2025 Harare City Portal. All rights reserved.</p>
      </footer>
      
      <!-- Complaint Submission Modal -->
      <div *ngIf="showComplaintModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg max-w-sm w-full relative overflow-y-auto max-h-[108vh]">
          <button (click)="closeComplaintModal()" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>          <div class="flex justify-center mt-4 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          
          <h3 class="text-xl font-bold mb-3 text-gray-800 text-center">Submit New Complaint</h3>
            <form class="px-4 py-2">
            <div class="mb-3">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" id="title" [(ngModel)]="newComplaint.title" name="title" 
                [ngClass]="{'border-red-500 focus:ring-red-500': formErrors['title']}"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                placeholder="Enter a brief title" required>
              <p *ngIf="formErrors['title']" class="text-red-500 text-xs mt-0.5">Title is required</p>
            </div>
              <div class="mb-3">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-0.5">Description *</label>
              <textarea id="description" [(ngModel)]="newComplaint.description" name="description" rows="3" 
                [ngClass]="{'border-red-500 focus:ring-red-500': formErrors['description']}"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                placeholder="Provide details about your complaint" required></textarea>
              <p *ngIf="formErrors['description']" class="text-red-500 text-xs mt-0.5">Description is required</p>
            </div>            <div class="mb-3">
              <label for="department" class="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <select id="department" [(ngModel)]="newComplaint.department" name="department" 
                class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                <option value="water">Water & Sanitation</option>
                <option value="roads">Roads & Infrastructure</option>
                <option value="wastemanagement">Waste Management</option>
                <option value="other">Other</option>
              </select>
            </div>            <div class="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" id="location" [(ngModel)]="locationAddress" name="location" 
                  class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                  placeholder="Enter the location of the issue">
                <p *ngIf="formErrors['location']" class="text-red-500 text-xs mt-0.5">Location is required</p>
              </div>
              
              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select id="priority" [(ngModel)]="newComplaint.priority" name="priority" 
                  class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
              <!-- Submit button similar to signup form -->            <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-xs">
              {{ error }}
            </div>
              <button type="button" (click)="submitAndNotify()" [disabled]="submittingComplaint"
              class="w-full px-3 py-2 mb-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow hover:shadow-md hover:scale-[1.02] transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm font-medium">
              <ng-container *ngIf="submittingComplaint; else submitButtonText">
                <svg class="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </ng-container>
              <ng-template #submitButtonText>Submit Complaint</ng-template>
            </button>
            
            <div class="text-center text-xs text-gray-600 mb-3">
              <p>All complaints will be reviewed promptly</p>
            </div>
          </form>
        </div>
      </div>    </div>
  `,styles: `
    :host {
      display: block;
    }
  `
})
export class GeneralUserDashboardComponent implements OnInit {
  complaints: Complaint[] = [];
  loading = true;
  error: string | null = null;
  showAllComplaints = false;
  showComplaintModal = false;
  submittingComplaint = false;
  formErrors: {[key: string]: boolean} = {};
  userName: string = 'User';
  
  newComplaint: Partial<Complaint> = {
    title: '',
    description: '',
    department: 'other',
    category: '',
    location: {
      address: ''
    },
    priority: 'Medium',
    status: 'New',
    dates: {
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  };
  constructor(
    private firebaseService: FirebaseService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}
  async ngOnInit() {
    // Get current user information
    this.getCurrentUserInfo();
    
    // Load complaints
    await this.loadComplaints();
  }

  private getCurrentUserInfo() {
    const currentUser = this.authService.auth.currentUser;
    if (currentUser && currentUser.email) {
      // Extract name from email (everything before @)
      const emailName = currentUser.email.split('@')[0];
      // Capitalize first letter and replace dots/underscores with spaces
      this.userName = emailName
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
    }
  }

  async loadComplaints() {
    try {
      // Fetch only complaints for the current user (replace 'natasha' with real user id/email)
      const currentUser = this.authService.auth.currentUser;
      if (!currentUser) {
        this.error = 'User not authenticated';
        this.loading = false;
        return;
      }

      const complaints = await this.firebaseService.getCollection('complaints');
      
      // Filter complaints for the current user and map to Complaint interface
      this.complaints = complaints
        .filter((complaint: any) => complaint.submittedBy?.email === currentUser.email)
        .map((complaint: any) => ({
          id: complaint.id || '',
          title: complaint.title || 'Untitled',
          description: complaint.description || '',
          department: complaint.department || 'other',
          category: complaint.category || '',
          location: complaint.location || { address: '' },
          priority: complaint.priority || 'Low',
          status: complaint.status || 'New',
          submittedBy: complaint.submittedBy || { userId: '', name: '', contact: '', email: '' },
          assignedTo: complaint.assignedTo || undefined,
          dates: complaint.dates || { created: '', updated: '' },
          mediaUrls: complaint.mediaUrls || [],
          updates: complaint.updates || [],
          aiAnalysis: complaint.aiAnalysis || undefined,
          publicId: complaint.publicId || '',
          isAnonymous: complaint.isAnonymous || false,
          isPublic: complaint.isPublic ?? false,
          tags: complaint.tags || [],
          votes: complaint.votes || 0
        } as Complaint));
      
      this.loading = false;
    } catch (error) {
      console.error('Error loading complaints:', error);
      this.error = 'Failed to load complaints';
      this.loading = false;
    }
  }
  toggleComplaintsView() {
    this.showAllComplaints = !this.showAllComplaints;
  }
  openComplaintModal() {
    // Reset the new complaint object
    this.newComplaint = {
      title: '',
      description: '',
      department: 'other',
      category: '',
      location: {
        address: ''
      },
      priority: 'Medium',
      status: 'New',
      dates: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
    };
    // Show the modal
    this.showComplaintModal = true;
  }

  closeComplaintModal() {
    this.showComplaintModal = false;
  }

  async submitComplaint() {
    this.error = null; // Clear any previous errors
    try {
      this.submittingComplaint = true; // Start the submission process
      this.formErrors = {}; // Reset form errors
      
      // Basic client-side validation
      if (!this.newComplaint.title || this.newComplaint.title.trim() === '') {
        this.formErrors['title'] = true;
      }
      if (!this.newComplaint.description || this.newComplaint.description.trim() === '') {
        this.formErrors['description'] = true;
      }
      if (!this.locationAddress || this.locationAddress.trim() === '') {
        this.formErrors['location'] = true;
      }
      
      // If there are validation errors, stop the submission
      if (Object.keys(this.formErrors).length > 0) {
        this.submittingComplaint = false;
        return;
      }
      
      console.log('Preparing complaint submission...');

      // Add user information
      const currentUser = this.authService.auth.currentUser;
      this.newComplaint.submittedBy = {
        userId: currentUser?.uid || '',
        name: this.userName,
        contact: '',
        email: currentUser?.email || ''
      };

      // Set dates
      const now = new Date().toISOString();
      this.newComplaint.dates = {
        created: now,
        updated: now
      };

      // Ensure location is properly set
      if (!this.newComplaint.location) {
        this.newComplaint.location = { address: this.locationAddress };
      } else {
        this.newComplaint.location.address = this.locationAddress;
      }

      // Set other defaults
      this.newComplaint.isAnonymous = false;
      this.newComplaint.isPublic = true;
      this.newComplaint.tags = [];
      this.newComplaint.votes = 0;
      
      // Ensure the updates array is initialized
      this.newComplaint.updates = [];      try {
        console.log('Submitting complaint to Firebase...');
        await this.firebaseService.addDocument('complaints', this.newComplaint);
        console.log('Complaint submitted successfully');
        
        // Reset submit button state first
        this.submittingComplaint = false;
        
        // Close the modal
        this.showComplaintModal = false;
        
        // Then show a success notification - this ensures the toast appears after the modal is gone
        setTimeout(() => {
          // Use both methods for maximum compatibility
          this.notificationService.showSuccess('Complaint has been successfully sent');
          console.log('Success notification dispatched');
        }, 100);
        
        // Refresh complaints in the background
        this.refreshComplaints();
      } catch (error: any) {        console.error('Error submitting complaint:', error);
        this.error = `Failed to submit: ${error.message || 'Unknown error'}`;
        
        // Use both notification methods for redundancy
        this.notificationService.showError(`Failed to submit complaint: ${error.message || 'Unknown error'}`);
        this.notificationService.error(`${error.message || 'Unknown error'}`, 'Submission Failed');
        
        this.submittingComplaint = false;
        throw error; // Re-throw to be handled by outer catch
      }
    } catch (error: any) {
      console.error('Error in complaint submission process:', error);
      this.error = error.message || 'Failed to submit complaint. Please try again.';
      this.submittingComplaint = false;    } finally {
      // This will be called when submission finishes, but refreshComplaints may still be ongoing
      // Set a safety timeout to ensure submitting flag is reset in case of any unexpected issues
      setTimeout(() => {
        if (this.submittingComplaint) {
          console.log('Submission state was still loading after timeout, forcing reset');
          this.submittingComplaint = false;
        }
      }, 3000); // Force UI to update after 3 seconds if stuck
    }
  }
  
  // Special method to ensure proper notification display
  async submitAndNotify() {
    try {
      this.submittingComplaint = true;
      this.formErrors = {};
      if (!this.newComplaint.title || this.newComplaint.title.trim() === '') {
        this.formErrors['title'] = true;
      }
      if (!this.newComplaint.description || this.newComplaint.description.trim() === '') {
        this.formErrors['description'] = true;
      }
      if (!this.locationAddress || this.locationAddress.trim() === '') {
        this.formErrors['location'] = true;
      }
      if (Object.keys(this.formErrors).length > 0) {
        this.submittingComplaint = false;
        return;
      }
      const now = new Date().toISOString();
      this.newComplaint.submittedBy = {
        userId: 'user123',
        name: 'natasha',
        contact: '',
        email: ''
      };
      this.newComplaint.dates = { created: now, updated: now };
      this.newComplaint.isAnonymous = false;
      this.newComplaint.isPublic = true;
      this.newComplaint.tags = [];
      this.newComplaint.votes = 0;
      this.newComplaint.updates = [];
      try {
        await this.firebaseService.addDocument('complaints', this.newComplaint);
        this.notificationService.show('Complaint submitted successfully!', 'success', 5000);
        this.submittingComplaint = false;
        setTimeout(() => {
          this.showComplaintModal = false;
        }, 3000);
        this.refreshComplaints();
      } catch (error) {
        this.submittingComplaint = false;
        const errMsg = (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error);
        this.notificationService.showError(`Failed to submit complaint: ${errMsg || 'Unknown error'}`);
        this.error = `Failed to submit: ${errMsg || 'Unknown error'}`;
      }
    } catch (error: any) {
      this.submittingComplaint = false;
      const errMsg = (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error);
      this.notificationService.showError(`Failed to submit complaint: ${errMsg || 'Unknown error'}`);
      this.error = `Failed to submit: ${errMsg || 'Unknown error'}`;
    }
  }
  
  // Separate method to refresh complaints to avoid blocking UI
  private async refreshComplaints() {
    try {
      this.loading = true;
      const allComplaints = await this.firebaseService.getCollection('complaints');
      
      if (Array.isArray(allComplaints)) {
        this.complaints = allComplaints
          .filter((c: any) => c && c.submittedBy?.name === 'natasha')
          .map((c: any) => ({
            id: c.id || '',
            title: c.title || 'Untitled',
            description: c.description || '',
            department: c.department || 'other',
            category: c.category || '',
            location: c.location || { address: '' },
            priority: c.priority || 'Low',
            status: c.status || 'New',
            submittedBy: c.submittedBy || { userId: '', name: '', contact: '', email: '' },
            assignedTo: c.assignedTo || undefined,
            dates: c.dates || { created: '', updated: '' },
            mediaUrls: c.mediaUrls || [],
            updates: c.updates || [],
            aiAnalysis: c.aiAnalysis || undefined,
            publicId: c.publicId || '',
            isAnonymous: c.isAnonymous || false,
            isPublic: c.isPublic ?? false,
            tags: c.tags || [],
            votes: c.votes || 0
          }));
      }
    } catch (error: any) {
      console.error('Error refreshing complaints:', error);
      this.error = error.message || 'Failed to refresh complaints.';
    } finally {
      this.loading = false;
    }
  }

  getComplaintStatus(complaint: Complaint): string {
    const created = new Date(complaint.dates.created).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    if (complaint.status === 'New' && now - created > fiveMinutes) {
      return 'Pending';
    }
    if (complaint.status === 'Resolved') return 'Resolved';
    if (complaint.status === 'InProgress') return 'In Progress';
    if (complaint.status === 'PendingReview') return 'Pending';
    return complaint.status;
  }

  logout() {
    this.authService.logout();
  }

  get locationAddress(): string {
    return this.newComplaint.location?.address || '';
  }

  set locationAddress(value: string) {
    if (!this.newComplaint.location) {
      this.newComplaint.location = { address: '' };
    }
    this.newComplaint.location.address = value;
  }
}