import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Complaint, Status, Priority, Department } from '../models/complaint.model';
import { Announcement } from '../models/announcement.model';
import { AnnouncementService } from '../services/announcement.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-department-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen" [class]="isDarkMode ? 'bg-gray-900' : 'bg-slate-50'">
      <!-- Modern Navbar -->
      <nav class="sticky top-0 z-50 w-full backdrop-blur-lg border-b shadow-sm" 
           [class]="isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-slate-200'">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-14 sm:h-16">
            <div class="flex items-center gap-2 sm:gap-3">
              <img src="/city.png" alt="City Logo" class="h-8 w-8 sm:h-10 sm:w-10 object-contain">
              <div class="flex flex-col">
                <span class="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate max-w-[150px] sm:max-w-none">Harare City Portal</span>
                <span class="text-[10px] sm:text-xs" [class]="isDarkMode ? 'text-gray-400' : 'text-slate-500'">Department Admin</span>
              </div>
            </div>
            <div class="flex items-center gap-2 sm:gap-4">
              <!-- Dark Mode Toggle -->
              <button (click)="toggleDarkMode()" 
                      class="p-1.5 sm:p-2 rounded-lg transition-all duration-200" 
                      [class]="isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'"
                      title="Toggle dark mode">
                <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
              
              <!-- User Menu -->
              <div class="relative group">
                <button class="flex items-center p-1 rounded-full transition bg-white border border-slate-200 shadow-sm hover:bg-slate-100 h-9 w-9">
                  <span class="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-base font-bold text-slate-700 border border-slate-300">
                    {{userName[0]}}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div class="absolute right-0 mt-2 w-60 rounded-xl shadow-lg border border-slate-200 bg-white z-50 invisible group-hover:visible transition-all">
                  <div class="flex flex-col items-center p-5 border-b border-slate-100">
                    <span class="h-14 w-14 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-700 border border-slate-300 mb-2">
                      {{userName[0]}}
                    </span>
                    <div class="font-bold text-slate-800 text-lg">{{userName}}</div>
                    <div class="text-xs text-slate-500 font-medium mt-1">Department Admin - {{department}}</div>
                  </div>
                  <div class="flex flex-col p-3 gap-2">
                    <button class="w-full text-left px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition" (click)="openProfileModal()">Profile Settings</button>
                    <button class="w-full text-left px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition" (click)="showAboutModal = true">About</button>
                    <button (click)="logout()" class="w-full text-left px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Dynamic Department Banner -->
      <div class="border-b" [class]="isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : getDepartmentBannerClass()">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div class="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-center">
            <!-- Department icons animation -->
            <div class="flex items-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" style="animation-delay: 0.2s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" [innerHTML]="getDepartmentIcon()">
              </svg>
            </div>
            
            <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <span class="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent" [innerHTML]="getDepartmentTitle()">
              </span>
              <span class="hidden sm:inline" [class]="isDarkMode ? 'text-gray-500' : 'text-slate-400'">•</span>
              <span class="text-[10px] sm:text-xs flex items-center gap-1" [class]="isDarkMode ? 'text-gray-300' : 'text-slate-600'">
                <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-500 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                <span [innerHTML]="getDepartmentSlogan()"></span>
              </span>
            </div>
            
            <!-- More department icons -->
            <div class="flex items-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" style="animation-delay: 0.8s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" [innerHTML]="getDepartmentIcon()">
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-4 sm:space-y-8">
            <!-- Dashboard Overview -->
            <div class="backdrop-blur rounded-xl border shadow p-3 sm:p-6" 
                 [class]="isDarkMode ? 'bg-gradient-to-br from-gray-800/80 to-gray-700/80 border-gray-600' : 'bg-gradient-to-br from-blue-100/80 to-white/80 border-blue-200'">
              <div class="flex items-center mb-3 sm:mb-4">
                <span class="rounded-full p-1.5 sm:p-2 mr-2 flex items-center justify-center" 
                      [class]="isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="9" y2="15"/>
                    <line x1="15" y1="9" x2="15" y2="15"/>
                    <line x1="9" y1="12" x2="15" y2="12"/>
                  </svg>
                </span>
                <h2 class="text-base sm:text-lg font-semibold truncate" [class]="isDarkMode ? 'text-gray-200' : 'text-slate-800'">Department Overview - {{department}}</h2>
              </div>
              <!-- Status Cards -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2">
                <div class="bg-blue-500 rounded-md border border-blue-600 px-1 py-0.5 sm:px-2 sm:py-1">
                  <div class="flex items-center justify-center gap-1">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </div>
                    <div class="flex flex-col items-center text-center">
                      <p class="text-[8px] sm:text-[10px] font-bold text-white leading-tight">Total</p>
                      <p class="text-xs sm:text-sm font-extrabold text-white leading-none">{{totalComplaints}}</p>
                    </div>
                  </div>
                </div>
                <div class="bg-blue-500 rounded-md border border-blue-600 px-1 py-0.5 sm:px-2 sm:py-1">
                  <div class="flex items-center justify-center gap-1">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex flex-col items-center text-center">
                      <p class="text-[8px] sm:text-[10px] font-bold text-white leading-tight">Resolved</p>
                      <p class="text-xs sm:text-sm font-extrabold text-white leading-none">{{resolvedComplaints}}</p>
                    </div>
                  </div>
                </div>
                <div class="bg-blue-500 rounded-md border border-blue-600 px-1 py-0.5 sm:px-2 sm:py-1">
                  <div class="flex items-center justify-center gap-1">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex flex-col items-center text-center">
                      <p class="text-[8px] sm:text-[10px] font-bold text-white leading-tight">Pending</p>
                      <p class="text-xs sm:text-sm font-extrabold text-white leading-none">{{pendingComplaints}}</p>
                    </div>
                  </div>
                </div>
                <div class="bg-blue-500 rounded-md border border-blue-600 px-1 py-0.5 sm:px-2 sm:py-1">
                  <div class="flex items-center justify-center gap-1">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-red-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex flex-col items-center text-center">
                      <p class="text-[8px] sm:text-[10px] font-bold text-white leading-tight">Overdue</p>
                      <p class="text-xs sm:text-sm font-extrabold text-white leading-none">{{overdueComplaints}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Department Complaints Management -->
            <div class="backdrop-blur rounded-xl border shadow p-3 sm:p-4 flex flex-col" [class]="isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-slate-100'">
              <div class="flex items-center mb-2">
                <span class="bg-blue-100 text-blue-600 rounded-full p-2 mr-2 flex items-center justify-center">
                  <!-- Complaints Icon: Chat Bubble with Exclamation -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="#2563eb" stroke-width="2">
                    <path d="M21 12c0 3.866-3.582 7-8 7-1.07 0-2.09-.14-3-.4L3 20l1.4-3.6C3.52 15.02 3 13.56 3 12c0-3.866 3.582-7 8-7s8 3.134 8 7z" stroke="#2563eb" stroke-width="2" fill="#dbeafe"/>
                    <circle cx="12" cy="12" r="1.2" fill="#2563eb"/>
                    <rect x="11.25" y="8" width="1.5" height="3.2" rx="0.75" fill="#2563eb"/>
                  </svg>
                </span>
                <h3 class="text-lg font-extrabold tracking-tight text-blue-700 ml-1">Department Complaints</h3>
              </div>
              <!-- Scrollable Complaints Container -->
              <div class="max-h-96 overflow-y-auto pr-2">
                <div class="flex flex-col gap-3">
                <div *ngIf="isLoading" class="text-center text-slate-500 py-4">
                  Loading complaints...
                </div>
                <div *ngIf="!isLoading && complaints.length === 0" class="text-center text-slate-500 py-4">
                  No complaints found for this department.
                </div>
                <!-- Complaint Cards -->
                <div class="bg-slate-50/80 rounded p-3 flex flex-col gap-2 border border-slate-100 hover:shadow-lg transition group" 
                     *ngFor="let complaint of complaints">
                  <div class="flex items-center justify-between">
                    <div class="font-semibold text-slate-700">{{ complaint.title }}</div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs rounded px-2 py-0.5" 
                            [ngClass]="getStatusBadgeClass(complaint.status)">
                        {{ formatStatus(complaint.status) }}
                      </span>
                      <span class="text-xs rounded px-2 py-0.5" 
                            [ngClass]="getPriorityBadgeClass(complaint.priority)">
                        {{ complaint.priority }}
                      </span>
                    </div>
                  </div>
                  <div class="text-xs text-slate-500 mb-1">
                    {{complaint.dates.created | date:"MMM d, y 'at' h:mm a"}} • #{{complaint.id || 'C-' + (complaints.indexOf(complaint) + 1).toString().padStart(3, '0')}}
                  </div>
                  <div class="text-sm text-slate-600 mb-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    {{complaint.description}}
                  </div>
                  <div class="flex gap-2 mt-1 flex-wrap">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{complaint.department | titlecase}}
                    </span>
                    <span *ngIf="complaint.category" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {{complaint.category}}
                    </span>
                  </div>
                  <div class="flex gap-2 mt-2">
                    <button class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition" (click)="openReplyModal(complaint)">Reply</button>
                    <button class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition" (click)="openStatusModal(complaint)">Update Status</button>
                    <button class="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition" (click)="openAssignModal(complaint)">Assign</button>
                    <button class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition" (click)="openDetailsModal(complaint)">Details</button>
                  </div>
                </div>
                
                <!-- Empty state when no complaints -->
                <div *ngIf="complaints.length === 0" 
                    class="rounded p-4 sm:p-6 flex flex-col items-center justify-center gap-2 border" 
                    [class]="isDarkMode ? 'bg-gray-700/80 border-gray-600' : 'bg-slate-50/80 border-slate-100'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 sm:h-12 sm:w-12 opacity-30" [class]="isDarkMode ? 'text-gray-500' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                  </svg>
                  <p class="text-center text-sm" [class]="isDarkMode ? 'text-gray-400' : 'text-slate-500'">No complaints found for your department.</p>
                  <button class="px-3 py-1.5 sm:px-4 sm:py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm font-medium transition">
                    Refresh Data
                  </button>
                </div>
              </div>
              
              <!-- Loading template -->
              <ng-template #loadingTemplate>
                <div class="flex justify-center items-center p-6 sm:p-8">
                  <svg class="animate-spin h-6 w-6 sm:h-8 sm:w-8" [class]="isDarkMode ? 'text-blue-400' : 'text-blue-600'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="ml-2 text-sm sm:text-base" [class]="isDarkMode ? 'text-gray-300' : 'text-slate-700'">Loading complaints...</span>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4 sm:space-y-6">
            <!-- Quick Actions -->
            <div class="backdrop-blur rounded-xl border shadow p-3 sm:p-4" 
                 [class]="isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-slate-100'">
              <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4" [class]="isDarkMode ? 'text-gray-200' : 'text-slate-800'">Quick Actions</h3>
              <div class="grid grid-cols-1 gap-2">
                <button (click)="openAnnouncementModal()" class="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition">
                  Create Announcement
                </button>
                <button (click)="generateReport()" class="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs sm:text-sm font-medium transition">
                  Generate Report
                </button>
                <button (click)="openBulkUpdateModal()" class="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs sm:text-sm font-medium transition">
                  Bulk Update Status
                </button>
                <button (click)="refreshComplaints()" class="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs sm:text-sm font-medium transition">
                  504 Refresh Complaints
                </button>
              </div>
            </div>

            <!-- Department Performance -->
            <div class="backdrop-blur rounded-xl border shadow p-3 sm:p-4" 
                 [class]="isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-slate-100'">
              <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4" [class]="isDarkMode ? 'text-gray-200' : 'text-slate-800'">Department Performance</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-xs sm:text-sm" [class]="isDarkMode ? 'text-gray-400' : 'text-slate-600'">Resolution Rate</span>
                  <span class="text-xs sm:text-sm font-bold text-green-600">85%</span>
                </div>
                <div class="w-full rounded-full h-1.5 sm:h-2" [class]="isDarkMode ? 'bg-gray-600' : 'bg-slate-200'">
                  <div class="bg-green-500 h-1.5 sm:h-2 rounded-full" style="width: 85%"></div>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-xs sm:text-sm" [class]="isDarkMode ? 'text-gray-400' : 'text-slate-600'">Avg Response Time</span>
                  <span class="text-xs sm:text-sm font-bold text-blue-600">4.2 hrs</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-1.5 sm:h-2" [class]="isDarkMode ? 'bg-gray-600' : 'bg-slate-200'">
                  <div class="bg-blue-500 h-1.5 sm:h-2 rounded-full" style="width: 70%"></div>
                </div>
              </div>
            </div>

            <!-- AI Insights Card -->
            <div class="bg-gradient-to-br from-purple-100/80 to-white/80 backdrop-blur rounded-xl border border-purple-200 shadow p-3 flex flex-col h-48 w-full">
              <div class="flex items-center mb-2 justify-between w-full">
                <span class="flex items-center">
                  <span class="bg-purple-100 text-purple-600 rounded-full p-1 mr-1 flex items-center justify-center">
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'>
                      <path d='M12 4a8 8 0 0 0-8 8c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4a8 8 0 0 0-8-8z' stroke='#a21caf' fill='#f3e8ff'/>
                      <circle cx='9' cy='12' r='1.5' fill='#a21caf'/>
                      <circle cx='15' cy='12' r='1.5' fill='#a21caf'/>
                    </svg>
                  </span>
                  <span class="font-semibold text-xs text-slate-800">AI Insights</span>
                </span>
              </div>
              <ul class="list-disc pl-3 text-[10px] text-slate-700 mb-2 flex-1">
                <li>Harare is known as the "Sunshine City" for its beautiful weather and vibrant atmosphere. ☀️🌳</li>
                <li>The city boasts lush gardens, tree-lined avenues, and a welcoming community spirit. 🌺🌳🤝</li>
                <li>Harare is a hub for arts, culture, and innovation in Southern Africa. 🎨🎶💡</li>
                <li>Enjoy year-round mild temperatures and plenty of sunshine, making it ideal for outdoor activities. 🌞🏞️</li>
                <li>Harare's markets, restaurants, and festivals offer a taste of Zimbabwean hospitality and creativity. 🍲🎉🛍️</li>
              </ul>
              <div class="flex justify-center">
                <button (click)="openInsightsModal()" class="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-bold" style="min-width:unset;">View Insights</button>
              </div>
            </div>

            <!-- Trends & Risks Card -->
            <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-3 flex flex-col h-48 w-full">
              <div class="flex items-center mb-2 justify-between w-full">
                <span class="flex items-center">
                  <span class="bg-red-100 text-red-600 rounded-full p-1 mr-1 flex items-center justify-center">
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'>
                      <polyline points='3,17 9,11 13,15 21,7' fill='none' stroke='#dc2626' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/>
                      <circle cx='3' cy='17' r='1.5' fill='#dc2626'/>
                      <circle cx='9' cy='11' r='1.5' fill='#dc2626'/>
                      <circle cx='13' cy='15' r='1.5' fill='#dc2626'/>
                      <circle cx='21' cy='7' r='1.5' fill='#dc2626'/>
                    </svg>
                  </span>
                  <span class="font-semibold text-xs text-slate-800">Trends & Risks</span>
                </span>
              </div>
              <ul class="list-disc pl-3 text-[10px] text-slate-700 mb-2 flex-1">
                <li>There is a rising trend in water supply complaints during the dry season. 💧📈</li>
                <li>Road infrastructure complaints spike after heavy rains, indicating a need for improved drainage and road repairs. 🚧🌧️</li>
                <li>Waste management issues are more frequent in high-density suburbs. 🗑️🏘️</li>
                <li>Seasonal disease outbreaks, such as cholera, are linked to water and sanitation challenges. 🦠🚱</li>
                <li>Community engagement can reduce illegal dumping and improve city cleanliness. 🤝♻️</li>
              </ul>
              <div class="flex justify-center">
                <button (click)="openTrendsModal()" class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold" style="min-width:unset;">View Trends</button>
              </div>
            </div>
          </div>
        </div>

      <!-- Modern Footer with Smart City AI Information -->
      <footer class="text-white py-4 sm:py-8 mt-6 sm:mt-12" 
              [class]="isDarkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-blue-900 to-indigo-900'">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <p class="text-xs sm:text-sm" [class]="isDarkMode ? 'text-gray-400' : 'text-blue-300'">&copy; 2025 Harare Smart City Portal - Department Admin Portal. All rights reserved.</p>
        </div>
      </footer>
      
      <!-- Modal: Assign Complaint -->
      <div *ngIf="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">Assign Complaint</h3>
            <button (click)="closeModals()" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <div class="font-medium mb-1">Complaint Title:</div>
            <div class="font-bold mb-2">{{ selectedComplaint?.title }}</div>
            
            <div class="font-medium mb-1">Current Status:</div>
            <div class="mb-4">
              <span class="inline-block px-2 py-1 text-xs font-medium rounded-full" [ngClass]="getStatusBadgeClass(selectedComplaint?.status || 'New')">
                {{ selectedComplaint?.status }}
              </span>
            </div>
            
            <div class="font-medium mb-1">Assign to Staff Member:</div>
            <ng-container *ngIf="filteredStaff().length > 0; else noStaff">
              <select [(ngModel)]="selectedStaffId" class="w-full rounded border p-2 mb-4">
                <option value="" disabled>Select Staff Member</option>
                <option *ngFor="let staff of filteredStaff()" [value]="staff.id">
                  {{ staff.name }} ({{ staff.role }})
                </option>
              </select>
            </ng-container>
            <ng-template #noStaff>
              <div class="text-red-500 text-sm mb-4">No admins registered to this department.</div>
            </ng-template>
          </div>
          
          <div class="flex justify-end gap-2">
            <button (click)="closeModals()" 
                    class="px-4 py-2 rounded font-medium text-sm">
              Cancel
            </button>
            <button (click)="assignComplaint()" 
                    [disabled]="!selectedStaffId || filteredStaff().length === 0 || isLoading"
                    class="px-4 py-2 rounded font-medium text-sm text-white"
                    [class.bg-blue-400]="isLoading || !selectedStaffId || filteredStaff().length === 0"
                    [class.bg-blue-600]="selectedStaffId && filteredStaff().length > 0 && !isLoading"
                    [class.cursor-not-allowed]="isLoading || !selectedStaffId || filteredStaff().length === 0"
                    [class.hover\:bg-blue-700]="selectedStaffId && filteredStaff().length > 0 && !isLoading">
              <span *ngIf="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Assigning...
              </span>
              <span *ngIf="!isLoading">Assign Complaint</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modal: Update Status -->
      <div *ngIf="showStatusModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">Update Complaint Status</h3>
            <button (click)="closeModals()" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <div class="font-medium mb-1">Complaint Title:</div>
            <div class="font-bold mb-2 text-blue-600 text-lg">{{ selectedComplaint?.title }}</div>
            
            <div class="font-medium mb-1">Current Status:</div>
            <div class="mb-4">
              <span class="inline-block px-2 py-1 text-xs font-medium rounded-full" [ngClass]="getStatusBadgeClass(selectedComplaint?.status || 'New')">
                {{ selectedComplaint?.status }}
              </span>
            </div>
            
            <div class="font-medium mb-1">Update Status To:</div>
            <select [(ngModel)]="selectedStatus" class="w-full rounded border p-2 mb-4">
              <option *ngFor="let status of availableStatuses" [value]="status">
                {{ status }}
              </option>
            </select>
            
            <div class="font-medium mb-1">Status Update Note:</div>
            <textarea [(ngModel)]="statusUpdateNote" 
                     class="w-full rounded border p-2 h-24 resize-none"
                     placeholder="Add details about this status change..."></textarea>
          </div>
          
          <div class="flex justify-end gap-2">
            <button (click)="closeModals()" 
                    class="px-4 py-2 rounded font-medium text-sm">
              Cancel
            </button>
            <button (click)="updateComplaintStatus()" 
                    [disabled]="!statusUpdateNote || isLoading"
                    class="px-4 py-2 rounded font-medium text-sm text-white"
                    [class.bg-green-400]="isLoading || !statusUpdateNote"
                    [class.bg-green-600]="statusUpdateNote && !isLoading"
                    [class.cursor-not-allowed]="isLoading || !statusUpdateNote"
                    [class.hover\:bg-green-700]="statusUpdateNote && !isLoading">
              <span *ngIf="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
              <span *ngIf="!isLoading">Update Status</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modal: View Complaint Details -->
      <div *ngIf="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">Complaint Details</h3>
            <button (click)="closeModals()" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="overflow-y-auto max-h-[70vh]">
            <!-- Complaint Header -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="text-xl font-bold">{{ selectedComplaint?.title }}</h2>
                <div class="text-sm">
                  Reference ID: {{ selectedComplaint?.publicId }}
                </div>
              </div>
              <div class="flex gap-2">
                <span class="inline-block px-2 py-1 text-xs font-medium rounded-full" [ngClass]="getPriorityBadgeClass(selectedComplaint?.priority || 'Medium')">
                  {{ selectedComplaint?.priority }}
                </span>
                <span class="inline-block px-2 py-1 text-xs font-medium rounded-full" [ngClass]="getStatusBadgeClass(selectedComplaint?.status || 'New')">
                  {{ selectedComplaint?.status }}
                </span>
              </div>
            </div>
            
            <!-- Complaint Meta -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="rounded p-3">
                <h4 class="font-medium mb-2">Location Details</h4>
                <div class="text-sm">
                  <div>Address: {{ selectedComplaint?.location?.address }}</div>
                  <div *ngIf="selectedComplaint?.location?.ward">Ward: {{ selectedComplaint?.location?.ward }}</div>
                  <div *ngIf="selectedComplaint?.location?.district">District: {{ selectedComplaint?.location?.district }}</div>
                </div>
              </div>
              <div class="rounded p-3">
                <h4 class="font-medium mb-2">Submission Details</h4>
                <div class="text-sm">
                  <div>Submitted By: {{ selectedComplaint?.submittedBy?.name || 'Unknown' }}</div>
                  <div>Contact: {{ selectedComplaint?.submittedBy?.contact || 'N/A' }}</div>
                  <div>Submitted On: {{ formatDate(selectedComplaint?.dates?.created || '') }}</div>
                </div>
              </div>
            </div>
            
            <!-- Assignment Details -->
            <div *ngIf="selectedComplaint?.assignedTo" class="rounded p-3 mb-4">
              <h4 class="font-medium mb-2">Assignment Details</h4>
              <div class="text-sm">
                <div>Assigned To: {{ selectedComplaint?.assignedTo?.officerName || 'Not assigned' }}</div>
                <div>Department: {{ selectedComplaint?.assignedTo?.departmentName }}</div>
              </div>
            </div>
            
            <!-- Complaint Description -->
            <div class="rounded p-3 mb-4">
              <h4 class="font-medium mb-2">Description</h4>
              <p class="text-sm whitespace-pre-line">
                {{ selectedComplaint?.description }}
              </p>
            </div>
            
            <!-- Update History -->
            <div class="rounded p-3 mb-4">
              <h4 class="font-medium mb-2">Update History</h4>
              <div *ngIf="!selectedComplaint?.updates?.length" class="text-sm italic">
                No updates yet
              </div>
              <div *ngFor="let update of selectedComplaint?.updates || []" class="border-b last:border-b-0 py-2">
                <div class="flex justify-between">
                  <span class="text-xs font-medium">
                    {{ formatDate(update.timestamp) }}
                  </span>
                  <span *ngIf="update.newStatus" class="text-xs px-2 rounded-full" [ngClass]="getStatusBadgeClass(update.newStatus)">
                    {{ update.newStatus }}
                  </span>
                </div>
                <p class="text-sm mt-1">{{ update.content }}</p>
                <div class="text-xs mt-1">By: {{ update.updatedBy }}</div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-between mt-4 pt-4 border-t">
            <button (click)="closeModals()" 
                    class="px-4 py-2 rounded font-medium text-sm">
              Close
            </button>
            <div class="flex gap-2">
              <button (click)="openAssignModal(selectedComplaint!); closeModals();" 
                      class="px-4 py-2 rounded font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white">
                Assign
              </button>
              <button (click)="openStatusModal(selectedComplaint!); closeModals();" 
                      class="px-4 py-2 rounded font-medium text-sm bg-green-600 hover:bg-green-700 text-white">
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal: Create Announcement -->
      <div *ngIf="showAnnouncementModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">Create Announcement</h3>
            <button (click)="closeModals()" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="overflow-y-auto max-h-[70vh]">
            <form (ngSubmit)="createAnnouncement()">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Title</label>
                  <input [(ngModel)]="announcement.title" name="title" type="text" required
                         class="w-full rounded border p-2" 
                         placeholder="Enter announcement title">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Priority</label>
                  <select [(ngModel)]="announcement.priority" name="priority"
                          class="w-full rounded border p-2">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Type</label>
                  <select [(ngModel)]="announcement.type" name="type"
                          class="w-full rounded border p-2">
                    <option value="General">General</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Update">Update</option>
                    <option value="Info">Info</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Target Audience</label>
                  <select [(ngModel)]="announcement.targetAudience" name="targetAudience"
                          class="w-full rounded border p-2">
                    <option value="All">All Users</option>
                    <option value="Residents">Residents Only</option>
                    <option value="Admins">Admins Only</option>
                    <option value="Department">Department Only</option>
                  </select>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium mb-1">Content</label>
                <textarea [(ngModel)]="announcement.content" name="content" required
                         class="w-full rounded border p-2 h-32 resize-none" 
                         placeholder="Enter the announcement content..."></textarea>
              </div>
              
              <div class="flex items-center mb-4">
                <input type="checkbox" [(ngModel)]="announcement.isUrgent" name="isUrgent" id="isUrgent" class="mr-2">
                <label for="isUrgent" class="text-sm">Mark as urgent</label>
              </div>
              
              <div class="flex justify-end gap-2">
                <button type="button" (click)="closeModals()" 
                        class="px-4 py-2 rounded font-medium text-sm">
                  Cancel
                </button>
                <button type="submit" 
                        [disabled]="!announcement.title || !announcement.content || isLoading"
                        class="px-4 py-2 rounded font-medium text-sm text-white"
                        [class]="(isLoading || !announcement.title || !announcement.content) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'">
                  <span *ngIf="isLoading" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                  <span *ngIf="!isLoading">Create Announcement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Modal: Bulk Update Status -->
      <div *ngIf="showBulkUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-auto p-6" 
             [class]="isDarkMode ? 'bg-gray-800' : 'bg-white'">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold" [class]="isDarkMode ? 'text-gray-200' : 'text-gray-800'">Bulk Update Status</h3>
            <button (click)="closeModals()" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="overflow-y-auto max-h-[70vh]">
            <!-- Status and Note Selection -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium mb-1" [class]="isDarkMode ? 'text-gray-300' : 'text-gray-700'">New Status</label>
                <select [(ngModel)]="bulkStatus" name="bulkStatus"
                        class="w-full rounded border p-2" 
                        [class]="isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'">
                  <option *ngFor="let status of availableStatuses" [value]="status">{{ status }}</option>
                </select>
              </div>
              <div class="flex items-end">
                <button (click)="selectAllComplaints()" 
                        class="px-4 py-2 rounded font-medium text-sm"
                        [class]="isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'">
                  {{ selectedComplaintIds.length === complaints.length ? 'Deselect All' : 'Select All' }}
                </button>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1" [class]="isDarkMode ? 'text-gray-300' : 'text-gray-700'">Update Note</label>
              <textarea [(ngModel)]="bulkUpdateNote" name="bulkUpdateNote"
                       class="w-full rounded border p-2 h-20 resize-none" 
                       [class]="isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'"
                       placeholder="Enter details about this bulk update..."></textarea>
            </div>
            
            <!-- Complaint Selection -->
            <div class="mb-4">
              <h4 class="text-sm font-medium mb-2" [class]="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                Select Complaints ({{ selectedComplaintIds.length }} selected)
              </h4>
              <div class="border rounded max-h-60 overflow-y-auto" [class]="isDarkMode ? 'border-gray-600' : 'border-gray-300'">
                <div *ngFor="let complaint of complaints" 
                     class="flex items-center p-3 border-b hover:bg-opacity-50 cursor-pointer"
                     [class]="isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'"
                     (click)="toggleComplaintSelection(complaint.id!)">
                  <input type="checkbox" 
                         [checked]="selectedComplaintIds.includes(complaint.id!)"
                         (click)="$event.stopPropagation()"
                         (change)="toggleComplaintSelection(complaint.id!)"
                         class="mr-3">
                  <div class="flex-1">
                    <div class="flex justify-between items-center">
                      <span class="font-medium" [class]="isDarkMode ? 'text-gray-200' : 'text-gray-800'">{{ complaint.title }}</span>
                      <span class="text-xs px-2 py-1 rounded-full" [ngClass]="getStatusBadgeClass(complaint.status)">
                        {{ complaint.status }}
                      </span>
                    </div>
                    <div class="text-sm mt-1" [class]="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
                      {{ complaint.location.address }} - {{ getTimeElapsed(complaint.dates.created) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 pt-4 border-t" [class]="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <button (click)="closeModals()" 
                    class="px-4 py-2 rounded font-medium text-sm"
                    [class]="isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'">
              Cancel
            </button>
            <button (click)="performBulkUpdate()" 
                    [disabled]="selectedComplaintIds.length === 0 || !bulkUpdateNote || isLoading"
                    class="px-4 py-2 rounded font-medium text-sm text-white"
                    [class]="(isLoading || selectedComplaintIds.length === 0 || !bulkUpdateNote) ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'">
              <span *ngIf="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
              <span *ngIf="!isLoading">Update {{ selectedComplaintIds.length }} Complaints</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- About Modal -->
    <div *ngIf="showAboutModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl w-[83vw] max-w-md p-0 mx-auto">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl flex items-center justify-between">
          <h2 class="text-lg font-bold">About</h2>
          <button (click)="showAboutModal = false" class="text-white hover:text-gray-200 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-4 space-y-3">
          <!-- Profile -->
          <div class="flex flex-col items-center mb-2">
            <img src="https://ui-avatars.com/api/?name=Simbarashe+Matogo&background=0D8ABC&color=fff&size=128" alt="Developer" class="w-20 h-20 rounded-full object-cover mb-2 shadow" />
            <div class="text-base font-bold text-gray-800">Simbarashe Matogo</div>
            <div class="text-xs text-blue-600 font-semibold">Full Stack Developer</div>
            <div class="text-xs text-gray-500">Final Year, Telone Centre for Learning</div>
          </div>
          <!-- About -->
          <div>
            <div class="text-xs text-gray-700 text-center">
              Passionate about tech, I build modern web apps and love solving real-world problems. Open to work and collaborations!
            </div>
          </div>
          <!-- About This Project -->
          <div>
            <div class="text-xs font-semibold text-gray-800 mb-1 flex items-center"><svg class="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>About This Project</div>
            <div class="text-xs text-gray-700">
              Smart City Management System is a modern web platform for city administration, complaint management, and real-time service monitoring. Built with Angular and Firebase, it empowers city officials and citizens with efficient, transparent, and AI-powered tools for a smarter city.
            </div>
          </div>
          <!-- Skills -->
          <div>
            <div class="text-xs font-semibold text-gray-800 mb-1 flex items-center"><svg class="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>Skills</div>
            <div class="flex flex-wrap gap-1">
              <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">Angular</span>
              <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">TypeScript</span>
              <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">JavaScript</span>
              <span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">Firebase</span>
              <span class="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">Node.js</span>
              <span class="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs">React</span>
              <span class="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-xs">Python</span>
            </div>
          </div>
          <!-- Contact -->
          <div>
            <div class="text-xs font-semibold text-gray-800 mb-1 flex items-center"><svg class="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 012 2z"></path></svg>Contact</div>
            <div class="text-xs text-gray-700">Email: simbarashe.matogo[at]gmail.com</div>
            <div class="text-xs text-gray-700">Phone: +263 77 123 4567</div>
            <div class="text-xs text-gray-700">LinkedIn: linkedin.com/in/simbarashe-matogo</div>
          </div>
          <!-- Call to Action -->
          <div class="text-center mt-2">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-2 text-xs mb-2">Let's work together!</div>
            <button (click)="showAboutModal = false" class="bg-gray-600 text-white px-4 py-1 rounded text-xs hover:bg-gray-700 transition">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- AI Insights Modal -->
    <div *ngIf="showInsightsModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 m-0 w-full h-full">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl sm:max-w-3xl md:max-w-4xl max-h-[80vh] h-[80vh] border border-gray-200 flex flex-col mx-8 sm:mx-16 my-8">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <span class="bg-purple-100 text-purple-600 rounded-full p-2">
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'>
                <path d='M12 4a8 8 0 0 0-8 8c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4a8 8 0 0 0-8-8z' stroke='#a21caf' fill='#f3e8ff'/>
                <circle cx='9' cy='12' r='1.5' fill='#a21caf'/>
                <circle cx='15' cy='12' r='1.5' fill='#a21caf'/>
              </svg>
            </span>
            <h3 class="text-lg font-bold text-slate-800">AI Insights</h3>
          </div>
          <button (click)="showInsightsModal = false" class="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 flex flex-col justify-center items-center p-6 overflow-y-auto">
          <div class="text-base text-slate-700 text-center font-medium mb-6" style="min-height: 120px;">
            {{ aiInsightsList[currentInsightIndex] }}
          </div>
        </div>
        <div class="flex justify-between items-center p-4 border-t border-gray-200">
          <button (click)="showInsightsModal = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Close</button>
          <button (click)="showNextInsight()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Next</button>
        </div>
      </div>
    </div>

    <!-- Trends & Risks Modal -->
    <div *ngIf="showTrendsModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 m-0 w-full h-full">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl sm:max-w-3xl md:max-w-4xl max-h-[80vh] h-[80vh] border border-gray-200 flex flex-col mx-8 sm:mx-16 my-8">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <span class="bg-red-100 text-red-600 rounded-full p-2">
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'>
                <polyline points='3,17 9,11 13,15 21,7' fill='none' stroke='#dc2626' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/>
                <circle cx='3' cy='17' r='1.5' fill='#dc2626'/>
                <circle cx='9' cy='11' r='1.5' fill='#dc2626'/>
                <circle cx='13' cy='15' r='1.5' fill='#dc2626'/>
                <circle cx='21' cy='7' r='1.5' fill='#dc2626'/>
              </svg>
            </span>
            <h3 class="text-lg font-bold text-slate-800">Trends & Risks</h3>
          </div>
          <button (click)="showTrendsModal = false" class="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 flex flex-col justify-center items-center p-6 overflow-y-auto">
          <div class="text-base text-slate-700 text-center font-medium mb-6" style="min-height: 120px;">
            {{ trendsAndRisksList[currentTrendIndex] }}
          </div>
        </div>
        <div class="flex justify-between items-center p-4 border-t border-gray-200">
          <button (click)="showTrendsModal = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Close</button>
          <button (click)="showNextTrend()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Next</button>
        </div>
      </div>
    </div>
    <!-- Reply Modal -->
    <div *ngIf="showReplyModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <span class="bg-blue-100 text-blue-600 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </span>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Admin Replies</h3>
              <p class="text-sm text-gray-600">{{ replyComplaint?.title }}</p>
            </div>
          </div>
          <button (click)="closeReplyModal()" class="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Modal Body -->
        <div class="p-4 max-h-96 overflow-y-auto">
          <div *ngIf="!replyComplaint?.updates?.length" class="text-center text-gray-500 py-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No replies yet</p>
          </div>
          <div *ngFor="let update of replyComplaint?.updates || []; let i = index" class="mb-4 last:mb-0">
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="bg-blue-100 text-blue-600 rounded-full p-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <div>
                    <p class="font-semibold text-gray-800 text-sm">{{ update.updatedBy }}</p>
                    <p class="text-xs text-gray-500">{{ update.timestamp | date:'MMM d, y h:mm a' }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded p-3 border border-gray-100">
                <p class="text-sm text-gray-700 leading-relaxed flex-1">{{ update.content }}</p>
              </div>
            </div>
            <button *ngIf="replyComplaint" (click)="deleteReply(replyComplaint!, i)" class="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors" title="Delete reply">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <!-- Modal Footer -->
        <div class="flex justify-end p-4 border-t border-gray-200">
          <button (click)="closeReplyModal()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DepartmentAdminDashboardComponent implements OnInit {
  userName: string = 'Admin User';
  department: string = 'Water Department';
  isDarkMode: boolean = false;
  
  // Complaint data
  complaints: Complaint[] = [];
  totalComplaints: number = 0;
  resolvedComplaints: number = 0;
  pendingComplaints: number = 0;
  overdueComplaints: number = 0;
  
  // Modal states
  showAssignModal: boolean = false;
  showStatusModal: boolean = false;
  showDetailsModal: boolean = false;
  showAnnouncementModal: boolean = false;
  showBulkUpdateModal: boolean = false;
  selectedComplaint: Complaint | null = null;
  
  // Announcement creation
  announcement: Announcement = {
    title: '',
    content: '',
    department: '',
    departmentId: '',
    priority: 'Medium',
    type: 'General',
    targetAudience: 'All',
    createdBy: {
      userId: '',
      name: '',
      role: '',
      department: ''
    },
    dates: {
      created: '',
      lastUpdated: ''
    },
    isActive: true,
    isUrgent: false,
    tags: [],
    views: 0,
    likes: 0
  };
  
  // Bulk update
  selectedComplaintIds: string[] = [];
  bulkStatus: Status = 'InProgress';
  bulkUpdateNote: string = '';
  
  // Staff assignment
  availableStaff: any[] = [
    { id: 'staff1', name: 'John Doe', role: 'Field Technician', department: 'Water and Sanitation' },
    { id: 'staff2', name: 'Jane Smith', role: 'Senior Engineer', department: 'Water and Sanitation' },
    { id: 'staff3', name: 'Robert Mugabe', role: 'Supervisor', department: 'Water and Sanitation' },
    { id: 'staff4', name: 'Maria Chivhu', role: 'Field Technician', department: 'Water and Sanitation' }
  ];
  selectedStaffId: string = '';
  
  // Status update
  availableStatuses: Status[] = ['New', 'Assigned', 'InProgress', 'PendingReview', 'Resolved', 'Closed', 'Reopened'];
  selectedStatus: Status = 'New';
  statusUpdateNote: string = '';
  
  // Loading state
  isLoading: boolean = false;

  // Add at the start of the class
  viewAllComplaints: boolean = false;

  showAboutModal: boolean = false;

  showReplyModal: boolean = false;
  replyComplaint: Complaint | null = null;

  formatStatus(status: string): string {
    // Basic formatting, can be customized
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : '';
  }

  openReplyModal(complaint: Complaint): void {
    this.replyComplaint = complaint;
    this.showReplyModal = true;
  }

  closeReplyModal(): void {
    this.showReplyModal = false;
    this.replyComplaint = null;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private firebaseService: FirebaseService,
    private announcementService: AnnouncementService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    await this.getCurrentUserInfo();
    this.loadThemePreference();
    this.loadComplaints();
  }

  loadThemePreference() {
    const savedTheme = localStorage.getItem('darkMode');
    this.isDarkMode = savedTheme === 'true';
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  async getCurrentUserInfo() {
    const currentUser = this.authService.auth.currentUser;
    const userData = this.authService.getCurrentUserData();
    
    if (userData) {
      this.userName = userData.name && userData.surname 
        ? (userData.name + ' ' + userData.surname) 
        : userData.name || userData.email?.split('@')[0] || 'Admin User';
      this.department = userData.department || 'Water and Sanitation';
      
      console.log('Department Admin User Info:', {
        userName: this.userName,
        department: this.department,
        userData: userData
      });
    }
    
    this.cdr.detectChanges();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getDepartmentBannerClass(): string {
    switch (this.department) {
      case 'Water and Sanitation':
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100';
      case 'Roads and Transport':
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-100';
      case 'Waste Management':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100';
      case 'General Services':
        return 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100';
    }
  }

  getDepartmentIcon(): SafeHtml {
    let svgPath = '';
    switch (this.department) {
      case 'Water and Sanitation':
        svgPath = '<path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z"/>';
        break;
      case 'Roads and Transport':
        svgPath = '<path d="M19 15v4H5v-4h14m1-2H4a1 1 0 00-1 1v6a1 1 0 001 1h16a1 1 0 001-1v-6a1 1 0 00-1-1zM6 18.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z"/>';
        break;
      case 'Waste Management':
        svgPath = '<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-12H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>';
        break;
      case 'General Services':
        svgPath = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
        break;
      default:
        svgPath = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
    }
    return this.sanitizer.bypassSecurityTrustHtml(svgPath);
  }

  getDepartmentTitle(): SafeHtml {
    let title = '';
    switch (this.department) {
      case 'Water and Sanitation':
        title = 'Water & Sanitation Department';
        break;
      case 'Roads and Transport':
        title = 'Roads & Transport Department';
        break;
      case 'Waste Management':
        title = 'Waste Management Department';
        break;
      case 'General Services':
        title = 'General Services Department';
        break;
      default:
        title = 'Department';
    }
    return this.sanitizer.bypassSecurityTrustHtml(title);
  }

  getDepartmentSlogan(): string {
    switch (this.department) {
      case 'Water and Sanitation':
        return '🚀 Clean Water • Proper Sanitation • Healthy Communities 🚀';
      case 'Roads and Transport':
        return '🛣️ Safe Roads • Efficient Transport • Connected Communities 🛣️';
      case 'Waste Management':
        return '🌱 Clean Environment • Sustainable Practices • Green Future 🌱';
      case 'General Services':
        return '⚡ Quality Service • Community First • Excellence Always ⚡';
      default:
        return '⚡ Leading • Innovating • Serving ⚡';
    }
  }

  // Method to load complaints based on department
  async loadComplaints() {
    this.isLoading = true;
    try {
      // Use the exact department name from the user's profile
      const deptFilter = this.department;

      console.log('Department Admin Dashboard - Loading complaints for:', this.department);
      console.log('Department filter:', deptFilter);

      // First try querying by department
      let complaints = await this.firebaseService.getCollection('complaints', [
        { field: 'department', operator: '==', value: deptFilter }
      ]);
      console.log('Complaints found with query:', complaints.length);
      
      // If no complaints found with query, get all complaints and filter manually
      if (complaints.length === 0) {
        console.log('No complaints found with query, getting all complaints to check...');
        const allComplaints = await this.firebaseService.getCollection('complaints');
        console.log('Total complaints in database:', allComplaints.length);
        
        // Log all departments to see what we have
        allComplaints.forEach((complaint: any, index: number) => {
          console.log('Complaint ' + (index + 1) + ':', {
            id: complaint.id,
            title: complaint.title,
            department: complaint.department,
            status: complaint.status
          });
        });
        
        // Filter manually
        complaints = allComplaints.filter((complaint: any) => complaint.department === deptFilter);
        console.log('Manually filtered complaints:', complaints.length);
      }
      
      // Cast to Complaint[] before accessing department property
      const typedComplaints = complaints as Complaint[];
      console.log('Final complaint departments:', typedComplaints.map(c => c.department));
      
      this.complaints = typedComplaints;
      
      this.updateStatistics();

    } catch (error) {
      console.error('Error loading complaints:', error);
      // If no complaints are loaded, use demo data
      if (this.complaints.length === 0) {
        this.initializeDemoComplaints();
      }
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // Initialize demo complaints if Firebase data isn't available
  initializeDemoComplaints() {
    // Use the exact department name
    const deptType = this.department as Department;

    const now = new Date().toISOString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString();

    this.complaints = [
      {
        id: 'comp1',
        title: 'Water Pressure Issue',
        description: 'The water pressure in our area has been very low for the past week.',
        department: deptType,
        category: 'Infrastructure',
        location: {
          address: 'Harare Central, Block 4',
          ward: 12
        },
        priority: 'Medium',
        status: 'New',
        submittedBy: {
          userId: 'user1',
          name: 'Sarah Moyo',
          contact: '0771234567',
          email: 'sarah@example.com'
        },
        dates: {
          created: yesterdayString,
          updated: yesterdayString
        },
        updates: [],
        publicId: 'WTR2023001',
        isAnonymous: false,
        isPublic: true,
        tags: ['water pressure', 'infrastructure'],
        votes: 2
      },
      {
        id: 'comp2',
        title: 'Pipe Leak Emergency',
        description: 'There is a major water pipe leak causing flooding in the street.',
        department: deptType,
        category: 'Emergency',
        location: {
          address: 'Mbare Township, Main Street',
          ward: 4
        },
        priority: 'High',
        status: 'InProgress',
        submittedBy: {
          userId: 'user2',
          name: 'John Banda',
          contact: '0772345678',
          email: 'john@example.com'
        },
        assignedTo: {
          departmentId: 'dept1',
          departmentName: deptType,
          officerId: 'staff2',
          officerName: 'Jane Smith'
        },
        dates: {
          created: now,
          updated: now
        },
        updates: [
          {
            timestamp: now,
            content: 'Technician dispatched to assess the situation',
            updatedBy: 'Admin',
            newStatus: 'InProgress'
          }
        ],
        publicId: 'WTR2023002',
        isAnonymous: false,
        isPublic: true,
        tags: ['leak', 'pipe', 'emergency'],
        votes: 5
      }
    ];
    
    this.totalComplaints = this.complaints.length;
    this.resolvedComplaints = 0;
    this.pendingComplaints = 2;
    this.overdueComplaints = 0;
  }

  // Open Assign Modal
  openAssignModal(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.selectedStaffId = complaint.assignedTo?.officerId || '';
    this.showAssignModal = true;
    this.cdr.detectChanges();
  }

  // Open Status Update Modal
  openStatusModal(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.selectedStatus = complaint.status;
    this.statusUpdateNote = '';
    this.showStatusModal = true;
    this.cdr.detectChanges();
  }

  // Open Details Modal
  openDetailsModal(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.showDetailsModal = true;
    this.cdr.detectChanges();
  }

  // Close all modals
  closeModals() {
    this.showAssignModal = false;
    this.showStatusModal = false;
    this.showDetailsModal = false;
    this.showAnnouncementModal = false;
    this.showBulkUpdateModal = false;
    this.selectedComplaint = null;
    this.selectedComplaintIds = [];
    this.cdr.detectChanges();
  }

  // Assign complaint to staff member
  async assignComplaint() {
    if (!this.selectedComplaint || !this.selectedStaffId) return;
    
    this.isLoading = true;
    try {
      const selectedStaff = this.availableStaff.find(staff => staff.id === this.selectedStaffId);
      if (!selectedStaff) throw new Error('Selected staff not found');
      
      // Create the assignment update
      const now = new Date().toISOString();
      const update = {
        assignedTo: {
          departmentId: 'dept_' + this.department.toLowerCase().replace(/\s+/g, ''),
          departmentName: this.mapDepartmentName(),
          officerId: selectedStaff.id,
          officerName: selectedStaff.name
        },
        status: 'Assigned' as Status,
        'dates.updated': now,
        updates: this.firebaseService.getArrayUnion({
          timestamp: now,
                          content: 'Complaint assigned to ' + selectedStaff.name + ' (' + selectedStaff.role + ')',
          updatedBy: this.userName,
          newStatus: 'Assigned'
        })
      };
      
      // Update in Firebase
      if (this.selectedComplaint.id) {
        await this.firebaseService.updateDocument('complaints', this.selectedComplaint.id, update);
        
        // Update the local data
        const index = this.complaints.findIndex(c => c.id === this.selectedComplaint?.id);
        if (index !== -1) {
          this.complaints[index] = {
            ...this.complaints[index],
            assignedTo: update.assignedTo,
            status: update.status,
            dates: {
              ...this.complaints[index].dates,
              updated: now
            },
            updates: [
              ...this.complaints[index].updates,
              {
                timestamp: now,
                content: 'Complaint assigned to ' + selectedStaff.name + ' (' + selectedStaff.role + ')',
                updatedBy: this.userName,
                newStatus: 'Assigned'
              }
            ]
          };
        }
      }
      
      // Close the modal
      this.closeModals();
      
    } catch (error) {
      console.error('Error assigning complaint:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // Update complaint status
  async updateComplaintStatus() {
    if (!this.selectedComplaint || !this.statusUpdateNote) return;
    
    this.isLoading = true;
    try {
      // Create the status update
      const now = new Date().toISOString();
      
      // Prepare the update object
      const update: any = {
        status: this.selectedStatus,
        'dates.updated': now,
        updates: this.firebaseService.getArrayUnion({
          timestamp: now,
          content: this.statusUpdateNote,
          updatedBy: this.userName,
          newStatus: this.selectedStatus
        })
      };
      
      // If status is Resolved, add the resolved date
      if (this.selectedStatus === 'Resolved') {
        update['dates.resolved'] = now;
      }
      
      // If status is Closed, add the closed date
      if (this.selectedStatus === 'Closed') {
        update['dates.closed'] = now;
      }
      
      // Update in Firebase
      if (this.selectedComplaint.id) {
        await this.firebaseService.updateDocument('complaints', this.selectedComplaint.id, update);
        
        // Update the local data
        const index = this.complaints.findIndex(c => c.id === this.selectedComplaint?.id);
        if (index !== -1) {
          this.complaints[index] = {
            ...this.complaints[index],
            status: this.selectedStatus,
            dates: {
              ...this.complaints[index].dates,
              updated: now,
              ...(this.selectedStatus === 'Resolved' ? { resolved: now } : {}),
              ...(this.selectedStatus === 'Closed' ? { closed: now } : {})
            },
            updates: [
              ...this.complaints[index].updates,
              {
                timestamp: now,
                content: this.statusUpdateNote,
                updatedBy: this.userName,
                newStatus: this.selectedStatus
              }
            ]
          };
          
          // Update statistics
          this.updateStatistics();
        }
      }
      
      // Close the modal
      this.closeModals();
      
    } catch (error) {
      console.error('Error updating complaint status:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // Refresh complaints data
  async refreshComplaints() {
    this.isLoading = true;
    await this.loadComplaints();
    this.isLoading = false;
    this.cdr.detectChanges();
    console.log('Complaints refreshed');
  }

  // Update statistics after changes
  updateStatistics() {
    this.totalComplaints = this.complaints.length;
    this.resolvedComplaints = this.complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
    this.pendingComplaints = this.complaints.filter(c => 
      c.status === 'New' || c.status === 'Assigned' || c.status === 'InProgress' || c.status === 'PendingReview'
    ).length;
    
    // Calculate overdue
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    this.overdueComplaints = this.complaints.filter(c => {
      const createdDate = new Date(c.dates.created);
      return createdDate < oneWeekAgo && 
             c.status !== 'Resolved' && 
             c.status !== 'Closed';
    }).length;
  }

  // Helper method to map department name to Department type
  mapDepartmentName(): Department {
    // Return the exact department name since we're now using full names
    return this.department as Department;
  }

  // Get status badge color
  getStatusBadgeClass(status: Status): string {
    switch (status) {
      case 'New':
        return 'text-blue-600 bg-blue-100';
      case 'Assigned':
        return 'text-purple-600 bg-purple-100';
      case 'InProgress':
        return 'text-yellow-600 bg-yellow-100';
      case 'PendingReview':
        return 'text-orange-600 bg-orange-100';
      case 'Resolved':
        return 'text-green-600 bg-green-100';
      case 'Closed':
        return 'text-gray-600 bg-gray-100';
      case 'Reopened':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  }

  // Get priority badge color
  getPriorityBadgeClass(priority: Priority): string {
    switch (priority) {
      case 'Low':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-blue-600 bg-blue-100';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Calculate time elapsed since submission
  getTimeElapsed(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return diffMins + ' minute' + (diffMins !== 1 ? 's' : '') + ' ago';
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return diffHours + ' hour' + (diffHours !== 1 ? 's' : '') + ' ago';
    }
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) {
      return diffDays + ' day' + (diffDays !== 1 ? 's' : '') + ' ago';
    }
    
    const diffMonths = Math.floor(diffDays / 30);
    return diffMonths + ' month' + (diffMonths !== 1 ? 's' : '') + ' ago';
  }

  // Quick Actions Methods

  // Open announcement modal
  openAnnouncementModal() {
    this.announcement = {
      title: '',
      content: '',
      department: this.department,
      departmentId: 'dept_' + this.department.toLowerCase().replace(/\s+/g, ''),
      priority: 'Medium',
      type: 'General',
      targetAudience: 'All',
      createdBy: {
        userId: this.authService.auth.currentUser?.uid || '',
        name: this.userName,
        role: 'Department Admin',
        department: this.department
      },
      dates: {
        created: '',
        lastUpdated: ''
      },
      isActive: true,
      isUrgent: false,
      tags: [],
      views: 0,
      likes: 0
    };
    this.showAnnouncementModal = true;
    this.cdr.detectChanges();
  }

  // Create announcement
  async createAnnouncement() {
    if (!this.announcement.title || !this.announcement.content) {
      return;
    }

    this.isLoading = true;
    try {
      const now = new Date().toISOString();
      
      const announcementData: Announcement = {
        ...this.announcement,
        dates: {
          created: now,
          lastUpdated: now,
          ...(this.announcement.dates.expires ? { expires: this.announcement.dates.expires } : {})
        }
      };

      // Save to Firebase using the announcement service
      const announcementId = await this.announcementService.createAnnouncement(announcementData);
      
      console.log('Announcement created successfully:', announcementId);
      
      // Close modal
      this.closeModals();
      
      // Show success message (you can add a toast notification here)
      alert('Announcement created successfully! It will appear on all user dashboards.');
      
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Error creating announcement. Please try again.');
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // Generate PDF report
  async generateReport() {
    this.isLoading = true;
    try {
      // For now, create a simple HTML-based report that can be printed
      this.createSimpleReport();
      
      /* TODO: Implement PDF generation when jsPDF is properly configured
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text(this.department + ' - Complaints Report', 20, 20);
      
      // Add metadata
      doc.setFontSize(12);
      doc.text('Generated on: ' + (new Date().toLocaleDateString()), 20, 35);
      doc.text('Generated by: ' + this.userName, 20, 45);
      doc.text('Department: ' + this.department, 20, 55);
      
      // Add statistics
      doc.setFontSize(14);
      doc.text('Summary Statistics:', 20, 75);
      doc.setFontSize(11);
      doc.text('Total Complaints: ' + this.totalComplaints, 25, 85);
      doc.text('Resolved: ' + this.resolvedComplaints, 25, 95);
      doc.text('Pending: ' + this.pendingComplaints, 25, 105);
      doc.text('Overdue: ' + this.overdueComplaints, 25, 115);
      
      // Download the PDF
      const fileName = this.department.replace(/\s+/g, '_') + '_Complaints_Report_' + (new Date().toISOString().split('T')[0]) + '.pdf';
      doc.save(fileName);
      */
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // Create a simple HTML report that can be printed or saved
  createSimpleReport() {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      alert('Please allow pop-ups to generate the report');
      return;
    }
    
    const reportHtml = 
      '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
        '<title>' + this.department + ' - Complaints Report</title>' +
        '<style>' +
          'body { font-family: Arial, sans-serif; margin: 20px; }' +
          '.header { text-align: center; margin-bottom: 30px; }' +
          '.stats { margin: 20px 0; }' +
          '.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }' +
          '.stat-item { background: #f3f4f6; padding: 10px; border-radius: 5px; }' +
          'table { width: 100%; border-collapse: collapse; margin-top: 20px; }' +
          'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }' +
          'th { background-color: #3b82f6; color: white; }' +
          'tr:nth-child(even) { background-color: #f9f9f9; }' +
          '@media print { body { margin: 0; } .no-print { display: none; } }' +
        '</style>' +
      '</head>' +
      '<body>' +
        '<div class="header">' +
          '<h1>' + this.department + ' - Complaints Report</h1>' +
          '<p>Generated on: ' + new Date().toLocaleDateString() + '</p>' +
          '<p>Generated by: ' + this.userName + '</p>' +
          '<button class="no-print" onclick="window.print()">Print Report</button>' +
        '</div>' +
        
        '<div class="stats">' +
          '<h2>Summary Statistics</h2>' +
          '<div class="stats-grid">' +
            '<div class="stat-item">' +
              '<strong>Total Complaints:</strong> ' + this.totalComplaints +
            '</div>' +
            '<div class="stat-item">' +
              '<strong>Resolved:</strong> ' + this.resolvedComplaints +
            '</div>' +
            '<div class="stat-item">' +
              '<strong>Pending:</strong> ' + this.pendingComplaints +
            '</div>' +
            '<div class="stat-item">' +
              '<strong>Overdue:</strong> ' + this.overdueComplaints +
            '</div>' +
          '</div>' +
        '</div>' +
        
        '<h2>Detailed Complaints</h2>' +
        '<table>' +
          '<thead>' +
            '<tr>' +
              '<th>ID</th>' +
              '<th>Title</th>' +
              '<th>Submitted By</th>' +
              '<th>Contact</th>' +
              '<th>Location</th>' +
              '<th>Status</th>' +
              '<th>Priority</th>' +
              '<th>Created</th>' +
              '<th>Assigned To</th>' +
              '<th>Resolved</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            this.complaints.map(complaint => 
              '<tr>' +
                '<td>' + (complaint.publicId || 'N/A') + '</td>' +
                '<td>' + complaint.title + '</td>' +
                '<td>' + (complaint.submittedBy?.name || 'Unknown') + '</td>' +
                '<td>' + (complaint.submittedBy?.contact || 'N/A') + '</td>' +
                '<td>' + complaint.location.address + '</td>' +
                '<td>' + complaint.status + '</td>' +
                '<td>' + complaint.priority + '</td>' +
                '<td>' + this.formatDate(complaint.dates.created) + '</td>' +
                '<td>' + (complaint.assignedTo?.officerName || 'Unassigned') + '</td>' +
                '<td>' + (complaint.dates.resolved ? this.formatDate(complaint.dates.resolved) : 'Not resolved') + '</td>' +
              '</tr>'
            ).join('') +
          '</tbody>' +
        '</table>' +
      '</body>' +
      '</html>';
    
    reportWindow.document.write(reportHtml);
    reportWindow.document.close();
  }

  // Open bulk update modal
  openBulkUpdateModal() {
    this.selectedComplaintIds = [];
    this.bulkStatus = 'InProgress';
    this.bulkUpdateNote = '';
    this.showBulkUpdateModal = true;
    this.cdr.detectChanges();
  }

  // Toggle complaint selection for bulk update
  toggleComplaintSelection(complaintId: string) {
    const index = this.selectedComplaintIds.indexOf(complaintId);
    if (index > -1) {
      this.selectedComplaintIds.splice(index, 1);
    } else {
      this.selectedComplaintIds.push(complaintId);
    }
    this.cdr.detectChanges();
  }

  // Select all complaints for bulk update
  selectAllComplaints() {
    if (this.selectedComplaintIds.length === this.complaints.length) {
      this.selectedComplaintIds = [];
    } else {
      this.selectedComplaintIds = this.complaints.map(c => c.id!).filter(id => id);
    }
    this.cdr.detectChanges();
  }

  // Perform bulk status update
  async performBulkUpdate() {
    if (this.selectedComplaintIds.length === 0 || !this.bulkUpdateNote) {
      return;
    }

    this.isLoading = true;
    try {
      const now = new Date().toISOString();
      
      // Update each selected complaint
      const updatePromises = this.selectedComplaintIds.map(async (complaintId) => {
        const update: any = {
          status: this.bulkStatus,
          'dates.updated': now,
          updates: this.firebaseService.getArrayUnion({
            timestamp: now,
            content: 'Bulk update: ' + this.bulkUpdateNote,
            updatedBy: this.userName,
            newStatus: this.bulkStatus
          })
        };
        
        // Add resolved/closed dates if applicable
        if (this.bulkStatus === 'Resolved') {
          update['dates.resolved'] = now;
        }
        if (this.bulkStatus === 'Closed') {
          update['dates.closed'] = now;
        }
        
        return this.firebaseService.updateDocument('complaints', complaintId, update);
      });
      
      await Promise.all(updatePromises);
      
      // Update local data
      this.selectedComplaintIds.forEach(complaintId => {
        const index = this.complaints.findIndex(c => c.id === complaintId);
        if (index !== -1) {
          this.complaints[index] = {
            ...this.complaints[index],
            status: this.bulkStatus,
            dates: {
              ...this.complaints[index].dates,
              updated: now,
              ...(this.bulkStatus === 'Resolved' ? { resolved: now } : {}),
              ...(this.bulkStatus === 'Closed' ? { closed: now } : {})
            },
            updates: [
              ...this.complaints[index].updates,
              {
                timestamp: now,
                content: 'Bulk update: ' + this.bulkUpdateNote,
                updatedBy: this.userName,
                newStatus: this.bulkStatus
              }
            ]
          };
        }
      });
      
      // Update statistics
      this.updateStatistics();
      
      // Close modal
      this.closeModals();
      
      alert('Successfully updated ' + this.selectedComplaintIds.length + ' complaints.');
      
    } catch (error) {
      console.error('Error performing bulk update:', error);
      alert('Error updating complaints. Please try again.');
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  openProfileModal(): void {
    // Implement profile modal logic here
    console.log('Open profile modal');
  }

  showInsightsModal = false;
  aiInsightsList = [
    'Harare is known as the "Sunshine City" for its beautiful weather and vibrant atmosphere. ☀️🌳',
    'The city boasts lush gardens, tree-lined avenues, and a welcoming community spirit. 🌺🌳🤝',
    'Harare is a hub for arts, culture, and innovation in Southern Africa. 🎨🎶💡',
    'Enjoy year-round mild temperatures and plenty of sunshine, making it ideal for outdoor activities. 🌞🏞️',
    'Harare\'s markets, restaurants, and festivals offer a taste of Zimbabwean hospitality and creativity. 🍲🎉🛍️',
    'Recent city initiatives focus on smart infrastructure, clean energy, and sustainable urban growth. 🌱🏙️🔋',
    'The city\'s education and healthcare sectors are among the best in the region. 🎓🏥',
    'Harare\'s vibrant nightlife and cultural scene attract visitors from across Africa. 🌃🎭',
    'The city is a leader in digital transformation and e-governance in Zimbabwe. 💻📊',
    'Harare\'s parks and recreational spaces are perfect for families and nature lovers. ��👨‍👩‍👧‍👦',
  ];
  currentInsightIndex = 0;
  showTrendsModal = false;
  trendsAndRisksList = [
    'There is a rising trend in water supply complaints during the dry season. 💧📈',
    'Road infrastructure complaints spike after heavy rains, indicating a need for improved drainage and road repairs. 🚧🌧️',
    'Waste management issues are more frequent in high-density suburbs. 🗑️🏘️',
    'Seasonal disease outbreaks, such as cholera, are linked to water and sanitation challenges in certain areas. 🦠🚱',
    'Community engagement can reduce illegal dumping and improve city cleanliness. 🤝♻️',
    'Smart city initiatives are helping to monitor and address emerging risks in real time. 📡🛡️',
    'Resource shortages, especially water and electricity, remain a key risk during peak demand periods. 💡🚱',
    'Public transport disruptions are more likely during the rainy season. 🚌🌧️',
    'Digital literacy programs are reducing risks associated with cyber threats. 🖥️🔒',
    'Climate change is increasing the frequency of extreme weather events, impacting city infrastructure. 🌦️🏗️',
  ];
  currentTrendIndex = 0;
  openInsightsModal() {
    this.showInsightsModal = true;
    this.currentInsightIndex = 0;
  }
  showNextInsight() {
    this.currentInsightIndex = (this.currentInsightIndex + 1) % this.aiInsightsList.length;
  }
  openTrendsModal() {
    this.showTrendsModal = true;
    this.currentTrendIndex = 0;
  }
  showNextTrend() {
    this.currentTrendIndex = (this.currentTrendIndex + 1) % this.trendsAndRisksList.length;
  }

  filteredStaff() {
    // Only show staff/admins whose department matches the current department
    return this.availableStaff.filter(staff => staff.department === this.department);
  }

  async deleteReply(complaint: Complaint, replyIndex: number): Promise<void> {
    if (!complaint || !complaint.updates || replyIndex < 0 || replyIndex >= complaint.updates.length) {
      console.error('Invalid reply or complaint');
      return;
    }
    try {
      // Remove the reply from the updates array
      const updatedUpdates = complaint.updates.filter((_, index) => index !== replyIndex);
      // Update local complaint data first
      if (this.replyComplaint && this.replyComplaint.id === complaint.id) {
        this.replyComplaint.updates = updatedUpdates;
      }
      const complaintIndex = this.complaints.findIndex(c => c.id === complaint.id);
      if (complaintIndex !== -1) {
        this.complaints[complaintIndex].updates = updatedUpdates;
      }
      // Update the updates array in the database
      await this.firebaseService.updateDocument('complaints', complaint.id!, {
        updates: updatedUpdates,
        'dates.updated': new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  }
}
