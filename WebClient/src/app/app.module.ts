import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { routing } from './app.routing';
import { AppConfig } from './app.config';
import { AlertComponent } from './derectives/alert.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { AlertService } from './services/alert.service';
import { ChartComponent } from './biz/chart/lineChart.component';
import { TabPanelComponent } from './core/tabPanel/tabPanel.component';
import { UserService } from './services/user.service'

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    TabPanelComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
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