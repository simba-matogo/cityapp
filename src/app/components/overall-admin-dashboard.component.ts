import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { ActivityService } from '../services/activity.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-overall-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-900 dark:text-white flex flex-col"
         [ngClass]="{'dark': isDarkMode}">
      <!-- Modern Navbar -->
      <nav class="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-3">
              <img src="/city.png" alt="City Logo" class="h-10 w-10 object-contain">
              <div class="flex flex-col">
                <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Harare City Portal</span>
                <span class="text-xs text-slate-500 dark:text-slate-400">Overall Admin Dashboard</span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <!-- Theme Toggle -->
              <button (click)="toggleDarkMode()" class="p-2 text-slate-600 hover:text-blue-600 transition" [title]="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
              
              <!-- Notifications -->
              <button class="relative p-2 text-slate-600 hover:text-blue-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">{{totalUsersCount || 0}}</span>
              </button>
              <!-- User Menu -->
              <div class="relative group">
                <button class="flex items-center gap-2 p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-800 transition">
                  <span class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                    {{adminName[0]}}
                  </span>
                  <span class="hidden sm:block font-medium text-slate-700 dark:text-white">{{adminName}}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 invisible group-hover:visible transition-all">
                  <div class="p-3 border-b border-slate-200 dark:border-slate-700">
                    <p class="text-sm font-medium text-slate-700 dark:text-white">{{adminName}}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{adminRole}}</p>
                  </div>
                  <div class="p-2">
                    <button class="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition">Profile Settings</button>
                    <button class="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition">System Config</button>
                    <button (click)="logout()" class="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col items-center pt-8 pb-8 px-1 sm:px-2">
        <!-- Profile Card & AI Assistant -->
        <div class="w-full max-w-5xl flex flex-col gap-4 mb-6 md:flex-row md:gap-4">
          <!-- Super Admin Card (icon left, text right, reduced size) -->
          <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-3 flex flex-row items-center w-full md:w-60 h-28">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-10 w-10 text-blue-600 mr-3" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4" />
            </svg>
            <div class="flex flex-col items-start justify-center flex-1">
              <div class="font-semibold text-slate-700 text-sm">Super Admin</div>
              <div class="text-[11px] text-slate-500 mb-1">System-wide Management</div>
              <button class="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-semibold hover:bg-blue-700 transition">Profile Settings</button>
            </div>
          </div>
          <!-- AI Chat Assistant (reduced size) -->
          <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-3 flex flex-col items-center justify-center w-full md:w-60 h-28">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 15s1.5 2 4 2 4-2 4-2" />
                <path d="M9 9h.01M15 9h.01" />
              </svg>
              <span class="font-semibold text-slate-700 text-sm">AI Assistant</span>
            </div>
            <button class="mt-2 px-2 py-0.5 bg-purple-600 text-white rounded text-[11px] font-semibold hover:bg-purple-700 transition">Ask AI</button>
          </div>
          <!-- Manage Users Card (icon left, text right, styled to match Super Admin) -->
          <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-3 flex flex-row items-center w-full md:w-60 h-28">
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-10 w-10 text-blue-600 mr-3' fill='none' stroke='currentColor' stroke-width='2'>
              <circle cx='8' cy='10' r='4'/>
              <circle cx='16' cy='10' r='4'/>
              <path d='M2 21v-2.5A4.5 4.5 0 0 1 6.5 14h3A4.5 4.5 0 0 1 14 18.5V21M18 21v-2.5A4.5 4.5 0 0 0 15.5 14h-3'/>
            </svg>
            <div class="flex flex-col items-start justify-center flex-1">
              <div class="font-semibold text-slate-700 text-sm">Manage Users</div>
              <div class="text-[11px] text-green-600 mb-1">Active Users: {{ generalUsers.length }}</div>
              <button class="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-semibold hover:bg-blue-700 transition w-full md:w-auto" (click)="openViewUsersModal()">View</button>
            </div>
          </div>
          <!-- Manage Departments Card (icon left, text right, styled to match Super Admin) -->
          <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-2 flex flex-col items-center w-full gap-2 md:flex-row md:items-center md:w-60 md:h-28">
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-10 w-10 text-blue-600 mb-2 md:mb-0 md:mr-3' fill='none' stroke='currentColor' stroke-width='2'>
              <circle cx='9' cy='10' r='4'/>
              <path d='M15.5 14a4.5 4.5 0 0 1 3.5 4.5V21M2 21v-2.5A4.5 4.5 0 0 1 5.5 14M19.4 15a2 2 0 0 0 .4-2.5l-1-1.7a2 2 0 0 0-2.5-.4l-1.7 1a2 2 0 0 0-.4 2.5l1 1.7a2 2 0 0 0 2.5.4l1.7-1z'/>
            </svg>
            <div class="flex flex-col items-start justify-center flex-1 w-full">
              <div class="font-semibold text-slate-700 text-sm">Manage Departments</div>
              <div class="flex gap-2 mt-2 w-full">
                <button class="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-semibold hover:bg-blue-700 transition w-full md:w-auto" (click)="showAddDepartmentModal = true">Add Department</button>
                <button class="px-2 py-0.5 bg-green-600 text-white rounded text-[10px] font-semibold hover:bg-green-700 transition w-full md:w-auto" (click)="showAddAdminModal = true">Add Admin</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Cards Section -->
        <div class="w-full max-w-6xl grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 md:gap-6">
          <!-- Complaints Management -->
          <div class="bg-white/80 backdrop-blur rounded-xl border border-slate-100 shadow p-4 sm:p-6 flex flex-col">
            <div class="flex items-center mb-2">
              <span class="bg-blue-100 text-blue-600 rounded-full p-2 mr-2 flex items-center justify-center">
                <!-- Complaints Icon: Chat Bubble with Exclamation -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="#2563eb" stroke-width="2">
                  <path d="M21 12c0 3.866-3.582 7-8 7-1.07 0-2.09-.14-3-.4L3 20l1.4-3.6C3.52 15.02 3 13.56 3 12c0-3.866 3.582-7 8-7s8 3.134 8 7z" stroke="#2563eb" stroke-width="2" fill="#dbeafe"/>
                  <circle cx="12" cy="12" r="1.2" fill="#2563eb"/>
                  <rect x="11.25" y="8" width="1.5" height="3.2" rx="0.75" fill="#2563eb"/>
                </svg>
              </span>
              <h3 class="text-lg font-extrabold tracking-tight text-blue-700 ml-1">Complaints</h3>
            </div>
            <div class="flex flex-col gap-3">
              <!-- Complaint Cards (repeat for each complaint) -->
              <div class="bg-slate-50/80 rounded p-3 flex flex-col gap-2 border border-slate-100 hover:shadow-lg transition group" *ngFor="let complaint of (viewAllComplaints ? complaints : complaints.slice(0, 4))">
                <div class="flex items-center justify-between">
                  <div class="font-semibold text-slate-700">{{ complaint.title }}</div>
                  <span class="text-xs" [ngClass]="{'text-yellow-600 bg-yellow-100': complaint.status === 'New', 'text-green-600 bg-green-100': complaint.status === 'Resolved', 'text-red-600 bg-red-100': complaint.status === 'Overdue'}" class="rounded px-2 py-0.5">{{ complaint.status }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-full h-2 bg-slate-200 rounded">
                    <div class="h-2 bg-blue-500 rounded" [style.width.%]="(complaint.resolutionRate || 0)"></div>
                  </div>
                  <span class="text-[10px] text-slate-400">{{ complaint.resolutionRate }}%</span>
                </div>
                <div class="flex gap-2 mt-1 flex-wrap">
                  <button class="text-xs text-blue-600 hover:underline">Reply</button>
                  <button class="text-xs text-green-600 hover:underline">Assign</button>
                  <button class="text-xs text-red-600 hover:underline">Delete</button>
                  <button class="text-xs text-purple-600 hover:underline">AI Suggest</button>
                  <button class="text-xs text-slate-500 hover:underline">Details</button>
                </div>
              </div>
              <!-- More complaints... -->
            </div>
            <div class="flex justify-end mt-2">
              <button (click)="viewAllComplaints = !viewAllComplaints" class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition">
                {{ viewAllComplaints ? 'View Less' : 'View All' }}
              </button>
            </div>
          </div>
          <!-- Analytics & Reports and Trends & Risks stacked -->
          <div class="flex flex-col gap-6">
            <!-- Analytics & Reports Card -->
            <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-4 flex flex-col h-full">
              <div class="flex items-center mb-2 justify-between w-full">
                <span class="flex items-center">
                  <span class="bg-blue-100 text-blue-600 rounded-full p-2 mr-2 flex items-center justify-center">
                    <!-- Analytics/Report Icon: Network Bar (Signal Strength) -->
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' class='h-10 w-10' fill='none'>
                      <rect x='6' y='22' width='4' height='6' rx='1' fill='#2563eb'/>
                      <rect x='12' y='18' width='4' height='10' rx='1' fill='#3b82f6'/>
                      <rect x='18' y='12' width='4' height='16' rx='1' fill='#60a5fa'/>
                      <rect x='24' y='6' width='4' height='22' rx='1' fill='#93c5fd'/>
                    </svg>
                  </span>
                  <span class="font-semibold text-base text-slate-800">Analytics & Reports</span>
                </span>
              </div>
              <ul class="list-disc pl-5 text-xs text-slate-700">
                <li>Top Departments by Complaints</li>
                <li>Time to Resolution (avg)</li>
                <li>Urgent vs Normal Issues</li>
                <li>AI Trends & Predictions</li>
              </ul>
              <div class="mt-2 flex flex-row justify-center gap-2">
                <button class="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold tracking-wide" style="min-width:unset;">View Analytics</button>
                <button class="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold tracking-wide flex items-center" style="min-width:unset;">
                  Generate Report <span class="ml-1">📒</span>
                </button>
                <button class="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold tracking-wide flex items-center" style="min-width:unset;">
                  Prediction <span class="ml-1">🔮</span>
                </button>
              </div>
            </div>
            <!-- AI Insights and Trends & Risks Row -->
            <div class="w-full max-w-5xl mt-6 flex flex-row gap-6">
              <!-- AI Insights -->
              <div class="bg-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-4 flex flex-col flex-1" style="min-height:11.76rem;">
                <div class="flex items-center mb-2">
                  <span class="bg-purple-100 text-purple-600 rounded-full p-2 mr-2 flex items-center justify-center">
                    <!-- AI Insights Icon: Brain/AI -->
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-7 w-7' fill='none' stroke='currentColor' stroke-width='2'>
                      <path d='M12 4a8 8 0 0 0-8 8c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4a8 8 0 0 0-8-8z' stroke='#a21caf' fill='#f3e8ff'/>
                      <circle cx='9' cy='12' r='1' fill='#a21caf'/>
                      <circle cx='15' cy='12' r='1' fill='#a21caf'/>
                    </svg>
                  </span>
                  <h3 class="text-base font-semibold text-slate-800">AI Insights</h3>
                </div>
                <ul class="list-disc pl-5 text-xs text-slate-700">
                  <li *ngFor="let insight of aiInsights">{{ insight }}</li>
                </ul>
                <button class="mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold tracking-wide mx-auto" style="min-width:unset;">View AI Insights</button>
              </div>
              <!-- Trends & Risks Card (already styled and sized) -->
              <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-3 flex flex-col items-start justify-center w-full md:w-60" style="min-height:11.76rem;">
                <div class="flex items-center mb-2">
                  <span class="bg-red-100 text-red-600 rounded-full p-2 mr-2 flex items-center justify-center">
                    <!-- Trends & Risks Icon: Alert/Trend Graph -->
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-7 w-7' fill='none' stroke='currentColor' stroke-width='2'>
                      <polyline points='3,17 9,11 13,15 21,7' fill='none' stroke='#dc2626' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/>
                      <circle cx='3' cy='17' r='1.5' fill='#dc2626'/>
                      <circle cx='9' cy='11' r='1.5' fill='#dc2626'/>
                      <circle cx='13' cy='15' r='1.5' fill='#dc2626'/>
                      <circle cx='21' cy='7' r='1.5' fill='#dc2626'/>
                    </svg>
                  </span>
                  <h3 class="text-base font-semibold text-slate-800">Trends & Risks</h3>
                </div>
                <ul class="list-disc pl-5 text-xs text-slate-700">
                  <li>Emerging complaint patterns</li>
                  <li>Departments at risk</li>
                  <li>Seasonal risk factors</li>
                  <li>Infrastructure vulnerabilities</li>
                  <li>Community sentiment shifts</li>
                  <li>Recent spikes in complaints</li>
                  <li>Potential resource shortages</li>
                </ul>
                <button class="mt-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold tracking-wide mx-auto" style="min-width:unset;">View Trends</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="w-full max-w-5xl mt-6">
          <div class="bg-white/80 backdrop-blur rounded-xl border border-slate-100 shadow p-4 sm:p-6">              <div class="flex items-center mb-4">
                <span class="bg-blue-100 text-blue-600 rounded-full p-2 mr-2 flex items-center justify-center">
                  <!-- Activity Icon: Pulse/Heartbeat -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="#2563eb" stroke-width="2.2">
                    <polyline points="3 12 7 12 10 19 14 5 17 12 21 12" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <h3 class="text-lg font-extrabold tracking-tight text-blue-700 ml-1">Real-time Activity Log</h3>
              </div>
            
            <div class="max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              <ul class="divide-y divide-slate-100 text-sm">
                <li *ngFor="let activity of activityFeed" class="py-2 flex items-center group transition-colors hover:bg-blue-50 rounded-lg px-2">
                  <span [class]="'mr-2 h-2 w-2 rounded-full flex-shrink-0 ' + (activity.severity === 'warning' ? 'bg-yellow-500' : activity.severity === 'error' ? 'bg-red-500' : 'bg-green-500')"></span>
                  <span class="font-medium text-slate-700 group-hover:text-blue-700">{{ activity.message }}</span>
                  <span *ngIf="activity.timestamp" class="ml-auto text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 group-hover:bg-blue-200 group-hover:text-blue-800 transition-all">{{ activity.timestamp?.toDate() | date:'short' }}</span>
                </li>
                <li *ngIf="activityFeed.length === 0" class="py-4 text-center text-slate-500">
                  No activity logs to display
                </li>
              </ul>
            </div>
            
            <div class="flex justify-end mt-3">
              <button (click)="viewAllActivities = !viewAllActivities" class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition">
                {{ viewAllActivities ? 'View Less' : 'View All' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <footer class="w-full bg-white/80 backdrop-blur text-slate-400 border-t border-slate-200 py-3 px-4 sm:px-6 text-center text-xs mt-8">
        <p>© 2025 Harare City Portal. All rights reserved.</p>
      </footer>
    </div>

    <div *ngIf="showAddAdminModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-2xl w-[442px] md:w-[579px] max-w-full flex flex-col items-center" style="max-height:80vh; overflow-y:auto;">
        <div class="flex flex-col md:flex-row items-center md:justify-center w-full mb-3">
          <span class="relative inline-block mb-1 md:mb-0 md:mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute bottom-0 right-0 h-5 w-5 text-green-400 bg-white rounded-full border-2 border-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m4-4H8" />
            </svg>
          </span>
          <h3 class="text-xs md:text-sm font-extrabold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent tracking-wide drop-shadow-md text-center whitespace-nowrap md:ml-2">Add Department Admin</h3>
        </div>
        <form (ngSubmit)="addAdmin()" autocomplete="off" class="w-full text-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input [(ngModel)]="newAdmin.name" name="adminName" placeholder="Name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Surname</label>
              <input [(ngModel)]="newAdmin.surname" name="adminSurname" placeholder="Surname" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input [(ngModel)]="newAdmin.email" name="adminEmail" placeholder="Email" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input [(ngModel)]="newAdmin.password" name="adminPassword" placeholder="Password" type="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select [(ngModel)]="newAdmin.department" name="adminDepartment" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option *ngFor="let dept of departments" [value]="dept.name">{{ dept.name }}</option>
            </select>
          </div>
          <div class="flex justify-center" style="gap:1.3cm;">
            <button type="button" (click)="showAddAdminModal = false" class="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">Add</button>
          </div>
        </form>
      </div>
    </div>

    <div *ngIf="showViewUsersModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-[442px] md:w-[579px] max-w-full flex flex-col items-center" style="max-height:80vh; overflow-y:auto;">
        <div class="flex flex-col md:flex-row items-center md:justify-center w-full mb-3">
          <span class="relative inline-block mb-1 md:mb-0 md:mr-3">
            <!-- Blue User/Group Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4" fill="#dbeafe" stroke="#2563eb"/>
              <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4" stroke="#2563eb" stroke-width="2"/>
            </svg>
          </span>
          <h3 class="text-lg md:text-xl font-extrabold text-blue-700 dark:text-blue-400 tracking-wide drop-shadow-md text-center whitespace-nowrap md:ml-2">Active Users ({{totalUsersCount}})</h3>
        </div>
        <div class="w-full text-sm">
          <div class="grid grid-cols-5 font-bold border-b border-slate-200 dark:border-slate-700 pb-2 mb-2 text-slate-800 dark:text-slate-300">
            <div>Name</div>
            <div>Surname</div>
            <div>Email</div>
            <div>Role</div>
            <div>Actions</div>
          </div>
          <ng-container *ngIf="users && users.length > 0">
            <ng-container *ngFor="let user of (viewAllUsers ? users : users.slice(0, 5))">
              <div class="grid grid-cols-5 items-center border-b border-slate-200 dark:border-slate-700 py-2 text-slate-700 dark:text-slate-300">
                <div>{{ user.name || 'N/A' }}</div>
                <div>{{ user.surname || 'N/A' }}</div>
                <div>{{ user.email || 'N/A' }}</div>
                <div>
                  <span [ngClass]="{
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': user.role === 'overalladmin',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': user.role === 'departmentadmin',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': user.role === 'generaluser'
                  }" class="px-2 py-1 rounded-full text-xs">
                    {{ user.role === 'overalladmin' ? 'Overall Admin' : 
                       user.role === 'departmentadmin' ? 'Dept Admin' : 
                       user.role === 'generaluser' ? 'General User' : 
                       'Unknown' }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <button (click)="deleteUser(user.id)" class="ml-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                    <svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
                      <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12'/>
                    </svg>
                  </button>
                </div>
              </div>
            </ng-container>
          </ng-container>
          <div class="flex justify-center mt-2" *ngIf="users && users.length > 5">
            <button *ngIf="!viewAllUsers" (click)="viewAllUsers = true" class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded text-xs font-semibold">View All</button>
            <button *ngIf="viewAllUsers" (click)="viewAllUsers = false" class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded text-xs font-semibold">View Less</button>
          </div>
        </div>
        <div class="flex justify-center mt-4">
          <button (click)="closeViewUsersModal()" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition">Close</button>
        </div>
      </div>
    </div>

    <div *ngIf="showAddDepartmentModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-2xl w-[442px] md:w-[420px] max-w-full flex flex-col items-center" style="max-height:80vh; overflow-y:auto;">
        <div class="flex flex-col items-center w-full mb-3">
          <span class="inline-block mb-2">
            <!-- Department Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="10" width="18" height="8" rx="2" fill="#dbeafe" stroke="#2563eb"/>
              <rect x="7" y="6" width="10" height="4" rx="1.5" fill="#93c5fd" stroke="#2563eb"/>
              <rect x="9" y="14" width="2" height="4" rx="1" fill="#2563eb"/>
              <rect x="13" y="14" width="2" height="4" rx="1" fill="#2563eb"/>
            </svg>
          </span>
          <h3 class="text-xs md:text-sm font-extrabold text-blue-700 tracking-wide text-center">Add Department</h3>
        </div>
        <form (ngSubmit)="addDepartment()" autocomplete="off" class="w-full text-sm">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
            <input [(ngModel)]="newDepartment.name" name="departmentName" placeholder="Department Name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea [(ngModel)]="newDepartment.description" name="departmentDescription" placeholder="Short description" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div class="flex justify-center gap-6">
            <button type="button" (click)="showAddDepartmentModal = false" class="px-4 py-2 bg-gray-300 rounded-lg">Close</button>
            <button type="submit" class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">Create</button>
          </div>
        </form>
      </div>
    </div>

    <div *ngIf="showViewDepartmentsModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded-lg shadow-2xl w-[95vw] max-w-md flex flex-col items-center" style="max-height:80vh; overflow-y:auto;">
        <div class="flex flex-col items-center w-full mb-3">
          <span class="inline-block mb-2">
            <!-- Department Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="10" width="18" height="8" rx="2" fill="#dbeafe" stroke="#2563eb"/>
              <rect x="7" y="6" width="10" height="4" rx="1.5" fill="#93c5fd" stroke="#2563eb"/>
              <rect x="9" y="14" width="2" height="4" rx="1" fill="#2563eb"/>
              <rect x="13" y="14" width="2" height="4" rx="1" fill="#2563eb"/>
            </svg>
          </span>
          <h3 class="text-base font-extrabold text-blue-700 tracking-wide text-center">Departments & Admins</h3>
        </div>
        <div class="w-full text-xs">
          <div class="grid grid-cols-2 font-bold border-b pb-2 mb-2">
            <div>Department</div>
            <div>Admin(s)</div>
          </div>
          <ng-container *ngFor="let dept of departments">
            <div class="grid grid-cols-2 items-center border-b py-2">
              <div>{{ dept.name }}</div>
              <div>
                <ng-container *ngFor="let admin of getDepartmentAdmins(dept.name)">
                  <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-0.5 mr-1 mb-1">{{ admin.name }}</span>
                </ng-container>
                <span *ngIf="getDepartmentAdmins(dept.name).length === 0" class="text-slate-400">None</span>
              </div>
            </div>
          </ng-container>
        </div>
        <div class="flex justify-center mt-4">
          <button (click)="showViewDepartmentsModal = false" class="px-4 py-2 bg-gray-300 rounded-lg">Close</button>
        </div>
      </div>
    </div>


  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: #94a3b8;
    }
  `]
})
export class OverallAdminDashboardComponent implements OnInit, OnDestroy {
  stats = {
    users: 120,
    departmentAdmins: 8,
    departments: 5,
    complaints: 230,
    resolved: 180,
    pending: 30,
    overdue: 20
  };
  aiInsights = [
    'Water & Sanitation has the highest complaint resolution rate.',
    'Predicted spike in road maintenance complaints next month.',
    'Most common issue: Water outages.',
    'Department Admin John resolved 15 complaints this week.'
  ];
  complaints: any[] = [];
  users: any[] = [];
  admins: any[] = [];
  departments: any[] = [];
  announcements: { message: string, date: string }[] = [];
  newAnnouncement = '';
  aiQuery = '';
  aiResponse = '';
  showAddAdminModal = false;
  newAdmin = { name: '', surname: '', email: '', password: '', department: '' };
  showAddDepartmentModal = false;
  showViewUsersModal = false;
  generalUsers: any[] = [];
  generalUsersSub?: Subscription;
  viewAllUsers: boolean = false;
  activityFeed: any[] = [];
  private activityUnsub?: () => void;
  viewAllActivities: boolean = false;
  viewAllComplaints: boolean = false;
  newDepartment = { name: '', description: '' };
  showViewDepartmentsModal = false;
  adminName: string = '';
  adminRole: string = 'Overall Admin';
  isDarkMode: boolean = false;
  totalUsersCount: number = 0;
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private activityService: ActivityService,
    private themeService: ThemeService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Fetch admin user info
    this.getCurrentAdminInfo();
    
    // TODO: Replace with real fetch logic
    this.complaints = [
      { id: '1', title: 'Burst pipe', department: 'Water', status: 'New', user: 'User A', date: new Date().toISOString() },
      { id: '2', title: 'No water', department: 'Water', status: 'In Progress', user: 'User B', date: new Date().toISOString() },
      { id: '3', title: 'Pothole', department: 'Roads', status: 'Pending', user: 'User C', date: new Date().toISOString() }
    ];
    this.users = [
      { id: 'u1', name: 'User A', email: 'a@email.com', role: 'generaluser' },
      { id: 'u2', name: 'User B', email: 'b@email.com', role: 'departmentadmin' }
    ];
    this.admins = [
      { id: 'a1', name: 'Admin John', department: 'Water' },
      { id: 'a2', name: 'Admin Jane', department: 'Roads' }
    ];
    this.departments = [
      { id: 'd1', name: 'Water & Sanitation' },
      { id: 'd2', name: 'Roads' }
    ];
    this.announcements = [
      { message: 'System maintenance scheduled for Friday', date: new Date().toISOString() }
    ];
    
    // Set up real-time activity monitoring
    this.setupActivityFeed();
    
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
  
  /**
   * Sets up the real-time activity feed using ActivityService
   */
  setupActivityFeed() {
    // Set up real-time listener for activities
    this.activityUnsub = this.activityService.listenToActivities((activities) => {
      // Update the activity feed with the latest data
      this.activityFeed = activities.map(activity => {
        // Format the activity for display if needed
        return {
          ...activity,
          // Ensure message is set (fallback to the action if message is missing)
          message: activity.message || `${activity.action} by ${activity.userEmail || 'system'}`
        };
      });
    }, 20); // Retrieve the 20 most recent activities
    
    // Log that the dashboard was accessed
    this.activityService.logActivity(
      'dashboard_access', 
      'Overall Admin Dashboard accessed', 
      '', 
      'info'
    );
  }
  
  /**
   * Test method for notifications
   */
  testNotifications() {
    this.notificationService.showSuccess('✅ Test Success Message!\nThis is a multiline success notification.', 4000);
    setTimeout(() => {
      this.notificationService.showInfo('ℹ️ Test Info Message!\nThis is a multiline info notification.', 4000);
    }, 1000);
    setTimeout(() => {
      this.notificationService.showWarning('⚠️ Test Warning Message!\nThis is a multiline warning notification.', 4000);
    }, 2000);
    setTimeout(() => {
      this.notificationService.showError('❌ Test Error Message!\nThis is a multiline error notification.', 4000);
    }, 3000);
  }



  postAnnouncement() {
    if (this.newAnnouncement.trim()) {
      const announcementId = Date.now().toString();
      this.announcements.unshift({ 
        message: this.newAnnouncement, 
        date: new Date().toISOString() 
      });
      
      // Log the announcement creation
      this.activityService.logActivity(
        'add_announcement',
        `New announcement posted: "${this.newAnnouncement.substring(0, 30)}${this.newAnnouncement.length > 30 ? '...' : ''}"`,
        announcementId
      );
      
      this.notificationService.showSuccess('Announcement posted!');
      this.newAnnouncement = '';
    }
  }

  deleteUser(userId: string) {
    this.users = this.users.filter(u => u.id !== userId);
    this.notificationService.showSuccess('User deleted!');
  }

  deleteAdmin(adminId: string) {
    this.admins = this.admins.filter(a => a.id !== adminId);
    this.notificationService.showSuccess('Department admin deleted!');
  }

  deleteDepartment(deptId: string) {
    this.departments = this.departments.filter(d => d.id !== deptId);
    this.notificationService.showSuccess('Department deleted!');
  }

  askAI() {
    // Placeholder for AI integration
    this.aiResponse = 'AI says: ' + (this.aiQuery || 'Ask a question about city data, complaints, or trends!');
  }

  async addAdmin() {
    try {
      const result = await this.authService.signUp(
        this.newAdmin.email,
        this.newAdmin.password,
        'departmentadmin',
        this.newAdmin.department
      );
      
      const adminId = Date.now().toString();
      
      this.admins.push({
        id: adminId,
        name: this.newAdmin.name,
        department: this.newAdmin.department
      });
      
      // Log the admin creation
      this.activityService.logActivity(
        'add_user',
        `New department admin "${this.newAdmin.name}" created for ${this.newAdmin.department} department`,
        adminId,
        'info'
      );
      
      this.notificationService.showSuccess('Department admin created!');
      this.showAddAdminModal = false;
      this.newAdmin = { name: '', surname: '', email: '', password: '', department: '' };
    } catch (error) {
      this.notificationService.showError('Failed to create admin: ' + (error as any).message);
    }
  }

  openViewUsersModal() {
    this.showViewUsersModal = true;
    if (this.generalUsersSub) this.generalUsersSub.unsubscribe();
    
    // Use UserService to get all users
    this.userService.users$.subscribe(allUsers => {
      this.users = allUsers;
      this.cdr.detectChanges();
    });
  }

  closeViewUsersModal() {
    this.showViewUsersModal = false;
    if (this.generalUsersSub) {
      this.generalUsersSub.unsubscribe();
      this.generalUsersSub = undefined;
    }
  }

  addDepartment() {
    if (this.newDepartment.name.trim()) {
      const deptId = Date.now().toString();
      this.departments.push({
        id: deptId,
        name: this.newDepartment.name,
        description: this.newDepartment.description
      });
      
      // Log the department creation
      this.activityService.logActivity(
        'add_department',
        `New department "${this.newDepartment.name}" created`,
        deptId
      );
      
      this.notificationService.showSuccess('Department created!');
      this.showAddDepartmentModal = false;
      this.newDepartment = { name: '', description: '' };
    } else {
      this.notificationService.showError('Department name is required.');
    }
  }

  getDepartmentAdmins(deptName: string) {
    return this.admins ? this.admins.filter(a => a.department === deptName) : [];
  }

  logout() {
    // Log the logout action before actually logging out
    this.activityService.logActivity(
      'logout', 
      'Administrator logged out', 
      this.authService.auth.currentUser?.uid || ''
    );
    
    this.authService.logout();
    // Navigate to login page
    window.location.href = '/';
  }

  async getCurrentAdminInfo() {
    const currentUser = this.authService.auth.currentUser;
    if (currentUser && currentUser.uid) {
      try {
        const userDoc: any = await this.firebaseService.getDocument('users', currentUser.uid);
        if (userDoc) {
          // Set admin name
          if (userDoc.name) {
            this.adminName = userDoc.name + (userDoc.surname ? ' ' + userDoc.surname : '');
          } else if (currentUser.email) {
            // fallback to email prefix
            const emailName = currentUser.email.split('@')[0];
            this.adminName = emailName.replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
          }
          
          // Set admin role based on database role
          if (userDoc.role) {
            switch(userDoc.role.toLowerCase()) {
              case 'overalladmin':
                this.adminRole = 'Overall Admin';
                break;
              case 'departmentadmin':
                this.adminRole = userDoc.department 
                  ? `${userDoc.department} Admin` 
                  : 'Department Admin';
                break;
              case 'admin':
                this.adminRole = 'Administrator';
                break;
              default:
                this.adminRole = 'System User';
            }
          }
        }
      } catch (error) {
        console.error('Error fetching admin info:', error);
      }
    }
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    if (this.generalUsersSub) this.generalUsersSub.unsubscribe();
    
    // Unsubscribe from activity feed listener
    if (this.activityUnsub) {
      this.activityUnsub();
      
      // Log that the dashboard was closed
      this.activityService.logActivity('dashboard_close', 'Overall Admin Dashboard closed');
    }
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
