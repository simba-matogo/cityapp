import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  enableIndexedDbPersistence,
  disableNetwork,
  enableNetwork,
  connectFirestoreEmulator
} from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { retryWithBackoff, timeoutPromise } from '../utils/retry-with-backoff';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);
  
  // Connection state observable
  private _isConnected = new BehaviorSubject<boolean>(true);
  public isConnected$ = this._isConnected.asObservable();

  constructor() {
    console.log('Firebase initialized successfully');
    this.setupOfflinePersistence();
  }

  // Enable offline persistence
  private async setupOfflinePersistence() {
    try {
      // Enable offline persistence
      await enableIndexedDbPersistence(this.db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support all of the features required to enable persistence');
        }
      });

      // If you want to use emulators, uncomment this and add useEmulators: true to environment.ts
      // if (!environment.production && (environment as any).useEmulators) {
      //   connectFirestoreEmulator(this.db, 'localhost', 8080);
      // }
    } catch (error) {
      console.error('Error setting up offline persistence:', error);
    }
  }

  // Network control methods
  async goOffline() {
    try {
      await disableNetwork(this.db);
      this._isConnected.next(false);
      console.log('Firebase network connectivity disabled');
    } catch (error) {
      console.error('Error disabling network:', error);
    }
  }

  async goOnline() {
    try {
      await enableNetwork(this.db);
      this._isConnected.next(true);
      console.log('Firebase network connectivity enabled');
    } catch (error) {
      console.error('Error enabling network:', error);
    }
  }

  // Get all documents from a collection with retry and timeout
  async getCollection(collectionName: string) {
    try {
      return await retryWithBackoff(async () => {
        const collectionRef = collection(this.db, collectionName);
        const snapshotPromise = getDocs(collectionRef);
        
        // Apply timeout if specified in environment
        const snapshot = await timeoutPromise(
          snapshotPromise, 
          environment.firestoreTimeout || 15000,
          'Firestore operation timed out'
        );
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }, 3);
    } catch (error) {
      console.error(`Error getting collection ${collectionName}:`, error);
      
      // If we're in offline mode and have cached data, it will still work
      // If completely disconnected with no cache, return empty array
      return [];
    }
  }

  // Add a document to a collection with retry
  async addDocument(collectionName: string, data: any) {
    try {
      return await retryWithBackoff(async () => {
        const collectionRef = collection(this.db, collectionName);
        const docRef = await timeoutPromise(
          addDoc(collectionRef, data),
          environment.firestoreTimeout || 15000,
          'Adding document timed out'
        );
        return docRef.id;
      }, 2);
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  }

  // Update a document with retry
  async updateDocument(collectionName: string, id: string, data: any) {
    try {
      return await retryWithBackoff(async () => {
        const docRef = doc(this.db, collectionName, id);
        await timeoutPromise(
          updateDoc(docRef, data),
          environment.firestoreTimeout || 15000,
          'Updating document timed out'
        );
        return true;
      }, 2);
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document with retry
  async deleteDocument(collectionName: string, id: string) {
    try {
      return await retryWithBackoff(async () => {
        const docRef = doc(this.db, collectionName, id);
        await timeoutPromise(
          deleteDoc(docRef),
          environment.firestoreTimeout || 15000,
          'Deleting document timed out'
        );
        return true;
      }, 2);
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  }

  // Query documents with retry and timeout
  async queryDocuments(collectionName: string, field: string, operator: any, value: any) {
    try {
      return await retryWithBackoff(async () => {
        const collectionRef = collection(this.db, collectionName);
        const q = query(collectionRef, where(field, operator, value));
        
        const snapshot = await timeoutPromise(
          getDocs(q),
          environment.firestoreTimeout || 15000,
          'Query operation timed out'
        );
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }, 3);
    } catch (error) {
      console.error(`Error querying documents in ${collectionName}:`, error);
      return [];
    }
  }

  // Get Firestore reference (for advanced operations)
  getDb() {
    return this.db;
  }

  // Get connection status
  getConnectionStatus() {
    return this._isConnected.value;
  }
}
