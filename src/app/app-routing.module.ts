import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FileListComponent } from './file-list/file-list.component';
import { AuthGuard } from './core/auth.guard';
import { LoginComponent } from './login/login.component';
import { UnauthGuard } from './core/unauth.guard';

const routes: Routes = [
  {
    path: '',
    component: FileListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
