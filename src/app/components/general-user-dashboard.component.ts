import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general-user-dashboard',
  standalone: true,
  imports: [CommonModule],
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
            <div class="flex items-center bg-slate-100 px-3 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4" />
              </svg>
              <span class="font-semibold">natasha</span>
            </div>
            <div class="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
              <button class="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-800">Account Settings</button>
              <button class="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-800">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col items-center pt-28 pb-8 px-2">
        <!-- Dashboard Title -->
        <div class="w-full max-w-5xl mb-6">
          <h2 class="text-xl font-bold text-slate-800">Your citizen dashboard for managing complaints</h2>
        </div>

        <!-- Stats Overview -->
        <div class="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <div class="bg-white rounded shadow p-1 flex items-center justify-center border border-slate-100 w-full min-w-0">
            <span class="inline-flex items-center justify-between w-full px-2">
              <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-1">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700 flex-1 text-center">Active Complaints</span>
              <span class="text-base font-extrabold text-blue-600 ml-2">3</span>
            </span>
          </div>
          <div class="bg-white rounded shadow p-1 flex items-center justify-center border border-slate-100 w-full min-w-0">
            <span class="inline-flex items-center justify-between w-full px-2">
              <span class="inline-block bg-green-100 text-green-600 rounded-full p-1">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M5 13l4 4L19 7'/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700 flex-1 text-center">Resolved</span>
              <span class="text-base font-extrabold text-blue-600 ml-2">2</span>
            </span>
          </div>
          <div class="bg-white rounded shadow p-1 flex items-center justify-center border border-slate-100 w-full min-w-0">
            <span class="inline-flex items-center justify-between w-full px-2">
              <span class="inline-block bg-yellow-100 text-yellow-600 rounded-full p-1">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700 flex-1 text-center">Notifications</span>
              <span class="text-base font-extrabold text-blue-600 ml-2">5</span>
            </span>
          </div>
          <div class="bg-white rounded shadow p-1 flex items-center justify-center border border-slate-100 w-full min-w-0">
            <span class="inline-flex items-center justify-between w-full px-2">
              <span class="inline-block bg-purple-100 text-purple-600 rounded-full p-1">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3'/></svg>
              </span>
              <span class="text-xs font-bold text-slate-700 flex-1 text-center">Avg Response</span>
              <span class="text-base font-extrabold text-blue-600 ml-2">2d</span>
            </span>
          </div>
        </div>

        <!-- Main Cards Section -->
        <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Submit New Complaint -->
          <div class="bg-white rounded-xl border border-slate-100 shadow p-6 flex flex-col justify-between">
            <div class="flex items-center mb-2">
              <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M12 4v16m8-8H4'/></svg></span>
              <h3 class="text-base font-semibold text-slate-800">Submit New Complaint</h3>
            </div>
            <p class="text-xs text-slate-600 mb-4">Report an issue in your neighborhood or with city services. Your voice matters.</p>
            <button class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow flex items-center justify-center gap-2">
              New Complaint
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <!-- My Complaints -->
          <div class="bg-white rounded-xl border border-slate-100 shadow p-6">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <span class="inline-block bg-yellow-100 text-yellow-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3'/></svg></span>
                <h3 class="text-base font-semibold text-slate-800">My Complaints</h3>
              </div>
              <button class="px-3 py-1 border border-blue-600 text-blue-600 rounded text-xs font-semibold hover:bg-blue-50">View All</button>
            </div>
            <div class="space-y-2">
              <!-- Complaint Card Example -->
              <div class="bg-slate-50 rounded p-3 flex flex-col md:flex-row md:items-center justify-between border border-slate-100">
                <div class="flex items-center mb-1 md:mb-0">
                  <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-1 mr-2"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/></svg></span>
                  <div>
                    <div class="text-sm font-bold text-slate-800">Water Supply Interruption</div>
                    <div class="text-xs text-slate-600">No water supply in Avondale area for 2 days</div>
                    <div class="text-xs text-slate-400 mt-1">Submitted: June 18, 2025</div>
                  </div>
                </div>
                <div class="flex flex-col items-end mt-2 md:mt-0">
                  <span class="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs mb-1">In Progress</span>
                  <span class="text-xs text-slate-400">ID: #C-7829</span>
                </div>
              </div>
              <div class="bg-slate-50 rounded p-3 flex flex-col md:flex-row md:items-center justify-between border border-slate-100">
                <div class="flex items-center mb-1 md:mb-0">
                  <span class="inline-block bg-green-100 text-green-600 rounded-full p-1 mr-2"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M5 13l4 4L19 7'/></svg></span>
                  <div>
                    <div class="text-sm font-bold text-slate-800">Street Light Broken</div>
                    <div class="text-xs text-slate-600">Street light on First Street not working at night</div>
                    <div class="text-xs text-slate-400 mt-1">Submitted: June 10, 2025</div>
                  </div>
                </div>
                <div class="flex flex-col items-end mt-2 md:mt-0">
                  <span class="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs mb-1">Resolved</span>
                  <span class="text-xs text-slate-400">ID: #C-7651</span>
                </div>
              </div>
              <div class="bg-slate-50 rounded p-3 flex flex-col md:flex-row md:items-center justify-between border border-slate-100">
                <div class="flex items-center mb-1 md:mb-0">
                  <span class="inline-block bg-purple-100 text-purple-600 rounded-full p-1 mr-2"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='http://www.w3.org/2000/svg' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M7 8h10'/></svg></span>
                  <div>
                    <div class="text-sm font-bold text-slate-800">Garbage Collection Missed</div>
                    <div class="text-xs text-slate-600">Garbage not collected in Highlands suburb this week</div>
                    <div class="text-xs text-slate-400 mt-1">Submitted: June 15, 2025</div>
                  </div>
                </div>
                <div class="flex flex-col items-end mt-2 md:mt-0">
                  <span class="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs mb-1">Pending</span>
                  <span class="text-xs text-slate-400">ID: #C-7732</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lower Section: Notifications & Quick Access -->
        <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Notifications -->
          <div class="bg-white rounded-xl border border-slate-100 shadow p-6 flex flex-col">
            <div class="flex items-center mb-2">
              <span class="inline-block bg-yellow-100 text-yellow-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='http://www.w3.org/2000/svg' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'/></svg></span>
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
                <span class="inline-block bg-purple-100 text-purple-600 rounded-full p-1 mr-2 mt-1"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='http://www.w3.org/2000/svg' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M7 8h10'/></svg></span>
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
              <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-2 mr-2"><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='http://www.w3.org/2000/svg' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M5 3v4c0 1.1.9 2 2 2h10a2 2 0 002-2V3M5 3h14M9 14h6m-3-3v6'/></svg></span>
              <h3 class="text-base font-semibold text-slate-800">Quick Access</h3>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button class="bg-slate-50 hover:bg-blue-50 transition rounded p-3 border border-slate-100 flex flex-col items-center shadow">
                <span class="inline-block bg-blue-100 text-blue-600 rounded-full p-1 mb-1"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='http://www.w3.org/2000/svg' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z'/></svg></span>
                <span class="text-xs text-slate-800 font-semibold">Billing</span>
              </button>
              <button class="bg-slate-50 hover:bg-blue-50 transition rounded p-3 border border-slate-100 flex flex-col items-center shadow">
                <span class="inline-block bg-yellow-100 text-yellow-600 rounded-full p-1 mb-1"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='http://www.w3.org/2000/svg' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/></svg></span>
                <span class="text-xs text-slate-800 font-semibold">Events</span>
              </button>
              <button class="bg-slate-50 hover:bg-blue-50 transition rounded p-3 border border-slate-100 flex flex-col items-center shadow">
                <span class="inline-block bg-green-100 text-green-600 rounded-full p-1 mb-1"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='http://www.w3.org/2000/svg' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'/></svg></span>
                <span class="text-xs text-slate-800 font-semibold">Services</span>
              </button>
              <button class="bg-slate-50 hover:bg-blue-50 transition rounded p-3 border border-slate-100 flex flex-col items-center shadow">
                <span class="inline-block bg-purple-100 text-purple-600 rounded-full p-1 mb-1"><svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='http://www.w3.org/2000/svg' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'/></svg></span>
                <span class="text-xs text-slate-800 font-semibold">Contact</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <footer class="w-full bg-slate-800 text-slate-200 border-t border-slate-700 py-3 px-6 text-center text-xs">
        <p>© 2025 Harare City Portal. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `
})
export class GeneralUserDashboardComponent {
  constructor() {}
}