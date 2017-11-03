import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from "angular-font-awesome/angular-font-awesome";


import { routing } from './app.routing';
import { AppConfig } from './app.config';
import { AlertComponent } from './derectives/alert.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';


import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { AlertService } from './services/alert.service';
import { ChartComponent } from './core/chart/chart.component';
import { TabPanelComponent } from './core/tabPanel/tabPanel.component';
import { UserService } from './services/user.service';
import { AuthenticationService } from './services/authentication.service';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    TabPanelComponent,
    AlertComponent,
    LayoutComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ChartsModule,
    TabsModule.forRoot(),
    AngularFontAwesomeModule
  ],
  providers: [
    AppConfig,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }