import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  department?: string;
  createdAt?: any;
  approved?: boolean; // Added approval field
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();
  
  private totalUserCountSubject = new BehaviorSubject<number>(0);
  public totalUserCount$ = this.totalUserCountSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {
    this.setupRealtimeUserListener();
  }

  /**
   * Set up real-time listener for users collection
   */
  private setupRealtimeUserListener(): void {
    try {
      const db = this.firebaseService.getDb();
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc')
      );

      onSnapshot(usersQuery, (snapshot) => {
        const users: User[] = [];
        snapshot.forEach((doc) => {
          const userData = doc.data() as any;
          // Only include active users (not deleted)
          if (userData.status !== 'deleted') {
            users.push({
              id: doc.id,
              ...userData
            } as User);
          }
        });
        
        this.usersSubject.next(users);
        this.totalUserCountSubject.next(users.length);
      }, (error) => {
        console.error('Error listening to users:', error);
        // Fallback to empty array if error occurs
        this.usersSubject.next([]);
        this.totalUserCountSubject.next(0);
      });
    } catch (error) {
      console.error('Error setting up user listener:', error);
    }
  }

  /**
   * Get all users
   */
  getUsers(): Observable<User[]> {
    return this.users$;
  }

  /**
   * Get total user count
   */
  getTotalUserCount(): Observable<number> {
    return this.totalUserCount$;
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: string): Observable<User[]> {
    return new Observable(observer => {
      this.users$.subscribe(users => {
        const filteredUsers = users.filter(user => user.role === role);
        observer.next(filteredUsers);
      });
    });
  }

  /**
   * Add a new user
   */
  async addUser(userData: Omit<User, 'id'>): Promise<void> {
    try {
      await this.firebaseService.addDocument('users', {
        ...userData,
        approved: userData.role === 'generaluser' ? true : false, // Default approval logic
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  /**
   * Update a user
   */
  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      await this.firebaseService.updateDocument('users', userId, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await this.firebaseService.deleteDocument('users', userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
