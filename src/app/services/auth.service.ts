import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

export interface UserData {
  uid: string;
  email: string;
  role: string;
  name?: string;
  surname?: string;
  department?: string;
  lastLogin?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app = initializeApp(environment.firebase);
  public auth = getAuth(this.app);  // Made public for component access

  private initialized = false;

  // Authentication state management
  private currentUserSubject = new BehaviorSubject<UserData | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private router: Router, private firebaseService: FirebaseService) {
    // Expose auth service to window for debugging (development only)
    if (typeof window !== 'undefined') {
      (window as any).authService = this;
    }
    
    if (!this.initialized) {
      // Enable Firebase Auth persistence
      setPersistence(this.auth, browserLocalPersistence).then(() => {
        console.log('Firebase Auth persistence enabled');
        this.initializeAuthStateListener();
        this.initialized = true;
      }).catch((error) => {
        console.error('Error enabling persistence:', error);
        // Still initialize auth listener even if persistence fails
        this.initializeAuthStateListener();
        this.initialized = true;
      });
    }
  }

  /**
   * Initialize Firebase auth state listener for persistence
   */
  private initializeAuthStateListener(): void {
    // Set initial loading state
    this.isLoadingSubject.next(true);

    onAuthStateChanged(this.auth, async (user: User | null) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      
      try {
        if (user) {
          // Get user data from Firestore
          let userData = await this.getUserData(user.uid);
          
          if (userData) {
            // Update user data and auth state
            this.currentUserSubject.next(userData);
            this.isAuthenticatedSubject.next(true);

            // Check if we need to update last login time
            const now = new Date();
            const lastLogin = userData.lastLogin ? new Date(userData.lastLogin) : null;
            if (!lastLogin || now.getTime() - lastLogin.getTime() > 3600000) { // Update if > 1 hour
              await this.updateLastLogin(user.uid);
            }
            
            // Handle navigation only if we're on the login page
            const currentUrl = this.router.url;
            if (currentUrl === '/' || currentUrl === '/login') {
              this.navigateBasedOnRole(userData.role);
            }
          } else {
            // User exists in Firebase Auth but not in Firestore
            console.warn('User exists in Auth but not in Firestore. Creating Firestore record...');
            
            // Create a new user record in Firestore with default role
            const newUserData: UserData = {
              uid: user.uid,
              email: user.email || 'unknown@email.com',
              role: 'generaluser', // Default role
              name: user.displayName || '',
              surname: '',
              department: ''
            };
            
            await this.saveUserData(newUserData);
            console.log('Created Firestore record for existing auth user');
            
            // Now set the user data and auth state
            this.currentUserSubject.next(newUserData);
            this.isAuthenticatedSubject.next(true);
            
            // Navigate to appropriate dashboard
            this.navigateBasedOnRole(newUserData.role);
          }
        } else {
          // User is logged out
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          
          // Only redirect to login if not already on login page and not loading
          if (!this.isLoadingSubject.value && this.router.url !== '/' && this.router.url !== '/login') {
            this.router.navigate(['/']);
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        if (this.router.url !== '/' && this.router.url !== '/login') {
          this.router.navigate(['/']);
        }
      } finally {
        // Always update loading state
        this.isLoadingSubject.next(false);
      }
    });
  }

  /**
   * Handle navigation for authenticated users
   */
  private handleAuthenticatedNavigation(role: string): void {
    const currentUrl = this.router.url;
    
    // If user is on login page and authenticated, redirect to dashboard
    if (currentUrl === '/' || currentUrl === '/login') {
      this.navigateBasedOnRole(role);
    }
    // If user is on a protected route, let them stay there
    // The route guards will handle unauthorized access
  }

  /**
   * Navigate user based on their role
   */
  private navigateBasedOnRole(role: string): void {
    switch (role.toLowerCase()) {
      case 'generaluser':
        this.router.navigate(['/user-dashboard']);
        break;
      case 'departmentadmin':
        this.router.navigate(['/department-dashboard']);
        break;
      case 'overalladmin':
        this.router.navigate(['/admin-dashboard']);
        break;
      default:
        this.router.navigate(['/user-dashboard']);
    }
  }

  // Login method
  async login(email: string, password: string): Promise<void> {
    try {
      this.isLoadingSubject.next(true);
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      // The auth state listener will handle navigation
    } catch (error) {
      this.isLoadingSubject.next(false);
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Sign-up method
  async signUp(email: string, password: string, role: string, name?: string, surname?: string, department?: string): Promise<void> {
    try {
      this.isLoadingSubject.next(true);
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      const userData: UserData = {
        uid: user.uid,
        email: user.email || email,
        role: role.toLowerCase(),
        name: name || '',
        surname: surname || '',
        department: department || ''
      };

      await this.saveUserData(userData);
      
      // Set user data and auth state manually to bypass the auth state change delay
      this.currentUserSubject.next(userData);
      this.isAuthenticatedSubject.next(true);
      
      // Navigate based on role immediately after signup
      this.navigateBasedOnRole(role);
      
      console.log(`User signed up and navigated to dashboard as ${role}`);
    } catch (error) {
      this.isLoadingSubject.next(false);
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('The email address is already in use. Please use a different email.');
      }
      console.error('Sign-up failed:', firebaseError);
      throw firebaseError;
    }
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      // The auth state listener will handle navigation
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Get user data from Firestore
   */
  private async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userDoc: any = await this.firebaseService.getDocument('users', uid);
      if (userDoc) {
        return {
          uid: userDoc.id,
          email: userDoc.email,
          role: userDoc.role,
          name: userDoc.name || '',
          surname: userDoc.surname || '',
          department: userDoc.department || ''
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  /**
   * Save user data to Firestore
   */
  private async saveUserData(userData: UserData): Promise<void> {
    try {
      const db = this.firebaseService.getDb();
      await setDoc(doc(db, 'users', userData.uid), {
        email: userData.email,
        role: userData.role,
        name: userData.name || '',
        surname: userData.surname || '',
        department: userData.department || '',
        createdAt: new Date(),
        lastLogin: new Date(),
        status: 'active',
        notifications: {
          email: true,
          app: true
        },
        profileComplete: false
      });
      console.log(`User data saved successfully for uid: ${userData.uid}`);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  /**
   * Update user's last login time in Firestore
   */
  private async updateLastLogin(uid: string): Promise<void> {
    try {
      const db = this.firebaseService.getDb();
      
      // Use merge: true to avoid overwriting other fields
      await setDoc(doc(db, 'users', uid), {
        lastLogin: new Date(),
        lastActive: new Date()
      }, { merge: true });
      
      console.log(`Updated last login time for user: ${uid}`);
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user data
   */
  getCurrentUserData(): UserData | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current user's name
   */
  getUserName(): string {
    const userData = this.getCurrentUserData();
    if (userData?.name && userData?.surname) {
      return `${userData.name} ${userData.surname}`;
    } else if (userData?.name) {
      return userData.name;
    } else if (userData?.email) {
      return userData.email.split('@')[0]; // Use email username as fallback
    }
    return 'User';
  }

  // Mocked method to get user role (deprecated - use getUserData instead)
  private async getUserRole(uid: string): Promise<string> {
    const userData = await this.getUserData(uid);
    return userData?.role || 'generaluser';
  }

  // Mocked method to save user role (deprecated - use saveUserData instead)
  private async saveUserRole(uid: string, role: string): Promise<void> {
    console.log(`Saved role ${role} for user ${uid}`);
  }

  /**
   * Update user role in Firestore (utility method for fixing role mismatches)
   */
  async updateUserRole(uid: string, newRole: string): Promise<void> {
    try {
      const db = this.firebaseService.getDb();
      await setDoc(doc(db, 'users', uid), {
        role: newRole.toLowerCase(),
        updatedAt: new Date()
      }, { merge: true });
      
      console.log(`Updated role for user ${uid} to ${newRole}`);
      
      // Update current user data if this is the current user
      const currentUser = this.getCurrentUserData();
      if (currentUser && currentUser.uid === uid) {
        this.currentUserSubject.next({
          ...currentUser,
          role: newRole.toLowerCase()
        });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Fix admin users with incorrect role values (utility method)
   */
  async fixAdminUserRoles(): Promise<void> {
    try {
      // This method can be called from browser console to fix existing users
      const db = this.firebaseService.getDb();
      const usersCollection = await this.firebaseService.getCollection('users');
      
      for (const user of usersCollection) {
        const userData = user as any; // Type assertion for flexibility
        if (userData.role === 'admin') {
          await this.updateUserRole(userData.id, 'departmentadmin');
          console.log(`Fixed role for user ${userData.email}: admin -> departmentadmin`);
        }
      }
      
      console.log('Finished fixing admin user roles');
    } catch (error) {
      console.error('Error fixing admin user roles:', error);
      throw error;
    }
  }

  // Public getter to access the auth instance
  public getAuth() {
    return this.auth;
  }

  // Public getter to access current user
  public getCurrentUser() {
    return this.auth.currentUser;
  }
}
