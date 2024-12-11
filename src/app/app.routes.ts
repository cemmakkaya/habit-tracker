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
    path: 'add-category',
    loadComponent: () => import('./modals/add-category/add-category.page').then(m => m.AddCategoryPage)
  }
];
