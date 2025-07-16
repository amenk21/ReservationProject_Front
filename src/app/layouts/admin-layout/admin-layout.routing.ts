import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service'; 

export const AdminLayoutRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['Admin', 'Formateur'] } 
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['Admin', 'Formateur'] } 
  },
  {
    path: 'tables',
    component: TablesComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['Admin'] } 
  },
  {
    path: 'icons',
    component: IconsComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['Admin', 'Formateur']} 
  },
  {
    path: 'maps',
    component: MapsComponent 
  }
];
