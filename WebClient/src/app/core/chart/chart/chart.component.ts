import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import * as _ from "lodash";

@Component({
 selector: "chart",
 templateUrl: "./chart.component.html",
})
export class ChartComponent {
 @Input() chartDataCollection: ChartDataCollectionEntry[];

 public lineChartLabels:Array<any> = ["January", "February", "March", "April", "May", "June", "July", "1", "2", "3"];
 public lineChartOptions:any = {
   responsive: true,
   animation : false,
   maintainAspectRatio: false,
   legend: {
     display: false
   }
 };
 public lineChartColors:Array<any> = [
   { // grey
     backgroundColor: 'rgba(148,159,177,0.2)',
     borderColor: 'rgba(148,159,177,1)',
     pointBackgroundColor: 'rgba(148,159,177,1)',
     pointBorderColor: '#fff',
     pointHoverBackgroundColor: '#fff',
     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
   },
   { // dark grey
     backgroundColor: 'rgba(77,83,96,0.2)',
     borderColor: 'rgba(77,83,96,1)',
     pointBackgroundColor: 'rgba(77,83,96,1)',
     pointBorderColor: '#fff',
     pointHoverBackgroundColor: '#fff',
     pointHoverBorderColor: 'rgba(77,83,96,1)'
   },
   { // grey
     backgroundColor: 'rgba(148,159,177,0.2)',
     borderColor: 'rgba(148,159,177,1)',
     pointBackgroundColor: 'rgba(148,159,177,1)',
     pointBorderColor: '#fff',
     pointHoverBackgroundColor: '#fff',
     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
   }
 ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

 // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }
}

export type ChartDataCollectionEntry = { 
  id: number, 
  tabId: number, 
  data: number[],
  label: string,
  hidden?: boolean
}
