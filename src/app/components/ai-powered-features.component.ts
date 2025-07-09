import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../services/activity.service';
import { Subscription } from 'rxjs';
import { ComplaintAnalyticsModalComponent } from './complaint-analytics-modal.component';
import { ComplaintService } from '../services/complaint.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-ai-powered-features',
  standalone: true,
  imports: [CommonModule, FormsModule, ComplaintAnalyticsModalComponent],
  template: `
    <div class="w-full max-w-8xl mt-6">
      <!-- AI Powered Features Header -->
      <div class="flex items-center justify-center mb-6">
        <div class="flex items-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-6 py-3 shadow-lg border border-purple-200">
          <span class="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-2 mr-3 flex items-center justify-center">
            <!-- AI Engine Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <path d="M12 2v20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
          <h2 class="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI POWERED FEATURES
          </h2>
        </div>
      </div>

      <!-- Analytics Components Grid -->
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Analytics & Reports -->
        <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-3 flex flex-col h-48 w-full md:w-64">
          <div class="flex items-center mb-2 justify-between w-full">
            <span class="flex items-center">
              <span class="bg-blue-100 text-blue-600 rounded-full p-1 mr-1 flex items-center justify-center">
                <!-- Analytics/Report Icon: Network Bar (Signal Strength) -->
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' class='h-4 w-4' fill='none'>
                  <rect x='6' y='22' width='4' height='6' rx='1' fill='#2563eb'/>
                  <rect x='12' y='18' width='4' height='10' rx='1' fill='#3b82f6'/>
                  <rect x='18' y='12' width='4' height='16' rx='1' fill='#60a5fa'/>
                  <rect x='24' y='6' width='4' height='22' rx='1' fill='#93c5fd'/>
                </svg>
              </span>
              <span class="font-semibold text-xs text-slate-800">Analytics & Reports</span>
            </span>
          </div>
          <ul class="list-disc pl-3 text-[10px] text-slate-700 mb-2 flex-1">
            <li>Top Departments by Complaints</li>
            <li>Time to Resolution: 4.2 days</li>
            <li>User Satisfaction: 86%</li>
            <li>Response Time: 2.3 hours</li>
            <li>Active Time: 10:00 AM - 2:00 PM</li>
            <li>Volume Trend: +12% (month)</li>
          </ul>
          <div class="flex flex-row justify-center gap-1">
            <button (click)="showAnalyticsModal = true" class="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700 transition">View Analytics</button>
            <button (click)="generateReport()" class="px-2 py-1 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-700 transition ml-2">Report</button>
          </div>
        </div>
        
        <!-- AI Insights -->
        <div class="bg-gradient-to-br from-purple-100/80 to-white/80 backdrop-blur rounded-xl border border-purple-200 shadow p-3 flex flex-col h-48 w-full md:w-64">
          <div class="flex items-center mb-2 justify-between w-full">
            <span class="flex items-center">
              <span class="bg-purple-100 text-purple-600 rounded-full p-1 mr-1 flex items-center justify-center">
                <!-- AI Insights Icon: Brain/AI -->
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
            <li>Water and Sanitation has the highest complaint resolution rate.</li>
            <li>Predicted spike in road maintenance complaints next month.</li>
            <li>Most common issue: Water outages.</li>
            <li>Department Admin John resolved 15 complaints this week.</li>
          </ul>
          <div class="flex justify-center">
            <button (click)="openInsightsModal()" class="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-bold" style="min-width:unset;">View Insights</button>
          </div>
        </div>
        
        <!-- Trends & Risks Card -->
        <div class="bg-gradient-to-br from-blue-100/80 to-white/80 backdrop-blur rounded-xl border border-blue-200 shadow p-3 flex flex-col h-48 w-full md:w-64">
          <div class="flex items-center mb-2 justify-between w-full">
            <span class="flex items-center">
              <span class="bg-red-100 text-red-600 rounded-full p-1 mr-1 flex items-center justify-center">
                <!-- Trends & Risks Icon: Alert/Trend Graph -->
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
            <li>Emerging complaint patterns</li>
            <li>Departments at risk</li>
            <li>Seasonal risk factors</li>
            <li>Infrastructure vulnerabilities</li>
            <li>Community sentiment shifts</li>
            <li>Recent spikes in complaints</li>
            <li>Potential resource shortages</li>
          </ul>
          <div class="flex justify-center">
            <button (click)="openTrendsModal()" class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold" style="min-width:unset;">View Trends</button>
          </div>
        </div>
        
        <!-- Real-time Logs -->
        <div class="bg-gradient-to-br from-green-100/80 to-white/80 backdrop-blur rounded-xl border border-green-200 shadow p-3 flex flex-col h-48 w-full md:w-64">
          <div class="flex items-center mb-2 justify-between w-full">
            <span class="flex items-center">
              <span class="bg-green-100 text-green-600 rounded-full p-1 mr-1 flex items-center justify-center">
                <!-- Real-time Logs Icon: Document/Log -->
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='h-4 w-4' fill='none' stroke='currentColor' stroke-width='2'>
                  <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' stroke='#059669' fill='#d1fae5'/>
                  <polyline points='14,2 14,8 20,8' stroke='#059669' stroke-width='2'/>
                  <line x1='16' y1='13' x2='8' y2='13' stroke='#059669' stroke-width='2'/>
                  <line x1='16' y1='17' x2='8' y2='17' stroke='#059669' stroke-width='2'/>
                  <polyline points='10,9 9,9 8,9' stroke='#059669' stroke-width='2'/>
                </svg>
              </span>
              <span class="font-semibold text-xs text-slate-800">Real-time Logs</span>
            </span>
          </div>
          <ul class="list-disc pl-3 text-[10px] text-slate-700 mb-2 flex-1">
            <li>User login activities</li>
            <li>Complaint submissions</li>
            <li>Status updates</li>
            <li>System notifications</li>
            <li>Admin actions</li>
            <li>Error tracking</li>
            <li>Performance metrics</li>
          </ul>
          <div class="flex justify-center">
            <button (click)="openLogsModal()" class="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold" style="min-width:unset;">View Logs</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Real-time Logs Modal -->
    <div *ngIf="showLogsModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div class="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[70vh] flex flex-col border border-slate-200/50 animate-slideUp">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-2xl">
          <div class="flex items-center gap-3">
            <div class="relative">
              <span class="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg p-2 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" fill="none"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2"/>
                </svg>
              </span>
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 class="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Activity Logs</h3>
              <p class="text-xs text-slate-500 flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Real-time monitoring
              </p>
            </div>
          </div>
          <button (click)="closeLogsModal()" class="p-1.5 hover:bg-slate-100 rounded-lg transition-all duration-200 group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Actions -->
        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/50 to-blue-50/50 border-b border-slate-200/30">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-slate-200/50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span class="text-sm font-semibold text-slate-700">{{ activityFeed.length }}</span>
              <span class="text-xs text-slate-500">logs</span>
            </div>
            <div class="flex items-center gap-1 text-xs text-slate-500">
              <span class="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              <span>Live</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button (click)="downloadLog()" class="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
            <button (click)="showClearLogConfirmation()" class="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-slate-50/30 to-blue-50/30">
          <div class="space-y-2">
            <div *ngFor="let activity of activityFeed; trackBy: trackByActivity" class="group">
              <div class="flex items-start gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white/90 transition-all duration-200 border border-slate-200/50 hover:border-slate-300/50 hover:shadow-md transform hover:scale-[1.01]">
                <div class="flex-shrink-0 mt-0.5">
                  <span [class]="'w-2.5 h-2.5 rounded-full flex-shrink-0 ' + (activity.severity === 'warning' ? 'bg-yellow-400 shadow-md shadow-yellow-400/50' : activity.severity === 'error' ? 'bg-red-400 shadow-md shadow-red-400/50' : 'bg-green-400 shadow-md shadow-green-400/50')"></span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-800 group-hover:text-slate-900 transition-colors leading-relaxed">{{ activity.message }}</p>
                  <div class="flex items-center gap-2 mt-1.5">
                    <p *ngIf="activity.timestamp" class="text-xs text-slate-500 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ activity.timestamp?.toDate() | date:'MMM d, HH:mm' }}
                    </p>
                    <span [class]="'px-1.5 py-0.5 rounded-full text-xs font-medium ' + (activity.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' : activity.severity === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')">
                      {{ activity.severity || 'info' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="activityFeed.length === 0" class="text-center py-8">
              <div class="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50">
                <div class="w-12 h-12 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 class="text-base font-semibold text-slate-700 mb-1">No Activity Logs</h3>
                <p class="text-xs text-slate-500">System activities will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Log Confirmation Modal -->
    <div *ngIf="showClearLogModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2">
      <div class="bg-gradient-to-br from-blue-50 to-green-50 border border-green-200 rounded-xl shadow-xl w-full max-w-xs p-4 flex flex-col items-center">
        <div class="flex items-center gap-2 mb-2">
          <span class="bg-green-100 text-green-600 rounded-full p-1 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </span>
          <h3 class="text-base font-bold text-green-700">Clear Activity Log</h3>
        </div>
        <p class="text-xs text-slate-600 mb-3 text-center">Are you sure you want to clear all activity logs? This cannot be undone.</p>
        <div class="flex gap-2 w-full justify-center">
          <button (click)="cancelClearLog()" class="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold transition-colors">Cancel</button>
          <button (click)="confirmClearLog()" [disabled]="clearingLog" class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
            <svg *ngIf="clearingLog" class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ clearingLog ? 'Clearing...' : 'Clear Log' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div *ngIf="clearLogSuccess" class="fixed top-6 right-6 bg-green-500/80 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 text-xs backdrop-blur-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      ✓ Log cleared successfully!
    </div>

    <app-complaint-analytics-modal [show]="showAnalyticsModal" [complaints]="complaints" (closeModal)="showAnalyticsModal = false"></app-complaint-analytics-modal>

    <div *ngIf="showInsightsModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 m-0 w-full h-full">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl sm:max-w-3xl md:max-w-4xl max-h-[80vh] h-[80vh] border border-gray-200 flex flex-col mx-8 sm:mx-16 my-8">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-700 text-white rounded-t-xl">
            <div class="flex items-center gap-3">
              <div class="bg-white/20 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span class="text-base font-medium">AI Insights</span>
            </div>
            <button (click)="showInsightsModal = false" class="text-white/80 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        <div class="flex-1 overflow-y-auto p-6 sm:p-10 space-y-4">
          <div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded shadow">
            <div class="flex items-center gap-2 mb-2">
              <svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6 text-purple-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'><circle cx='12' cy='12' r='10' stroke='#a21caf' stroke-width='2' fill='#f3e8ff'/></svg>
              <span class="font-semibold text-purple-700">AI says:</span>
            </div>
            <div class="text-gray-800 text-base min-h-[60px] flex items-center">{{ aiInsightsList[currentInsightIndex] }}</div>
          </div>
          </div>
          <div class="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end">
          <button (click)="showNextInsight()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Next</button>
        </div>
      </div>
    </div>

    <div *ngIf="showTrendsModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 m-0 w-full h-full">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl sm:max-w-3xl md:max-w-4xl max-h-[80vh] h-[80vh] border border-gray-200 flex flex-col mx-8 sm:mx-16 my-8">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-t-xl">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <polyline points="3,17 9,11 13,15 21,7" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="3" cy="17" r="1.5" fill="#dc2626"/>
                <circle cx="9" cy="11" r="1.5" fill="#dc2626"/>
                <circle cx="13" cy="15" r="1.5" fill="#dc2626"/>
                <circle cx="21" cy="7" r="1.5" fill="#dc2626"/>
              </svg>
            </div>
            <span class="text-base font-medium">Trends & Risks</span>
          </div>
          <button (click)="showTrendsModal = false" class="text-white/80 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-6 sm:p-10 space-y-4">
          <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded shadow">
            <div class="flex items-center gap-2 mb-2">
              <svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'><polyline points='3,17 9,11 13,15 21,7' fill='none' stroke='#dc2626' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/><circle cx='3' cy='17' r='1.5' fill='#dc2626'/><circle cx='9' cy='11' r='1.5' fill='#dc2626'/><circle cx='13' cy='15' r='1.5' fill='#dc2626'/><circle cx='21' cy='7' r='1.5' fill='#dc2626'/></svg>
              <span class="font-semibold text-red-700">AI says:</span>
            </div>
            <div class="text-gray-800 text-base min-h-[60px] flex items-center">{{ trendsAndRisksList[currentTrendIndex] }}</div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end">
          <button (click)="showNextTrend()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Next</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0; 
        transform: translateY(20px) scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
    
    .animate-slideUp {
      animation: slideUp 0.4s ease-out;
    }
    
    .backdrop-blur-sm {
      backdrop-filter: blur(8px);
    }
    
    .backdrop-blur-sm {
      backdrop-filter: blur(8px);
    }
  `]
})
export class AiPoweredFeaturesComponent implements OnInit {
  showLogsModal = false;
  showClearLogModal = false;
  clearingLog = false;
  clearLogSuccess = false;
  activityFeed: any[] = [];
  private activityUnsub?: () => void;
  showAnalyticsModal = false;
  complaints: any[] = [];
  showInsightsModal = false;
  aiInsightsList = [
    '☀️ Harare, often called the "Sunshine City," enjoys over 300 days of sunshine each year, making it one of the most pleasant climates in Africa. The city’s high altitude ensures cool evenings and comfortable days, perfect for outdoor living.',
    '🌳 The city is renowned for its lush green spaces, including the Harare Gardens, Mukuvisi Woodlands, and the National Botanic Gardens. These parks offer residents and visitors a tranquil escape from urban life and support a rich diversity of flora and fauna.',
    '🎨 Harare is a vibrant hub for arts, music, and culture. The National Gallery of Zimbabwe showcases contemporary African art, while annual festivals like HIFA (Harare International Festival of the Arts) attract global talent and celebrate local creativity.',
    '🛒 The city’s markets, such as Mbare Musika, are bustling centers of commerce and culture. Here, you can experience the true spirit of Zimbabwean entrepreneurship, taste local delicacies, and find unique crafts.',
    '🎓 Harare is a leader in education and innovation, home to top institutions like the University of Zimbabwe and a growing tech startup scene. The city’s youth are driving digital transformation and social change.',
    '💡 Recent city initiatives focus on smart infrastructure, clean energy, and sustainable urban growth. Projects include solar-powered street lighting, digital service delivery, and expanded public transport options.',
    '🍲 The city’s culinary scene is diverse and exciting, with restaurants offering everything from traditional Zimbabwean dishes to international cuisine. Food festivals and pop-up markets are popular weekend attractions.',
    '🤝 Harare’s community spirit is evident in its many volunteer organizations, neighborhood clean-up campaigns, and youth empowerment programs. Residents take pride in their city and work together to build a better future.',
    '🏏 Sports are a major part of life in Harare, with cricket, soccer, and rugby drawing passionate crowds. The city regularly hosts international sporting events and is home to several renowned sports academies.',
    '🌍 Whether you’re a resident or visitor, Harare offers a unique blend of tradition and modernity, with a welcoming atmosphere that makes everyone feel at home.'
  ];
  currentInsightIndex: number = 0;
  showTrendsModal = false;
  trendsAndRisksList = [
    '💧 Water supply reliability is a recurring challenge, especially during the dry season. The city is investing in new boreholes, water recycling, and leak detection technology to address shortages and improve access for all residents.',
    '🌧️ Heavy seasonal rains often lead to increased road damage and potholes, particularly in high-traffic areas. The city’s new road maintenance program aims to use predictive analytics to schedule repairs before issues become critical.',
    '🗑️ Waste management remains a top concern, with illegal dumping and inconsistent collection affecting some neighborhoods. Community-led recycling initiatives and public awareness campaigns are helping to reduce landfill waste and promote a cleaner city.',
    '🦠 Public health risks, such as cholera and typhoid outbreaks, are closely linked to water and sanitation infrastructure. Ongoing upgrades to sewer systems and expanded health education are reducing the frequency and severity of outbreaks.',
    '🔌 Power outages and load shedding can disrupt businesses and daily life. The city is exploring alternative energy sources, including solar microgrids and battery storage, to build resilience and reduce dependence on the national grid.',
    '🏘️ Rapid urbanization is increasing demand for affordable housing, schools, and healthcare. Strategic urban planning and public-private partnerships are being used to expand essential services and manage population growth.',
    '🚦 Traffic congestion is a growing risk, especially during peak hours in the CBD. Smart traffic lights, expanded public transport, and new cycling lanes are being piloted to improve mobility and reduce emissions.',
    '🌡️ Climate change is intensifying droughts and heatwaves, impacting water supply, agriculture, and public health. The city is developing a climate action plan focused on green infrastructure, tree planting, and water conservation.',
    '🛡️ As Harare adopts more digital services, cybersecurity and data privacy are emerging risks. Investments in secure IT infrastructure and public education on digital safety are priorities for city leaders.',
    '⛽ Supply chain disruptions, such as fuel and medical shortages, can impact essential services. The city is building strategic reserves and diversifying suppliers to ensure continuity during crises.'
  ];
  currentTrendIndex: number = 0;
  constructor(private activityService: ActivityService, private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.setupActivityFeed();
    this.complaintService.complaints$.subscribe((complaints) => {
      this.complaints = complaints;
    });
  }

  setupActivityFeed() {
    this.activityUnsub = this.activityService.listenToActivities((activities: any[]) => {
      this.activityFeed = activities;
    });
  }

  openLogsModal() {
    this.showLogsModal = true;
  }

  closeLogsModal() {
    this.showLogsModal = false;
  }

  downloadLog() {
    const logContent = this.generateLogContent();
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private generateLogContent(): string {
    let content = '=== HARARE CITY PORTAL ACTIVITY LOG ===\n';
    content += `Generated on: ${new Date().toLocaleString()}\n`;
    content += `Total Activities: ${this.activityFeed.length}\n\n`;

    this.activityFeed.forEach((activity, index) => {
      const timestamp = activity.timestamp?.toDate()?.toLocaleString() || 'Unknown time';
      const severity = activity.severity || 'info';
      content += `${index + 1}. [${timestamp}] [${severity.toUpperCase()}] ${activity.message}\n`;
    });

    return content;
  }

  showClearLogConfirmation() {
    this.showClearLogModal = true;
  }

  cancelClearLog() {
    this.showClearLogModal = false;
  }

  async confirmClearLog() {
    this.clearingLog = true;
    try {
      await this.activityService.clearAllActivities();
      this.clearLogSuccess = true;
      // Show green tick for 2 seconds then close modal
      setTimeout(() => {
        this.clearLogSuccess = false;
        this.showClearLogModal = false;
      }, 2000);
    } catch (error) {
      console.error('Error clearing log:', error);
    } finally {
      this.clearingLog = false;
    }
  }

  generateReport() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Complaint Analytics Report', 10, 15);
    doc.setFontSize(10);
    let y = 25;
    doc.text(`Total Complaints: ${this.complaints.length}`, 10, y);
    y += 8;
    // Department with most complaints
    const deptCounts: Record<string, number> = {};
    for (let c of this.complaints) {
      const dept = c.department || 'Unknown';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    }
    const deptSorted = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);
    const topDept = deptSorted[0]?.[0] || '';
    const topDeptCount = deptSorted[0]?.[1] || 0;
    doc.text(`Department with Most Complaints: ${topDept} (${topDeptCount})`, 10, y);
    y += 8;
    // Most common category
    const catCounts: Record<string, number> = {};
    for (let c of this.complaints) {
      const cat = c.category || 'Unknown';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
    const catSorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    const topCat = catSorted[0]?.[0] || '';
    const topCatCount = catSorted[0]?.[1] || 0;
    doc.text(`Most Common Category: ${topCat} (${topCatCount})`, 10, y);
    y += 8;
    // User with most complaints
    const userCounts: Record<string, number> = {};
    for (let c of this.complaints) {
      const user = c.submittedBy?.name || 'Anonymous';
      userCounts[user] = (userCounts[user] || 0) + 1;
    }
    const userSorted = Object.entries(userCounts).sort((a, b) => b[1] - a[1]);
    const topUser = userSorted[0]?.[0] || '';
    const topUserCount = userSorted[0]?.[1] || 0;
    doc.text(`User with Most Complaints: ${topUser} (${topUserCount})`, 10, y);
    y += 8;
    // Add a table of complaints by department
    doc.setFontSize(12);
    doc.text('Complaints by Department:', 10, y + 6);
    doc.setFontSize(10);
    y += 14;
    deptSorted.forEach(([dept, count]) => {
      doc.text(`${dept}: ${count}`, 12, y);
      y += 6;
    });
    // Download the PDF
    doc.save('complaint-analytics-report.pdf');
  }

  trackByActivity(index: number, activity: any): string {
    return activity.id || index;
  }

  nextInsight() {
    this.currentInsightIndex = (this.currentInsightIndex + 1) % this.aiInsightsList.length;
  }

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