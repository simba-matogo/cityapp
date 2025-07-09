import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-complaint-analytics-modal',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div *ngIf="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[480px] border border-gray-200 flex flex-col relative">
        <!-- Modal Header (smaller) -->
        <div class="flex items-center justify-between p-2 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
          <div class="flex items-center gap-2">
            <div class="bg-white/20 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span class="text-base font-medium">Complaint Analytics</span>
          </div>
          <button (click)="close()" class="text-white/80 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ng-container *ngIf="complaints && complaints.length; else noData">
          <div class="flex-1 overflow-y-auto p-2 space-y-4">
            <!-- Complaints by Department -->
            <div>
              <h4 class="font-semibold mb-1 text-sm">Complaints by Department</h4>
              <canvas baseChart class="h-28 max-h-40 w-full"
                [data]="departmentChartData"
                [labels]="departmentChartLabels"
                [type]="'pie'"
                [options]="pieChartOptions">
              </canvas>
            </div>
            <!-- Complaints by User (Top 5) -->
            <div>
              <h4 class="font-semibold mb-1 text-sm">Top 5 Users by Complaints</h4>
              <canvas baseChart class="h-28 max-h-40 w-full"
                [data]="userChartData"
                [labels]="userChartLabels"
                [type]="'bar'"
                [options]="barChartOptions">
              </canvas>
            </div>
            <!-- Summary -->
            <div class="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100 text-blue-900 text-xs">
              <div><strong>Total Complaints:</strong> {{ complaints.length }}</div>
              <div *ngIf="departmentWithMostComplaints">
                <strong>Department with Most Complaints:</strong> {{ departmentWithMostComplaints }} ({{ mostComplaintsCount }})
              </div>
              <div *ngIf="topCategory">
                <strong>Most Common Category:</strong> {{ topCategory }} ({{ topCategoryCount }})
              </div>
              <div *ngIf="topUser">
                <strong>User with Most Complaints:</strong> {{ topUser }} ({{ topUserCount }})
              </div>
            </div>
          </div>
        </ng-container>
        <ng-template #noData>
          <div class="flex-1 flex items-center justify-center text-center text-gray-500">No complaint data available.</div>
        </ng-template>
      </div>
    </div>
  `
})
export class ComplaintAnalyticsModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() complaints: any[] = [];
  @Output() closeModal = new EventEmitter<void>();

  departmentChartLabels: string[] = [];
  departmentChartData: any = { labels: [], datasets: [] };
  pieChartOptions = { responsive: true };

  userChartLabels: string[] = [];
  userChartData: any = { labels: [], datasets: [] };

  // Summary fields
  departmentWithMostComplaints: string = '';
  mostComplaintsCount: number = 0;
  topCategory: string = '';
  topCategoryCount: number = 0;
  topUser: string = '';
  topUserCount: number = 0;

  barChartOptions = { responsive: true };

  private allComplaints: any[] = [];

  ngOnInit() {
    this.allComplaints = [...this.complaints];
    this.updateCharts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['complaints']) {
      this.allComplaints = [...this.complaints];
      this.updateCharts();
    }
  }

  close() {
    this.show = false;
    this.closeModal.emit();
  }

  updateCharts() {
    this.generateDepartmentChart();
    this.generateUserChart();
    this.generateSummary();
  }

  generateDepartmentChart() {
    const counts: Record<string, number> = {};
    for (let c of this.complaints) {
      const dept = c.department || 'Unknown';
      counts[dept] = (counts[dept] || 0) + 1;
    }
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    this.departmentChartLabels = labels;
    this.departmentChartData = {
      labels,
      datasets: [{ data, label: 'Complaints' }]
    };
  }

  generateUserChart() {
    const counts: Record<string, number> = {};
    for (let c of this.complaints) {
      const user = c.submittedBy?.name || 'Anonymous';
      counts[user] = (counts[user] || 0) + 1;
    }
    // Sort users by complaint count, take top 5
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const labels = sorted.map(([user]) => user);
    const data = sorted.map(([, count]) => count);
    this.userChartLabels = labels;
    this.userChartData = {
      labels,
      datasets: [{ data, label: 'Complaints' }]
    };
  }

  generateSummary() {
    // Department with most complaints
    const deptCounts: Record<string, number> = {};
    for (let c of this.complaints) {
      const dept = c.department || 'Unknown';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    }
    const deptSorted = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);
    this.departmentWithMostComplaints = deptSorted[0]?.[0] || '';
    this.mostComplaintsCount = deptSorted[0]?.[1] || 0;

    // Most common category
    const catCounts: Record<string, number> = {};
    for (let c of this.complaints) {
      const cat = c.category || 'Unknown';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
    const catSorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    this.topCategory = catSorted[0]?.[0] || '';
    this.topCategoryCount = catSorted[0]?.[1] || 0;

    // User with most complaints
    const userCounts: Record<string, number> = {};
    for (let c of this.complaints) {
      const user = c.submittedBy?.name || 'Anonymous';
      userCounts[user] = (userCounts[user] || 0) + 1;
    }
    const userSorted = Object.entries(userCounts).sort((a, b) => b[1] - a[1]);
    this.topUser = userSorted[0]?.[0] || '';
    this.topUserCount = userSorted[0]?.[1] || 0;
  }
} 