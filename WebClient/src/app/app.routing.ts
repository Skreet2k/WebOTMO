import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { ChartComponent } from './core/chart/chart.component';
import { HomeComponent } from './home/home.component';
import { FlowsComponent } from './flows/flows.component';
import { FlowComponent } from './flows/flow.component';


const appRoutes: Routes = [
    {
        path: 'main', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'prefix' },
            { path: 'chart', component: ChartComponent },
            { path: 'home', component: HomeComponent },
            { path: 'flows', component: FlowsComponent },         
            { path: 'flow/:id', component: FlowComponent }            
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: 'main' }
];

export const routing = RouterModule.forRoot(appRoutes);