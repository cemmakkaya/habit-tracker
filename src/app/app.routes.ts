import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes)
  },
  {
    path: 'add-habit',
    loadComponent: () => import('./modals/add-habit/add-habit.page').then(m => m.AddHabitPage)
  },
  {
    path: 'habit-details',
    loadComponent: () => import('./modals/habit-details/habit-details.page').then( m => m.HabitDetailsPage)
  },
  {
    path: 'habit-documentation',
    loadComponent: () => import('./modals/habit-documentation/habit-documentation.page').then( m => m.HabitDocumentationPage)
  }

];
