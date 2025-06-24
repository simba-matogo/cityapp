import { Routes } from '@angular/router';
import { FirebaseDemoComponent } from './components/firebase-demo.component';
import { LandingPageComponent } from './components/landing-page.component';
import { GeneralUserDashboardComponent } from './components/general-user-dashboard.component';
import { DepartmentAdminDashboardComponent } from './components/department-admin-dashboard.component';
import { OverallAdminDashboardComponent } from './components/overall-admin-dashboard.component';

export const routes: Routes = [
  { 
    path: '', 
    component: LandingPageComponent 
  },
  { 
    path: 'firebase', 
    component: FirebaseDemoComponent 
  },
  { 
    path: 'general-user-dashboard', 
    component: GeneralUserDashboardComponent 
  },
  { 
    path: 'department-admin-dashboard/:department', 
    component: DepartmentAdminDashboardComponent 
  },
  { 
    path: 'overall-admin-dashboard', 
    component: OverallAdminDashboardComponent 
  }
];
