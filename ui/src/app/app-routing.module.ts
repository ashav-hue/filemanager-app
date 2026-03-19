import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { UserLoginComponent } from './auth/user-login/user-login.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { UserDashboardComponent } from './user/dashboard/dashboard.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { UserFormComponent } from './admin/user-form/user-form.component';
import { FileManagerComponent } from './user/file-manager/file-manager.component';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

const routes: Routes = [

  // Default redirect
  { path: '', redirectTo: '/admin/login', pathMatch: 'full' },

  // Auth routes
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'user/login',  component: UserLoginComponent },

  // Admin routes
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'users',      component: UserListComponent },
      { path: 'users/add',  component: UserFormComponent },
      { path: 'users/edit/:id', component: UserFormComponent }
    ]
  },

  // User routes
  {
    path: 'user',
    component: UserDashboardComponent,
    canActivate: [UserGuard],
    children: [
      { path: 'files', component: FileManagerComponent }
    ]
  },

  // Fallback
  { path: '**', redirectTo: '/admin/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }