import { Injectable, NgZone } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, arrayUnion } from 'firebase/firestore';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Complaint, Status } from '../models/complaint.model';
import { FirebaseService } from './firebase.service';
import { ActivityService } from './activity.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private firestore: Firestore;
  private complaintsCollection = 'complaints';
  private complaintsSubject = new BehaviorSubject<Complaint[]>([]);
  public complaints$ = this.complaintsSubject.asObservable();

  constructor(
    private firebaseService: FirebaseService,
    private activityService: ActivityService,
    private notificationService: NotificationService,
    private ngZone: NgZone
  ) {
    this.firestore = this.firebaseService.getFirestore();
    this.setupComplaintsListener();
  }

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
      });
    }, (error) => {
      console.error('Error fetching complaints:', error);
      this.ngZone.run(() => {
        this.notificationService.showError('Failed to load complaints');
      });
    });
  }

  // Get complaints for a specific department
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

  // Get complaints for a specific user
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

  // Submit a new complaint
  async addComplaint(complaint: Omit<Complaint, 'id'>): Promise<string> {
    try {
      // Add timestamp
      const complaintWithTimestamps = {
        ...complaint,
        dates: {
          ...complaint.dates,
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        }
      };

      const docRef = await addDoc(
        collection(this.firestore, this.complaintsCollection),
        complaintWithTimestamps
      );

      // Log activity
      this.activityService.logActivity(
        'complaint_created',
        `New complaint submitted: ${complaint.title}`,
        docRef.id
      );

      this.notificationService.showSuccess('Complaint submitted successfully');
      return docRef.id;
    } catch (error) {
      console.error('Error adding complaint:', error);
      this.notificationService.showError('Failed to submit complaint');
      throw error;
    }
  }

  // Update a complaint's status
  async updateComplaintStatus(
    complaintId: string, 
    newStatus: Status, 
    updateNote: string,
    updatedBy: string
  ): Promise<void> {
    try {
      const complaintRef = doc(this.firestore, this.complaintsCollection, complaintId);
      
      // Create a new update entry
      const update = {
        timestamp: new Date().toISOString(),
        content: updateNote,
        updatedBy: updatedBy,
        newStatus: newStatus
      };

      await updateDoc(complaintRef, {
        status: newStatus,
        'dates.updated': new Date().toISOString(),
        updates: arrayUnion(update)
      });

      // If the status is resolved, add the resolved date
      if (newStatus === 'Resolved') {
        await updateDoc(complaintRef, {
          'dates.resolved': new Date().toISOString()
        });
      }

      // If the status is closed, add the closed date
      if (newStatus === 'Closed') {
        await updateDoc(complaintRef, {
          'dates.closed': new Date().toISOString()
        });
      }

      // Log activity
      this.activityService.logActivity(
        'complaint_updated',
        `Complaint status updated to ${newStatus}: ${updateNote}`,
        complaintId
      );

      this.notificationService.showSuccess(`Complaint status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating complaint status:', error);
      this.notificationService.showError('Failed to update complaint status');
      throw error;
    }
  }

  // Add a reply to a complaint
  async addReplyToComplaint(
    complaintId: string,
    replyContent: string,
    repliedBy: string
  ): Promise<void> {
    try {
      const complaintRef = doc(this.firestore, this.complaintsCollection, complaintId);
      
      // Create a new update entry
      const update = {
        timestamp: new Date().toISOString(),
        content: replyContent,
        updatedBy: repliedBy
      };

      await updateDoc(complaintRef, {
        'dates.updated': new Date().toISOString(),
        updates: arrayUnion(update)
      });

      // Log activity
      this.activityService.logActivity(
        'complaint_reply',
        `Reply added to complaint: ${replyContent.substring(0, 30)}...`,
        complaintId
      );

      this.notificationService.showSuccess('Reply added successfully');
    } catch (error) {
      console.error('Error adding reply to complaint:', error);
      this.notificationService.showError('Failed to add reply');
      throw error;
    }
  }

  // Assign a complaint to a department or officer
  async assignComplaint(
    complaintId: string,
    departmentId: string,
    departmentName: string,
    officerId?: string,
    officerName?: string
  ): Promise<void> {
    try {
      const complaintRef = doc(this.firestore, this.complaintsCollection, complaintId);
      
      const assignmentData: any = {
        'assignedTo.departmentId': departmentId,
        'assignedTo.departmentName': departmentName,
        status: 'Assigned',
        'dates.updated': new Date().toISOString()
      };

      // Add officer info if provided
      if (officerId && officerName) {
        assignmentData['assignedTo.officerId'] = officerId;
        assignmentData['assignedTo.officerName'] = officerName;
      }

      await updateDoc(complaintRef, assignmentData);

      // Create a new update entry
      const updateNote = officerId 
        ? `Assigned to ${departmentName} department, officer: ${officerName}`
        : `Assigned to ${departmentName} department`;

      const update = {
        timestamp: new Date().toISOString(),
        content: updateNote,
        updatedBy: 'System',
        newStatus: 'Assigned'
      };

      await updateDoc(complaintRef, {
        updates: arrayUnion(update)
      });

      // Log activity
      this.activityService.logActivity(
        'complaint_assigned',
        updateNote,
        complaintId
      );

      this.notificationService.showSuccess(`Complaint assigned to ${departmentName}`);
    } catch (error) {
      console.error('Error assigning complaint:', error);
      this.notificationService.showError('Failed to assign complaint');
      throw error;
    }
  }

  // Delete a complaint
  async deleteComplaint(complaintId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, this.complaintsCollection, complaintId));

      // Log activity
      this.activityService.logActivity(
        'complaint_deleted',
        `Complaint deleted`,
        complaintId
      );

      // Wrap notification in NgZone to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.ngZone.run(() => {
          this.notificationService.showSuccess('Complaint deleted successfully');
        });
      }, 0);
    } catch (error) {
      console.error('Error deleting complaint:', error);
      this.notificationService.showError('Failed to delete complaint');
      throw error;
    }
  }
}
