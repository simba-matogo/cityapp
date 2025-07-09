import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot,
  disableNetwork,
  enableNetwork,
  connectFirestoreEmulator,
  Firestore,
  arrayUnion,
  orderBy,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  CollectionReference,
  DocumentReference,
  Query,
  QuerySnapshot,
  writeBatch,
  runTransaction,
  Transaction,
  serverTimestamp,
  Timestamp,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache
} from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { retryWithBackoff, timeoutPromise } from '../utils/retry-with-backoff';

/**
 * Firebase Service - Core Database Operations
 * 
 * This service provides a centralized interface for all Firestore database operations
 * in the Harare City Complaints System. It handles:
 * 
 * - Document CRUD operations (Create, Read, Update, Delete)
 * - Collection queries with filtering and sorting
 * - Real-time data synchronization
 * - Batch operations for data consistency
 * - Transaction support for complex operations
 * - Error handling and logging
 * 
 * Features:
 * - Type-safe Firestore operations
 * - Real-time listeners with automatic cleanup
 * - Batch operations for performance
 * - Comprehensive error handling
 * - Query optimization and caching
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  private db!: Firestore;
  
  // Connection state observable
  private _isConnected = new BehaviorSubject<boolean>(true);
  public isConnected$ = this._isConnected.asObservable();

  constructor() {
    console.log('Firebase initialized successfully');
    this.initializeFirestore();
  }

  // Initialize Firestore with cache configuration
  private initializeFirestore() {
    try {
      // For development, use memory cache to avoid multi-tab conflicts
      if (!environment.production) {
        this.db = initializeFirestore(this.app, {
          localCache: undefined // Use memory cache in development
        });
        console.log('Firestore initialized with memory cache (development mode)');
      } else {
        // In production, use persistent cache
        this.db = initializeFirestore(this.app, {
          localCache: persistentLocalCache({
            cacheSizeBytes: CACHE_SIZE_UNLIMITED
          })
        });
        console.log('Firestore initialized with persistent local cache (production mode)');
      }

      // If you want to use emulators, uncomment this and add useEmulators: true to environment.ts
      // if (!environment.production && (environment as any).useEmulators) {
      //   connectFirestoreEmulator(this.db, 'localhost', 8080);
      // }
    } catch (error) {
      console.error('Error initializing Firestore:', error);
      // Fallback to default Firestore initialization
      this.db = getFirestore(this.app);
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

  /**
   * Get Firestore database instance
   * 
   * @returns Firestore - The Firestore database instance
   */
  getDb() {
    return this.db;
  }

  /**
   * Get a single document from Firestore
   * 
   * Retrieves a document by its ID from the specified collection.
   * Returns null if the document doesn't exist or has been deleted.
   * 
   * @param collectionName - Name of the Firestore collection
   * @param docId - Document ID to retrieve
   * @returns Promise<any> - Document data or null if not found
   * @throws Error - If the operation fails
   */
  async getDocument(collectionName: string, docId: string): Promise<any> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log(`Document ${docId} not found in collection ${collectionName}`);
        return null;
      }
    } catch (error) {
      console.error(`Error getting document ${docId} from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get all documents from a collection
   * 
   * Retrieves all documents from the specified collection with optional
   * filtering, sorting, and limiting capabilities.
   * 
   * @param collectionName - Name of the Firestore collection
   * @param filters - Optional array of filter conditions
   * @param sortBy - Optional field to sort by
   * @param sortOrder - Optional sort order ('asc' or 'desc')
   * @param limitCount - Optional limit on number of documents
   * @returns Promise<any[]> - Array of document data
   * @throws Error - If the operation fails
   */
  async getCollection(
    collectionName: string, 
    filters?: Array<{ field: string; operator: any; value: any }>,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'desc',
    limitCount?: number
  ): Promise<any[]> {
    try {
      let q: Query = collection(this.db, collectionName);
      
      // Apply filters if provided
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }
      
      // Apply sorting if specified
      if (sortBy) {
        q = query(q, orderBy(sortBy, sortOrder));
      }
      
      // Apply limit if specified
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      const documents: any[] = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      console.error(`Error getting collection ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Add a new document to a collection
   * 
   * Creates a new document in the specified collection with the provided data.
   * Firestore will automatically generate a unique document ID.
   * 
   * @param collectionName - Name of the Firestore collection
   * @param data - Document data to add
   * @returns Promise<string> - The generated document ID
   * @throws Error - If the operation fails
   */
  async addDocument(collectionName: string, data: any): Promise<string> {
    try {
      // Add server timestamp for creation tracking
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(this.db, collectionName), docData);
      console.log(`Document added to ${collectionName} with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing document
   * 
   * Updates a document in the specified collection with new data.
   * Only the provided fields will be updated, existing fields remain unchanged.
   * 
   * @param collectionName - Name of the Firestore collection
   * @param docId - Document ID to update
   * @param data - New data to update
   * @returns Promise<void>
   * @throws Error - If the operation fails
   */
  async updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      
      // Add server timestamp for update tracking
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      console.log(`Document ${docId} updated in ${collectionName}`);
    } catch (error) {
      console.error(`Error updating document ${docId} in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document from a collection
   * 
   * Permanently removes a document from the specified collection.
   * This operation cannot be undone.
   * 
   * @param collectionName - Name of the Firestore collection
   * @param docId - Document ID to delete
   * @returns Promise<void>
   * @throws Error - If the operation fails
   */
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await deleteDoc(docRef);
      console.log(`Document ${docId} deleted from ${collectionName}`);
    } catch (error) {
      console.error(`Error deleting document ${docId} from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Set a document with a specific ID
   * 
   * Creates or overwrites a document with the specified ID in the collection.
   * If the document exists, it will be completely replaced with the new data.
   * 
   * @param collectionName - Name of the Firestore collection
   * @param docId - Document ID to set
   * @param data - Document data
   * @returns Promise<void>
   * @throws Error - If the operation fails
   */
  async setDocument(collectionName: string, docId: string, data: any): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      
      // Add server timestamp for tracking
      const docData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, docData);
      console.log(`Document ${docId} set in ${collectionName}`);
    } catch (error) {
      console.error(`Error setting document ${docId} in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Create a real-time listener for a document
   * 
   * Sets up a real-time listener that automatically updates when the document changes.
   * Returns an unsubscribe function that should be called to clean up the listener.
   * 
   * @param collectionName - Name of the Firestore collection
   * @param docId - Document ID to listen to
   * @param callback - Function called when document changes
   * @returns Function - Unsubscribe function to stop listening
   */
  onDocumentSnapshot(
    collectionName: string, 
    docId: string, 
    callback: (data: any) => void
  ): () => void {
    const docRef = doc(this.db, collectionName, docId);
    
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error(`Error listening to document ${docId} in ${collectionName}:`, error);
    });
    
    return unsubscribe;
  }

  /**
   * Create a real-time listener for a collection
   * 
   * Sets up a real-time listener that automatically updates when the collection changes.
   * Returns an unsubscribe function that should be called to clean up the listener.
   * 
   * @param collectionName - Name of the Firestore collection
   * @param callback - Function called when collection changes
   * @param filters - Optional array of filter conditions
   * @param sortBy - Optional field to sort by
   * @param sortOrder - Optional sort order ('asc' or 'desc')
   * @returns Function - Unsubscribe function to stop listening
   */
  onCollectionSnapshot(
    collectionName: string,
    callback: (data: any[]) => void,
    filters?: Array<{ field: string; operator: any; value: any }>,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'desc'
  ): () => void {
    let q: Query = collection(this.db, collectionName);
    
    // Apply filters if provided
    if (filters && filters.length > 0) {
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
    }
    
    // Apply sorting if specified
    if (sortBy) {
      q = query(q, orderBy(sortBy, sortOrder));
    }
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents: any[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      callback(documents);
    }, (error) => {
      console.error(`Error listening to collection ${collectionName}:`, error);
    });
    
    return unsubscribe;
  }

  /**
   * Execute a batch write operation
   * 
   * Performs multiple write operations (add, update, delete) as a single atomic unit.
   * If any operation fails, all operations are rolled back.
   * 
   * @param operations - Array of batch operations to perform
   * @returns Promise<void>
   * @throws Error - If any operation fails
   */
  async executeBatch(operations: Array<{
    type: 'add' | 'update' | 'delete';
    collection: string;
    docId?: string;
    data?: any;
  }>): Promise<void> {
    try {
      const batch = writeBatch(this.db);
      
      operations.forEach(operation => {
        if (operation.type === 'add') {
          const docRef = doc(collection(this.db, operation.collection));
          batch.set(docRef, {
            ...operation.data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } else if (operation.type === 'update' && operation.docId) {
          const docRef = doc(this.db, operation.collection, operation.docId);
          batch.update(docRef, {
            ...operation.data,
            updatedAt: serverTimestamp()
          });
        } else if (operation.type === 'delete' && operation.docId) {
          const docRef = doc(this.db, operation.collection, operation.docId);
          batch.delete(docRef);
        }
      });
      
      await batch.commit();
      console.log(`Batch operation completed with ${operations.length} operations`);
    } catch (error) {
      console.error('Error executing batch operation:', error);
      throw error;
    }
  }

  /**
   * Execute a transaction
   * 
   * Performs multiple read and write operations within a transaction.
   * All operations either succeed together or fail together.
   * 
   * @param updateFunction - Function that performs the transaction operations
   * @returns Promise<T> - Result of the transaction
   * @throws Error - If the transaction fails
   */
  async executeTransaction<T>(updateFunction: (transaction: Transaction) => Promise<T>): Promise<T> {
    try {
      return await runTransaction(this.db, updateFunction);
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw error;
    }
  }

  /**
   * Convert Firestore timestamp to JavaScript Date
   * 
   * Utility function to convert Firestore Timestamp objects to JavaScript Date objects.
   * Handles both Timestamp objects and regular Date objects.
   * 
   * @param timestamp - Firestore Timestamp or JavaScript Date
   * @returns Date - JavaScript Date object
   */
  convertTimestamp(timestamp: any): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    } else if (timestamp instanceof Date) {
      return timestamp;
    } else if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    } else {
      return new Date();
    }
  }

  /**
   * Convert JavaScript Date to Firestore timestamp
   * 
   * Utility function to convert JavaScript Date objects to Firestore Timestamp objects.
   * 
   * @param date - JavaScript Date object
   * @returns Timestamp - Firestore Timestamp object
   */
  convertToTimestamp(date: Date): Timestamp {
    return Timestamp.fromDate(date);
  }

  /**
   * Check if a document exists
   * 
   * Utility function to check if a document exists in a collection without retrieving its data.
   * 
   * @param collectionName - Name of the Firestore collection
   * @param docId - Document ID to check
   * @returns Promise<boolean> - True if document exists, false otherwise
   */
  async documentExists(collectionName: string, docId: string): Promise<boolean> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error(`Error checking if document ${docId} exists in ${collectionName}:`, error);
      return false;
    }
  }

  /**
   * Get document count in a collection
   * 
   * Utility function to get the total number of documents in a collection.
   * Note: This retrieves all documents, so use with caution on large collections.
   * 
   * @param collectionName - Name of the Firestore collection
   * @param filters - Optional array of filter conditions
   * @returns Promise<number> - Number of documents in the collection
   */
  async getDocumentCount(
    collectionName: string,
    filters?: Array<{ field: string; operator: any; value: any }>
  ): Promise<number> {
    try {
      const documents = await this.getCollection(collectionName, filters);
      return documents.length;
    } catch (error) {
      console.error(`Error getting document count for ${collectionName}:`, error);
      return 0;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this._isConnected.value;
  }

  // Listen to real-time updates on a query
  listenToQuery(q: any, callback: (snapshot: any) => void): () => void {
    try {
      return onSnapshot(q, callback, (error) => {
        console.error('Error in query listener:', error);
        this._isConnected.next(false);
      });
    } catch (error) {
      console.error('Error setting up query listener:', error);
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Get Firestore instance
  getFirestore(): Firestore {
    return this.db;
  }

  // Get arrayUnion function for use in services
  getArrayUnion(data: any) {
    return arrayUnion(data);
  }
}
