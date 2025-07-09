import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';

export interface Department {
  id: string;
  name: string;
  description: string;
  banner: string;
  createdAt?: any;
  updatedAt?: any;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private departmentsSubject = new BehaviorSubject<Department[]>([]);
  public departments$ = this.departmentsSubject.asObservable();
  
  private totalDepartmentCountSubject = new BehaviorSubject<number>(0);
  public totalDepartmentCount$ = this.totalDepartmentCountSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {
    this.setupRealtimeDepartmentListener();
  }

  /**
   * Set up real-time listener for departments collection
   */
  private setupRealtimeDepartmentListener(): void {
    try {
      const db = this.firebaseService.getDb();
      const departmentsQuery = query(
        collection(db, 'departments'),
        orderBy('createdAt', 'desc')
      );

      onSnapshot(departmentsQuery, (snapshot) => {
        const departments: Department[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as any;
          departments.push({
            id: doc.id,
            name: data['name'],
            description: data['description'] || '',
            banner: data['banner'] || '',
            createdAt: data['createdAt'],
            updatedAt: data['updatedAt'],
            isActive: data['isActive'] !== false // Default to true
          } as Department);
        });
        
        this.departmentsSubject.next(departments);
        this.totalDepartmentCountSubject.next(departments.length);
      }, (error) => {
        console.error('Error listening to departments:', error);
        // Fallback to empty array if error occurs
        this.departmentsSubject.next([]);
        this.totalDepartmentCountSubject.next(0);
      });
    } catch (error) {
      console.error('Error setting up department listener:', error);
    }
  }

  /**
   * Get all departments
   */
  getDepartments(): Observable<Department[]> {
    return this.departments$;
  }

  /**
   * Get total department count
   */
  getTotalDepartmentCount(): Observable<number> {
    return this.totalDepartmentCount$;
  }

  /**
   * Get active departments only
   */
  getActiveDepartments(): Observable<Department[]> {
    return new Observable(observer => {
      this.departments$.subscribe(departments => {
        const activeDepartments = departments.filter(dept => dept.isActive !== false);
        observer.next(activeDepartments);
      });
    });
  }

  /**
   * Add a new department
   */
  async addDepartment(departmentData: Omit<Department, 'id'>): Promise<string> {
    try {
      const docId = await this.firebaseService.addDocument('departments', {
        ...departmentData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });
      return docId;
    } catch (error) {
      console.error('Error adding department:', error);
      throw error;
    }
  }

  /**
   * Update a department
   */
  async updateDepartment(departmentId: string, departmentData: Partial<Department>): Promise<void> {
    try {
      await this.firebaseService.updateDocument('departments', departmentId, {
        ...departmentData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  }

  /**
   * Delete a department
   */
  async deleteDepartment(departmentId: string): Promise<void> {
    try {
      await this.firebaseService.deleteDocument('departments', departmentId);
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  }

  /**
   * Get department by ID
   */
  async getDepartmentById(departmentId: string): Promise<Department | null> {
    try {
      const department = await this.firebaseService.getDocument('departments', departmentId);
      if (department) {
        return {
          id: department.id,
          name: (department as any)['name'],
          description: (department as any)['description'] || '',
          banner: (department as any)['banner'] || '',
          createdAt: (department as any)['createdAt'],
          updatedAt: (department as any)['updatedAt'],
          isActive: (department as any)['isActive'] !== false
        } as Department;
      }
      return null;
    } catch (error) {
      console.error('Error getting department by ID:', error);
      return null;
    }
  }

  /**
   * Get department by name
   */
  getDepartmentByName(name: string): Observable<Department | null> {
    return new Observable(observer => {
      this.departments$.subscribe(departments => {
        const department = departments.find(dept => dept.name === name);
        observer.next(department || null);
      });
    });
  }
} 