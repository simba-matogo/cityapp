import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { ActivityService } from '../services/activity.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { ComplaintService } from '../services/complaint.service';
import { AnnouncementService } from '../services/announcement.service';
import { DepartmentService } from '../services/department.service';
import { Complaint, Status, Priority } from '../models/complaint.model';
import { Announcement } from '../models/announcement.model';
import { AiPoweredFeaturesComponent } from './ai-powered-features.component';
import { AiChatComponent } from './ai-chat.component';
import { NotificationContainerComponent } from './notification-container.component';


@Component({
  selector: 'app-overall-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AiPoweredFeaturesComponent, AiChatComponent, NotificationContainerComponent],
  providers: [NotificationService],
  template: `
    <div class="min-h-screen flex flex-col" [class]="isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-100 to-blue-50'">
      <app-notification-container></app-notification-container>
      <!-- Modern Navbar -->
      <nav class="sticky top-0 z-50 w-full backdrop-blur-lg border-b shadow-sm" 
           [class]="isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-slate-200'">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-3">
              <img src="/city.png" alt="City Logo" class="h-10 w-10 object-contain">
              <div class="flex flex-col">
                <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Harare City Portal</span>
                <span class="text-xs" [class]="isDarkMode ? 'text-gray-400' : 'text-slate-500'">Overall Admin Dashboard</span>
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
                    {{adminName[0]}}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div class="absolute right-0 mt-2 w-60 rounded-xl shadow-lg border border-slate-200 bg-white z-50 invisible group-hover:visible transition-all">
                  <div class="flex flex-col items-center p-5 border-b border-slate-100">
                    <span class="h-14 w-14 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-700 border border-slate-300 mb-2">
                      {{adminName[0]}}
                    </span>
                    <div class="font-bold text-slate-800 text-lg">{{adminName}}</div>
                    <div class="text-xs text-slate-500 font-medium mt-1">{{adminRole}}</div>
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

      <!-- Smart City Administration Banner -->
      <div class="border-b" [class]="isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100'">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div class="flex items-center justify-center gap-2 text-center">
            <!-- Admin icons animation -->
            <div class="flex items-center gap-1">
              <svg class="w-5 h-5 text-indigo-500 animate-bounce" style="animation-delay: 0.2s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            
            <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <span class="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                👑 Smart City Command Center 👑
              </span>
              <span class="hidden sm:inline" [class]="isDarkMode ? 'text-gray-500' : 'text-slate-400'">•</span>
              <span class="text-xs flex items-center gap-1" [class]="isDarkMode ? 'text-gray-300' : 'text-slate-600'">
                <svg class="w-3 h-3 text-purple-500 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                ⚙️ Coordinate • Monitor • Optimize ⚙️
              </span>
            </div>
            
            <!-- More admin icons -->
            <div class="flex items-center gap-1">
              <svg class="w-5 h-5 text-purple-400 animate-bounce" style="animation-delay: 0.8s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col items-center pt-8 pb-8 px-1 sm:px-2">
        <!-- Profile Card & AI Assistant -->
        <div class="w-full max-w-5xl flex flex-col gap-4 mb-6 md:flex-row md:gap-4">
          <!-- Super Admin Card (Profile Settings) -->
          <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-3 flex flex-row items-center flex-1 h-28 mx-4 sm:mx-8 md:basis-[32%]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-10 w-10 text-blue-600 mr-3" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4" />
            </svg>
            <div class="flex flex-col items-start justify-center flex-1">
              <div class="font-semibold text-slate-700 text-sm">Super Admin</div>
              <div class="text-[11px] text-slate-500 mb-1">System-wide Management</div>
              <button class="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-semibold hover:bg-blue-700 transition" (click)="openProfileModal()">Profile Settings</button>
            </div>
          </div>
          <!-- AI Chat Assistant -->
          <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-3 flex flex-row items-center flex-1 h-28 mx-4 sm:mx-8 md:basis-[32%]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-10 w-10 text-purple-600 mr-3" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 15s1.5 2 4 2 4-2 4-2" />
                <path d="M9 9h.01M15 9h.01" />
              </svg>
            <div class="flex flex-col items-start justify-center flex-1">
              <div class="font-semibold text-slate-700 text-sm">AI Assistant</div>
              <div class="text-[11px] text-slate-500 mb-1">Your Smart City AI assistant</div>
              <button class="px-2 py-0.5 bg-purple-600 text-white rounded text-[11px] font-semibold hover:bg-purple-700 transition" (click)="openAiChat()">Ask AI</button>
            </div>
          </div>
          <!-- Manage Users Card -->
          <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-3 flex flex-row items-center flex-1 h-28 mx-4 sm:mx-8 md:basis-[32%]">
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-10 w-10 text-blue-600 mr-3' fill='none' stroke='currentColor' stroke-width='2'>
              <circle cx='8' cy='10' r='4'/>
              <circle cx='16' cy='10' r='4'/>
              <path d='M2 21v-2.5A4.5 4.5 0 0 1 6.5 14h3A4.5 4.5 0 0 1 14 18.5V21M18 21v-2.5A4.5 4.5 0 0 0 15.5 14h-3'/>
            </svg>
            <div class="flex flex-col items-start justify-center flex-1">
              <div class="font-semibold text-slate-700 text-sm">Manage Users</div>
              <div class="text-[11px] text-green-600 mb-1">Active Users: {{ totalUsersCount }}</div>
              <button class="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-semibold hover:bg-blue-700 transition w-full md:w-auto" (click)="openViewUsersModal()">View</button>
            </div>
          </div>
          <!-- Manage Departments Card -->
          <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-2 flex flex-col items-center flex-1 gap-2 md:flex-row md:items-center h-28 mx-4 sm:mx-8 md:basis-[32%]">
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-10 w-10 text-blue-600 mb-2 md:mb-0 md:mr-3' fill='none' stroke='currentColor' stroke-width='2'>
              <circle cx='9' cy='10' r='4'/>
              <path d='M15.5 14a4.5 4.5 0 0 1 3.5 4.5V21M2 21v-2.5A4.5 4.5 0 0 1 5.5 14M19.4 15a2 2 0 0 0 .4-2.5l-1-1.7a2 2 0 0 0-2.5-.4l-1.7 1a2 2 0 0 0-.4 2.5l1 1.7a2 2 0 0 0 2.5.4l1.7-1z'/>
            </svg>
            <div class="flex flex-col items-start justify-center flex-1 w-full">
              <div class="font-semibold text-slate-700 text-sm">Manage Departments</div>
              <div class="flex gap-2 mt-2 w-full">
                <button class="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-semibold hover:bg-blue-700 transition w-full md:w-auto" (click)="showAddDepartmentModal = true; refreshAdminData()">Department</button>
                <button class="px-2 py-0.5 bg-green-600 text-white rounded text-[10px] font-semibold hover:bg-green-700 transition w-full md:w-auto" (click)="showAddAdminModal = true">Admin</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Cards Section -->
        <div class="w-full max-w-8xl grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 md:gap-6">
          <!-- Complaints Management -->
          <div class="bg-white/80 backdrop-blur rounded-xl border border-slate-100 shadow p-4 sm:p-6 flex flex-col md:col-span-2">
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
            <!-- Scrollable Complaints Container -->
            <div class="max-h-96 overflow-y-auto pr-2">
              <div class="flex flex-col gap-3">
                <div *ngIf="loading" class="text-center text-slate-500 py-4">
                  Loading complaints...
                </div>
                <div *ngIf="!loading && complaints.length === 0" class="text-center text-slate-500 py-4">
                  No complaints found.
                </div>
                <!-- Complaint Cards -->
                <div class="bg-slate-50/80 rounded p-3 flex flex-col gap-2 border border-slate-100 hover:shadow-lg transition group" 
                     *ngFor="let complaint of complaints">
                  <div class="flex items-center justify-between">
                    <div class="font-semibold text-slate-700">{{ complaint.title }}</div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs rounded px-2 py-0.5" 
                            [ngClass]="{
                              'text-yellow-600 bg-yellow-100': complaint.status === 'New' || complaint.status === 'PendingReview', 
                              'text-green-600 bg-green-100': complaint.status === 'Resolved', 
                              'text-blue-600 bg-blue-100': complaint.status === 'InProgress',
                              'text-red-600 bg-red-100': complaint.status === 'Reopened'
                            }">
                        {{ getComplaintStatus(complaint) }}
                      </span>
                      <span class="text-xs rounded px-2 py-0.5" 
                            [ngClass]="getPriorityClass(complaint.priority)">
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
                    <button class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition" (click)="openStatusModal(complaint, 'Resolved')">Resolved</button>
                    <button class="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition" (click)="openStatusModal(complaint, 'InProgress')">In Progress</button>
                    <button class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition" (click)="openStatusModal(complaint, 'PendingReview')">On Review</button>
                    <button class="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition" (click)="openDeleteConfirmModal(complaint)">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Powered Features Section -->
        <app-ai-powered-features></app-ai-powered-features>

      </div>
      <!-- Footer -->
      <footer class="w-full bg-white/80 backdrop-blur text-slate-400 border-t border-slate-200 py-3 px-4 sm:px-6 text-center text-xs mt-8">
        <p>© 2025 Harare City Portal. All rights reserved.</p>
      </footer>
    </div>

    <div *ngIf="showAddAdminModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg flex flex-col items-center mx-4 sm:mx-8" style="max-height:80vh; overflow-y:auto;">
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
              <option *ngFor="let dept of getUniqueDepartments()" [value]="dept.name">{{ dept.name }}</option>
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
      <div class="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg flex flex-col items-center mx-4 sm:mx-8" style="max-height:80vh; overflow-y:auto;">
        <div class="flex flex-col md:flex-row items-center md:justify-center w-full mb-3">
          <span class="relative inline-block mb-1 md:mb-0 md:mr-3">
            <!-- Blue User/Group Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4" fill="#dbeafe" stroke="#2563eb"/>
              <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4" stroke="#2563eb" stroke-width="2"/>
            </svg>
          </span>
          <h3 class="text-lg md:text-xl font-extrabold text-blue-700 tracking-wide drop-shadow-md text-center whitespace-nowrap md:ml-2">Active Users ({{totalUsersCount}})</h3>
        </div>
        <div class="w-full text-sm">
          <div class="grid grid-cols-5 font-bold border-b border-slate-200 pb-2 mb-2 text-slate-800">
            <div>Name</div>
            <div>Surname</div>
            <div>Email</div>
            <div>Role</div>
            <div>Actions</div>
          </div>
          <ng-container *ngIf="users && users.length > 0">
            <ng-container *ngFor="let user of (viewAllUsers ? users : users.slice(0, 5))">
              <div class="grid grid-cols-5 items-center border-b border-slate-200 py-2 text-slate-700">
                <div>{{ user.name || 'N/A' }}</div>
                <div>{{ user.surname || 'N/A' }}</div>
                <div>{{ user.email || 'N/A' }}</div>
                <div>
                  <span [ngClass]="{
                    'bg-blue-100 text-blue-800': user.role === 'overalladmin',
                    'bg-green-100 text-green-800': user.role === 'departmentadmin',
                    'bg-purple-100 text-purple-800': user.role === 'generaluser'
                  }" class="px-2 py-1 rounded-full text-xs">
                    {{ user.role === 'overalladmin' ? 'Overall Admin' : 
                       user.role === 'departmentadmin' ? 'Dept Admin' : 
                       user.role === 'generaluser' ? 'General User' : 
                       'Unknown' }}
                  </span>
                  <span *ngIf="user.approved === false" class="ml-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-bold">Pending</span>
                  <button *ngIf="user.approved === false && (user.role === 'departmentadmin' || user.role === 'overalladmin')"
                          (click)="approveUser(user)"
                          class="ml-2 px-2 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 transition">Approve</button>
                </div>
                <div class="flex items-center justify-between">
                  <button *ngIf="user.approved === false && (user.role === 'departmentadmin' || user.role === 'overalladmin')"
                          (click)="approveUser(user)"
                          class="px-2 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 transition">Approve</button>
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
      <div class="bg-white p-6 rounded-lg shadow-2xl w-[95vw] max-w-4xl flex flex-col items-center" style="max-height:90vh; overflow-y:auto;">
        <div class="flex flex-col items-center w-full mb-4">
          <span class="inline-block mb-2">
            <!-- Department Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="10" width="18" height="8" rx="2" fill="#dbeafe" stroke="#2563eb"/>
              <rect x="7" y="6" width="10" height="4" rx="1.5" fill="#93c5fd" stroke="#2563eb"/>
              <rect x="9" y="14" width="2" height="4" rx="1" fill="#2563eb"/>
              <rect x="13" y="14" width="2" height="4" rx="1" fill="#2563eb"/>
            </svg>
          </span>
          <h3 class="text-lg font-extrabold text-blue-700 tracking-wide text-center">Manage Departments</h3>
        </div>



        <!-- Existing Departments Section -->
        <div class="w-full mb-6">
          <h4 class="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Existing Departments & Admins</h4>
          <div class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div class="font-bold text-gray-700 border-b pb-1">Department</div>
              <div class="font-bold text-gray-700 border-b pb-1">Description</div>
              <div class="font-bold text-gray-700 border-b pb-1">Admin(s)</div>
              <div class="font-bold text-gray-700 border-b pb-1">Actions</div>
              
              <ng-container *ngFor="let dept of getUniqueDepartments()">
                <div class="py-2 border-b border-gray-200">
                  <div class="font-semibold text-blue-600">{{ dept.name }}</div>
                  <div class="text-xs text-gray-500 mt-1" *ngIf="dept.banner">{{ dept.banner }}</div>
                </div>
                <div class="py-2 border-b border-gray-200">
                  <div class="text-gray-600">{{ dept.description || 'No description' }}</div>
                </div>
                <div class="py-2 border-b border-gray-200">
                  <div class="flex flex-wrap gap-1">
                    <ng-container *ngFor="let admin of getDepartmentAdmins(dept.name)">
                      <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 text-xs">{{ admin.name }}</span>
                    </ng-container>
                    <span *ngIf="getDepartmentAdmins(dept.name).length === 0" class="text-slate-400 text-xs">None assigned</span>
                  </div>
                </div>
                <div class="py-2 border-b border-gray-200">
                  <button 
                    (click)="deleteDepartment(dept.id)" 
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete department">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </ng-container>
            </div>
          </div>
        </div>

        <!-- Add New Department Section -->
        <div class="w-full">
          <h4 class="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Add New Department</h4>
        <form (ngSubmit)="addDepartment()" autocomplete="off" class="w-full text-sm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
            <input [(ngModel)]="newDepartment.name" name="departmentName" placeholder="Department Name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Banner Text</label>
                <input [(ngModel)]="newDepartment.banner" name="departmentBanner" placeholder="e.g., 🏗️ Building Our City's Future 🏗️" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea [(ngModel)]="newDepartment.description" name="departmentDescription" placeholder="Short description of the department's responsibilities" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
            <div class="flex justify-center gap-4">
              <button type="button" (click)="showAddDepartmentModal = false" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Close</button>
              <button type="submit" class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">Create Department</button>
          </div>
        </form>
        </div>
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
          <ng-container *ngFor="let dept of getUniqueDepartments()">
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

    <!-- Clear Log Confirmation Modal -->
    <div *ngIf="showClearLogModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-6 w-[442px] md:w-[450px] max-w-full flex flex-col items-center" style="max-height:80vh; overflow-y:auto;">
        <!-- Loading State -->
        <div *ngIf="clearingLog && !clearLogSuccess" class="flex flex-col items-center w-full">
          <div class="inline-block mb-4">
            <!-- Rotating Loading Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-blue-700 dark:text-blue-400 text-center mb-2">Clearing Log...</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 text-center">
            Please wait while we clear the activity log.
          </p>
        </div>

        <!-- Success State -->
        <div *ngIf="clearLogSuccess" class="flex flex-col items-center w-full">
          <div class="inline-block mb-4">
            <!-- Green Check Icon with bounce animation -->
            <div class="h-20 w-20 bg-gradient-to-br from-green-100/80 to-emerald-50/80 backdrop-blur border border-green-200 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-bold text-green-700 text-center mb-2">Success!</h3>
          <p class="text-sm text-green-600 text-center">
            Activity log has been cleared successfully.
          </p>
        </div>

        <!-- Confirmation State -->
        <div *ngIf="!clearingLog && !clearLogSuccess" class="flex flex-col items-center w-full">
          <div class="inline-block mb-4">
            <!-- Warning Icon with animation -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-red-500 drop-shadow-lg animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-red-700 dark:text-red-400 text-center mb-4">Clear Activity Log</h3>
          <div class="text-center mb-6 space-y-3">
            <p class="text-base text-slate-700 dark:text-slate-300">
              
            </p>
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p class="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                Are you sure you want to clear the entire activity log?
              </p>
              <p class="text-sm font-semibold text-red-600 dark:text-red-400">
                Only the Chief Admin should perform this operation.
              </p>
              <p class="text-sm font-semibold text-red-600 dark:text-red-400">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div class="flex justify-center gap-4 w-full">
            <button (click)="cancelClearLog()" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition">
              Cancel
            </button>
            <button (click)="confirmClearLog()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Clear Log
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reply Modal -->
    <div *ngIf="showReplyModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-[500px] max-w-full">
        <h3 class="text-lg font-bold text-blue-700 mb-4">Reply to Complaint</h3>
        <div class="mb-4">
          <p class="text-sm font-medium text-slate-700">Complaint: {{ currentComplaint?.title }}</p>
          <p class="text-xs text-slate-500">{{ currentComplaint?.description }}</p>
        </div>
        <div class="mb-4">
          <textarea
            [(ngModel)]="replyText"
            rows="4"
            class="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your reply here..."></textarea>
        </div>
        <div class="flex justify-end gap-3">
          <button (click)="showReplyModal = false" class="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition">Cancel</button>
          <button (click)="submitReply()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Send Reply</button>
        </div>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div *ngIf="showStatusModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-[500px] max-w-full">
        <h3 class="text-lg font-bold text-blue-700 mb-4">Update Complaint Status</h3>
        <div class="mb-4">
          <p class="text-sm font-medium text-slate-700">Complaint: {{ currentComplaint?.title }}</p>
          <p class="text-xs text-slate-500">Current Status: {{ formatStatus(currentComplaint?.status || 'New') }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">New Status</label>
          <select
            [(ngModel)]="selectedStatus"
            class="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option *ngFor="let status of statusOptions" [value]="status">{{ formatStatus(status) }}</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">Status Note</label>
          <textarea
            [(ngModel)]="statusNote"
            rows="3"
            class="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add note about this status update..."></textarea>
        </div>
        <div class="flex justify-end gap-3">
          <button (click)="showStatusModal = false" class="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition">Cancel</button>
          <button (click)="updateComplaintStatus()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Update Status</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteConfirmModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-[400px] max-w-full">
        <h3 class="text-lg font-bold text-red-600 mb-4">Confirm Deletion</h3>
        <p class="text-sm text-slate-700 mb-4">Are you sure you want to delete this complaint? This action cannot be undone.</p>
        <div class="mb-4">
          <p class="text-sm font-medium text-slate-700">{{ currentComplaint?.title }}</p>
          <p class="text-xs text-slate-500">{{ currentComplaint?.description }}</p>
        </div>
        <div class="flex justify-end gap-3">
          <button (click)="showDeleteConfirmModal = false" class="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition">Cancel</button>
          <button (click)="deleteComplaint()" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button>
        </div>
      </div>
    </div>

    <!-- Delete User Confirmation Modal -->
    <div *ngIf="showDeleteUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 sm:mx-8" >
        <ng-container *ngIf="!deletingUser && !deleteUserSuccess">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-bold text-red-700">Delete User</h3>
            </div>
          </div>
          <div class="mb-6">
            <p class="text-sm text-gray-700 mb-3">
              Are you sure you want to delete the user <strong>"{{ userToDelete?.name }} {{ userToDelete?.surname }}"</strong>?
            </p>
            <div class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-sm font-semibold text-red-600 mb-1">⚠️ Warning:</p>
              <ul class="text-xs text-red-600 space-y-1">
                <li>• This action cannot be undone</li>
                <li>• User will be marked as deleted and removed from the system</li>
                <li>• User will no longer be able to access the application</li>
                <li>• All user data will be preserved for audit purposes</li>
              </ul>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button (click)="cancelDeleteUser()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
              Cancel
            </button>
            <button (click)="confirmDeleteUser()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Delete User
            </button>
          </div>
        </ng-container>
        <ng-container *ngIf="deletingUser">
          <div class="flex flex-col items-center justify-center py-8">
            <svg class="animate-spin h-12 w-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div class="text-blue-700 font-semibold text-lg">Deleting user...</div>
          </div>
        </ng-container>
        <ng-container *ngIf="deleteUserSuccess">
          <div class="flex flex-col items-center justify-center py-8">
            <div class="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="text-green-700 font-semibold text-lg">User deleted successfully!</div>
          </div>
        </ng-container>
      </div>
    </div>

    <!-- Delete Department Confirmation Modal -->
    <div *ngIf="showDeleteDepartmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-[400px] max-w-full">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-bold text-red-700">Delete Department</h3>
          </div>
        </div>
        
        <div class="mb-6">
          <p class="text-sm text-gray-700 mb-3">
            Are you sure you want to delete the department <strong>"{{ departmentToDelete?.name }}"</strong>?
          </p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-sm font-semibold text-red-600 mb-1">⚠️ Warning:</p>
            <ul class="text-xs text-red-600 space-y-1">
              <li>• This action cannot be undone</li>
              <li>• All department data will be permanently removed</li>
              <li>• Any complaints assigned to this department will need to be reassigned</li>
            </ul>
          </div>
        </div>
        
        <div class="flex justify-end gap-3">
          <button (click)="cancelDeleteDepartment()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
            Cancel
          </button>
          <button (click)="confirmDeleteDepartment()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Delete Department
          </button>
        </div>
      </div>
    </div>

    <!-- Profile Settings Modal -->
    <div *ngIf="showProfileModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-2xl w-[442px] md:w-[500px] max-w-2xl flex flex-col items-center mx-8 sm:mx-16 my-8" style="max-height:80vh; overflow-y:auto;">
        <h3 class="text-lg font-bold text-blue-700 mb-4">Profile Settings</h3>
        <form (ngSubmit)="saveProfile()" autocomplete="off" class="w-full text-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input [(ngModel)]="profileForm.name" name="profileName" placeholder="Name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Surname</label>
              <input [(ngModel)]="profileForm.surname" name="profileSurname" placeholder="Surname" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input [(ngModel)]="profileForm.email" name="profileEmail" placeholder="Email" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input [(ngModel)]="profileForm.password" name="profilePassword" placeholder="Password" type="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="mb-6" *ngIf="!adminRole.toLowerCase().includes('overall')">
            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select [(ngModel)]="profileForm.department" name="profileDepartment" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option *ngFor="let dept of getUniqueDepartments()" [value]="dept.name">{{ dept.name }}</option>
            </select>
          </div>
          <div class="flex justify-center gap-6">
            <button type="button" (click)="closeProfileModal()" class="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">Save</button>
          </div>
        </form>
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
    <app-ai-chat #aiChat></app-ai-chat>
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
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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
  isDarkMode: boolean = false;
  aiInsights = [
    'Water and Sanitation has the highest complaint resolution rate.',
    'Predicted spike in road maintenance complaints next month.',
    'Most common issue: Water outages.',
    'Department Admin John resolved 15 complaints this week.'
  ];

  complaints: Complaint[] = [];
  private complaintsSubscription?: Subscription;
  showReplyModal = false;
  currentComplaint: Complaint | null = null;
  replyText: string = '';
  statusOptions: Status[] = ['New', 'Assigned', 'InProgress', 'PendingReview', 'Resolved', 'Closed', 'Reopened'];
  selectedStatus: Status = 'InProgress';
  showStatusModal = false;
  statusNote: string = '';
  showDeleteConfirmModal = false;
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
  newDepartment = { name: '', description: '', banner: '' };
  showViewDepartmentsModal = false;
  adminName: string = '';
  adminRole: string = 'Overall Admin';
  totalUsersCount: number = 0;
  showClearLogModal: boolean = false;
  clearingLog: boolean = false;
  clearLogSuccess: boolean = false;
  showProfileModal: boolean = false;
  profileForm = { name: '', surname: '', email: '', password: '', department: '' };
  showDeleteDepartmentModal: boolean = false;
  departmentToDelete: any = null;
  showDeleteUserModal: boolean = false;
  userToDelete: any = null;
  defaultDepartmentsInitialized: boolean = false;
  showAboutModal: boolean = false;
  loading: boolean = true;
  @ViewChild(AiChatComponent) aiChat!: AiChatComponent;
  // Add state variables to the class:
  deletingUser: boolean = false;
  deleteUserSuccess: boolean = false;
  constructor(
    @Inject(NotificationService) private notificationService: NotificationService,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    @Inject(ActivityService) private activityService: ActivityService,
    @Inject(ThemeService) private themeService: ThemeService,
    @Inject(UserService) private userService: UserService,
    private complaintService: ComplaintService,
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Defer initialization to next cycle to avoid ChangeAfterChecked errors
    setTimeout(() => {
      // Fetch admin user info
      this.getCurrentAdminInfo();
      
      // Subscribe to real-time complaints data
      this.setupComplaintsListener();
      
      // Load theme preference
      this.loadThemePreference();
      
      // Subscribe to real-time users data
      this.userService.getUsers().subscribe((users: any[]) => {
        this.users = users;
        // Filter department admins with better data handling
        this.admins = users
          .filter(user => user.role === 'departmentadmin')
          .map(user => ({
            id: user.id,
            name: `${user.name || ''} ${user.surname || ''}`.trim() || user.email || 'Unknown',
            department: user.department || 'Unassigned',
            email: user.email
          }));
        
        this.cdr.detectChanges();
      });
      
      // Subscribe to real-time departments data
      this.departmentService.getDepartments().subscribe(async (departments: any[]) => {
        this.departments = departments;
        this.cdr.detectChanges();
        
        // Update existing department names to use correct naming convention
        await this.updateDepartmentNames();
        
        // Initialize default departments if none exist (only once)
        if (departments.length === 0 && !this.defaultDepartmentsInitialized) {
          this.initializeDefaultDepartments();
          this.defaultDepartmentsInitialized = true;
        }
      });
      
      this.announcements = [
        { message: 'System maintenance scheduled for Friday', date: new Date().toISOString() }
      ];
      
      // Set up real-time activity monitoring
      this.setupActivityFeed();
      
      // Subscribe to total user count
      this.userService.getTotalUserCount().subscribe((count: number) => {
        this.totalUsersCount = count;
        this.cdr.detectChanges();
      });
      
      // Trigger change detection after initialization
      this.cdr.detectChanges();
    }, 0);
  }
  
  /**
   * Sets up the real-time activity feed using ActivityService
   */
  setupActivityFeed() {
    // Set up real-time listener for activities
    this.activityUnsub = this.activityService.listenToActivities((activities: any[]) => {
      // Update the activity feed with the latest data
      this.activityFeed = activities.map((activity: any) => {
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
    // Force notifications to run inside NgZone using setTimeout
    setTimeout(() => {
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
    }, 0);
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
    const user = this.users.find(u => u.id === userId);
    if (user) {
      if (user.role === 'overalladmin') {
        this.notificationService.showError("Due to security reasons, Overall Admins can only be deleted directly from Firebase (the backend).", 4000);
        return;
      }
      this.userToDelete = user;
      this.showDeleteUserModal = true;
    }
  }

  deleteAdmin(adminId: string) {
    this.admins = this.admins.filter(a => a.id !== adminId);
    this.notificationService.showSuccess('Department admin deleted!');
  }

  deleteDepartment(deptId: string) {
    const department = this.departments.find(d => d.id === deptId);
    if (department) {
      this.departmentToDelete = department;
      this.showDeleteDepartmentModal = true;
    }
  }

  async confirmDeleteDepartment() {
    if (this.departmentToDelete) {
      try {
        // Check if department has admins
        const departmentAdmins = this.getDepartmentAdmins(this.departmentToDelete.name);
        if (departmentAdmins.length > 0) {
          this.notificationService.showError(`Cannot delete department "${this.departmentToDelete.name}" - it has ${departmentAdmins.length} admin(s) assigned. Please reassign or remove admins first.`);
          this.showDeleteDepartmentModal = false;
          this.departmentToDelete = null;
          return;
        }

        // Delete department from database
        await this.departmentService.deleteDepartment(this.departmentToDelete.id);
        
        // Log the department deletion
        this.activityService.logActivity(
          'delete_department',
          `Department "${this.departmentToDelete.name}" deleted`,
          this.departmentToDelete.id
        );
        
        this.notificationService.showSuccess(`Department "${this.departmentToDelete.name}" deleted successfully!`);
        this.showDeleteDepartmentModal = false;
        this.departmentToDelete = null;
      } catch (error) {
        console.error('Error deleting department:', error);
        this.notificationService.showError('Failed to delete department. Please try again.');
      }
    }
  }

  cancelDeleteDepartment() {
    this.showDeleteDepartmentModal = false;
    this.departmentToDelete = null;
  }

  async confirmDeleteUser() {
    if (this.userToDelete) {
      try {
        this.deletingUser = true;
        this.deleteUserSuccess = false;
        // Check if user is trying to delete themselves
        const currentUser = this.authService.getCurrentUserData();
        if (currentUser && currentUser.uid === this.userToDelete.id) {
          this.notificationService.showError('You cannot delete your own account.');
          this.deletingUser = false;
          this.showDeleteUserModal = false;
          this.userToDelete = null;
          return;
        }

        // Check if user is an overall admin (prevent deletion of overall admins)
        if (this.userToDelete.role === 'overalladmin') {
          this.notificationService.showError("Due to security reasons, Overall Admins can only be deleted directly from Firebase (the backend).", 4000);
          this.deletingUser = false;
          this.showDeleteUserModal = false;
          this.userToDelete = null;
          return;
        }

        // Mark user as deleted in Firestore (this will remove them from the UI)
        await this.authService.markUserAsDeleted(this.userToDelete.id);
        // Log the user deletion
        this.activityService.logActivity(
          'delete_user',
          `User "${this.userToDelete.name} ${this.userToDelete.surname}" (${this.userToDelete.email}) deleted`,
          this.userToDelete.id
        );
        this.notificationService.showSuccess(`User "${this.userToDelete.name} ${this.userToDelete.surname}" deleted successfully!`);
        this.deletingUser = false;
        this.deleteUserSuccess = true;
        this.cdr.detectChanges();
        this.showDeleteUserModal = false;
        this.userToDelete = null;
        this.deleteUserSuccess = false;
        this.openViewUsersModal();
        return;
      } catch (error) {
        console.error('Error deleting user:', error);
        this.notificationService.showError('Failed to delete user. Please try again.');
        this.deletingUser = false;
        this.cdr.detectChanges();
      }
    }
  }

  cancelDeleteUser() {
    this.showDeleteUserModal = false;
    this.userToDelete = null;
  }

  askAI() {
    // Placeholder for AI integration
    this.aiResponse = 'AI says: ' + (this.aiQuery || 'Ask a question about city data, complaints, or trends!');
  }

  async addAdmin() {
    try {
      // Validate department exists
      const selectedDepartment = this.departments.find(dept => dept.name === this.newAdmin.department);
      if (!selectedDepartment) {
        this.notificationService.showError('Please select a valid department.');
        return;
      }

      const result = await this.authService.signUp(
        this.newAdmin.email,
        this.newAdmin.password,
        'departmentadmin',
        this.newAdmin.name,
        this.newAdmin.surname,
        this.newAdmin.department
      );
      
      // Log the admin creation
      this.activityService.logActivity(
        'add_user',
        `New department admin "${this.newAdmin.name} ${this.newAdmin.surname}" created for ${this.newAdmin.department} department`,
        '',
        'info'
      );
      
      this.notificationService.showSuccess('Department admin created successfully!');
      this.showAddAdminModal = false;
      this.newAdmin = { name: '', surname: '', email: '', password: '', department: '' };
    } catch (error) {
      console.error('Error creating admin:', error);
      this.notificationService.showError('Failed to create admin: ' + (error as any).message);
    }
  }

  openViewUsersModal() {
    this.showViewUsersModal = true;
    if (this.generalUsersSub) this.generalUsersSub.unsubscribe();
    
    // Use UserService to get all users
    this.userService.users$.subscribe((allUsers: any[]) => {
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

  /**
   * Refresh admin data to ensure we have the latest information
   */
  refreshAdminData() {
    // Force a refresh of the admin data by triggering change detection
    this.cdr.detectChanges();
    
    // Log current state for debugging
    console.log('Refreshing admin data...');
    console.log('Current departments:', this.departments);
    console.log('Current admins:', this.admins);
    
    // Check each department for admins
    this.departments.forEach(dept => {
      const deptAdmins = this.getDepartmentAdmins(dept.name);
      console.log(`Department "${dept.name}" has ${deptAdmins.length} admins:`, deptAdmins);
    });
  }

  async addDepartment() {
    if (this.newDepartment.name.trim()) {
      try {
        // Check if department name already exists
        const existingDepartment = this.departments.find(dept => 
          dept.name.toLowerCase() === this.newDepartment.name.toLowerCase()
        );
        
        if (existingDepartment) {
          this.notificationService.showError('A department with this name already exists.');
          return;
        }

        // Add department to database
        const deptId = await this.departmentService.addDepartment({
        name: this.newDepartment.name,
          description: this.newDepartment.description,
          banner: this.newDepartment.banner,
          isActive: true
      });
      
      // Log the department creation
      this.activityService.logActivity(
        'add_department',
        `New department "${this.newDepartment.name}" created`,
        deptId
      );
      
        this.notificationService.showSuccess('Department created successfully!');
      this.showAddDepartmentModal = false;
        this.newDepartment = { name: '', description: '', banner: '' };
      } catch (error) {
        console.error('Error creating department:', error);
        this.notificationService.showError('Failed to create department. Please try again.');
      }
    } else {
      this.notificationService.showError('Department name is required.');
    }
  }

  getDepartmentAdmins(deptName: string) {
    if (!this.admins || this.admins.length === 0) {
      return [];
    }
    
    // Case-insensitive comparison for department names
    const matchingAdmins = this.admins.filter(a => 
      a.department && a.department.toLowerCase() === deptName.toLowerCase()
    );
    
    return matchingAdmins;
  }

  /**
   * Get all admins for all departments (for debugging)
   */
  getAllAdmins() {
    return this.admins || [];
  }

  /**
   * Get unique departments (filter out duplicates by name)
   */
  getUniqueDepartments() {
    if (!this.departments || this.departments.length === 0) {
      return [];
    }
    
    // Filter out duplicates by department name (case-insensitive)
    const uniqueDepartments = this.departments.filter((dept, index, self) => 
      index === self.findIndex(d => 
        d.name.toLowerCase() === dept.name.toLowerCase()
      )
    );
    
    return uniqueDepartments;
  }

  /**
   * Initialize default departments in the database
   */
  private async initializeDefaultDepartments() {
    try {
      const defaultDepartments = [
        {
          name: 'Water Department',
          description: 'Manages water supply and sanitation services',
          banner: '🚰 Ensuring Clean Water & Sanitation for All Citizens 🚰',
          isActive: true
        },
        {
          name: 'Roads Department',
          description: 'Maintains roads and transportation infrastructure',
          banner: '🛣️ Building & Maintaining Safe Roads for Our City 🛣️',
          isActive: true
        },
        {
          name: 'Waste Management Department',
          description: 'Handles waste collection and disposal services',
          banner: '♻️ Keeping Our City Clean & Environmentally Friendly ♻️',
          isActive: true
        }
      ];

      for (const dept of defaultDepartments) {
        await this.departmentService.addDepartment(dept);
      }

      console.log('Default departments initialized successfully');
    } catch (error) {
      console.error('Error initializing default departments:', error);
    }
  }

  /**
   * Update existing department names to use correct naming convention
   */
  private async updateDepartmentNames() {
    try {
      const departmentUpdates = [
        { oldName: 'Water and Sanitation', newName: 'Water Department' },
        { oldName: 'Roads and Transport', newName: 'Roads Department' },
        { oldName: 'Waste Management', newName: 'Waste Management Department' }
      ];

      for (const update of departmentUpdates) {
        const existingDept = this.departments.find(d => d.name === update.oldName);
        if (existingDept) {
          console.log(`Updating department name from "${update.oldName}" to "${update.newName}"`);
          await this.departmentService.updateDepartment(existingDept.id, { name: update.newName });
        }
      }
    } catch (error) {
      console.error('Error updating department names:', error);
    }
  }

  logout() {
    // Log the logout action before actually logging out
    this.activityService.logActivity(
      'logout', 
      'Administrator logged out', 
      this.authService.getCurrentUser()?.uid || ''
    );
    
    this.authService.logout();
    // Navigate to login page
    window.location.href = '/';
  }

  async getCurrentAdminInfo() {
    const currentUser = this.authService.getCurrentUser();
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
    if (this.complaintsSubscription) this.complaintsSubscription.unsubscribe();
    
    // Unsubscribe from activity feed listener
    if (this.activityUnsub) {
      this.activityUnsub();
      
      // Log that the dashboard was closed
      this.activityService.logActivity('dashboard_close', 'Overall Admin Dashboard closed');
    }
  }

  /**
   * Download the activity log as a file
   */
  downloadLog() {
    try {
      // Create the log content
      const logContent = this.generateLogContent();
      
      // Create a blob with the log content
      const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date and time
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `activity-log-${timestamp}.txt`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Log the download action
      this.activityService.logActivity(
        'download_log',
        'Activity log downloaded by Overall Admin',
        '',
        'info'
      );
      
      this.notificationService.showSuccess('Activity log downloaded successfully!');
    } catch (error) {
      console.error('Error downloading log:', error);
      this.notificationService.showError('Failed to download activity log');
    }
  }

  /**
   * Generate the content for the activity log file
   */
  private generateLogContent(): string {
    const header = `HARARE CITY PORTAL - ACTIVITY LOG
Generated: ${new Date().toLocaleString()}
Total Activities: ${this.activityFeed.length}
${'='.repeat(50)}

`;

    let content = header;
    
    if (this.activityFeed.length === 0) {
      content += 'No activity logs to display.\n';
    } else {
      this.activityFeed.forEach((activity, index) => {
        const timestamp = activity.timestamp?.toDate ? 
          activity.timestamp.toDate().toLocaleString() : 
          (activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Unknown time');
        
        const severity = activity.severity || 'info';
        const severityDisplay = severity.toUpperCase().padEnd(8);
        
        content += `${(index + 1).toString().padStart(3)}. [${severityDisplay}] ${timestamp}\n`;
        content += `     ${activity.message || activity.action}\n`;
        if (activity.userEmail) {
          content += `     User: ${activity.userEmail}\n`;
        }
        if (activity.details) {
          content += `     Details: ${activity.details}\n`;
        }
        content += '\n';
      });
    }
    
    content += `${'='.repeat(50)}\nEnd of Activity Log`;
    
    return content;
  }

  /**
   * Show the confirmation modal for clearing the log
   */
  showClearLogConfirmation() {
    this.showClearLogModal = true;
  }

  /**
   * Cancel the clear log operation
   */
  cancelClearLog() {
    this.showClearLogModal = false;
    this.clearingLog = false;
    this.clearLogSuccess = false;
  }

  /**
   * Confirm and execute the clear log operation
   */
  confirmClearLog() {
    console.log('confirmClearLog: Starting...');
    
    // Start loading state
    this.clearingLog = true;
    this.clearLogSuccess = false;
    this.cdr.detectChanges();
    console.log('confirmClearLog: Loading state set');
    
    // Clear logs from database during loading state
    this.activityService.clearAllActivities()
      .then(() => {
        console.log('confirmClearLog: Database activities cleared');
        
        // Clear the local activity feed
        this.activityFeed = [];
        console.log('confirmClearLog: Local activity feed cleared');
        
        // Show success state after database clearing is complete
        this.clearingLog = false;
        this.clearLogSuccess = true;
        this.cdr.detectChanges();
        // Immediately close modal and reset state
        this.clearLogSuccess = false;
        this.showClearLogModal = false;
        this.cdr.detectChanges();
        // Show success notification
        this.notificationService.showSuccess('✅ Activity log cleared successfully!', 3000);
      })
      .catch((error) => {
        console.error('Error clearing logs:', error);
        this.clearingLog = false;
        this.showClearLogModal = false;
        this.notificationService.showError('❌ Failed to clear activity log');
        this.cdr.detectChanges();
      });
  }

  /**
   * Setup real-time listener for complaints
   */
  private setupComplaintsListener(): void {
    this.complaintsSubscription = this.complaintService.complaints$.subscribe(
      (complaints: Complaint[]) => {
        this.complaints = complaints;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching complaints:', error);
        this.notificationService.showError('Failed to load complaints');
      }
    );
  }

  /**
   * Open the reply modal for a complaint
   */
  openReplyModal(complaint: Complaint): void {
    this.currentComplaint = complaint;
    this.replyText = '';
    this.showReplyModal = true;
  }

  /**
   * Submit a reply to a complaint
   */
  async submitReply(): Promise<void> {
    if (!this.currentComplaint || !this.replyText.trim()) {
      this.notificationService.showError('Please enter a reply');
      return;
    }

    try {
      await this.complaintService.addReplyToComplaint(
        this.currentComplaint.id!,
        this.replyText,
        this.adminName
      );
      this.showReplyModal = false;
      this.replyText = '';
      this.currentComplaint = null;
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  }

  /**
   * Open the status update modal for a complaint
   */
  openStatusModal(complaint: Complaint, status: Status): void {
    this.currentComplaint = complaint;
    this.selectedStatus = status;
    this.statusNote = `Status updated to ${status}`;
    this.showStatusModal = true;
  }

  /**
   * Update the status of a complaint
   */
  async updateComplaintStatus(): Promise<void> {
    if (!this.currentComplaint || !this.statusNote.trim()) {
      this.notificationService.showError('Please enter a status note');
      return;
    }

    try {
      await this.complaintService.updateComplaintStatus(
        this.currentComplaint.id!,
        this.selectedStatus,
        this.statusNote,
        this.adminName
      );
      this.showStatusModal = false;
      this.statusNote = '';
      this.currentComplaint = null;
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  }

  /**
   * Open the delete confirmation modal for a complaint
   */
  openDeleteConfirmModal(complaint: Complaint): void {
    this.currentComplaint = complaint;
    this.showDeleteConfirmModal = true;
  }

  /**
   * Delete a complaint
   */
  async deleteComplaint(): Promise<void> {
    if (!this.currentComplaint) {
      return;
    }

    try {
      // Using setTimeout to run this after the current change detection cycle
      setTimeout(async () => {
        await this.complaintService.deleteComplaint(this.currentComplaint!.id!);
        this.showDeleteConfirmModal = false;
        this.currentComplaint = null;
        this.cdr.detectChanges();
      }, 0);
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  }

  /**
   * Get status color class based on status
   */
  getStatusClass(status: Status): string {
    switch (status) {
      case 'New':
        return 'text-yellow-600 bg-yellow-100';
      case 'Assigned':
        return 'text-blue-600 bg-blue-100';
      case 'InProgress':
        return 'text-blue-600 bg-blue-100';
      case 'PendingReview':
        return 'text-purple-600 bg-purple-100';
      case 'Resolved':
        return 'text-green-600 bg-green-100';
      case 'Closed':
        return 'text-slate-600 bg-slate-100';
      case 'Reopened':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  }

  /**
   * Format status for display
   */
  formatStatus(status: Status): string {
    switch (status) {
      case 'InProgress':
        return 'In Progress';
      case 'PendingReview':
        return 'Pending Review';
      default:
        return status;
    }
  }

  loadThemePreference() {
    const savedTheme = localStorage.getItem('darkMode');
    this.isDarkMode = savedTheme === 'true';
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  openProfileModal() {
    const userData = this.authService.getCurrentUserData();
    this.profileForm = {
      name: userData?.name || this.adminName.split(' ')[0] || '',
      surname: userData?.surname || this.adminName.split(' ')[1] || '',
      email: userData?.email || '',
      password: '',
      department: userData?.department || (this.adminRole.includes('Admin') ? (this.departments[0]?.name || '') : '')
    };
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  async saveProfile() {
    try {
      const currentUser = this.authService.getCurrentUserData();
      if (!currentUser) {
        this.notificationService.showError('No user data found. Please log in again.');
        return;
      }

      // Prepare update data
      const updateData: any = {
        name: this.profileForm.name,
        surname: this.profileForm.surname,
        email: this.profileForm.email
      };

      // Add department if user is not overall admin
      if (!this.adminRole.toLowerCase().includes('overall')) {
        updateData.department = this.profileForm.department;
      }

      // Update user data in Firestore
      await this.userService.updateUser(currentUser.uid, updateData);

      // Update password if provided
      if (this.profileForm.password && this.profileForm.password.trim()) {
        try {
          // Import updatePassword from Firebase Auth
          const { updatePassword } = await import('firebase/auth');
          const auth = this.authService.getAuth();
          const user = auth.currentUser;
          
          if (user) {
            await updatePassword(user, this.profileForm.password);
            console.log('Password updated successfully');
          }
        } catch (passwordError) {
          console.error('Error updating password:', passwordError);
          this.notificationService.showError('Profile updated but password change failed. Please try again.');
          this.showProfileModal = false;
          return;
        }
      }

      // Update local admin name and role display
      this.adminName = `${this.profileForm.name} ${this.profileForm.surname}`.trim();
      if (!this.adminRole.toLowerCase().includes('overall') && this.profileForm.department) {
        this.adminRole = `${this.profileForm.department} Admin`;
      }

      // Log the profile update
      this.activityService.logActivity(
        'update_profile',
        `Profile updated for user "${this.profileForm.name} ${this.profileForm.surname}"`,
        currentUser.uid,
        'info'
      );

      this.notificationService.showSuccess('Profile updated successfully!');
      this.showProfileModal = false;
      
      // Clear password field
      this.profileForm.password = '';
      
    } catch (error) {
      console.error('Error updating profile:', error);
      this.notificationService.showError('Failed to update profile. Please try again.');
    }
  }

  /**
   * Get priority color class based on priority
   */
  getPriorityClass(priority: Priority): string {
    switch (priority) {
      case 'Low':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  }

  getComplaintStatus(complaint: Complaint): string {
    if (!complaint.status) return 'New';
    
    switch (complaint.status) {
      case 'New':
        return 'New';
      case 'Assigned':
        return 'Assigned';
      case 'InProgress':
        return 'In Progress';
      case 'PendingReview':
        return 'Pending';
      case 'Resolved':
        return 'Resolved';
      case 'Closed':
        return 'Closed';
      case 'Reopened':
        return 'Reopened';
      default:
        return 'New';
    }
  }

  openAiChat() {
    if (this.aiChat) {
      this.aiChat.openChat();
    } else {
      console.error('AI Chat component not found');
    }
  }

  async approveUser(user: any) {
    try {
      await this.userService.updateUser(user.id, { approved: true });
      user.approved = true;
      this.notificationService.show('User approved successfully.', 'success');
      this.cdr.detectChanges();
    } catch (error) {
      this.notificationService.show('Failed to approve user.', 'error');
    }
  }
}
