import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">User Dashboard</h1>
        <button class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Logout</button>
      </nav>

      <div class="max-w-6xl mx-auto py-8">
        <h2 class="text-4xl font-bold text-gray-800 mb-8">Welcome, [User Name]</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Submit Complaint -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Submit a Complaint</h3>
            <button class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Submit Complaint</button>
          </div>

          <!-- My Complaints -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">My Complaints</h3>
            <ul class="list-disc pl-5 text-gray-700">
              <li>Complaint 1 - Status: In Progress</li>
              <li>Complaint 2 - Status: Resolved</li>
              <li>Complaint 3 - Status: Pending</li>
            </ul>
          </div>

          <!-- Notifications -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Notifications</h3>
            <ul class="list-disc pl-5 text-gray-700">
              <li>Notification 1</li>
              <li>Notification 2</li>
              <li>Notification 3</li>
            </ul>
          </div>

          <!-- Resolved Issues -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Resolved Issues</h3>
            <ul class="list-disc pl-5 text-gray-700">
              <li>Issue 1</li>
              <li>Issue 2</li>
              <li>Issue 3</li>
            </ul>
          </div>

          <!-- Account Settings -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Account Settings</h3>
            <button class="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class GeneralUserDashboardComponent {}
