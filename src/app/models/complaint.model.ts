export type Department = 'Water and Sanitation' | 'Roads and Transport' | 'Waste Management' | 'General Services' | 'Other';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'New' | 'Assigned' | 'InProgress' | 'PendingReview' | 'Resolved' | 'Closed' | 'Reopened';

export interface Complaint {
  id?: string;
  title: string;
  description: string;
  department: Department;
  category: string;
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    ward?: number;
    district?: string;
  };
  priority: Priority;
  status: Status;
  submittedBy: {
    userId: string;
    name: string;
    contact: string;
    email: string;
  };
  assignedTo?: {
    departmentId: string;
    departmentName: Department;
    officerId?: string;
    officerName?: string;
  };
  dates: {
    created: string;
    updated: string;
    resolved?: string;
    closed?: string;
  };
  mediaUrls?: string[];
  updates: {
    timestamp: string;
    content: string;
    updatedBy: string;
    newStatus?: Status;
  }[];
  aiAnalysis?: {
    suggestedPriority: Priority;
    suggestedDepartment: Department;
    estimatedResolutionTime: string;
    similarComplaints: string[];
  };
  publicId: string; // For non-logged in users to track complaints
  isAnonymous: boolean;
  isPublic: boolean; // Whether this complaint is visible to other residents
  tags: string[];
  votes: number; // For community support/upvotes
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  address?: string;
  ward?: number;
  photoURL?: string;
  role: 'resident' | 'official' | 'admin';
  department?: Department;
  officialId?: string;
  dateJoined: string;
  lastActive: string;
  complaints?: string[]; // IDs of complaints submitted by user
  watchlist?: string[]; // IDs of complaints the user is watching
}

export interface DepartmentStats {
  department: Department;
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  averageResolutionTime: number; // in hours
  criticalIssues: number;
  monthlyTrend: {
    month: string;
    count: number;
  }[];
}

export interface ComplaintAnalytics {
  totalComplaints: number;
  resolvedComplaints: number;
  averageResolutionTime: number;
  complaintsByDepartment: {
    department: Department;
    count: number;
  }[];
  complaintsByPriority: {
    priority: Priority;
    count: number;
  }[];
  complaintsByStatus: {
    status: Status;
    count: number;
  }[];
  trendData: {
    period: string;
    count: number;
  }[];
  hotspotAreas: {
    area: string;
    count: number;
    topIssue: string;
  }[];
}
