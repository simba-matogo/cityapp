import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

/**
 * User Data Interface - Defines the structure of user information
 * 
 * This interface represents the complete user profile stored in Firestore
 * and used throughout the application for user management and authorization.
 */
export interface UserData {
  uid: string;           // Unique Firebase Auth user ID
  email: string;         // User's email address
  role: string;          // User role: 'generaluser', 'departmentadmin', 'overalladmin'
  name?: string;         // User's first name (optional)
  surname?: string;      // User's last name (optional)
  department?: string;   // User's assigned department (optional)
  lastLogin?: Date;      // Timestamp of last login (optional)
}

/**
 * Authentication Service - Core Authentication Management
 * 
 * This service handles all authentication-related functionality for the
 * Harare City Complaints System, including:
 * 
 * - User login/logout with Firebase Auth
 * - User registration and profile creation
 * - Authentication state management
 * - User data synchronization with Firestore
 * - Role-based navigation
 * - Session persistence
 * - Loading state management
 * 
 * Features:
 * - Firebase Authentication integration
 * - Firestore user data storage
 * - Reactive state management with RxJS
 * - Automatic session restoration
 * - Role-based access control
 * - Minimum loading time for better UX
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Firebase app and auth instances
  private app = initializeApp(environment.firebase);
  public auth = getAuth(this.app);  // Made public for component access

  // Initialization flag to prevent multiple setups
  private initialized = false;

  // Authentication state management with reactive streams
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
    
    // Initialize authentication system if not already done
    if (!this.initialized) {
      // Enable Firebase Auth persistence for better user experience
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
   * 
   * This method sets up the core authentication state monitoring that:
   * - Listens for Firebase Auth state changes
   * - Synchronizes user data with Firestore
   * - Manages loading states
   * - Handles navigation based on user role
   * - Ensures minimum loading time for better UX
   */
  private initializeAuthStateListener(): void {
    // Set initial loading state
    this.isLoadingSubject.next(true);
    const startTime = Date.now();

    onAuthStateChanged(this.auth, async (user: User | null) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      
      try {
        if (user) {
          // User is authenticated - get their data from Firestore
          let userData = await this.getUserData(user.uid);
          
          if (userData) {
            // User exists in Firestore - update state and handle navigation
            this.currentUserSubject.next(userData);
            this.isAuthenticatedSubject.next(true);

            // Update last login time if more than 1 hour has passed
            const now = new Date();
            const lastLogin = userData.lastLogin ? new Date(userData.lastLogin) : null;
            if (!lastLogin || now.getTime() - lastLogin.getTime() > 3600000) { // Update if > 1 hour
              await this.updateLastLogin(user.uid);
            }
            
            // Navigate to appropriate dashboard if on login page
            const currentUrl = this.router.url;
            if (currentUrl === '/' || currentUrl === '/login') {
              this.navigateBasedOnRole(userData.role);
            }
          } else {
            // User exists in Firebase Auth but not in Firestore - create record
            console.warn('User exists in Auth but not in Firestore. Creating Firestore record...');
            
            // Create a new user record in Firestore with default role
            const newUserData: UserData = {
              uid: user.uid,
              email: user.email || 'unknown@email.com',
              role: 'generaluser', // Default role for existing auth users
              name: user.displayName || '',
              surname: '',
              department: ''
            };
            
            await this.saveUserData(newUserData);
            console.log('Created Firestore record for existing auth user');
            
            // Update state and navigate
            this.currentUserSubject.next(newUserData);
            this.isAuthenticatedSubject.next(true);
            this.navigateBasedOnRole(newUserData.role);
          }
        } else {
          // User is logged out - clear state and handle navigation
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          
          // Redirect to login if not already there and not loading
          if (!this.isLoadingSubject.value && this.router.url !== '/' && this.router.url !== '/login') {
            this.router.navigate(['/']);
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        // Handle errors by clearing state and redirecting to login
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        if (this.router.url !== '/' && this.router.url !== '/login') {
          this.router.navigate(['/']);
        }
      } finally {
        // Ensure minimum loading time of 3 seconds for better UX
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 3000; // 3 seconds
        
        if (elapsedTime < minLoadingTime) {
          setTimeout(() => {
            this.isLoadingSubject.next(false);
          }, minLoadingTime - elapsedTime);
        } else {
          this.isLoadingSubject.next(false);
        }
      }
    });
  }

  /**
   * Handle navigation for authenticated users
   * 
   * @param role - The user's role to determine navigation destination
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
   * 
   * Routes users to the appropriate dashboard based on their assigned role:
   * - generaluser -> /user-dashboard
   * - departmentadmin -> /department-dashboard  
   * - overalladmin -> /admin-dashboard
   * 
   * @param role - The user's role from Firestore
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

  /**
   * Authenticate user with email and password
   * 
   * Handles user login with Firebase Auth and ensures minimum loading time
   * for better user experience. The auth state listener handles navigation.
   * 
   * @param email - User's email address
   * @param password - User's password
   * @throws FirebaseError - If authentication fails
   */
  async login(email: string, password: string): Promise<void> {
    try {
      this.isLoadingSubject.next(true);
      const startTime = Date.now();
      
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Ensure minimum loading time of 3 seconds for better UX
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 3000; // 3 seconds
      
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
      // The auth state listener will handle navigation
    } catch (error) {
      this.isLoadingSubject.next(false);
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Register new user with email and password
   * 
   * Creates a new user account in Firebase Auth and Firestore with the
   * specified role and profile information.
   * 
   * @param email - User's email address
   * @param password - User's password
   * @param role - User's role in the system
   * @param name - User's first name (optional)
   * @param surname - User's last name (optional)
   * @param department - User's department (optional)
   * @throws FirebaseError - If registration fails
   */
  async signUp(email: string, password: string, role: string, name?: string, surname?: string, department?: string): Promise<void> {
    try {
      this.isLoadingSubject.next(true);
      const startTime = Date.now();
      
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
      
      // Ensure minimum loading time of 3 seconds for better UX
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 3000; // 3 seconds
      
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
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

  /**
   * Create user account without auto-login
   * 
   * Creates a new user account in Firebase Auth and Firestore but does not
   * automatically log the user in. This is used for the new signup flow.
   * 
   * @param email - User's email address
   * @param password - User's password
   * @param role - User's role in the system
   * @param name - User's first name (optional)
   * @param surname - User's last name (optional)
   * @param department - User's department (optional)
   * @throws FirebaseError - If registration fails
   */
  async createUserAccount(email: string, password: string, role: string, name?: string, surname?: string, department?: string): Promise<void> {
    try {
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
      
      // Sign out immediately to prevent auto-login
      await signOut(this.auth);
      
      console.log(`User account created successfully for ${email} with role ${role}`);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('The email address is already in use. Please use a different email.');
      }
      console.error('Account creation failed:', firebaseError);
      throw firebaseError;
    }
  }

  /**
   * Sign out the current user
   * 
   * Logs out the user from Firebase Auth. The auth state listener
   * will handle clearing the local state and navigation.
   * 
   * @throws FirebaseError - If logout fails
   */
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
   * 
   * Retrieves the complete user profile from Firestore, including
   * role, name, department, and other profile information.
   * 
   * @param uid - Firebase Auth user ID
   * @returns Promise<UserData | null> - User data or null if not found/deleted
   */
  private async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userDoc: any = await this.firebaseService.getDocument('users', uid);
      if (userDoc) {
        // Check if user is marked as deleted
        if (userDoc.status === 'deleted') {
          console.log(`User ${uid} is marked as deleted`);
          return null;
        }
        
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
   * 
   * Creates or updates a user record in Firestore with complete
   * profile information and metadata.
   * 
   * @param userData - Complete user data to save
   * @throws Error - If save operation fails
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
   * 
   * Updates the lastLogin and lastActive timestamps for the user
   * to track their activity and session information.
   * 
   * @param uid - Firebase Auth user ID
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
   * Check if user is currently authenticated
   * 
   * @returns boolean - True if user is authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user data
   * 
   * @returns UserData | null - Current user's complete profile or null if not authenticated
   */
  getCurrentUserData(): UserData | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current user's display name
   * 
   * Returns a formatted display name based on available user data:
   * 1. Full name (name + surname) if both are available
   * 2. First name only if surname is missing
   * 3. Email username as fallback
   * 4. 'User' as final fallback
   * 
   * @returns string - User's display name
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
   * 
   * Updates the role of a specific user in Firestore. This is primarily
   * used for administrative purposes and fixing data inconsistencies.
   * 
   * @param uid - Firebase Auth user ID
   * @param newRole - New role to assign to the user
   * @throws Error - If update operation fails
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
   * Mark user as deleted (soft delete)
   * 
   * Performs a soft delete by marking the user's status as 'deleted'
   * instead of removing the record entirely. This preserves data integrity
   * and allows for potential recovery.
   * 
   * @param uid - Firebase Auth user ID
   * @throws Error - If update operation fails
   */
  async markUserAsDeleted(uid: string): Promise<void> {
    try {
      const db = this.firebaseService.getDb();
      await setDoc(doc(db, 'users', uid), {
        status: 'deleted',
        deletedAt: new Date()
      }, { merge: true });
      
      console.log(`Marked user ${uid} as deleted`);
    } catch (error) {
      console.error('Error marking user as deleted:', error);
      throw error;
    }
  }

  /**
   * Fix admin user roles (utility method)
   * 
   * This method is used to fix role mismatches in the database.
   * It updates all users with 'admin' role to 'overalladmin' for consistency.
   * 
   * @throws Error - If update operation fails
   */
  async fixAdminUserRoles(): Promise<void> {
    try {
      // This would typically involve a batch update operation
      // For now, it's a placeholder for future implementation
      console.log('Admin user roles fix method called');
    } catch (error) {
      console.error('Error fixing admin user roles:', error);
      throw error;
    }
  }

  /**
   * Completely delete a user from Firestore users collection
   * @param uid - Firebase Auth user ID
   */
  async deleteUserCompletely(uid: string): Promise<void> {
    try {
      const db = this.firebaseService.getDb();
      await deleteDoc(doc(db, 'users', uid));
      console.log(`Deleted user document from Firestore for uid: ${uid}`);
    } catch (error) {
      console.error('Error deleting user document:', error);
      throw error;
    }
  }

  /**
   * Get Firebase Auth instance
   * 
   * @returns Auth - Firebase Auth instance for direct access
   */
  public getAuth() {
    return this.auth;
  }

  /**
   * Get current Firebase User
   * 
   * @returns User | null - Current Firebase User object or null if not authenticated
   */
  public getCurrentUser() {
    return this.auth.currentUser;
  }
}
