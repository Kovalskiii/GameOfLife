import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ContentComponent} from "./layout/content/content.component";
import {AuthLayoutComponent} from "./layout/auth-layout/auth-layout.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home', // temporary /auth/login
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./modules/home/home.module').then(m => m.HomeModule)
      },
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' } // temporary /auth/login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
