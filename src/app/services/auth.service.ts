import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app'; // Import FirebaseError
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);
  private db = getFirestore(this.app); // Initialize Firestore

  constructor(private router: Router) {}

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
  async signUp(email: string, password: string, role: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Save user role to Firestore
      await this.saveUserRole(user.uid, role);

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
  // Get user role and department from Firestore
  private async getUserRoleAndDepartment(uid: string): Promise<{ role: string, department?: string }> {
    try {
      // Get the current user's email
      const user = this.auth.currentUser;
      
      if (!user) {
        return { role: 'generaluser' };
      }

      const email = user.email?.toLowerCase();
      
      // Check specific emails for admin roles
      // This is still a temporary solution that should be replaced with Firestore in production
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

      // Example mock logic for hardcoded UIDs - keeping for backward compatibility
      if (uid === 'waterAdminUid') {
        return { role: 'departmentadmin', department: 'water' };
      }
      if (uid === 'roadsAdminUid') {
        return { role: 'departmentadmin', department: 'roads' };
      }
      if (uid === 'wastemanagementAdminUid') {
        return { role: 'departmentadmin', department: 'wastemanagement' };
      }
      if (uid === 'overallAdminUid') {
        return { role: 'overalladmin' };
      }
      
      return { role: 'generaluser' };
    } catch (error) {
      console.error('Error determining user role:', error);
      return { role: 'generaluser' }; // Default fallback
    }
  }

  // Save user role to Firestore
  private async saveUserRole(uid: string, role: string, department?: string): Promise<void> {
    try {
      const userDocRef = doc(this.db, 'users', uid);
      await setDoc(userDocRef, { 
        role,
        department,
        createdAt: new Date().toISOString()
      });
      console.log(`Saved role ${role} for user ${uid}`);
    } catch (error) {
      console.error('Error saving user role:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  redirectToLogin(): void {
    this.router.navigate(['/']);
  }
}
