import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overall-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Overall Admin Dashboard</h1>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Logout</button>
      </nav>

      <div class="max-w-4xl mx-auto py-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Welcome, [Admin Name]</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- All Complaints -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">All Complaints</h3>
            <ul class="list-disc pl-5">
              <li>Complaint 1 - Status: New</li>
              <li>Complaint 2 - Status: Resolved</li>
              <li>Complaint 3 - Status: In Progress</li>
            </ul>
          </div>

          <!-- Analytics & Reports -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Analytics & Reports</h3>
            <ul class="list-disc pl-5">
              <li>Top Departments by Complaints</li>
              <li>Time to Resolution (avg)</li>
              <li>Urgent vs Normal Issues</li>
            </ul>
          </div>

          <!-- Manage Departments -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Manage Departments</h3>
            <button class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">Add Department</button>
          </div>

          <!-- Manage Users -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Manage Users</h3>
            <button class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition">Promote User</button>
          </div>

          <!-- Announcements -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Post Announcements</h3>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Post Announcement</button>
          </div>

          <!-- AI Insights -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">AI Insights</h3>
            <ul class="list-disc pl-5">
              <li>Customer Feedback Analysis</li>
              <li>Complaint Resolution Assistant</li>
              <li>Quality Control Monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OverallAdminDashboardComponent {}
