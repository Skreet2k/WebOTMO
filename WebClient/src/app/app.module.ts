import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TabsModule, BsDropdownModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { routing } from './app.routing';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppComponent } from './app.component';
import { AlertComponent } from './alert/alert.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FlowsPageComponent } from './core/flows/flowsPage/flowsPage.component';
import { FlowConfigPageComponent } from './core/flows/flowConfigPage/flowConfigPage.component';
import { PromptModalDialog } from './common/dialog/prompt/promptDialog.component';
import { ListComponent } from './common/list/list.component';
import { ChartLayoutComponent } from './core/chart/layout/chartLayout.component';
import { ChartSidebarComponent } from './core/chart/sidebar/chartSidebar.component';
import { ChartComponent } from './core/chart/chart/chart.component';
import { ChartTabsetComponent } from './core/chart/tabset/chartTabset.component';
import { ChartCollectionProviderService } from './core/chart/chartTabCollectionProvider.service';
import { ModifyOnChartFlowDialog } from './core/chart/modifyOnChartFlowDialog/modifyOnChartFlowDialog.component';

import { AuthGuard } from './guards/auth.guard';
import { AlertService } from './services/alert.service';
import { UserService } from './services/user.service';
import { FlowService } from './core/flows/flow.service';
import { AuthenticationService } from './services/authentication.service';
import { FlowFunctionsService } from './core/flows//flowFunctions.service';
import { StorageService } from './services/storage.service';

import { AppConfig } from './app.config';

import { IterablePipe } from './pipes/iterable.pipe';
import { CompileDirective } from './derectives/compile.directive';

import 'hammerjs';
import 'chartjs-plugin-zoom';

@NgModule({
    declarations: [
        AppComponent,
        AlertComponent,
        LayoutComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        FlowConfigPageComponent,
        ChartLayoutComponent,
        ChartSidebarComponent,
        ChartComponent,
        IterablePipe,
        FlowsPageComponent,
        CompileDirective,
        ChartTabsetComponent,
        PromptModalDialog,
        ModifyOnChartFlowDialog,
        ListComponent
    ],
    entryComponents: [
        PromptModalDialog,
        ModifyOnChartFlowDialog
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        ChartsModule,
        ModalModule.forRoot(),
        BootstrapModalModule,
        ColorPickerModule
    ],
    providers: [
        AppConfig,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        FlowService,
        FlowFunctionsService,
        ChartCollectionProviderService,
        StorageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
