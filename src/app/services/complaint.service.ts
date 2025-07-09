import { Injectable, NgZone } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, arrayUnion } from 'firebase/firestore';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Complaint, Status, Priority, Department } from '../models/complaint.model';
import { FirebaseService } from './firebase.service';
import { ActivityService } from './activity.service';
import { NotificationService } from './notification.service';

/**
 * Complaint Reply Interface - Defines the structure of reply data
 * 
 * This interface represents a reply or update to a complaint,
 * allowing for communication between users and administrators.
 */
export interface ComplaintReply {
  id?: string;           // Unique reply ID
  complaintId: string;   // ID of the complaint being replied to
  message: string;       // Reply message content
  repliedBy: string;     // User ID who sent the reply
  repliedByName?: string;  // Display name of replier
  repliedAt: Date;       // Timestamp of the reply
  isInternal?: boolean;  // Whether this is an internal note (not visible to general users)
}

/**
 * Complaint Statistics Interface - Defines complaint analytics data
 * 
 * This interface represents aggregated statistics for dashboard displays
 * and reporting purposes.
 */
export interface ComplaintStats {
  total: number;         // Total number of complaints
  pending: number;       // Number of pending complaints
  inProgress: number;    // Number of complaints in progress
  resolved: number;      // Number of resolved complaints
  closed: number;        // Number of closed complaints
  byPriority: {          // Complaints grouped by priority
    Low: number;
    Medium: number;
    High: number;
    Critical: number;
  };
  byCategory: { [key: string]: number };  // Complaints grouped by category
  byDepartment: { [key: string]: number };  // Complaints grouped by department
}

/**
 * Complaint Service - Core Complaint Management
 * 
 * This service handles all complaint-related operations for the
 * Harare City Complaints System, including:
 * 
 * - Complaint CRUD operations (Create, Read, Update, Delete)
 * - Real-time complaint tracking and updates
 * - Complaint assignment and status management
 * - Reply and communication handling
 * - Statistics and analytics generation
 * - Search and filtering capabilities
 * 
 * Features:
 * - Real-time data synchronization with Firestore
 * - Role-based complaint access and management
 * - Comprehensive status tracking
 * - Image upload support
 * - Reply system for communication
 * - Analytics and reporting capabilities
 */
@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private firestore: Firestore;
  private complaintsCollection = 'complaints';
  private complaintsSubject = new BehaviorSubject<Complaint[]>([]);
  public complaints$ = this.complaintsSubject.asObservable();

  private statsSubject = new BehaviorSubject<ComplaintStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    byPriority: { Low: 0, Medium: 0, High: 0, Critical: 0 },
    byCategory: {},
    byDepartment: {}
  });
  public stats$ = this.statsSubject.asObservable();

  // Real-time listeners for automatic cleanup
  private complaintsListener: (() => void) | null = null;

  constructor(
    private firebaseService: FirebaseService,
    private activityService: ActivityService,
    private notificationService: NotificationService,
    private ngZone: NgZone
  ) {
    this.firestore = this.firebaseService.getFirestore();
    this.setupComplaintsListener();
  }

  /**
   * Setup real-time complaints listener
   * 
   * Initializes the real-time listener for complaints collection
   * to automatically update the local state when changes occur.
   */
  private setupComplaintsListener(): void {
    const complaintsRef = collection(this.firestore, this.complaintsCollection);
    const complaintsQuery = query(complaintsRef, orderBy('dates.created', 'desc'));

    onSnapshot(complaintsQuery, (snapshot) => {
      this.ngZone.run(() => {
        const complaints: Complaint[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<Complaint, 'id'>;
          complaints.push({ id: doc.id, ...data });
        });
        this.complaintsSubject.next(complaints);
        this.updateStats(complaints);
      });
    }, (error) => {
      console.error('Error fetching complaints:', error);
      this.ngZone.run(() => {
        this.notificationService.showError('Failed to load complaints');
      });
    });
  }

  /**
   * Get complaints for a specific department
   * 
   * @param department - Department to filter complaints by
   * @returns Observable<Complaint[]> - Stream of department complaints
   */
  getComplaintsByDepartment(department: string): Observable<Complaint[]> {
    const complaintsRef = collection(this.firestore, this.complaintsCollection);
    const departmentQuery = query(complaintsRef, 
      where('department', '==', department),
      orderBy('dates.created', 'desc')
    );

    return new Observable<Complaint[]>((observer) => {
      const unsubscribe = onSnapshot(departmentQuery, (snapshot) => {
        const complaints: Complaint[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<Complaint, 'id'>;
          complaints.push({ id: doc.id, ...data });
        });
        observer.next(complaints);
      }, (error) => {
        console.error('Error fetching department complaints:', error);
        observer.error(error);
      });

      // Return the unsubscribe function for cleanup
      return { unsubscribe };
    });
  }

  /**
   * Get complaints for a specific user
   * 
   * @param userId - User ID to filter complaints by
   * @returns Observable<Complaint[]> - Stream of user complaints
   */
  getComplaintsByUser(userId: string): Observable<Complaint[]> {
    const complaintsRef = collection(this.firestore, this.complaintsCollection);
    const userQuery = query(complaintsRef, 
      where('submittedBy.userId', '==', userId),
      orderBy('dates.created', 'desc')
    );

    return new Observable<Complaint[]>((observer) => {
      const unsubscribe = onSnapshot(userQuery, (snapshot) => {
        const complaints: Complaint[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<Complaint, 'id'>;
          complaints.push({ id: doc.id, ...data });
        });
        observer.next(complaints);
      }, (error) => {
        console.error('Error fetching user complaints:', error);
        observer.error(error);
      });

      // Return the unsubscribe function for cleanup
      return { unsubscribe };
    });
  }

  /**
   * Add a new complaint to the system
   * 
   * @param complaint - Complaint data to add
   * @returns Promise<string> - Generated complaint ID
   */
  async addComplaint(complaint: Omit<Complaint, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(this.firestore, this.complaintsCollection), complaint);
      
      // Log activity
      await this.activityService.logActivity(
        'complaint_created',
        `New complaint created: ${complaint.title}`,
        docRef.id
      );

      console.log('Complaint added successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding complaint:', error);
      this.notificationService.showError('Failed to submit complaint');
      throw error;
    }
  }

  /**
   * Update complaint status
   * 
   * @param complaintId - ID of the complaint to update
   * @param newStatus - New status to set
   * @param updateNote - Optional note about the status change
   * @param updatedBy - User ID making the update
   */
  async updateComplaintStatus(
    complaintId: string, 
    newStatus: Status, 
    updateNote: string,
    updatedBy: string
  ): Promise<void> {
    try {
      const complaintRef = doc(this.firestore, this.complaintsCollection, complaintId);
      
      const updateData: any = {
        status: newStatus,
        'dates.updated': new Date().toISOString()
      };

      // Add update to the updates array
      const update = {
        timestamp: new Date().toISOString(),
        content: updateNote,
        updatedBy: updatedBy,
        newStatus: newStatus
      };

      await updateDoc(complaintRef, {
        ...updateData,
        updates: arrayUnion(update)
      });

      // Log activity
      await this.activityService.logActivity(
        'complaint_status_updated',
        `Complaint status updated to ${newStatus}`,
        complaintId
      );

      console.log(`Complaint ${complaintId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating complaint status:', error);
      this.notificationService.showError('Failed to update complaint status');
      throw error;
    }
  }

  /**
   * Add reply to complaint
   * 
   * @param complaintId - ID of the complaint to reply to
   * @param replyContent - Reply message content
   * @param repliedBy - User ID sending the reply
   */
  async addReplyToComplaint(
    complaintId: string,
    replyContent: string,
    repliedBy: string
  ): Promise<void> {
    try {
      const complaintRef = doc(this.firestore, this.complaintsCollection, complaintId);
      
      const update = {
        timestamp: new Date().toISOString(),
        content: replyContent,
        updatedBy: repliedBy
      };

      await updateDoc(complaintRef, {
        'dates.updated': new Date().toISOString(),
        updates: arrayUnion(update)
      });

      console.log(`Reply added to complaint ${complaintId}`);
    } catch (error) {
      console.error('Error adding reply to complaint:', error);
      this.notificationService.showError('Failed to add reply');
      throw error;
    }
  }

  /**
   * Update complaint updates array
   * 
   * @param complaintId - ID of the complaint to update
   * @param updates - New updates array
   */
  async updateComplaintUpdates(
    complaintId: string, 
    updates: any[]
  ): Promise<void> {
    try {
      const complaintRef = doc(this.firestore, this.complaintsCollection, complaintId);
      
      await updateDoc(complaintRef, {
        updates: updates,
        'dates.updated': new Date().toISOString()
      });

      console.log(`Complaint updates updated for ${complaintId}`);
    } catch (error) {
      console.error('Error updating complaint updates:', error);
      this.notificationService.showError('Failed to update complaint updates');
      throw error;
    }
  }

  /**
   * Assign complaint to department
   * 
   * @param complaintId - ID of the complaint to assign
   * @param departmentId - Department ID to assign to
   * @param departmentName - Department name
   * @param officerId - Optional officer ID
   * @param officerName - Optional officer name
   */
  async assignComplaint(
    complaintId: string,
    departmentId: string,
    departmentName: Department,
    officerId?: string,
    officerName?: string
  ): Promise<void> {
    try {
      const complaintRef = doc(this.firestore, this.complaintsCollection, complaintId);
      
      const assignedTo = {
        departmentId: departmentId,
        departmentName: departmentName,
        officerId: officerId,
        officerName: officerName
      };

      const update = {
        timestamp: new Date().toISOString(),
        content: `Complaint assigned to ${departmentName}`,
        updatedBy: 'system'
      };

      await updateDoc(complaintRef, {
        assignedTo: assignedTo,
        status: 'Assigned' as Status,
        'dates.updated': new Date().toISOString(),
        updates: arrayUnion(update)
      });

      console.log(`Complaint ${complaintId} assigned to ${departmentName}`);
    } catch (error) {
      console.error('Error assigning complaint:', error);
      this.notificationService.showError('Failed to assign complaint');
      throw error;
    }
  }

  /**
   * Delete complaint
   * 
   * @param complaintId - ID of the complaint to delete
   */
  async deleteComplaint(complaintId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, this.complaintsCollection, complaintId));
      console.log(`Complaint ${complaintId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting complaint:', error);
      this.notificationService.showError('Failed to delete complaint');
      throw error;
    }
  }

  /**
   * Initialize complaints listener with filters
   * 
   * @param filters - Optional filters to apply
   */
  initializeComplaintsListener(filters?: Array<{ field: string; operator: any; value: any }>) {
    // Clean up existing listener if any
    if (this.complaintsListener) {
      this.complaintsListener();
    }

    // Set up new real-time listener
    this.complaintsListener = this.firebaseService.onCollectionSnapshot(
      'complaints',
      (complaints: Complaint[]) => {
        this.complaintsSubject.next(complaints);
        this.updateStats(complaints);
      },
      filters,
      'dates.created',
      'desc'
    );
  }

  /**
   * Clean up real-time listeners
   */
  cleanup() {
    if (this.complaintsListener) {
      this.complaintsListener();
      this.complaintsListener = null;
    }
  }

  /**
   * Submit a new complaint
   * 
   * @param complaintData - Complaint data without ID and timestamps
   * @returns Promise<string> - The generated complaint ID
   */
  async submitComplaint(complaintData: Omit<Complaint, 'id' | 'dates'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const complaint: Omit<Complaint, 'id'> = {
        ...complaintData,
        dates: {
          created: now,
          updated: now
        }
      };

      const complaintId = await this.firebaseService.addDocument('complaints', complaint);
      console.log(`Complaint submitted successfully with ID: ${complaintId}`);
      return complaintId;
    } catch (error) {
      console.error('Error submitting complaint:', error);
      throw error;
    }
  }

  /**
   * Get complaint by ID
   * 
   * @param complaintId - ID of the complaint to retrieve
   * @returns Promise<Complaint | null> - Complaint data or null if not found
   */
  async getComplaint(complaintId: string): Promise<Complaint | null> {
    try {
      const complaint = await this.firebaseService.getDocument('complaints', complaintId);
      return complaint;
    } catch (error) {
      console.error(`Error getting complaint ${complaintId}:`, error);
      return null;
    }
  }

  /**
   * Get complaints with filters
   * 
   * @param filters - Optional array of filter conditions
   * @param sortBy - Optional field to sort by
   * @param sortOrder - Optional sort order
   * @param limitCount - Optional limit on number of complaints
   * @returns Promise<Complaint[]> - Array of filtered complaints
   */
  async getComplaints(
    filters?: Array<{ field: string; operator: any; value: any }>,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'desc',
    limitCount?: number
  ): Promise<Complaint[]> {
    try {
      const complaints = await this.firebaseService.getCollection(
        'complaints',
        filters,
        sortBy,
        sortOrder,
        limitCount
      );

      return complaints;
    } catch (error) {
      console.error('Error getting complaints:', error);
      return [];
    }
  }

  /**
   * Update complaint statistics
   * 
   * @param complaints - Array of complaints to analyze
   */
  private updateStats(complaints: Complaint[]) {
    const stats: ComplaintStats = {
      total: complaints.length,
      pending: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      byPriority: { Low: 0, Medium: 0, High: 0, Critical: 0 },
      byCategory: {},
      byDepartment: {}
    };

    complaints.forEach(complaint => {
      // Count by status
      switch (complaint.status) {
        case 'New':
        case 'PendingReview':
          stats.pending++;
          break;
        case 'Assigned':
        case 'InProgress':
          stats.inProgress++;
          break;
        case 'Resolved':
          stats.resolved++;
          break;
        case 'Closed':
          stats.closed++;
          break;
      }

      // Count by priority
      if (complaint.priority) {
        stats.byPriority[complaint.priority]++;
      }

      // Count by category
      if (complaint.category) {
        stats.byCategory[complaint.category] = (stats.byCategory[complaint.category] || 0) + 1;
      }

      // Count by department
      if (complaint.department) {
        stats.byDepartment[complaint.department] = (stats.byDepartment[complaint.department] || 0) + 1;
      }
    });

    this.statsSubject.next(stats);
  }

  /**
   * Get current complaints
   * 
   * @returns Complaint[] - Current complaints from the reactive stream
   */
  getCurrentComplaints(): Complaint[] {
    return this.complaintsSubject.value;
  }

  /**
   * Get current statistics
   * 
   * @returns ComplaintStats - Current statistics from the reactive stream
   */
  getCurrentStats(): ComplaintStats {
    return this.statsSubject.value;
  }

  /**
   * Search complaints by text
   * 
   * @param searchTerm - Text to search for
   * @returns Complaint[] - Array of matching complaints
   */
  searchComplaints(searchTerm: string): Complaint[] {
    const complaints = this.getCurrentComplaints();
    const term = searchTerm.toLowerCase();
    
    return complaints.filter(complaint => 
      complaint.title.toLowerCase().includes(term) ||
      complaint.description.toLowerCase().includes(term) ||
      complaint.location.address.toLowerCase().includes(term)
    );
  }
}
