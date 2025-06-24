import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-department-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col">
      <!-- Navbar -->
      <nav class="w-full bg-white text-slate-800 py-4 px-4 sm:px-6 flex justify-between items-center shadow">
        <div class="flex items-center">
          <img src="/city.png" alt="City Logo" class="h-8 w-8 mr-3">
          <span class="text-lg font-bold tracking-wide">Department Admin Portal</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative group cursor-pointer">
            <div class="flex items-center bg-slate-100 px-3 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4" />
              </svg>
              <span class="font-semibold">admin</span>
            </div>
            <div class="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
              <button class="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-800">Account Settings</button>
              <button class="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-800">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Quick Actions Bar -->
      <div class="w-full bg-slate-100 py-2 px-2 sm:px-6 flex gap-2 sm:gap-3 items-center shadow-sm sticky top-0 z-30 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
        <button class="flex items-center gap-1 px-4 py-2 sm:px-3 sm:py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-semibold whitespace-nowrap"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><path d='M10 4v12m6-6H4'/></svg>Assign</button>
        <button class="flex items-center gap-1 px-4 py-2 sm:px-3 sm:py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition text-xs font-semibold whitespace-nowrap"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 10h12'/></svg>Bulk Update</button>
        <button class="flex items-center gap-1 px-4 py-2 sm:px-3 sm:py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition text-xs font-semibold whitespace-nowrap"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 4h12v12H4z'/></svg>Export</button>
        <button class="flex items-center gap-1 px-4 py-2 sm:px-3 sm:py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition text-xs font-semibold whitespace-nowrap"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><circle cx='10' cy='10' r='8'/></svg>Analytics</button>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col items-center pt-8 pb-8 px-1 sm:px-2">
        <!-- Profile Card & Chart -->
        <div class="w-full max-w-5xl flex flex-col gap-4 mb-6 md:flex-row md:gap-4">
          <div class="bg-white rounded-xl border border-slate-100 shadow p-4 flex items-center gap-4 flex-1 min-w-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4" />
            </svg>
            <div>
              <div class="font-bold text-slate-800 text-base sm:text-lg">Admin Name</div>
              <div class="text-xs text-slate-500">Department: Water & Sanitation</div>
              <button class="text-xs text-blue-600 hover:underline mt-1">Profile Settings</button>
            </div>
          </div>
          <!-- Simple Donut Chart Placeholder -->
          <div class="bg-white rounded-xl border border-slate-100 shadow p-4 flex flex-col items-center justify-center w-full md:w-48 h-32">
            <svg viewBox="0 0 36 36" class="w-24 h-24">
              <circle cx="18" cy="18" r="16" fill="#f1f5f9" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#2563eb" stroke-width="4" stroke-dasharray="60,40" stroke-linecap="round" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#22c55e" stroke-width="4" stroke-dasharray="25,75" stroke-dashoffset="60" stroke-linecap="round" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f59e42" stroke-width="4" stroke-dasharray="15,85" stroke-dashoffset="85" stroke-linecap="round" />
            </svg>
            <div class="text-xs text-slate-500 mt-2 text-center">Resolved / Pending / Overdue</div>
          </div>
        </div>

        <!-- Stats Overview -->
        <div class="w-full max-w-5xl grid grid-cols-2 gap-2 mb-6 sm:grid-cols-4">
          <div class="bg-white rounded shadow p-2 flex items-center justify-center border border-slate-100 w-full min-w-0">
            <span class="inline-flex items-center justify-between w-full px-2">
              <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-1">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700 flex-1 text-center">Active</span>
              <span class="text-base font-extrabold text-blue-600 ml-2">8</span>
            </span>
          </div>
          <div class="bg-white rounded shadow p-2 flex items-center justify-center border border-slate-100 w-full min-w-0">
            <span class="inline-flex items-center justify-between w-full px-2">
              <span class="inline-block bg-green-100 text-green-600 rounded-full p-1">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M5 13l4 4L19 7'/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700 flex-1 text-center">Resolved</span>
              <span class="text-base font-extrabold text-blue-600 ml-2">15</span>
            </span>
          </div>
          <div class="bg-white rounded shadow p-2 flex items-center justify-center border border-slate-100 w-full min-w-0">
            <span class="inline-flex items-center justify-between w-full px-2">
              <span class="inline-block bg-yellow-100 text-yellow-600 rounded-full p-1">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700 flex-1 text-center">Pending</span>
              <span class="text-base font-extrabold text-blue-600 ml-2">4</span>
            </span>
          </div>
          <div class="bg-white rounded shadow p-2 flex items-center justify-center border border-slate-100 w-full min-w-0">
            <span class="inline-flex items-center justify-between w-full px-2">
              <span class="inline-block bg-red-100 text-red-600 rounded-full p-1">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3'/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700 flex-1 text-center">Overdue</span>
              <span class="text-base font-extrabold text-blue-600 ml-2">1</span>
            </span>
          </div>
        </div>

        <!-- Main Cards Section -->
        <div class="w-full max-w-6xl grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 md:gap-6">
          <!-- Complaints Queue -->
          <div class="bg-white rounded-xl border border-slate-100 shadow p-4 sm:p-6 flex flex-col">
            <div class="flex items-center mb-2">
              <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/></svg></span>
              <h3 class="text-base font-semibold text-slate-800">Complaints Queue</h3>
            </div>
            <div class="flex flex-col gap-3">
              <!-- Complaint Cards (repeat for each complaint) -->
              <div class="bg-slate-50 rounded p-3 flex flex-col gap-2 border border-slate-100 hover:shadow-lg transition group" *ngFor="let complaint of visibleComplaints">
                <div class="flex items-center justify-between">
                  <div class="font-semibold text-slate-700">{{ complaint.title }}</div>
                  <span class="text-xs" [ngClass]="{
                    'text-yellow-600 bg-yellow-100': complaint.status === 'New',
                    'text-blue-600 bg-blue-100': complaint.status === 'In Progress',
                    'text-green-600 bg-green-100': complaint.status === 'Pending Review'
                  }" class="rounded px-2 py-0.5">{{ complaint.status }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-full h-2 bg-slate-200 rounded">
                    <div class="h-2 bg-blue-500 rounded" [style.width.%]="complaint.status === 'New' ? 20 : complaint.status === 'In Progress' ? 60 : 90"></div>
                  </div>
                  <span class="text-[10px] text-slate-400" *ngIf="complaint.status !== 'New'">{{ complaint.status === 'In Progress' ? '60%' : '90%' }}</span>
                </div>
                <div class="flex gap-2 mt-1">
                  <button class="text-xs text-blue-600 hover:underline" (click)="sendReply(complaint.id)">Reply</button>
                  <button class="text-xs text-green-600 hover:underline">Assign</button>
                  <button class="text-xs text-slate-500 hover:underline">Details</button>
                </div>
                <div class="mt-2" *ngIf="complaint.status === 'In Progress'">
                  <textarea [(ngModel)]="replyText[complaint.id]" class="w-full p-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:outline-none" rows="2" placeholder="Type your reply..."></textarea>
                </div>
              </div>
            </div>
            <button (click)="toggleComplaintsView()" class="mt-4 text-xs text-blue-600 hover:underline">
              {{ showAllComplaints ? 'Show Less' : 'Show All' }}
            </button>
          </div>

          <!-- Notifications, Announcements, Activity Feed -->
          <div class="flex flex-col gap-6">
            <!-- Collapsible Notifications -->
            <details open class="bg-white rounded-xl border border-slate-100 shadow p-4 sm:p-6 mb-4 flex-1">
              <summary class="flex items-center mb-2 cursor-pointer select-none">
                <span class="inline-block bg-yellow-100 text-yellow-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'/></svg></span>
                <h3 class="text-base font-semibold text-slate-800">Notifications</h3>
              </summary>
              <ul class="divide-y divide-slate-100 mb-2">
                <li class="py-2 text-xs text-slate-700" *ngFor="let notification of notifications">
                  {{ notification.message }}
                </li>
              </ul>
              <button class="w-full py-2 sm:py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold" (click)="postNotification()">Send Notification</button>
            </details>
            <!-- Collapsible Announcements -->
            <details open class="bg-white rounded-xl border border-slate-100 shadow p-4 sm:p-6 flex-1">
              <summary class="flex items-center mb-2 cursor-pointer select-none">
                <span class="inline-block bg-green-100 text-green-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2z'/></svg></span>
                <h3 class="text-base font-semibold text-slate-800">Announcements</h3>
              </summary>
              <ul class="divide-y divide-slate-100 mb-2">
                <li class="py-2 text-xs text-slate-700">Water outage scheduled for tomorrow</li>
                <li class="py-2 text-xs text-slate-700">New waste collection schedule posted</li>
              </ul>
              <button class="w-full py-2 sm:py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">Post Announcement</button>
            </details>
            <!-- Recent Activity Feed -->
            <div class="bg-white rounded-xl border border-slate-100 shadow p-4 sm:p-6 flex-1">
              <div class="flex items-center mb-2">
                <span class="inline-block bg-purple-100 text-purple-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'/></svg></span>
                <h3 class="text-base font-semibold text-slate-800">Recent Activity</h3>
              </div>
              <ul class="divide-y divide-slate-100 text-xs">
                <li class="py-2">Admin X resolved Complaint 2</li>
                <li class="py-2">Complaint 1 assigned to User Y</li>
                <li class="py-2">Announcement posted: Water outage</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Department Reports -->
        <div class="w-full max-w-5xl mt-6">
          <div class="bg-white rounded-xl border border-slate-100 shadow p-4 sm:p-6">
            <div class="flex items-center mb-2">
              <span class="inline-block bg-purple-100 text-purple-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-5 w-5' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'/></svg></span>
              <h3 class="text-base font-semibold text-slate-800">Department Reports</h3>
            </div>
            <ul class="list-disc pl-5 text-slate-700 text-xs">
              <li>Resolved Complaints: 15</li>
              <li>Pending Complaints: 4</li>
              <li>Overdue Complaints: 1</li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <footer class="w-full bg-white text-slate-400 border-t border-slate-200 py-3 px-4 sm:px-6 text-center text-xs mt-8">
        <p>© 2025 Harare City Portal. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: []
})
export class DepartmentAdminDashboardComponent {
  departmentName = '';
  complaints: any[] = [];
  showAllComplaints = false;
  replyText: { [id: string]: string } = {};
  notifications: { message: string, date: string }[] = [];
  newNotification = '';

  departmentDisplayNames: { [key: string]: string } = {
    water: 'Water & Sanitation',
    roads: 'Roads & Infrastructure',
    wastemanagement: 'Waste Management'
  };

  constructor(private notificationService: NotificationService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Get department from route
    this.route.paramMap.subscribe(params => {
      const dept = params.get('department');
      this.departmentName = dept && this.departmentDisplayNames[dept] ? this.departmentDisplayNames[dept] : (dept ? dept.charAt(0).toUpperCase() + dept.slice(1) : '');
      // TODO: Replace with real fetch logic
      this.complaints = [
        { id: '1', title: 'Burst pipe', description: 'Pipe burst on Main St.', status: 'New', user: 'User A', date: new Date().toISOString(), department: 'water' },
        { id: '2', title: 'No water', description: 'No water in area.', status: 'In Progress', user: 'User B', date: new Date().toISOString(), department: 'water' },
        { id: '3', title: 'Pothole', description: 'Pothole on Main St.', status: 'Pending Review', user: 'User C', date: new Date().toISOString(), department: 'roads' },
        { id: '4', title: 'Missed collection', description: 'Garbage not collected.', status: 'New', user: 'User D', date: new Date().toISOString(), department: 'wastemanagement' }
      ].filter(c => c.department === dept);
    });
    this.notifications = [
      { message: 'Water outage scheduled for tomorrow', date: new Date().toISOString() },
      { message: 'New waste collection schedule posted', date: new Date().toISOString() }
    ];
  }

  get visibleComplaints() {
    return this.showAllComplaints ? this.complaints : this.complaints.slice(-2);
  }

  toggleComplaintsView() {
    this.showAllComplaints = !this.showAllComplaints;
  }

  sendReply(complaintId: string) {
    if (this.replyText[complaintId]) {
      this.notificationService.showSuccess('Reply sent!');
      this.replyText[complaintId] = '';
    }
  }

  postNotification() {
    if (this.newNotification.trim()) {
      this.notifications.unshift({ message: this.newNotification, date: new Date().toISOString() });
      this.notificationService.showSuccess('Announcement posted!');
      this.newNotification = '';
    }
  }
}
