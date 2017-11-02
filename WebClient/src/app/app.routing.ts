import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { ChartComponent } from './core/chart/chart.component';


const appRoutes: Routes = [
    {
        path: 'home', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'chart', pathMatch: 'prefix' },
            { path: 'chart', component: ChartComponent },
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: 'home' }
];

export const routing = RouterModule.forRoot(appRoutes);