import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { MathUtil } from "../../../common/MathUtil";
import { BaseChartDirective } from 'ng2-charts';
import * as _ from "lodash";

@Component({
    selector: "chart",
    templateUrl: "./chart.component.html",
})
export class ChartComponent implements OnChanges {
    @Input() displayData: FormulaDisplayData[];
    @ViewChild(BaseChartDirective) private baseChart;

    public ngOnChanges(changes: SimpleChanges) {
        // Dirty hack. Reason: BaseChartDirective doesn't react on manual hidden property changes
        if (this.baseChart.chart != null && changes["displayData"] != null) { 
            const transferData = changes["displayData"].currentValue;
            this.baseChart.datasets = !_.isEmpty(transferData) ? transferData : [nullFormula]; // Otherwise chart will crash without any data inside
            this.baseChart.refresh();
        }
    }

    public lineChartLabels:Array<any> = ["January", "February", "March", "April", "May", "June", "July", "1", "2", "3"];
    public lineChartOptions:any = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        }};

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
    }];

    public lineChartLegend = true;
    public lineChartType = 'line';

    // events
    public chartClicked(e:any):void {
        console.log(e);
    }

    public chartHovered(e:any):void {
        console.log(e);
    }
}

export class FormulaDisplayData { 
    public readonly id: string;

    constructor(
        public label: string,
        public data: number[],
        public hidden = false) {
        
        this.id = MathUtil.newGuid();
    }
}

var nullFormula: FormulaDisplayData = new FormulaDisplayData("null", [0], true)
