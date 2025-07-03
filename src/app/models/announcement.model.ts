export interface Announcement {
  id?: string;
  title: string;
  content: string;
  department: string;
  departmentId: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'General' | 'Emergency' | 'Maintenance' | 'Update' | 'Info';
  targetAudience: 'All' | 'Residents' | 'Admins' | 'Department';
  createdBy: {
    userId: string;
    name: string;
    role: string;
    department: string;
  };
  dates: {
    created: string;
    expires?: string;
    lastUpdated: string;
  };
  isActive: boolean;
  isUrgent: boolean;
  attachments?: string[];
  tags: string[];
  views: number;
  likes: number;
}
