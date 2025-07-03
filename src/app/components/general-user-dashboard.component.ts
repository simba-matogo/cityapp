import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { Complaint } from '../models/complaint.model';
import { Announcement } from '../models/announcement.model';
import { AnnouncementService } from '../services/announcement.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-general-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen" [class]="isDarkMode ? 'bg-gray-900' : 'bg-slate-50'">
      <!-- Modern Navbar -->
      <nav class="sticky top-0 z-50 w-full backdrop-blur-lg border-b shadow-sm" 
           [class]="isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-slate-200'">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-3">
              <img src="/city.png" alt="City Logo" class="h-10 w-10 object-contain">
              <div class="flex flex-col">
                <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Harare City Portal</span>
                <span class="text-xs" [class]="isDarkMode ? 'text-gray-400' : 'text-slate-500'">General User Dashboard</span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <!-- Dark Mode Toggle -->
              <button (click)="toggleDarkMode()" 
                      class="p-2 rounded-lg transition-all duration-200" 
                      [class]="isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'"
                      title="Toggle dark mode">
                <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
              
              <!-- User Menu -->
              <div class="relative group">
                <button class="flex items-center gap-2 p-2 rounded-full transition" 
                        [class]="isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-100 hover:bg-blue-50'">
                  <span class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                    {{userName[0]}}
                  </span>
                  <span class="hidden sm:block font-medium" [class]="isDarkMode ? 'text-gray-200' : 'text-slate-700'">{{userName}}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" [class]="isDarkMode ? 'text-gray-400' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div class="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border invisible group-hover:visible transition-all" 
                     [class]="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'">
                  <div class="p-3 border-b" [class]="isDarkMode ? 'border-gray-700' : 'border-slate-200'">
                    <p class="text-sm font-medium" [class]="isDarkMode ? 'text-gray-200' : 'text-slate-700'">{{userName}}</p>
                    <p class="text-xs" [class]="isDarkMode ? 'text-gray-400' : 'text-slate-500'">Citizen</p>
                  </div>
                  <div class="p-2">
                    <button class="w-full text-left px-3 py-2 text-sm rounded-md transition" 
                            [class]="isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-slate-700 hover:bg-slate-50'">Profile Settings</button>
                    <button class="w-full text-left px-3 py-2 text-sm rounded-md transition" 
                            [class]="isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-slate-700 hover:bg-slate-50'">Help Center</button>
                    <button (click)="logout()" class="w-full text-left px-3 py-2 text-sm rounded-md transition" 
                            [class]="isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Smart City Citizen Portal Banner -->
      <div class="border-b" [class]="isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-100'">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div class="flex items-center justify-center gap-2 text-center">
            <!-- City icons animation -->
            <div class="flex items-center gap-1">
              <svg class="w-5 h-5 text-green-500 animate-bounce" style="animation-delay: 0.2s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            
            <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <span class="text-sm font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                🏙️ Smart City Citizen Portal 🏙️
              </span>
              <span class="hidden sm:inline" [class]="isDarkMode ? 'text-gray-500' : 'text-slate-400'">•</span>
              <span class="text-xs flex items-center gap-1" [class]="isDarkMode ? 'text-gray-300' : 'text-slate-600'">
                <svg class="w-3 h-3 text-purple-500 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                🌟 Your Voice • Our Priority • Better Tomorrow 🌟
              </span>
            </div>
            
            <!-- More city icons -->
            <div class="flex items-center gap-1">
              <svg class="w-5 h-5 text-blue-400 animate-bounce" style="animation-delay: 0.8s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

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
                <div *ngFor="let announcement of announcements" 
                     class="border border-slate-100 rounded-lg p-2 hover:shadow-sm transition-shadow cursor-pointer bg-white/60"
                     (click)="viewAnnouncement(announcement)">
                  <div class="flex items-start justify-between mb-1">
                    <h4 class="font-medium text-slate-800 text-xs truncate flex-1">{{ announcement.title }}</h4>
                    <span class="text-[9px] text-slate-400 ml-2 flex-shrink-0">{{ formatAnnouncementDate(announcement.dates.created) }}</span>
                  </div>
                  <div class="flex items-center gap-1 mb-1">
                    <span class="text-[8px] px-1.5 py-0.5 rounded-full" [ngClass]="getAnnouncementPriorityColor(announcement.priority)">
                      {{ announcement.priority }}
                    </span>
                    <span *ngIf="announcement.isUrgent" class="text-[8px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                      Urgent
                    </span>
                    <span class="text-[8px] text-slate-500">{{ announcement.department }}</span>
                  </div>
                  <p class="text-[9px] text-slate-600 line-clamp-2">{{ announcement.content }}</p>
                  <div class="flex items-center justify-between mt-1">
                    <div class="flex items-center gap-2 text-[8px] text-slate-400">
                      <span class="flex items-center gap-0.5">
                        <svg class="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {{ announcement.views || 0 }}
                      </span>
                      <span class="flex items-center gap-0.5">
                        <svg class="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {{ announcement.likes || 0 }}
                      </span>
                    </div>
                    <span class="text-[8px] px-1 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {{ announcement.type }}
                    </span>
                  </div>
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

      <!-- Modern Footer with Smart City AI Information -->
      <footer class="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- AI Innovation Section -->
          <div class="mb-10">
            <div class="flex items-center justify-center mb-6">
              <div class="h-1 bg-gradient-to-r from-blue-400 to-indigo-400 w-20 rounded-full mr-3"></div>
              <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300">SmartCity AI Ecosystem</h2>
              <div class="h-1 bg-gradient-to-r from-indigo-400 to-blue-400 w-20 rounded-full ml-3"></div>
            </div>
            <p class="text-center text-blue-200 mb-8 max-w-3xl mx-auto">
              Powering Harare's future through intelligent systems that improve city services, enhance citizen experience, and enable data-driven governance.
            </p>
            
            <!-- Smart City AI Features -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-blue-800 bg-opacity-30 p-4 rounded-lg border border-blue-700 hover:border-blue-500 transition">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 class="text-lg font-semibold text-blue-300">Predictive Analytics</h3>
                </div>
                <p class="text-sm text-blue-200">Our AI systems analyze patterns in service requests to predict future needs, allowing proactive resource allocation and maintenance scheduling.</p>
              </div>
              
              <div class="bg-blue-800 bg-opacity-30 p-4 rounded-lg border border-blue-700 hover:border-blue-500 transition">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <h3 class="text-lg font-semibold text-blue-300">NLP-Powered Complaints</h3>
                </div>
                <p class="text-sm text-blue-200">Natural Language Processing automatically categorizes, prioritizes, and routes your complaints to the right department, reducing response times by up to 60%.</p>
              </div>
              
              <div class="bg-blue-800 bg-opacity-30 p-4 rounded-lg border border-blue-700 hover:border-blue-500 transition">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <h3 class="text-lg font-semibold text-blue-300">City Resource Mapping</h3>
                </div>
                <p class="text-sm text-blue-200">Geospatial AI analyzes city infrastructure data to optimize resource allocation, identify service gaps, and guide urban planning decisions.</p>
              </div>
            </div>
          </div>
          
          <!-- Statistics Bar -->
          <div class="flex flex-wrap justify-center gap-8 py-6 border-t border-b border-blue-800 mb-10">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-300">93%</div>
              <div class="text-xs text-blue-200">Issue Resolution Rate</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-300">2.5hr</div>
              <div class="text-xs text-blue-200">Avg Response Time</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-300">15k+</div>
              <div class="text-xs text-blue-200">Citizens Engaged</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-300">24/7</div>
              <div class="text-xs text-blue-200">AI-Powered Support</div>
            </div>
          </div>
          
          <!-- Regular Footer Content -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Contact Us</h3>
              <div class="space-y-2">
                <p class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 012 2z" />
                  </svg>
                  <a href="mailto:smart&#64;hararecity.gov.zw" class="hover:text-blue-300 transition">smart&#64;hararecity.gov.zw</a>
                </p>
                <p class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+263-4-753777" class="hover:text-blue-300 transition">+263-4-753777</a>
                </p>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div class="space-y-2">
                <a href="#" class="flex items-center hover:text-blue-300 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  SmartCity Initiative
                </a>
                <a href="#" class="flex items-center hover:text-blue-300 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Open Data Portal
                </a>
                <a href="#" class="flex items-center hover:text-blue-300 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Developer API
                </a>
                <a href="#" class="flex items-center hover:text-blue-300 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Privacy Policy
                </a>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Emergency Contacts</h3>
              <div class="space-y-2">
                <p class="flex items-center gap-2">
                  <span class="text-red-400 font-semibold">Emergency:</span>
                  <a href="tel:999" class="hover:text-blue-300 transition">999</a>
                </p>
                <p class="flex items-center gap-2">
                  <span class="text-yellow-300 font-semibold">Fire Brigade:</span>
                  <a href="tel:994" class="hover:text-blue-300 transition">994</a>
                </p>
                <p class="flex items-center gap-2">
                  <span class="text-green-400 font-semibold">Smart City Helpdesk:</span>
                  <a href="tel:+263-4-700800" class="hover:text-blue-300 transition">+263-4-700800</a>
                </p>
              </div>
            </div>
          </div>
          
          <!-- Copyright with AI Assistant Info -->
          <div class="mt-8 pt-8 border-t border-blue-800 text-center">
            <div class="flex justify-center items-center mb-4">
              <span class="bg-blue-800 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 012 2z" />
                </svg>
              </span>
              <p class="text-sm text-blue-200">This platform is powered by <span class="font-semibold text-blue-300">CityAI Assistant</span>, processing over 5,000 citizen requests daily with 98% accuracy</p>
            </div>
            <p class="text-sm text-blue-300">&copy; 2025 Harare Smart City Portal. All rights reserved.</p>
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
                <option value="Water and Sanitation">Water and Sanitation</option>
                <option value="Roads and Transport">Roads and Transport</option>
                <option value="Waste Management">Waste Management</option>
                <option value="General Services">General Services</option>
                <option value="Other">Other</option>
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
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
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
                required
                class="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Street address or landmark"
              >
              <div *ngIf="formErrors['location']" class="text-red-500 text-xs mt-0.5">This field is required</div>
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
  isDarkMode: boolean = false;
  
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
  announcements: Announcement[] = [];

  // New complaint form
  newComplaint: {
    title: string;
    description: string;
    department: string;
    category: string;
    location: string;
    priority: string;
  } = {
    title: '',
    description: '',
    department: '',
    category: '',
    location: '',
    priority: 'Medium'
  };
  showComplaintModal: boolean = false;
  submittingComplaint: boolean = false;
  formErrors: { [key: string]: boolean } = {};
  locationAddress: string = '';

  // Stats
  stats = {
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    inProgressComplaints: 0
  };

  // Loading and error states
  loading: boolean = true;
  error: string | null = null;

  // Additional properties
  totalUsersCount: number = 0;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private themeService: ThemeService,
    private announcementService: AnnouncementService
  ) {}

  async ngOnInit() {
    await this.getCurrentUserInfo();
    await this.loadComplaints();
    await this.loadAnnouncements();
    this.updateComplaintStats();
    this.loadThemePreference();
    this.activityFeed = [
      { message: 'Complaint #C-7829 updated', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { message: 'Complaint #C-7651 resolved', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { message: 'Submitted new complaint', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
    ];
    await this.loadAnnouncements();
    
    // Subscribe to total user count
    this.userService.getTotalUserCount().subscribe(count => {
      this.totalUsersCount = count;
      this.cdr.detectChanges();
    });
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
      console.log('Total complaints fetched:', complaints.length);
      const currentUserEmail = currentUser.email?.toLowerCase() || '';
      
      this.complaints = complaints.filter((complaint: any) => {
        const submitterEmail = complaint.submittedBy?.email?.toLowerCase() || '';
        const isUsersComplaint = submitterEmail === currentUserEmail;
        return isUsersComplaint;
      }).map((complaint: any) => ({
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

  // Load announcements for the user
  async loadAnnouncements() {
    try {
      const userData = this.authService.getCurrentUserData();
      const userRole = userData?.role || 'generaluser';
      const userDepartment = userData?.department;
      
      this.announcementService.getAnnouncementsForUser(userRole, userDepartment).subscribe(
        announcements => {
          this.announcements = announcements.slice(0, 5); // Show only latest 5
          this.cdr.detectChanges();
        }
      );
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  }

  // Format date for announcements
  formatAnnouncementDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Get announcement priority color
  getAnnouncementPriorityColor(priority: string): string {
    switch (priority) {
      case 'Critical':
        return 'text-red-600 bg-red-100';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Medium':
        return 'text-blue-600 bg-blue-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  // View announcement details and increment view count
  async viewAnnouncement(announcement: Announcement) {
    if (announcement.id) {
      await this.announcementService.incrementViewCount(announcement.id);
    }
    // You can implement a modal or navigation to full announcement view here
    console.log('Viewing announcement:', announcement.title);
  }

  // Update complaint statistics
  updateComplaintStats() {
    if (!this.complaints || this.complaints.length === 0) {
      this.stats = {
        totalComplaints: 0,
        pendingComplaints: 0,
        resolvedComplaints: 0,
        inProgressComplaints: 0
      };
      return;
    }

    this.stats = {
      totalComplaints: this.complaints.length,
      pendingComplaints: this.complaints.filter(c => c.status === 'PendingReview' || c.status === 'New').length,
      resolvedComplaints: this.complaints.filter(c => c.status === 'Resolved').length,
      inProgressComplaints: this.complaints.filter(c => c.status === 'InProgress').length
    };
  }

  // Logout user
  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  // Open complaint modal
  openComplaintModal() {
    this.showComplaintModal = true;
  }

  // Close complaint modal
  closeComplaintModal() {
    this.showComplaintModal = false;
  }

  // Refresh complaints
  async refreshComplaints() {
    this.loading = true;
    await this.loadComplaints();
  }

  // Get complaint status with proper formatting
  getComplaintStatus(complaint: Complaint): string {
    if (!complaint || !complaint.status) {
      return 'Unknown';
    }
    return complaint.status;
  }

  // Get progress percentage for a complaint
  getProgress(complaint: Complaint): number {
    if (!complaint || !complaint.status) {
      return 0;
    }
    
    switch (complaint.status) {
      case 'New':
        return 10;
      case 'PendingReview':
        return 25;
      case 'InProgress':
        return 60;
      case 'Resolved':
        return 100;
      case 'Closed':
        return 100;
      default:
        return 0;
    }
  }

  // Submit new complaint
  async submitComplaint() {
    if (!this.newComplaint.title || !this.newComplaint.description || !this.newComplaint.department) {
      this.error = 'Please fill in all required fields';
      return;
    }

    try {
      this.submittingComplaint = true;
      const currentUser = this.authService.auth.currentUser;
      
      if (!currentUser) {
        this.error = 'User not authenticated';
        this.submittingComplaint = false;
        return;
      }

      const userData = this.authService.getCurrentUserData();
      
      const complaint: Partial<Complaint> = {
        title: this.newComplaint.title,
        description: this.newComplaint.description,
        department: this.newComplaint.department as any,
        category: this.newComplaint.category || 'General',
        location: {
          address: this.newComplaint.location || ''
        },
        priority: this.newComplaint.priority as any,
        status: 'New',
        submittedBy: {
          userId: currentUser.uid,
          name: userData?.name || currentUser.displayName || 'Anonymous',
          contact: '',
          email: currentUser.email || ''
        },
        dates: {
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        },
        mediaUrls: [],
        updates: [],
        tags: [],
        votes: 0,
        isAnonymous: false,
        isPublic: true
      };

      const complaintId = await this.firebaseService.addDocument('complaints', complaint);
      
      // Reset form
      this.newComplaint = {
        title: '',
        description: '',
        department: '',
        category: '',
        location: '',
        priority: 'Medium'
      };
      
      this.closeComplaintModal();
      await this.refreshComplaints();
      
      // Show success message
      console.log('Complaint submitted successfully with ID:', complaintId);
      
    } catch (error) {
      console.error('Error submitting complaint:', error);
      this.error = 'Failed to submit complaint. Please try again.';
    } finally {
      this.submittingComplaint = false;
    }
  }
}