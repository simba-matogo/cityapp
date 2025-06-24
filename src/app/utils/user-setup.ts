import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

/**
 * Utility function to set up a user with a specific role and department
 * Call this function after a user has successfully registered or authenticated
 * Example usage:
 * 
 * // For overall admin
 * setupUserRole('YLRbkXGDtFg3wF0oxyjz4SNwOOH3', 'overalladmin');
 * 
 * // For department admin
 * setupUserRole('exampleUid', 'departmentadmin', 'water');
 */
export async function setupUserRole(uid: string, role: 'generaluser' | 'departmentadmin' | 'overalladmin', department?: string): Promise<void> {
  try {
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app);
    
    const userData: any = {
      role,
      updatedAt: new Date().toISOString()
    };
    
    if (department) {
      userData.department = department;
    }
    
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, userData, { merge: true });
    
    console.log(`Successfully set user ${uid} as ${role}${department ? ' for department ' + department : ''}`);
    return Promise.resolve();
  } catch (error) {
    console.error('Error setting up user role:', error);
    return Promise.reject(error);
  }
}

/**
 * Utility function to verify the current user's role
 * This can be used for debugging
 */
export async function verifyCurrentUserRole(): Promise<{uid: string, role?: string, department?: string} | null> {
  try {
    const app = initializeApp(environment.firebase);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('No user is currently logged in');
      return null;
    }
    
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      console.log(`Current user ${currentUser.uid} has role: ${data['role']} ${data['department'] ? 'department: ' + data['department'] : ''}`);
      return {
        uid: currentUser.uid,
        role: data['role'],
        department: data['department']
      };
    } else {
      console.log(`No role information found for user ${currentUser.uid}`);
      return {
        uid: currentUser.uid
      };
    }
  } catch (error) {
    console.error('Error verifying user role:', error);
    return null;
  }
}
