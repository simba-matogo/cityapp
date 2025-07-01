import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { collection, query, onSnapshot, getDocs, QueryDocumentSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private COLLECTION_NAME = 'users';
  private usersSubject = new BehaviorSubject<any[]>([]);
  public users$ = this.usersSubject.asObservable();
  private unsubscribe: (() => void) | null = null;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {
    this.startListeningToUsers();
  }

  /**
   * Start listening to user changes in the database
   */
  private startListeningToUsers(): void {
    try {
      const usersQuery = query(
        collection(this.firebaseService.firestore, this.COLLECTION_NAME)
      );
      
      this.unsubscribe = this.firebaseService.listenToQuery(usersQuery, (snapshot: QuerySnapshot<DocumentData>) => {
        const users = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        this.usersSubject.next(users);
      });
    } catch (error) {
      console.error('Error setting up users listener:', error);
    }
  }

  /**
   * Get all users (one-time fetch)
   */
  async getAllUsers(): Promise<any[]> {
    try {
      return await this.firebaseService.getCollection(this.COLLECTION_NAME);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  /**
   * Get users by role
   * @param role The role to filter by (e.g., 'generaluser', 'overalladmin', 'departmentadmin')
   */
  getUsersByRole(role: string): Observable<any[]> {
    return new Observable(observer => {
      this.users$.subscribe(users => {
        const filteredUsers = users.filter(user => user.role === role);
        observer.next(filteredUsers);
      });
    });
  }

  /**
   * Get total user count
   */
  getTotalUserCount(): Observable<number> {
    return new Observable(observer => {
      this.users$.subscribe(users => {
        observer.next(users.length);
      });
    });
  }

  /**
   * Stop listening to user changes
   */
  stopListening(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}
