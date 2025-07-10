import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserData } from '../services/auth.service';

@Component({
  selector: 'app-user-approval-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96 max-w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ user?.isApproved ? 'Manage Admin Access' : 'Pending Admin Approval' }}
          </h2>
          <button 
            (click)="close.emit()"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <p class="text-gray-900 dark:text-white">{{ user?.name }} {{ user?.surname }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p class="text-gray-900 dark:text-white">{{ user?.email }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <p class="text-gray-900 dark:text-white capitalize">{{ user?.role }}</p>
            </div>
            <div *ngIf="user?.department">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
              <p class="text-gray-900 dark:text-white">{{ user?.department }}</p>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Approval Notes</label>
            <textarea
              [(ngModel)]="approvalNotes"
              class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              rows="3"
              placeholder="Enter any notes about this approval decision..."
            ></textarea>
          </div>

          <div class="flex justify-between items-center mt-6">
            <div class="flex items-center" *ngIf="user?.isApproved">
              <span class="text-green-600 dark:text-green-400 flex items-center">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Approved
              </span>
            </div>
            <div class="flex gap-3">
              <button
                *ngIf="!user?.isApproved"
                (click)="approve.emit({ uid: user?.uid ?? '', notes: approvalNotes })"
                class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Approve Access
              </button>
              <button
                *ngIf="user?.isApproved"
                (click)="revoke.emit({ uid: user?.uid ?? '', notes: approvalNotes })"
                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Revoke Access
              </button>
              <button
                (click)="close.emit()"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserApprovalModalComponent {
  @Input() user: UserData | null = null;
  @Output() approve = new EventEmitter<{ uid: string, notes: string }>();
  @Output() revoke = new EventEmitter<{ uid: string, notes: string }>();
  @Output() close = new EventEmitter<void>();

  approvalNotes: string = '';
} 