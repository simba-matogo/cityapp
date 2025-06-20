import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { BehaviorSubject, Observable, fromEvent, merge, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);
  
  // User information
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // User profile data (name, role, etc.)
  private userProfileSubject = new BehaviorSubject<any | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();
  
  // Network connectivity status
  private onlineStatusSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public onlineStatus$ = this.onlineStatusSubject.asObservable();
  
  // Last login attempt state (for offline/retry scenarios)
  private lastLoginCredentials: { email: string, password: string } | null = null;

  constructor(private router: Router) {
    console.log('🔥 Firebase Auth initialized');
    
    // Set up auth state observer
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
      
      if (user) {
        this.fetchUserProfile(user.uid);
      } else {
        this.userProfileSubject.next(null);
      }
    });
    
    // Set up network connectivity listeners
    this.setupNetworkListeners();
  }
  
  // Set up event listeners for online/offline status
  private setupNetworkListeners(): void {
    merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe(isOnline => {
      console.log(`Network status changed. Online: ${isOnline}`);
      this.onlineStatusSubject.next(isOnline);
      
      // If we're coming back online and have pending login credentials, retry
      if (isOnline && this.lastLoginCredentials) {
        console.log('Network reconnected. Retrying previous login attempt...');
        const { email, password } = this.lastLoginCredentials;
        this.lastLoginCredentials = null; // Clear stored credentials
        this.login(email, password, true); // Pass retry flag to avoid re-storing credentials
      }
    });
  }
  
  // Fetch user profile data from database (mocked for now)
  private async fetchUserProfile(uid: string): Promise<void> {
    try {
      // In a real app, this would fetch from Firestore
      // For now we'll use mock data
      const role = await this.getUserRole(uid);
      const email = this.auth.currentUser?.email || '';
      
      const userData: any = {
        uid,
        email,
        displayName: this.auth.currentUser?.displayName || email.split('@')[0] || 'User',
        role,
        // Add other user data as needed
      };
      
      // Add department information for department admins
      if (role === 'departmentadmin' && email) {
        userData.department = this.getDepartmentFromEmail(email);
      }
      
      this.userProfileSubject.next(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      this.userProfileSubject.next(null);
    }
  }
  
  // Get current user data synchronously
  public getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
  
  // Get current user profile synchronously
  public getCurrentUserProfile(): any | null {
    return this.userProfileSubject.value;
  }
  // Network connectivity check
  private async checkNetworkConnectivity(): Promise<boolean> {
    // First check navigator.onLine as a quick test
    if (!navigator.onLine) {
      return false;
    }
    
    // Then do a more reliable check by trying to fetch a tiny resource
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        // Try Google's favicon first
        await fetch('https://www.google.com/favicon.ico', { 
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal,
          cache: 'no-store' // Prevent cached responses
        });
        clearTimeout(timeoutId);
        return true;
      } catch (fetchError) {
        // If Google fails, try Firebase
        try {
          const controller2 = new AbortController();
          const timeoutId2 = setTimeout(() => controller2.abort(), 5000);
          
          await fetch('https://firebase.google.com/favicon.ico', {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller2.signal,
            cache: 'no-store'
          });
          
          clearTimeout(timeoutId2);
          return true;
        } catch (secondFetchError) {
          console.warn('Both connectivity checks failed:', secondFetchError);
          return false;
        }
      }
    } catch (error) {
      console.warn('Network check error:', error);
      return navigator.onLine; // Fall back to navigator.onLine
    }
  }

  // Login method with offline support
  async login(email: string, password: string, isRetry = false): Promise<void> {
    // Check network connectivity first
    const isOnline = await this.checkNetworkConnectivity();
    
    if (!isOnline) {
      // Store credentials for retry when back online (only if not already a retry attempt)
      if (!isRetry) {
        this.lastLoginCredentials = { email, password };
        console.log('Login attempted while offline. Will retry when connection is restored.');
      }
      
      throw new Error('No internet connection. Please check your network and try again. Your login will be attempted automatically when you are back online.');
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Clear any stored credentials since login was successful
      this.lastLoginCredentials = null;

      // Redirect based on role
      const role = await this.getUserRole(user.uid);
      if (role === 'generaluser') {
        this.router.navigate(['/user-dashboard']);
      } else if (role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/department-dashboard']);
      }
    } catch (error) {
      const firebaseError = error as FirebaseError;
      
      // Handle specific Firebase auth errors with user-friendly messages
      if (firebaseError.code === 'auth/network-request-failed') {
        if (!isRetry) {
          this.lastLoginCredentials = { email, password };
        }
        throw new Error('Network error. Your login will be attempted automatically when you are back online.');
      } else if (firebaseError.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later or reset your password.');
      } else if (firebaseError.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled. Please contact support.');
      } else if (firebaseError.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again or reset your password.');
      } else if (firebaseError.code === 'auth/user-not-found') {
        throw new Error('User not found. Please check your email or sign up for a new account.');
      } else {
        console.error('Login failed:', firebaseError);
        throw new Error(`Authentication failed: ${firebaseError.message}`);
      }
    }
  }
  // Sign-up method with offline support
  async signUp(email: string, password: string, role: string): Promise<void> {
    // Check network connectivity first
    const isOnline = await this.checkNetworkConnectivity();
    
    if (!isOnline) {
      throw new Error('No internet connection. Please check your network and try again when you are back online.');
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Save user role
      await this.saveUserRole(user.uid, role);

      // Redirect to login
      this.router.navigate(['/']);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      
      // Handle specific Firebase auth errors with user-friendly messages
      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('The email address is already in use. Please use a different email.');
      } else if (firebaseError.code === 'auth/invalid-email') {
        throw new Error('The email address is invalid. Please enter a valid email.');
      } else if (firebaseError.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please choose a stronger password (at least 6 characters).');
      } else if (firebaseError.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        console.error('Sign-up failed:', firebaseError);
        throw new Error(`Sign-up failed: ${firebaseError.message}`);
      }
    }
  }
  // Logout method with offline support
  async logout(): Promise<void> {
    // Check network connectivity
    const isOnline = await this.checkNetworkConnectivity();
    
    if (!isOnline) {
      // For logout, we can still clear local state even offline
      console.warn('Offline logout: Clearing local state only');
      this.currentUserSubject.next(null);
      this.userProfileSubject.next(null);
      
      // Navigate to home page
      this.router.navigate(['/']);
      
      // Inform the user about partial logout
      throw new Error(
        'You are currently offline. Your account has been logged out locally, but the server logout will be completed when you are back online.'
      );
    }
    
    try {
      await signOut(this.auth);
      // Clear any stored credentials on logout
      this.lastLoginCredentials = null;
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout failed:', error);
      if ((error as FirebaseError).code === 'auth/network-request-failed') {
        this.currentUserSubject.next(null);
        this.userProfileSubject.next(null);
        this.router.navigate(['/']);
        throw new Error('Network error during logout. You have been logged out locally.');
      } else {
        throw error;
      }
    }
  }
  // Mocked method to get user role
  private async getUserRole(uid: string): Promise<string> {
    // Replace with actual logic to fetch user role from Firestore or another source
    // For now, we'll determine role based on email domain for demo purposes
    const email = this.auth.currentUser?.email || '';
    
    if (email.includes('admin')) {
      return 'admin';
    } else if (email.includes('department') || email.endsWith('@dept.cityapp.gov')) {
      return 'departmentadmin';
    } else {
      return 'generaluser';
    }
  }

  // Mocked method to save user role
  private async saveUserRole(uid: string, role: string): Promise<void> {
    // Replace with actual logic to save user role to Firestore or another source
    console.log(`Saved role ${role} for user ${uid}`);
    // In a real app, this would save to Firestore
    // const db = getFirestore(this.app);
    // await setDoc(doc(db, 'users', uid), { role });
  }
  
  // Extract department from email address
  public getDepartmentFromEmail(email: string): string {
    // Implementation of the missing method
    // This should extract the department from the user's email
    
    const emailParts = email.split('@')[0].toLowerCase();
    
    // Check for department indicators in the email
    if (emailParts.includes('water') || email.includes('water@')) {
      return 'water';
    } else if (emailParts.includes('road') || emailParts.includes('roads') || email.includes('road@')) {
      return 'roads';
    } else if (emailParts.includes('health') || email.includes('health@')) {
      return 'health';
    } else if (emailParts.includes('electric') || emailParts.includes('electricity') || email.includes('electric@')) {
      return 'electricity';
    } else if (emailParts.includes('waste') || emailParts.includes('garbage') || email.includes('waste@')) {
      return 'waste';
    } else if (emailParts.includes('housing') || email.includes('housing@')) {
      return 'housing';
    } else {
      // Default or unknown department
      return 'general';
    }
  }
  
  // Get current online status
  public isOnline(): boolean {
    return this.onlineStatusSubject.value;
  }
  
  // Method to check and handle expired tokens
  public async checkAndRefreshAuthState(): Promise<boolean> {
    if (!this.auth.currentUser) {
      return false;
    }
    
    try {
      // Force token refresh if it's getting old
      const token = await this.auth.currentUser.getIdToken(true);
      return !!token;
    } catch (error) {
      console.error('Failed to refresh authentication token:', error);
      return false;
    }
  }
}
