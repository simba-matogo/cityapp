import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-firebase-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Connection Status -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-4">Firebase Connection Status</h1>
          <div class="flex items-center mb-4">
            <div [class]="connectionStatus ? 'bg-green-500' : 'bg-red-500'" 
                 class="w-4 h-4 rounded-full mr-2"></div>
            <span class="text-lg">
              {{ connectionStatus ? 'Connected to Firebase' : 'Offline Mode' }}
            </span>
          </div>
          <div class="flex gap-2">
            <button (click)="goOnline()" 
                    [disabled]="connectionStatus"
                    class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    [class.opacity-50]="connectionStatus">
              Go Online
            </button>
            <button (click)="goOffline()" 
                    [disabled]="!connectionStatus"
                    class="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    [class.opacity-50]="!connectionStatus">
              Go Offline
            </button>
          </div>
        </div>
        
        <!-- Data Display -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900">Items from Firestore</h2>
            <div class="flex gap-2">
              <button (click)="loadItems()" 
                      class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Refresh Data
              </button>
              <button (click)="showAddForm = !showAddForm" 
                      class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                {{ showAddForm ? 'Cancel' : 'Add Item' }}
              </button>
            </div>
          </div>
            <!-- Error Message -->
          <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong class="font-bold">Error:</strong>
            <span class="block sm:inline"> {{ errorMessage }}</span>
            <button (click)="clearError()" class="float-right font-bold">&times;</button>
          </div>
          
          <!-- Add Form -->
          <div *ngIf="showAddForm" class="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" id="name" [(ngModel)]="newItem.name" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" [(ngModel)]="newItem.description" rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <button (click)="addItem()" 
                    [disabled]="!newItem.name" 
                    [class.opacity-50]="!newItem.name"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Save Item
            </button>
          </div>
          
          <!-- Items List -->
          <div *ngIf="isLoading" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600">Loading items...</p>
          </div>
          
          <div *ngIf="!isLoading && !errorMessage && items.length === 0" class="text-center py-8 text-gray-500">
            No items found. Add an item to get started.
          </div>
          
          <ul *ngIf="!isLoading && items.length > 0" class="divide-y divide-gray-200">
            <li *ngFor="let item of items" class="py-4">
              <div class="flex justify-between">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
                  <p class="text-gray-600 mt-1">{{ item.description }}</p>
                </div>
                <div class="flex gap-2">
                  <button (click)="deleteItem(item.id)" 
                          class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <!-- Firebase Info -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-2">Firebase Configuration</h2>
          <div class="bg-gray-50 p-4 rounded border border-gray-200">
            <p class="mb-1"><span class="font-semibold">Project ID:</span> citycouncil-27475</p>
            <p><span class="font-semibold">Collection:</span> {{ collectionName }}</p>
            <p><span class="font-semibold">Status:</span> {{ connectionStatus ? 'Online' : 'Offline' }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FirebaseDemoComponent implements OnInit, OnDestroy {
  private firebaseService = inject(FirebaseService);
  private subscription = new Subscription();
  
  connectionStatus = true;
  items: any[] = [];
  isLoading = true;
  showAddForm = false;
  collectionName = 'items';
  errorMessage = '';
  
  newItem = {
    name: '',
    description: '',
    createdAt: ''
  };

  ngOnInit() {
    // Subscribe to connection status from service
    this.subscription.add(
      this.firebaseService.isConnected$.subscribe(status => {
        this.connectionStatus = status;
      })
    );
    
    // Check Firebase connection with a slight delay
    setTimeout(() => {
      this.loadItems();
    }, 1000);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  async goOnline() {
    try {
      await this.firebaseService.goOnline();
      this.errorMessage = '';
      this.loadItems();
    } catch (error) {
      this.handleError('Failed to connect to Firebase');
    }
  }
  
  async goOffline() {
    try {
      await this.firebaseService.goOffline();
    } catch (error) {
      this.handleError('Failed to disconnect from Firebase');
    }
  }

  async loadItems() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      this.items = await this.firebaseService.getCollection(this.collectionName);
      console.log('Items loaded:', this.items);
    } catch (error) {
      this.handleError('Error loading items. Using local data if available.');
    } finally {
      this.isLoading = false;
    }
  }

  async addItem() {
    if (!this.newItem.name) return;
    
    try {
      const itemToAdd = {
        ...this.newItem,
        createdAt: new Date().toISOString()
      };
      
      await this.firebaseService.addDocument(this.collectionName, itemToAdd);
      this.newItem = { name: '', description: '', createdAt: '' };
      this.showAddForm = false;
      this.loadItems();
    } catch (error) {
      this.handleError('Error adding item. Please try again.');
    }
  }

  async deleteItem(id: string) {
    try {
      await this.firebaseService.deleteDocument(this.collectionName, id);
      this.loadItems();
    } catch (error) {
      this.handleError('Error deleting item. Please try again.');
    }
  }
    private handleError(message: string) {
    this.errorMessage = message;
    console.error(message);
  }

  clearError() {
    this.errorMessage = '';
  }
}
