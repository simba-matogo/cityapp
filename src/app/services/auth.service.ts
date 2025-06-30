import { Injectable } from '@angular/core';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app'; // Import FirebaseError
import { getFirestore, doc, setDoc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore'; // Import Firestore
import { Observable } from 'rxjs';

// Singleton Firebase service
class FirebaseService {
  private static instance: FirebaseService;
  public app: any;
  public auth: any;
  public db: any;

  private constructor() {
    // Initialize Firebase only if not already initialized
    if (getApps().length === 0) {
      this.app = initializeApp(environment.firebase);
    } else {
      this.app = getApp();
    }
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseService: FirebaseService;

  constructor(private router: Router) {
    this.firebaseService = FirebaseService.getInstance();
  }

  get auth() {
    return this.firebaseService.auth;
  }

  get db() {
    return this.firebaseService.db;
  }

  // Login method
  async login(email: string, password: string): Promise<{ uid: string, role: string, department?: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      const { role, department } = await this.getUserRoleAndDepartment(user.uid); // Fetch both role and department
      return { uid: user.uid, role, department };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Sign-up method
  async signUp(email: string, password: string, role: string, department?: string, name?: string, surname?: string): Promise<void> {
    console.log('AuthService: Starting sign-up process...');
    try {
      console.log('AuthService: Creating user with Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      console.log('AuthService: User created successfully, UID:', user.uid);

      // Use provided department or determine from email if not provided
      let userDepartment: string | undefined = department;
      if (!userDepartment && role === 'departmentadmin') {
        userDepartment = this.getDepartmentFromEmail(email);
      }
      console.log('AuthService: Department determined:', userDepartment);

      // Save user role to Firestore
      console.log('AuthService: Saving user role to Firestore...');
      await this.saveUserRole(user.uid, role, userDepartment, email, name, surname);
      console.log('AuthService: User role saved successfully');

      // Don't navigate here - let the component handle navigation
      console.log('AuthService: Sign-up process completed successfully');
    } catch (error) {
        console.error('AuthService: Sign-up failed with error:', error);
        const firebaseError = error as FirebaseError;
        if (firebaseError.code === 'auth/email-already-in-use') {
          throw new Error('The email address is already in use. Please use a different email.');
        }
        console.error('Sign-up failed:', firebaseError);
        throw firebaseError;
    }
  }

  // Helper method to determine department from email
  private getDepartmentFromEmail(email: string): string {
    const emailLower = email.toLowerCase();
    if (emailLower.includes('water')) return 'water';
    if (emailLower.includes('road')) return 'roads';
    if (emailLower.includes('waste')) return 'wastemanagement';
    return 'general';
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
  // Get user role and department from Firestore
  private async getUserRoleAndDepartment(uid: string): Promise<{ role: string, department?: string }> {
    try {
      // Try to get user data from Firestore first
      const userDocRef = doc(this.db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data from Firestore:', userData);
        return {
          role: userData['role'] || 'generaluser',
          department: userData['department']
        };
      }
      
      // Fallback to email-based logic for backward compatibility
      const user = this.auth.currentUser;
      if (!user) {
        return { role: 'generaluser' };
      }

      const email = user.email?.toLowerCase();
      
      // Check specific emails for admin roles (fallback)
      if (email === 'simbarashe@admin.com' || email === 'overalladmin@city.com') {
        return { role: 'overalladmin' };
      }
      
      if (email?.includes('water') || email === 'water@admin.com') {
        return { role: 'departmentadmin', department: 'water' };
      }
      
      if (email?.includes('roads') || email === 'roads@admin.com') {
        return { role: 'departmentadmin', department: 'roads' };
      }
      
      if (email?.includes('waste') || email === 'wastemanagement@admin.com') {
        return { role: 'departmentadmin', department: 'wastemanagement' };
      }
      
      return { role: 'generaluser' };
    } catch (error) {
      console.error('Error determining user role:', error);
      return { role: 'generaluser' }; // Default fallback
    }
  }

  // Save user role to Firestore
  private async saveUserRole(uid: string, role: string, department?: string, email?: string, name?: string, surname?: string): Promise<void> {
    try {
      const userDocRef = doc(this.db, 'users', uid);
      const userData: any = {
        uid,
        role,
        createdAt: new Date().toISOString()
      };
      if (department) userData.department = department;
      if (email) userData.email = email;
      if (name) userData.name = name;
      if (surname) userData.surname = surname;
      await setDoc(userDocRef, userData);
      console.log(`Saved role ${role} for user ${uid}${department ? ` with department ${department}` : ''}`);
    } catch (error) {
      console.error('Error saving user role:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  getUserName(): string {
    const currentUser = this.auth.currentUser;
    if (currentUser && currentUser.email) {
      // Extract name from email (everything before @)
      const emailName = currentUser.email.split('@')[0];
      // Capitalize first letter and replace dots/underscores with spaces
      return emailName
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
    }
    return 'User';
  }

  redirectToLogin(): void {
    this.router.navigate(['/']);
  }

  // Real-time general users fetch
  getGeneralUsersRealtime(): Observable<any[]> {
    return new Observable(observer => {
      const q = query(collection(this.db, 'users'), where('role', '==', 'generaluser'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const users: any[] = [];
        querySnapshot.forEach(doc => {
          users.push({ id: doc.id, ...doc.data() });
        });
        observer.next(users);
      }, error => observer.error(error));
      return { unsubscribe };
    });
  }
}
