import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { ChartComponent } from './biz/chart/chart.component';
import { LineChartComponent } from './biz/chart/lineChart.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule
  ],
  providers: [
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
