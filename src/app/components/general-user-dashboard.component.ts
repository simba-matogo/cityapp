import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { Complaint } from '../models/complaint.model';
import { Announcement } from '../models/announcement.model';
import { AnnouncementService } from '../services/announcement.service';
import { ComplaintService } from '../services/complaint.service';
import { doc, updateDoc } from '@angular/fire/firestore';
import { AiChatComponent } from './ai-chat.component';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-general-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AiChatComponent],
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
                    <div class="text-xs text-slate-500 font-medium mt-1">Citizen</div>
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
                <div class="bg-white rounded-md border border-gray-200 pl-1 pr-2 py-0.5 w-fit shadow-sm">
                  <div class="flex items-center gap-0">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </div>
                    <div class="flex items-center ml-1 gap-1">
                      <p class="text-xs font-bold text-gray-700 leading-tight">Total</p>
                      <p class="text-sm font-extrabold text-gray-900 leading-none">{{totalComplaints}}</p>
                    </div>
                  </div>
                </div>
                <div class="bg-white rounded-md border border-gray-200 pl-1 pr-2 py-0.5 w-fit shadow-sm">
                  <div class="flex items-center gap-0">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex items-center ml-1 gap-1">
                      <p class="text-xs font-bold text-gray-700 leading-tight">Resolved</p>
                      <p class="text-sm font-extrabold text-gray-900 leading-none">{{resolvedComplaints}}</p>
                    </div>
                  </div>
                </div>
                <div class="bg-white rounded-md border border-gray-200 pl-1 pr-2 py-0.5 w-fit shadow-sm">
                  <div class="flex items-center gap-0">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex items-center ml-1 gap-1">
                      <p class="text-xs font-bold text-gray-700 leading-tight">Pending</p>
                      <p class="text-sm font-extrabold text-gray-900 leading-none">{{pendingComplaints}}</p>
                    </div>
                  </div>
                </div>
                <div class="bg-white rounded-md border border-gray-200 pl-1 pr-2 py-0.5 w-fit shadow-sm">
                  <div class="flex items-center gap-0">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex items-center ml-1 gap-1">
                      <p class="text-xs font-bold text-gray-700 leading-tight">Overdue</p>
                      <p class="text-sm font-extrabold text-gray-900 leading-none">{{overdueComplaints}}</p>
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
              <!-- Scrollable Complaints Container -->
              <div class="max-h-96 overflow-y-auto pr-2">
                <div class="flex flex-col gap-3">
                  <div *ngIf="loading" class="text-center text-slate-500 py-4">
                    Loading complaints...
                  </div>
                  <div *ngIf="!loading && complaints.length === 0" class="text-center text-slate-500 py-4">
                    No complaints found. Submit your first complaint to get started.
                  </div>
                  <!-- Complaint Cards -->
                  <div class="bg-slate-50/80 rounded p-3 flex flex-col gap-2 border border-slate-100 hover:shadow-lg transition group" 
                       *ngFor="let complaint of complaints">
                  <div class="flex items-center justify-between">
                    <div class="font-semibold text-slate-700">{{ complaint.title }}</div>
                    <div class="flex items-center gap-2">
                      <!-- Reply Button with Count -->
                      <button 
                        *ngIf="getReplyCount(complaint) > 0"
                        (click)="openReplyModal(complaint)"
                        class="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                        title="View replies">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span class="font-medium">{{ getReplyCount(complaint) }}</span>
                      </button>
                      <span class="text-xs rounded px-2 py-0.5" 
                            [ngClass]="{
                              'text-yellow-600 bg-yellow-100': getComplaintStatus(complaint) === 'New' || getComplaintStatus(complaint) === 'Pending', 
                              'text-green-600 bg-green-100': getComplaintStatus(complaint) === 'Resolved', 
                              'text-blue-600 bg-blue-100': getComplaintStatus(complaint) === 'In Progress',
                              'text-red-600 bg-red-100': getComplaintStatus(complaint) === 'Overdue'
                            }">
                        {{ getComplaintStatus(complaint) }}
                      </span>
                      <button 
                        (click)="openDeleteConfirmModal(complaint)"
                        class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete complaint">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
                </div>
              </div>
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
              <!-- Compact Update Items with Single Announcement Display and Scroll -->
              <div class="h-32 overflow-y-auto pr-2">
                <div class="space-y-1">
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
              <button 
              (click)="openAiChat()"
              class="px-4 py-2 bg-purple-600 text-white rounded text-sm font-semibold hover:bg-purple-700 transition">Ask AI</button>
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
      </main>

      <!-- Modern Footer with Smart City AI Information -->
      <footer class="bg-white text-gray-800 py-12 mt-12 border-t border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- AI Innovation Section -->
          <div class="mb-10">
            <div class="flex items-center justify-center mb-6">
              <div class="h-1 bg-gradient-to-r from-blue-600 to-indigo-600 w-20 rounded-full mr-3"></div>
              <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">SmartCity AI Ecosystem</h2>
              <div class="h-1 bg-gradient-to-r from-indigo-600 to-blue-600 w-20 rounded-full ml-3"></div>
            </div>
            <p class="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              Powering Harare's future through intelligent systems that improve city services, enhance citizen experience, and enable data-driven governance.
            </p>
            
            <!-- Smart City AI Features -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-800">Predictive Analytics</h3>
                </div>
                <p class="text-sm text-gray-600">Our AI systems analyze patterns in service requests to predict future needs, allowing proactive resource allocation and maintenance scheduling.</p>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-800">NLP-Powered Complaints</h3>
                </div>
                <p class="text-sm text-gray-600">Natural Language Processing automatically categorizes, prioritizes, and routes your complaints to the right department, reducing response times by up to 60%.</p>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-800">City Resource Mapping</h3>
                </div>
                <p class="text-sm text-gray-600">Geospatial AI analyzes city infrastructure data to optimize resource allocation, identify service gaps, and guide urban planning decisions.</p>
              </div>
            </div>
          </div>
          

          
          <!-- Regular Footer Content -->
          <div class="grid grid-cols-1 gap-4">
            <div class="text-center">
              <h3 class="text-sm font-semibold text-gray-800 mb-1">Contact</h3>
              <div class="text-xs text-gray-600">
                <a href="mailto:smart&#64;hararecity.gov.zw" class="hover:text-blue-600 transition">smart&#64;hararecity.gov.zw</a>
              </div>
            </div>
          </div>
          
          <!-- Copyright with AI Assistant Info -->
          <div class="mt-8 pt-8 border-t border-gray-300 text-center">
            <div class="flex justify-center items-center mb-4">
              <span class="bg-blue-600 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 012 2z" />
                </svg>
              </span>
              <p class="text-sm text-gray-600">This platform is powered by <span class="font-semibold text-blue-600">CityAI Assistant</span>, processing over 5,000 citizen requests daily with 98% accuracy</p>
            </div>
            <p class="text-sm text-gray-600">&copy; 2025 Harare Smart City Portal. All rights reserved.</p>
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
              <p class="text-sm text-gray-600">{{ selectedComplaint?.title }}</p>
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
          <div *ngIf="getReplies(selectedComplaint).length === 0" class="text-center text-gray-500 py-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No replies yet</p>
          </div>
          
          <div *ngFor="let reply of getReplies(selectedComplaint); let i = index" class="mb-4 last:mb-0">
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <!-- Reply Header -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="bg-blue-100 text-blue-600 rounded-full p-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <div>
                    <p class="font-semibold text-gray-800 text-sm">{{ getReplierName(reply.updatedBy) }}</p>
                    <p class="text-xs text-gray-500">{{ getReplierRole(reply.updatedBy) }}</p>
                  </div>
                </div>
                <span class="text-xs text-gray-500">{{ formatReplyDate(reply.timestamp) }}</span>
              </div>
              
              <!-- Reply Content -->
              <div class="bg-white rounded p-3 border border-gray-100">
                <div class="flex justify-between items-start">
                  <p class="text-sm text-gray-700 leading-relaxed flex-1">{{ reply.content }}</p>
                  <button 
                    (click)="openDeleteReplyConfirmModal(selectedComplaint!, i)"
                    class="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Delete reply">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
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

    <!-- Delete Reply Confirmation Modal -->
    <div *ngIf="showDeleteReplyConfirmModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="bg-red-100 text-red-600 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Delete Reply</h3>
              <p class="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          <button (click)="closeDeleteReplyConfirmModal()" class="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-4">
          <p class="text-gray-700 mb-4">
            Are you sure you want to delete this reply?
          </p>
          <div class="bg-gray-50 rounded p-3 mb-4">
            <p class="text-sm text-gray-600 italic">"{{ getReplyContentToDelete() }}"</p>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex gap-3 p-4 border-t border-gray-200">
          <button 
            (click)="closeDeleteReplyConfirmModal()"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
            Cancel
          </button>
          <button 
            (click)="confirmDeleteReply()"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
            Delete Reply
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteConfirmModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="bg-red-100 text-red-600 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Delete Complaint</h3>
              <p class="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          <button (click)="closeDeleteConfirmModal()" class="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-4">
          <p class="text-gray-700 mb-4">
            Are you sure you want to delete the complaint "<strong>{{ complaintToDelete?.title }}</strong>"?
          </p>
          <p class="text-sm text-gray-600 mb-6">
            This will permanently remove the complaint from the system and cannot be recovered.
          </p>
        </div>

        <!-- Modal Actions -->
        <div class="flex gap-3 p-4 border-t border-gray-200">
          <button 
            (click)="closeDeleteConfirmModal()"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
            Cancel
          </button>
          <button 
            (click)="confirmDeleteComplaint()"
            [disabled]="deletingComplaint"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!deletingComplaint">Delete Complaint</span>
            <span *ngIf="deletingComplaint" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </span>
          </button>
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
            <img src="assets/dev.jpg" alt="Developer" class="w-20 h-20 rounded-full object-cover mb-2 shadow" />
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

    <!-- AI Chat Component -->
            <app-ai-chat #aiChat></app-ai-chat>

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
  showAboutModal: boolean = false;
  showDeleteConfirmModal: boolean = false;
  complaintToDelete: Complaint | null = null;
  deletingComplaint: boolean = false;
  showReplyModal: boolean = false;
  selectedComplaint: Complaint | null = null;
  showDeleteReplyConfirmModal: boolean = false;
  replyToDelete: { complaint: Complaint; index: number } | null = null;
  showAiChatModal: boolean = false;

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
    private announcementService: AnnouncementService,
    private complaintService: ComplaintService,
    private chatService: ChatService
  ) {}

  @ViewChild(AiChatComponent) aiChat!: AiChatComponent;

  // AI Chat functionality
  openAiChat() {
    if (this.aiChat) {
      this.aiChat.openChat();
    } else {
      console.error('AI Chat component not found');
    }
  }

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
      
      // Log the real counts for debugging
      console.log('Real complaint counts:', {
        total: this.totalComplaints,
        resolved: this.resolvedComplaints,
        pending: this.pendingComplaints,
        overdue: this.overdueComplaints
      });
      
      // Force change detection to ensure UI updates
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 100);
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
      // Reset all counts to 0
      this.totalComplaints = 0;
      this.resolvedComplaints = 0;
      this.pendingComplaints = 0;
      this.overdueComplaints = 0;
      
      this.stats = {
        totalComplaints: 0,
        pendingComplaints: 0,
        resolvedComplaints: 0,
        inProgressComplaints: 0
      };
      return;
    }

    // Calculate real counts from complaints data
    this.totalComplaints = this.complaints.length;
    this.resolvedComplaints = this.complaints.filter(c => c.status === 'Resolved').length;
    this.pendingComplaints = this.complaints.filter(c => 
      c.status === 'PendingReview' || 
      c.status === 'New'
    ).length;
    
    // Calculate overdue complaints (complaints older than 7 days that are not resolved)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    this.overdueComplaints = this.complaints.filter(c => {
      if (c.status === 'Resolved') return false; // Resolved complaints are not overdue
      
      const createdDate = new Date(c.dates.created);
      return createdDate < sevenDaysAgo;
    }).length;

    // Update stats object for backward compatibility
    this.stats = {
      totalComplaints: this.totalComplaints,
      pendingComplaints: this.pendingComplaints,
      resolvedComplaints: this.resolvedComplaints,
      inProgressComplaints: this.complaints.filter(c => c.status === 'InProgress').length
    };

    // Calculate additional metrics
    this.calculateResponseTimeMetrics();
    this.calculateSatisfactionMetrics();
    this.calculateEfficiencyMetrics();
  }

  // Calculate response time metrics
  private calculateResponseTimeMetrics() {
    const resolvedComplaints = this.complaints.filter(c => c.status === 'Resolved');
    if (resolvedComplaints.length === 0) {
      this.averageResponseTime = 0;
      this.responseTimeChange = 0;
      this.isResponseTimeImproved = false;
      return;
    }

    let totalResponseTime = 0;
    resolvedComplaints.forEach(complaint => {
      const createdDate = new Date(complaint.dates.created);
      const resolvedDate = new Date(complaint.dates.updated);
      const responseTime = resolvedDate.getTime() - createdDate.getTime();
      totalResponseTime += responseTime;
    });

    this.averageResponseTime = totalResponseTime / resolvedComplaints.length;
    // For demo purposes, assume 10% improvement
    this.responseTimeChange = -10;
    this.isResponseTimeImproved = true;
  }

  // Calculate satisfaction metrics
  private calculateSatisfactionMetrics() {
    const resolvedComplaints = this.complaints.filter(c => c.status === 'Resolved');
    if (resolvedComplaints.length === 0) {
      this.satisfactionRate = 0;
      this.satisfactionChange = 0;
      this.isSatisfactionImproved = false;
      return;
    }

    // For demo purposes, calculate based on resolution time
    const quickResolutions = resolvedComplaints.filter(complaint => {
      const createdDate = new Date(complaint.dates.created);
      const resolvedDate = new Date(complaint.dates.updated);
      const daysToResolve = (resolvedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysToResolve <= 3; // Resolved within 3 days
    });

    this.satisfactionRate = (quickResolutions.length / resolvedComplaints.length) * 100;
    this.satisfactionChange = 5; // Assume 5% improvement
    this.isSatisfactionImproved = true;
  }

  // Calculate efficiency metrics
  private calculateEfficiencyMetrics() {
    if (this.totalComplaints === 0) {
      this.efficiencyScore = 0;
      this.efficiencyChange = 0;
      this.isEfficiencyImproved = false;
      return;
    }

    // Calculate efficiency based on resolution rate and response time
    const resolutionRate = (this.resolvedComplaints / this.totalComplaints) * 100;
    const responseTimeScore = Math.max(0, 100 - (this.averageResponseTime / (1000 * 60 * 60 * 24))); // Days to hours
    
    this.efficiencyScore = (resolutionRate + responseTimeScore) / 2;
    this.efficiencyChange = 8; // Assume 8% improvement
    this.isEfficiencyImproved = true;
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
    // Ensure stats are updated after refresh
    this.updateComplaintStats();
    this.cdr.detectChanges();
  }

  // Get complaint status with proper formatting
  getComplaintStatus(complaint: Complaint): string {
    if (!complaint || !complaint.status) {
      return 'Unknown';
    }
    return complaint.status;
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

  openProfileModal(): void {
    // Implement profile modal logic here
    console.log('Open profile modal');
  }

  // Delete complaint methods
  openDeleteConfirmModal(complaint: Complaint): void {
    this.complaintToDelete = complaint;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.complaintToDelete = null;
    this.deletingComplaint = false;
  }

  async confirmDeleteComplaint(): Promise<void> {
    if (!this.complaintToDelete || !this.complaintToDelete.id) {
      console.error('No complaint selected for deletion');
      return;
    }

    try {
      this.deletingComplaint = true;
      
      // Delete the complaint from the database
      await this.complaintService.deleteComplaint(this.complaintToDelete.id);
      
      // Remove the complaint from the local array
      this.complaints = this.complaints.filter(c => c.id !== this.complaintToDelete!.id);
      
      // Update statistics
      this.updateComplaintStats();
      
      // Close the modal
      this.closeDeleteConfirmModal();
      
      // Show success message (you can implement a notification service here)
      console.log('Complaint deleted successfully');
      
    } catch (error) {
      console.error('Error deleting complaint:', error);
      // Show error message (you can implement a notification service here)
      this.error = 'Failed to delete complaint. Please try again.';
    } finally {
      this.deletingComplaint = false;
    }
  }

  // Reply functionality methods
  getReplyCount(complaint: Complaint): number {
    if (!complaint.updates) return 0;
    // Count updates that are replies (not status updates)
    return complaint.updates.filter(update => 
      update.content && !update.content.includes('status') && !update.content.includes('assigned')
    ).length;
  }

  openReplyModal(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    this.showReplyModal = true;
  }

  closeReplyModal(): void {
    this.showReplyModal = false;
    this.selectedComplaint = null;
  }

  getReplies(complaint: Complaint | null): any[] {
    if (!complaint || !complaint.updates) return [];
    // Filter updates to get only replies (not status updates)
    return complaint.updates.filter(update => 
      update.content && !update.content.includes('status') && !update.content.includes('assigned')
    );
  }

  getReplierName(updatedBy: string): string {
    // This would need to be enhanced to get actual user names from a user service
    // For now, return a formatted version of the user ID
    if (updatedBy === 'system') return 'System';
    if (updatedBy.includes('admin')) return 'Administrator';
    return updatedBy || 'Unknown User';
  }

  getReplierRole(updatedBy: string): string {
    // Determine role based on user ID or other logic
    if (updatedBy === 'system') return 'System';
    
    // Check for specific admin types
    const lowerUpdatedBy = updatedBy.toLowerCase();
    
    if (lowerUpdatedBy.includes('overall') || lowerUpdatedBy.includes('super') || lowerUpdatedBy.includes('master')) {
      return 'Overall Admin';
    }
    
    if (lowerUpdatedBy.includes('department') || lowerUpdatedBy.includes('dept') || lowerUpdatedBy.includes('water') || 
        lowerUpdatedBy.includes('roads') || lowerUpdatedBy.includes('waste') || lowerUpdatedBy.includes('general')) {
      return 'Department Admin';
    }
    
    if (lowerUpdatedBy.includes('admin') || lowerUpdatedBy.includes('administrator')) {
      return 'Administrator';
    }
    
    // Check for specific department names
    const departments = ['water', 'sanitation', 'roads', 'transport', 'waste', 'management', 'general', 'services'];
    if (departments.some(dept => lowerUpdatedBy.includes(dept))) {
      return 'Department Admin';
    }
    
    return 'Staff Member';
  }

  openDeleteReplyConfirmModal(complaint: Complaint, replyIndex: number): void {
    this.replyToDelete = { complaint, index: replyIndex };
    this.showDeleteReplyConfirmModal = true;
  }

  closeDeleteReplyConfirmModal(): void {
    this.showDeleteReplyConfirmModal = false;
    this.replyToDelete = null;
  }

  async confirmDeleteReply(): Promise<void> {
    if (!this.replyToDelete) return;

    const { complaint, index } = this.replyToDelete;
    await this.deleteReply(complaint, index);
    this.closeDeleteReplyConfirmModal();
  }

  getReplyContentToDelete(): string {
    if (!this.replyToDelete || !this.replyToDelete.complaint || !this.replyToDelete.complaint.updates) {
      return 'No content available';
    }
    
    const { complaint, index } = this.replyToDelete;
    if (index === undefined || index < 0 || index >= complaint.updates.length) {
      return 'No content available';
    }
    
    return complaint.updates[index]?.content || 'No content available';
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
      const complaintIndex = this.complaints.findIndex(c => c.id === complaint.id);
      if (complaintIndex !== -1) {
        this.complaints[complaintIndex].updates = updatedUpdates;
      }
      
      // Manually update the updates array in the database
      const complaintRef = doc(this.firebaseService.getFirestore(), 'complaints', complaint.id!);
      await updateDoc(complaintRef, {
        updates: updatedUpdates,
        'dates.updated': new Date().toISOString()
      });
      
      console.log('Reply deleted successfully');
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  }

  formatReplyDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  showInsightsModal = false;
  aiInsightsList = [
    'Harare is known as the "Sunshine City" for its beautiful weather and vibrant atmosphere. ☀️🌳',
    'The city boasts lush gardens, tree-lined avenues, and a welcoming community spirit. 🌺🌳🤝',
    'Harare is a hub for arts, culture, and innovation in Southern Africa. 🎨🎶💡',
    'Enjoy year-round mild temperatures and plenty of sunshine, making it ideal for outdoor activities. 🌞🏞️',
    "Harare's markets, restaurants, and festivals offer a taste of Zimbabwean hospitality and creativity. 🍲🎉🛍️",
    'Recent city initiatives focus on smart infrastructure, clean energy, and sustainable urban growth. 🌱🏙️🔋',
    "The city's education and healthcare sectors are among the best in the region. 🎓🏥",
    "Harare's vibrant nightlife and cultural scene attract visitors from across Africa. 🌃🎭",
    'The city is a leader in digital transformation and e-governance in Zimbabwe. 💻📊',
    "Harare's parks and recreational spaces are perfect for families and nature lovers. 🌳👨‍👩‍👧‍👦",
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
}