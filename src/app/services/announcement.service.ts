import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Announcement } from '../models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private announcementsSubject = new BehaviorSubject<Announcement[]>([]);
  public announcements$ = this.announcementsSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {
    this.loadAnnouncements();
  }

  // Load all active announcements
  async loadAnnouncements() {
    try {
      const announcements = await this.firebaseService.getCollection('announcements', [
        { field: 'isActive', operator: '==', value: true }
      ]);
      
      // Sort by creation date (newest first)
      const sortedAnnouncements = (announcements as Announcement[]).sort((a, b) => 
        new Date(b.dates.created).getTime() - new Date(a.dates.created).getTime()
      );
      
      this.announcementsSubject.next(sortedAnnouncements);
    } catch (error) {
      console.error('Error loading announcements:', error);
      this.announcementsSubject.next([]);
    }
  }

  // Get announcements for specific audience
  getAnnouncementsForUser(userRole: string, userDepartment?: string): Observable<Announcement[]> {
    return new Observable(observer => {
      this.announcements$.subscribe(announcements => {
        const filteredAnnouncements = announcements.filter(announcement => {
          // Check target audience
          if (announcement.targetAudience === 'All') return true;
          if (announcement.targetAudience === 'Residents' && userRole === 'generaluser') return true;
          if (announcement.targetAudience === 'Admins' && (userRole === 'departmentadmin' || userRole === 'overalladmin')) return true;
          if (announcement.targetAudience === 'Department' && userDepartment && announcement.department === userDepartment) return true;
          
          return false;
        });
        
        observer.next(filteredAnnouncements);
      });
    });
  }

  // Create new announcement
  async createAnnouncement(announcement: Announcement): Promise<string> {
    const announcementId = await this.firebaseService.addDocument('announcements', announcement);
    this.loadAnnouncements(); // Refresh the list
    return announcementId;
  }

  // Update announcement
  async updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<void> {
    await this.firebaseService.updateDocument('announcements', id, updates);
    this.loadAnnouncements(); // Refresh the list
  }

  // Delete announcement (mark as inactive)
  async deleteAnnouncement(id: string): Promise<void> {
    await this.firebaseService.updateDocument('announcements', id, { 
      isActive: false,
      'dates.lastUpdated': new Date().toISOString()
    });
    this.loadAnnouncements(); // Refresh the list
  }

  // Increment view count
  async incrementViewCount(id: string): Promise<void> {
    try {
      const announcement = await this.firebaseService.getDocument('announcements', id) as any;
      if (announcement) {
        await this.firebaseService.updateDocument('announcements', id, {
          views: (announcement.views || 0) + 1
        });
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  // Increment like count
  async incrementLikeCount(id: string): Promise<void> {
    try {
      const announcement = await this.firebaseService.getDocument('announcements', id) as any;
      if (announcement) {
        await this.firebaseService.updateDocument('announcements', id, {
          likes: (announcement.likes || 0) + 1
        });
        this.loadAnnouncements(); // Refresh the list
      }
    } catch (error) {
      console.error('Error incrementing like count:', error);
    }
  }
}
