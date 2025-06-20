import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app'; // Import FirebaseError

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);

  constructor(private router: Router) {}

  // Login method
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Redirect based on role (mocked for now)
      const role = await this.getUserRole(user.uid); // Replace with actual role fetching logic
      if (role === 'generaluser') {
        this.router.navigate(['/user-dashboard']);
      } else if (role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/department-dashboard']);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Sign-up method
  async signUp(email: string, password: string, role: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Save user role (mocked for now)
      await this.saveUserRole(user.uid, role); // Replace with actual role saving logic

      // Redirect to login
      this.router.navigate(['/']);
    } catch (error) {
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
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  // Mocked method to get user role
  private async getUserRole(uid: string): Promise<string> {
    // Replace with actual logic to fetch user role from Firestore or another source
    return 'generaluser';
  }

  // Mocked method to save user role
  private async saveUserRole(uid: string, role: string): Promise<void> {
    // Replace with actual logic to save user role to Firestore or another source
    console.log(`Saved role ${role} for user ${uid}`);
  }
}
