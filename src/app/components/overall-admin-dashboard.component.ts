import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-overall-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col">
      <!-- Navbar -->
      <nav class="w-full bg-white/80 backdrop-blur text-slate-800 py-4 px-4 sm:px-6 flex justify-between items-center shadow">
        <div class="flex items-center">
          <img src="/city.png" alt="City Logo" class="h-8 w-8 mr-3">
          <span class="text-lg font-bold tracking-wide">Overall Admin Portal</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative group cursor-pointer">
            <div class="flex items-center bg-slate-100 px-3 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4" />
              </svg>
              <span class="font-semibold">superadmin</span>
            </div>
            <div class="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
              <button class="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-800">Account Settings</button>
              <button class="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-800">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Quick Actions Bar -->
      <div class="w-full bg-slate-100/80 py-2 px-2 sm:px-6 flex gap-2 sm:gap-3 items-center shadow-sm sticky top-0 z-30 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
        <button class="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-semibold whitespace-nowrap"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><path d='M10 4v12m6-6H4'/></svg>Add Department</button>
        <button class="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-xs font-semibold whitespace-nowrap"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><path d='M10 4v12m6-6H4'/></svg>Add User</button>
        <button class="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs font-semibold whitespace-nowrap"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 6l8 8M6 14L14 6'/></svg>Delete</button>
        <button class="flex items-center gap-1 px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition text-xs font-semibold whitespace-nowrap"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><circle cx='10' cy='10' r='8'/></svg>Analytics</button>
        <button class="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-xs font-semibold whitespace-nowrap"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><path d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2z'/></svg>Announcements</button>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col items-center pt-8 pb-8 px-1 sm:px-2">
        <!-- Profile Card & AI Assistant -->
        <div class="w-full max-w-5xl flex flex-col gap-4 mb-6 md:flex-row md:gap-4">
          <div class="bg-white/80 backdrop-blur rounded-xl border border-slate-100 shadow p-4 flex items-center gap-4 flex-1 min-w-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4" />
            </svg>
            <div>
              <div class="font-bold text-slate-800 text-base sm:text-lg">Super Admin</div>
              <div class="text-xs text-slate-500">System-wide Management</div>
              <button class="text-xs text-blue-600 hover:underline mt-1">Profile Settings</button>
            </div>
          </div>
          <!-- AI Chat Assistant -->
          <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-4 flex flex-col items-center justify-center w-full md:w-72 h-32">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-7 w-7 text-purple-600" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 15s1.5 2 4 2 4-2 4-2" />
                <path d="M9 9h.01M15 9h.01" />
              </svg>
              <span class="font-semibold text-slate-700">AI Assistant</span>
            </div>
            <button class="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700 transition">Ask AI</button>
          </div>
        </div>

        <!-- Stats Overview -->
        <div class="w-full max-w-5xl grid grid-cols-2 gap-2 mb-6 sm:grid-cols-4">
          <div class="bg-white/80 backdrop-blur rounded shadow p-2 flex items-center justify-center border border-slate-100 w-full min-w-0">
            <span class="inline-flex items-center justify-between w-full px-2">
              <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-1">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700 flex-1 text-center">Complaints</span>
              <span class="text-base font-extrabold text-blue-600 ml-2">{{ stats.complaints }}</span>
            </span>
          </div>
          <div class="bg-white/80 backdrop-blur rounded shadow p-2 flex items-center justify-center border border-slate-100 w-full min-w-0">
            <span class="inline-flex items-center justify-between w-full px-2">
              <span class="inline-block bg-green-100 text-green-600 rounded-full p-1">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M5 13l4 4L19 7'/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700 flex-1 text-center">Resolved</span>
              <span class="text-base font-extrabold text-blue-600 ml-2">{{ stats.resolved }}</span>
            </span>
          </div>
          <div class="bg-white/80 backdrop-blur rounded shadow p-2 flex items-center justify-center border border-slate-100 w-full min-w-0">
            <span class="inline-flex items-center justify-between w-full px-2">
              <span class="inline-block bg-yellow-100 text-yellow-600 rounded-full p-1">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700 flex-1 text-center">Pending</span>
              <span class="text-base font-extrabold text-blue-600 ml-2">{{ stats.pending }}</span>
            </span>
          </div>
          <div class="bg-white/80 backdrop-blur rounded shadow p-2 flex items-center justify-center border border-slate-100 w-full min-w-0">
            <span class="inline-flex items-center justify-between w-full px-2">
              <span class="inline-block bg-red-100 text-red-600 rounded-full p-1">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3'/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700 flex-1 text-center">Overdue</span>
              <span class="text-base font-extrabold text-blue-600 ml-2">{{ stats.overdue }}</span>
            </span>
          </div>
        </div>

        <!-- Main Cards Section -->
        <div class="w-full max-w-6xl grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 md:gap-6">
          <!-- Complaints Management -->
          <div class="bg-white/80 backdrop-blur rounded-xl border border-slate-100 shadow p-4 sm:p-6 flex flex-col">
            <div class="flex items-center mb-2">
              <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/></svg></span>
              <h3 class="text-base font-semibold text-slate-800">All Complaints</h3>
            </div>
            <div class="flex flex-col gap-3">
              <!-- Complaint Cards (repeat for each complaint) -->
              <div class="bg-slate-50/80 rounded p-3 flex flex-col gap-2 border border-slate-100 hover:shadow-lg transition group" *ngFor="let complaint of complaints">
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
          </div>

          <!-- Departments & Users Management -->
          <div class="flex flex-col gap-6">
            <!-- Departments -->
            <details open class="bg-white/80 backdrop-blur rounded-xl border border-slate-100 shadow p-4 sm:p-6 mb-4 flex-1">
              <summary class="flex items-center mb-2 cursor-pointer select-none">
                <span class="inline-block bg-green-100 text-green-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path d='M10 4v12m6-6H4'/></svg></span>
                <h3 class="text-base font-semibold text-slate-800">Departments</h3>
              </summary>
              <ul class="divide-y divide-slate-100 mb-2">
                <li class="py-2 text-xs text-slate-700 flex justify-between items-center" *ngFor="let department of departments"> {{ department.name }} <span><button class="text-xs text-blue-600 hover:underline">View</button> <button class="text-xs text-red-600 hover:underline ml-2" (click)="deleteDepartment(department.id)">Delete</button></span></li>
              </ul>
              <button class="w-full py-2 sm:py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">Add Department</button>
            </details>
            <!-- Users -->
            <details open class="bg-white/80 backdrop-blur rounded-xl border border-slate-100 shadow p-4 sm:p-6 flex-1">
              <summary class="flex items-center mb-2 cursor-pointer select-none">
                <span class="inline-block bg-yellow-100 text-yellow-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='8' r='4' /><path d='M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4' /></svg></span>
                <h3 class="text-base font-semibold text-slate-800">Users</h3>
              </summary>
              <ul class="divide-y divide-slate-100 mb-2">
                <li class="py-2 text-xs text-slate-700 flex justify-between items-center" *ngFor="let user of users"> {{ user.name }} <span><button class="text-xs text-blue-600 hover:underline">Promote</button> <button class="text-xs text-red-600 hover:underline ml-2" (click)="deleteUser(user.id)">Delete</button></span></li>
              </ul>
              <button class="w-full py-2 sm:py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold">Add User</button>
            </details>
            <!-- Announcements -->
            <details open class="bg-white/80 backdrop-blur rounded-xl border border-slate-100 shadow p-4 sm:p-6 flex-1">
              <summary class="flex items-center mb-2 cursor-pointer select-none">
                <span class="inline-block bg-purple-100 text-purple-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2z'/></svg></span>
                <h3 class="text-base font-semibold text-slate-800">Announcements</h3>
              </summary>
              <ul class="divide-y divide-slate-100 mb-2">
                <li class="py-2 text-xs text-slate-700" *ngFor="let announcement of announcements">
                  {{ announcement.message }}
                  <span class="text-[10px] text-slate-400">{{ announcement.date | date:'short' }}</span>
                </li>
              </ul>
              <div class="flex gap-2 mt-2">
                <input [(ngModel)]="newAnnouncement" type="text" class="flex-1 px-3 py-2 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="New announcement...">
                <button class="px-3 py-2 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700 transition" (click)="postAnnouncement()">Post</button>
              </div>
            </details>
          </div>
        </div>

        <!-- AI Insights, Analytics, Trends & Risks -->
        <div class="w-full max-w-5xl mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- AI Insights -->
          <div class="bg-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-4 flex flex-col">
            <div class="flex items-center mb-2">
              <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/></svg></span>
              <h3 class="text-base font-semibold text-slate-800">AI Insights</h3>
            </div>
            <ul class="list-disc pl-5 text-xs text-slate-700">
              <li *ngFor="let insight of aiInsights">{{ insight }}</li>
            </ul>
            <button class="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">View AI Insights</button>
          </div>
          <!-- Analytics & Reports -->
          <div class="bg-white/80 backdrop-blur rounded-xl border border-slate-100 shadow p-4 flex flex-col">
            <div class="flex items-center mb-2">
              <span class="inline-block bg-green-100 text-green-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 4h16v16H4z'/></svg></span>
              <h3 class="text-base font-semibold text-slate-800">Analytics & Reports</h3>
            </div>
            <ul class="list-disc pl-5 text-xs text-slate-700">
              <li>Top Departments by Complaints</li>
              <li>Time to Resolution (avg)</li>
              <li>Urgent vs Normal Issues</li>
              <li>AI Trends & Predictions</li>
            </ul>
            <button class="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold">View Analytics</button>
          </div>
          <!-- Trends & Risks -->
          <div class="bg-white/80 backdrop-blur rounded-xl border border-red-200 shadow p-4 flex flex-col">
            <div class="flex items-center mb-2">
              <span class="inline-block bg-red-100 text-red-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 8v4l3 3'/></svg></span>
              <h3 class="text-base font-semibold text-slate-800">Trends & Risks</h3>
            </div>
            <ul class="list-disc pl-5 text-xs text-slate-700">
              <li>Emerging complaint patterns</li>
              <li>Departments at risk</li>
              <li>AI-predicted escalations</li>
            </ul>
            <button class="mt-2 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold">View Trends</button>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="w-full max-w-5xl mt-6">
          <div class="bg-white/80 backdrop-blur rounded-xl border border-slate-100 shadow p-4 sm:p-6">
            <div class="flex items-center mb-2">
              <span class="inline-block bg-purple-100 text-purple-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'/></svg></span>
              <h3 class="text-base font-semibold text-slate-800">Recent Activity</h3>
            </div>
            <ul class="divide-y divide-slate-100 text-xs">
              <li class="py-2">Admin X resolved Complaint 2</li>
              <li class="py-2">Complaint 1 assigned to User Y</li>
              <li class="py-2">Announcement posted: Water outage</li>
              <li class="py-2">AI flagged urgent complaint in Roads</li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <footer class="w-full bg-white/80 backdrop-blur text-slate-400 border-t border-slate-200 py-3 px-4 sm:px-6 text-center text-xs mt-8">
        <p>© 2025 Harare City Portal. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: []
})
export class OverallAdminDashboardComponent {
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

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
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
  }

  postAnnouncement() {
    if (this.newAnnouncement.trim()) {
      this.announcements.unshift({ message: this.newAnnouncement, date: new Date().toISOString() });
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
}
