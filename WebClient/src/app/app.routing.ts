import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { ChartLayoutComponent } from './core/chart/layout/chartLayout.component';
import { HomeComponent } from './home/home.component';
import { FlowsPageComponent } from './core/flows/flowsPage/flowsPage.component';
import { FlowConfigPageComponent } from './core/flows/flowConfigPage/flowConfigPage.component';


const appRoutes: Routes = [
    {
        path: 'main', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'prefix' },
            { path: 'chart', component: ChartLayoutComponent },
            { path: 'home', component: HomeComponent },
            { path: 'flows', component: FlowsPageComponent },         
            { path: 'flow/:id', component: FlowConfigPageComponent }            
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: 'main' }
];

export const routing = RouterModule.forRoot(appRoutes);