import { Routes } from '@angular/router';
import { FirebaseDemoComponent } from './components/firebase-demo.component';
import { LandingPageComponent } from './components/landing-page.component';
import { GeneralUserDashboardComponent } from './components/general-user-dashboard.component';
import { DepartmentAdminDashboardComponent } from './components/department-admin-dashboard.component';
import { OverallAdminDashboardComponent } from './components/overall-admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: LandingPageComponent 
  },
  { 
    path: 'login', 
    component: LandingPageComponent 
  },
  { 
    path: 'firebase', 
    component: FirebaseDemoComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'user-dashboard', 
    component: GeneralUserDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'generaluser' }
  },
  { 
    path: 'department-dashboard', 
    component: DepartmentAdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'departmentadmin' }
  },
  { 
    path: 'admin-dashboard', 
    component: OverallAdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'overalladmin' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
