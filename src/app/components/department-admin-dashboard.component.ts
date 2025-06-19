import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Department Admin Dashboard</h1>
        <button class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Logout</button>
      </nav>

      <div class="max-w-6xl mx-auto py-8">
        <h2 class="text-4xl font-bold text-gray-800 mb-8">Welcome, [Admin Name]</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Complaints Queue -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Complaints Queue</h3>
            <ul class="list-disc pl-5 text-gray-700">
              <li>Complaint 1 - Status: New</li>
              <li>Complaint 2 - Status: In Progress</li>
              <li>Complaint 3 - Status: Pending Review</li>
            </ul>
          </div>

          <!-- Update Status -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Update Complaint Status</h3>
            <button class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Update Status</button>
          </div>

          <!-- Announcements -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Post Announcements</h3>
            <button class="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">Post Announcement</button>
          </div>

          <!-- Department Reports -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Department Reports</h3>
            <ul class="list-disc pl-5 text-gray-700">
              <li>Resolved Complaints: 10</li>
              <li>Pending Complaints: 5</li>
              <li>Overdue Complaints: 2</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DepartmentAdminDashboardComponent {}
