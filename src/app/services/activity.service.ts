import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { addDoc, collection, serverTimestamp, query, orderBy, limit, deleteDoc, getDocs, QueryDocumentSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private COLLECTION_NAME = 'system_activities';

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {}

  /**
   * Logs a system activity
   * @param action The action performed (login, logout, complaint submitted, etc.)
   * @param details Additional details about the activity
   * @param targetId Optional ID of the target resource (complaint ID, user ID, etc.)
   * @param severity Optional severity level (info, warning, error)
   */
  async logActivity(
    action: string, 
    details: string = '', 
    targetId: string = '', 
    severity: 'info' | 'warning' | 'error' = 'info'
  ): Promise<void> {
    try {
      const currentUser = this.authService.auth.currentUser;
      const userId = currentUser?.uid || 'system';
      const userEmail = currentUser?.email || 'system';
      
      const activityData = {
        action,
        details,
        targetId,
        severity,
        userId,
        userEmail,
        timestamp: serverTimestamp(),
        message: this.formatActivityMessage(action, details, targetId)
      };
      
      await addDoc(collection(this.firebaseService.firestore, this.COLLECTION_NAME), activityData);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  /**
   * Gets recent activities with a specified limit
   * @param count The number of activities to retrieve
   * @returns Array of activity objects
   */
  async getRecentActivities(count: number = 20): Promise<any[]> {
    try {
      const activitiesQuery = query(
        collection(this.firebaseService.firestore, this.COLLECTION_NAME),
        orderBy('timestamp', 'desc'),
        limit(count)
      );
      
      const snapshot = await getDocs(activitiesQuery);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  /**
   * Sets up a realtime listener for activity updates
   * @param callback Function to call with updated activities data
   * @param count Number of activities to retrieve
   * @returns Function to unsubscribe the listener
   */
  listenToActivities(callback: (activities: any[]) => void, count: number = 20): () => void {
    const activitiesQuery = query(
      collection(this.firebaseService.firestore, this.COLLECTION_NAME),
      orderBy('timestamp', 'desc'),
      limit(count)
    );
    
    return this.firebaseService.listenToQuery(activitiesQuery, (snapshot: QuerySnapshot<DocumentData>) => {
      const activities = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      callback(activities);
    });
  }

  /**
   * Clears all activity logs from the database
   * WARNING: This will permanently delete all activity records
   */
  async clearAllActivities(): Promise<void> {
    try {
      console.log('ActivityService: clearAllActivities called - no browser confirmation should happen');
      // Log that activities are being cleared (this will remain as the only activity)
      await this.logActivity('clear_activities', 'All activity logs were cleared', '', 'warning');
      
      // Get all activities except the one we just created
      const activitiesQuery = query(
        collection(this.firebaseService.firestore, this.COLLECTION_NAME),
        orderBy('timestamp', 'asc')
      );
      
      const snapshot = await getDocs(activitiesQuery);
      console.log(`Found ${snapshot.docs.length} activities to clear`);
      
      // Delete all activities except the last one (which is our "cleared" record)
      const deletePromises = snapshot.docs.slice(0, -1).map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      console.log('All activities cleared successfully');
    } catch (error) {
      console.error('Error clearing activities:', error);
      throw error; // Rethrow to handle in the component
    }
  }

  /**
   * Formats an activity message for display
   */
  private formatActivityMessage(action: string, details: string, targetId: string): string {
    const user = this.authService.auth.currentUser;
    const userName = user?.displayName || user?.email?.split('@')[0] || 'A user';
    
    switch (action) {
      case 'login':
        return `${userName} logged into the system`;
      case 'logout':
        return `${userName} logged out of the system`;
      case 'submit_complaint':
        return `${userName} submitted a new complaint${targetId ? ` #${targetId}` : ''}`;
      case 'update_complaint':
        return `${userName} updated complaint${targetId ? ` #${targetId}` : ''}`;
      case 'resolve_complaint':
        return `${userName} resolved complaint${targetId ? ` #${targetId}` : ''}`;
      case 'add_user':
        return `${userName} added a new user to the system`;
      case 'add_department':
        return `${userName} created a new department: ${details}`;
      case 'add_announcement':
        return `${userName} posted a new announcement`;
      case 'clear_activities':
        return `${userName} cleared the activity logs`;
      default:
        return details || `${userName} performed action: ${action}`;
    }
  }
}
