import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AdminComponent } from './admin';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const postsModule = () => import('./posts/posts.module').then(x => x.PostsModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);

const routes: Routes = [
    { 
        path: '', 
        component: HomeComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    { 
        path: 'my-posts', 
        loadChildren: postsModule, 
        canActivate: [AuthGuard]
    },
    { 
        path: 'posts', 
        loadChildren: postsModule, 
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    { 
        path: 'users', 
        loadChildren: usersModule, 
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    { 
        path: 'account', 
        loadChildren: accountModule
    },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }