import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { Complaint } from '../models/complaint.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-general-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-white" [ngClass]="{'dark': isDarkMode}">
      <!-- Modern Navbar -->
      <nav class="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-3">
              <img src="/city.png" alt="City Logo" class="h-10 w-10 object-contain">
              <div class="flex flex-col">
                <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Harare City Portal</span>
                <span class="text-xs text-slate-500 dark:text-slate-400">General User Dashboard</span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <!-- Theme Toggle -->
              <button (click)="toggleDarkMode()" class="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition" [title]="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
              
              <!-- Notifications -->
              <button class="relative p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">{{totalUsersCount || 0}}</span>
              </button>
              <!-- User Menu -->
              <div class="relative group">
                <button class="flex items-center gap-2 p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-800 transition">
                  <span class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                    {{userName[0]}}
                  </span>
                  <span class="hidden sm:block font-medium text-slate-700 dark:text-white">{{userName}}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 invisible group-hover:visible transition-all">
                  <div class="p-3 border-b border-slate-200 dark:border-slate-700">
                    <p class="text-sm font-medium text-slate-700 dark:text-white">{{userName}}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Citizen</p>
                  </div>
                  <div class="p-2">
                    <button class="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition">Profile Settings</button>
                    <button class="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition">Help Center</button>
                    <button (click)="logout()" class="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Dashboard Overview -->
            <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-6">
              <div class="flex items-center mb-4">
                <span class="bg-blue-100 text-blue-600 rounded-full p-2 mr-2 flex items-center justify-center">
                  <!-- Dashboard/Analytics Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="9" y2="15"/>
                    <line x1="15" y1="9" x2="15" y2="15"/>
                    <line x1="9" y1="12" x2="15" y2="12"/>
                  </svg>
                </span>
                <h2 class="text-lg font-semibold text-slate-800">Dashboard Overview</h2>
              </div>
              <!-- Quick Stats Summary -->
              <div class="mb-3 grid grid-cols-1 gap-1">
                <div class="flex items-center text-[10px] text-slate-700 bg-slate-50/60 rounded px-2 py-1">
                  <span class="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                  <span class="truncate">Resolution rate: 85% this month</span>
                </div>
                <div class="flex items-center text-[10px] text-slate-700 bg-slate-50/60 rounded px-2 py-1">
                  <span class="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                  <span class="truncate">Most active department: Public Works</span>
                </div>
              </div>
              <!-- Status Cards -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-1">
                <div class="bg-blue-500 rounded-md border border-blue-600 px-1 py-0.5">
                  <div class="flex items-center justify-center gap-1">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </div>
                    <div class="flex flex-col items-center text-center">
                      <p class="text-[8px] font-bold text-white leading-tight">Total</p>
                      <p class="text-xs font-extrabold text-white leading-none">{{totalComplaints}}</p>
                    </div>
                  </div>
                </div>
                <div class="bg-blue-500 rounded-md border border-blue-600 px-1 py-0.5">
                  <div class="flex items-center justify-center gap-1">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex flex-col items-center text-center">
                      <p class="text-[8px] font-bold text-white leading-tight">Resolved</p>
                      <p class="text-xs font-extrabold text-white leading-none">{{resolvedComplaints}}</p>
                    </div>
                  </div>
                </div>
                <div class="bg-blue-500 rounded-md border border-blue-600 px-1 py-0.5">
                  <div class="flex items-center justify-center gap-1">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex flex-col items-center text-center">
                      <p class="text-[8px] font-bold text-white leading-tight">Pending</p>
                      <p class="text-xs font-extrabold text-white leading-none">{{pendingComplaints}}</p>
                    </div>
                  </div>
                </div>
                <div class="bg-blue-500 rounded-md border border-blue-600 px-1 py-0.5">
                  <div class="flex items-center justify-center gap-1">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-red-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex flex-col items-center text-center">
                      <p class="text-[8px] font-bold text-white leading-tight">Overdue</p>
                      <p class="text-xs font-extrabold text-white leading-none">{{overdueComplaints}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- My Complaints -->
            <div class="bg-white/80 backdrop-blur rounded-xl border border-slate-100 shadow p-4 flex flex-col">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <span class="bg-blue-100 text-blue-600 rounded-full p-2 mr-2 flex items-center justify-center">
                    <!-- Complaints Icon: Chat Bubble with Exclamation -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="#2563eb" stroke-width="2">
                      <path d="M21 12c0 3.866-3.582 7-8 7-1.07 0-2.09-.14-3-.4L3 20l1.4-3.6C3.52 15.02 3 13.56 3 12c0-3.866 3.582-7 8-7s8 3.134 8 7z" stroke="#2563eb" stroke-width="2" fill="#dbeafe"/>
                      <circle cx="12" cy="12" r="1.2" fill="#2563eb"/>
                      <rect x="11.25" y="8" width="1.5" height="3.2" rx="0.75" fill="#2563eb"/>
                    </svg>
                  </span>
                  <h3 class="text-lg font-extrabold tracking-tight text-blue-700 ml-1">My Complaints</h3>
                </div>
                <div class="flex gap-2">
                  <button (click)="openComplaintModal()" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition">
                    Launch
                  </button>
                  <button (click)="refreshComplaints()" class="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-xs font-semibold transition">
                    Refresh
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-3">
                <div *ngIf="loading" class="text-center text-slate-500 py-4">
                  Loading complaints...
                </div>
                <div *ngIf="!loading && complaints.length === 0" class="text-center text-slate-500 py-4">
                  No complaints found. Submit your first complaint to get started.
                </div>
                <!-- Complaint Cards -->
                <div class="bg-slate-50/80 rounded p-3 flex flex-col gap-2 border border-slate-100 hover:shadow-lg transition group" 
                     *ngFor="let complaint of (showAllComplaints ? complaints : complaints.slice(0, 2))">
                  <div class="flex items-center justify-between">
                    <div class="font-semibold text-slate-700">{{ complaint.title }}</div>
                    <span class="text-xs rounded px-2 py-0.5" 
                          [ngClass]="{
                            'text-yellow-600 bg-yellow-100': getComplaintStatus(complaint) === 'New' || getComplaintStatus(complaint) === 'Pending', 
                            'text-green-600 bg-green-100': getComplaintStatus(complaint) === 'Resolved', 
                            'text-blue-600 bg-blue-100': getComplaintStatus(complaint) === 'In Progress',
                            'text-red-600 bg-red-100': getComplaintStatus(complaint) === 'Overdue'
                          }">
                      {{ getComplaintStatus(complaint) }}
                    </span>
                  </div>
                  <div class="text-xs text-slate-500 mb-1">
                    {{complaint.dates.created | date:"MMM d, y 'at' h:mm a"}} • #{{complaint.id || 'C-' + (complaints.indexOf(complaint) + 1).toString().padStart(3, '0')}}
                  </div>
                  <div class="text-sm text-slate-600 mb-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    {{complaint.description}}
                  </div>
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-full h-2 bg-slate-200 rounded">
                      <div class="h-2 bg-blue-500 rounded" [style.width.%]="getProgress(complaint)"></div>
                    </div>
                    <span class="text-[10px] text-slate-400">{{ getProgress(complaint) }}%</span>
                  </div>
                  <div class="flex gap-2 mt-1 flex-wrap">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{complaint.department | titlecase}}
                    </span>
                    <span *ngIf="complaint.category" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {{complaint.category}}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex justify-end mt-2">
                <button (click)="showAllComplaints = !showAllComplaints" class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition">
                  {{ showAllComplaints ? 'View Less' : 'View All' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-8">
            <!-- City Updates -->
            <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-6">
              <div class="flex items-center mb-4">
                <span class="bg-blue-100 text-blue-600 rounded-full p-2 mr-3 flex items-center justify-center">
                  <!-- City Updates Icon: Megaphone/Announcement -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 11v3a1 1 0 0 0 1 1h1l4 4V7l-4 4H4a1 1 0 0 0-1 1z"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </svg>
                </span>
                <h2 class="text-lg font-bold text-slate-800 tracking-wide">City Updates</h2>
              </div>
              <!-- Compact Update Items in Grid -->
              <div class="grid grid-cols-1 gap-1">
                <div *ngIf="announcements.length === 0" class="text-center text-xs text-slate-500 py-4">
                  No city updates available at this time.
                </div>
                <div *ngFor="let announcement of announcements" class="flex items-center text-[10px] text-slate-700 bg-slate-50/60 rounded px-2 py-1">
                  <span class="inline-block w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0"
                        [ngClass]="{
                          'bg-blue-500': announcement.type === 'info',
                          'bg-amber-500': announcement.type === 'warning',
                          'bg-green-500': announcement.type === 'success',
                          'bg-red-500': announcement.type === 'alert'
                        }"></span>
                  <span class="truncate">{{announcement.message || announcement.title}}</span>
                </div>
              </div>
            </div>

            <!-- Ask AI Assistant -->
            <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-6 flex flex-col items-center justify-center">
              <div class="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 15s1.5 2 4 2 4-2 4-2" />
                  <path d="M9 9h.01M15 9h.01" />
                </svg>
                <h2 class="font-semibold text-slate-700 text-lg">AI Assistant</h2>
              </div>
              <p class="text-sm text-slate-600 text-center mb-4">Get instant help with your complaints and city services</p>
              <button class="px-4 py-2 bg-purple-600 text-white rounded text-sm font-semibold hover:bg-purple-700 transition">Ask AI</button>
            </div>
          </div>
        </div>
      </main>

      <!-- Modern Footer -->
      <footer class="bg-slate-900 text-slate-400 py-12 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Contact Us</h3>
              <div class="space-y-2">
                <p class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 012 2z" />
                  </svg>
                  <a href="mailto:info&#64;hararecity.gov.zw" class="hover:text-white transition">info&#64;hararecity.gov.zw</a>
                </p>
                <p class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+263-4-753777" class="hover:text-white transition">+263-4-753777</a>
                </p>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div class="space-y-2">
                <a href="#" class="block hover:text-white transition">About Us</a>
                <a href="#" class="block hover:text-white transition">Services</a>
                <a href="#" class="block hover:text-white transition">FAQ</a>
                <a href="#" class="block hover:text-white transition">Privacy Policy</a>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Emergency Contacts</h3>
              <div class="space-y-2">
                <p class="flex items-center gap-2">
                  <span class="text-red-500">Emergency:</span>
                  <a href="tel:999" class="hover:text-white transition">999</a>
                </p>
                <p class="flex items-center gap-2">
                  <span class="text-yellow-500">Fire Brigade:</span>
                  <a href="tel:994" class="hover:text-white transition">994</a>
                </p>
              </div>
            </div>
          </div>
          <div class="mt-8 pt-8 border-t border-slate-800 text-center">
            <p>&copy; 2025 Harare City Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <!-- Complaint Modal -->
      <div *ngIf="showComplaintModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
        <div class="bg-white bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-3 w-72 max-w-[90vw] max-h-[90vh] overflow-y-auto relative">
          <!-- Exit button -->
          <button (click)="closeComplaintModal()" class="absolute top-1 right-1 text-gray-500 hover:text-gray-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Header Icon -->
          <div class="flex flex-col items-center justify-center mb-2">
            <div class="bg-blue-100 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
              </svg>
            </div>
            <h3 class="text-md font-bold mt-2 text-slate-700">Submit New Complaint</h3>
          </div>
          
          <form #complaintForm="ngForm" (ngSubmit)="submitComplaint()">
            <!-- Title -->
            <div class="mb-1.5">
              <label for="title" class="block text-xs font-medium text-gray-700">Title</label>
              <input 
                type="text" 
                id="title"
                [(ngModel)]="newComplaint.title" 
                name="title"
                required
                class="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Brief description of the issue"
              >
              <div *ngIf="formErrors['title']" class="text-red-500 text-xs mt-0.5">This field is required</div>
            </div>

            <!-- Department -->
            <div class="mb-1.5">
              <label for="department" class="block text-xs font-medium text-gray-700">Department</label>
              <select 
                id="department"
                [(ngModel)]="newComplaint.department" 
                name="department"
                required
                class="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                
                <option value="water-sanitation">Water & Sanitation</option>
                <option value="roads-transport">Roads & Transport</option>
               
                <option value="environment">Waste Management</option>
                
              </select>
              <div *ngIf="formErrors['department']" class="text-red-500 text-xs mt-0.5">This field is required</div>
            </div>

            
            <!-- Priority -->
            <div class="mb-1.5">
              <label for="priority" class="block text-xs font-medium text-gray-700">Priority</label>
              <select 
                id="priority"
                [(ngModel)]="newComplaint.priority" 
                name="priority"
                required
                class="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <div *ngIf="formErrors['priority']" class="text-red-500 text-xs mt-0.5">This field is required</div>
            </div>

            <!-- Description -->
            <div class="mb-1.5">
              <label for="description" class="block text-xs font-medium text-gray-700">Description</label>
              <textarea 
                id="description"
                [(ngModel)]="newComplaint.description" 
                name="description"
                required
                rows="2"
                class="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                placeholder="Provide detailed information"
              ></textarea>
              <div *ngIf="formErrors['description']" class="text-red-500 text-xs mt-0.5">This field is required</div>
            </div>

            <!-- Location -->
            <div class="mb-1.5">
              <label for="location" class="block text-xs font-medium text-gray-700">Location</label>
              <input 
                type="text" 
                id="location"
                [(ngModel)]="locationAddress" 
                name="location"
                class="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Street address or landmark"
              >
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="submittingComplaint || !complaintForm.valid"
              class="w-full mt-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs rounded-md shadow hover:shadow-md hover:scale-[1.02] transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span *ngIf="!submittingComplaint">Submit Complaint</span>
              <span *ngIf="submittingComplaint" class="flex items-center justify-center gap-1">
                <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            </button>
          </form>
          
          <!-- Footer Note -->
          <div class="mt-1 text-center">
            <p class="text-[10px] text-gray-600">All complaints will be reviewed promptly</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `
})
export class GeneralUserDashboardComponent implements OnInit {
  // User data
  userName: string = '';
  email: string = '';
  
  // Complaint stats
  complaints: Complaint[] = [];
  totalComplaints: number = 0;
  resolvedComplaints: number = 0;
  pendingComplaints: number = 0;
  overdueComplaints: number = 0;
  previousTotal: number = 0;

  // Performance metrics
  averageResponseTime: number = 0;
  isResponseTimeImproved: boolean = false;
  responseTimeChange: number = 0;
  satisfactionRate: number = 0;
  isSatisfactionImproved: boolean = false;
  satisfactionChange: number = 0;
  efficiencyScore: number = 0;
  isEfficiencyImproved: boolean = false;
  efficiencyChange: number = 0;

  // View states
  showAllComplaints: boolean = false;

  // Activity and notifications
  activityFeed: any[] = [];
  notifications: any[] = [];
  announcements: any[] = [];

  // New complaint form
  newComplaint: Partial<Complaint> = {};
  showComplaintModal: boolean = false;
  submittingComplaint: boolean = false;
  formErrors: { [key: string]: boolean } = {};
  locationAddress: string = '';

  // Loading and error states
  loading: boolean = true;
  error: string | null = null;

  // Additional properties
  totalUsersCount: number = 0;
  isDarkMode: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private themeService: ThemeService
  ) {}

  async ngOnInit() {
    await this.getCurrentUserInfo();
    await this.loadComplaints();
    await this.loadAnnouncements();
    this.updateComplaintStats();
    this.activityFeed = [
      { message: 'Complaint #C-7829 updated', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { message: 'Complaint #C-7651 resolved', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { message: 'Submitted new complaint', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
    ];
    await this.loadAnnouncements();
    
    // Subscribe to dark mode changes
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      this.cdr.detectChanges();
    });
    
    // Subscribe to total user count
    this.userService.getTotalUserCount().subscribe(count => {
      this.totalUsersCount = count;
      this.cdr.detectChanges();
    });
  }

  async getCurrentUserInfo() {
    const currentUser = this.authService.auth.currentUser;
    if (currentUser && currentUser.uid) {
      const userDoc: any = await this.firebaseService.getDocument('users', currentUser.uid);
      if (userDoc && userDoc.name) {
        this.userName = userDoc.name + (userDoc.surname ? ' ' + userDoc.surname : '');
      } else if (currentUser.email) {
        // fallback to email prefix
        const emailName = currentUser.email.split('@')[0];
        this.userName = emailName.replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      }
    }
  }

  async loadComplaints() {
    try {
      const currentUser = this.authService.auth.currentUser;
      if (!currentUser) {
        this.error = 'User not authenticated';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }
      const complaints = await this.firebaseService.getCollection('complaints');
      this.complaints = complaints.filter((complaint: any) => complaint.submittedBy?.email === currentUser.email)
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
        
      // Sort complaints by creation date (newest first)
      this.complaints.sort((a, b) => {
        const dateA = new Date(a.dates.created).getTime();
        const dateB = new Date(b.dates.created).getTime();
        return dateB - dateA; // Descending order (newest first)
      });
      
      this.loading = false;
      this.updateComplaintStats();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading complaints:', error);
      this.error = 'Failed to load complaints';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadAnnouncements() {
    try {
      // Get announcements from Firebase
      const announcementsData = await this.firebaseService.getCollection('announcements');
      if (Array.isArray(announcementsData) && announcementsData.length > 0) {
        this.announcements = announcementsData
          .map((announcement: any) => ({
            id: announcement.id || '',
            title: announcement.title || '',
            message: announcement.message || '',
            date: announcement.date || new Date().toISOString(),
            type: announcement.type || 'info',
            postedBy: announcement.postedBy || '',
            department: announcement.department || ''
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first
      } else {
        this.announcements = []; // Empty array if no announcements found
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
      this.announcements = []; // Reset to empty array on error
    }
  }

  updateComplaintStats() {
    this.totalComplaints = this.complaints.length;
    this.resolvedComplaints = this.complaints.filter(c => this.getComplaintStatus(c) === 'Resolved').length;
    this.pendingComplaints = this.complaints.filter(c => {
      const status = this.getComplaintStatus(c);
      return status === 'Pending' || status === 'In Progress';
    }).length;
    this.overdueComplaints = this.complaints.filter(c => this.getComplaintStatus(c) === 'Overdue').length;
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
    this.cdr.detectChanges();
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
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
        
        // Close the modal
        this.showComplaintModal = false;
        this.cdr.detectChanges();
        
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
        this.cdr.detectChanges();
        throw error; // Re-throw to be handled by outer catch
      }
    } catch (error: any) {
      console.error('Error in complaint submission process:', error);
      this.error = error.message || 'Failed to submit complaint. Please try again.';
      this.submittingComplaint = false;
      this.cdr.detectChanges();
    } finally {
      // This will be called when submission finishes, but refreshComplaints may still be ongoing
      // Set a safety timeout to ensure submitting flag is reset in case of any unexpected issues
      setTimeout(() => {
        if (this.submittingComplaint) {
          console.log('Submission state was still loading after timeout, forcing reset');
          this.submittingComplaint = false;
          this.cdr.detectChanges();
        }
      }, 3000); // Force UI to update after 3 seconds if stuck
    }
  }
  
  // Special method to ensure proper notification display
  async submitAndNotify() {
    this.submittingComplaint = true;
    this.cdr.detectChanges();
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
      this.cdr.detectChanges();
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
      this.cdr.detectChanges();
      setTimeout(() => {
        this.showComplaintModal = false;
        this.cdr.detectChanges();
      }, 3000);
      this.refreshComplaints();
    } catch (error) {
      this.submittingComplaint = false;
      this.cdr.detectChanges();
      const errMsg = (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error);
      this.notificationService.showError(`Failed to submit complaint: ${errMsg || 'Unknown error'}`);
      this.error = `Failed to submit: ${errMsg || 'Unknown error'}`;
    }
  }
  
  // Separate method to refresh complaints to avoid blocking UI
  async refreshComplaints() {
    try {
      this.loading = true;
      this.cdr.detectChanges();
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
          
        // Sort complaints by creation date (newest first)
        this.complaints.sort((a, b) => {
          const dateA = new Date(a.dates.created).getTime();
          const dateB = new Date(b.dates.created).getTime();
          return dateB - dateA; // Descending order (newest first)
        });
      }
    } catch (error: any) {
      console.error('Error refreshing complaints:', error);
      this.error = error.message || 'Failed to refresh complaints.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
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

  // Compute a fake resolution rate based on status for UI purposes
  getResolutionRate(complaint: Complaint): number {
    const status = this.getComplaintStatus(complaint);
    if (status === 'Resolved') return 100;
    if (status === 'In Progress') return 60;
    if (status === 'Pending') return 30;
    return 10;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }



  getProgress(complaint: Complaint): number {
    // Example: Resolved = 100, In Progress = 60, New = 20, Overdue = 80
    const status = this.getComplaintStatus(complaint);
    if (status === 'Resolved') return 100;
    if (status === 'In Progress') return 60;
    if (status === 'Overdue') return 80;
    return 20;
  }

  // Administrative action methods
  manageUsers() {
    // Implement user management logic
    console.log('Managing users...');
  }

  manageDepartments() {
    // Implement department management logic
    console.log('Managing departments...');
  }

  viewAnalytics() {
    // Implement analytics view logic
    console.log('Viewing analytics...');
  }

  manageRoles() {
    // Implement role management logic
    console.log('Managing roles...');
  }

  viewReports() {
    // Implement reports view logic
    console.log('Viewing reports...');
  }

  systemSettings() {
    // Implement settings management logic
    console.log('Managing system settings...');
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  getPercentageChange(current: number, previous: number): number {
    return Math.round(((current - previous) / previous) * 100);
  }

  getProgressPercentage(value: number): number {
    return Math.min((value / 200) * 100, 100);
  }

  getResolvedPercentage(): number {
    return Math.round((this.resolvedComplaints / this.totalComplaints) * 100);
  }

  getPendingPercentage(): number {
    return Math.round((this.pendingComplaints / this.totalComplaints) * 100);
  }

  getResponseTimeScore(): number {
    // Lower is better for response time, so we invert the percentage
    return Math.max(100 - (this.averageResponseTime / 48) * 100, 0);
  }

  getEfficiencyPercentage(): number {
    return (this.efficiencyScore / 10) * 100;
  }
}