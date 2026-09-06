import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LeadsComponent } from './pages/leads/leads.component';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { PropertiesComponent } from './pages/properties/properties.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'leads',
        component: LeadsComponent
      },
      {
        path: 'properties',
        component: PropertiesComponent
      }, {
        path: 'bookings',
        component: BookingsComponent
      },
      {
        path: 'users',
        component: UsersComponent
      }

    ]
  }

];