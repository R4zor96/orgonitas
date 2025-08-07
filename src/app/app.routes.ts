import { Routes } from '@angular/router';
import { HomeComponent } from './pages/portal/home/home.component';
import { DashboardComponent } from './pages/panel/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'dash',
    component: DashboardComponent
  }
];
