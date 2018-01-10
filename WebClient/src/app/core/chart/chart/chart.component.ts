import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { MathUtil } from "../../../common/MathUtil";
import { BaseChartDirective } from 'ng2-charts';
import { ProcessFunctionRequestArgs } from "../../flows/flowFunctions.service"
import * as _ from "lodash";

@Component({
    selector: "chart",
    templateUrl: "./chart.component.html",
})
export class ChartComponent implements OnChanges {
    @ViewChild(BaseChartDirective) private baseChart;

    private displayDataInternal: FlowChartDataItem[];
    public get displayData() {
        return this.displayDataInternal;
    }
    @Input()
    public set displayData(data: FlowChartDataItem[]) {
        const visibleData = _.filter(data, dataItem => !dataItem.displayOptions.hidden);
        this.displayDataInternal = !_.isEmpty(visibleData) ? visibleData : [nullFlowItem];
        this.refreshChartXLabels();
        this.refreshChartDataDisplayOptions();
    }
    
    public chartXDataLabels: string[];
    public chartDataDisplayOptions: FlowDisplayOptions[];
    public chartType = 'line';

    public chartGlobalConfiguration = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                }
            }]
        },
        pan: {
            enabled: true,
            mode: 'xy'
        },
        zoom: {
            enabled: true,
            drag: false,
            mode: 'xy'
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        // Dirty hack. Reason: BaseChartDirective doesn't react on manual hidden property changes
        if (this.baseChart.chart != null && this.displayDataInternal != null) { 
            this.baseChart.datasets = this.displayDataInternal; // Otherwise chart will crash without any data inside
            this.baseChart.labels = this.chartXDataLabels;
            this.baseChart.colors = this.chartDataDisplayOptions;
            this.baseChart.refresh();
        }
    }

    private refreshChartXLabels() {
        const largestDataSet = _.maxBy(this.displayData, dataItem => dataItem.data.length);
        this.chartXDataLabels = _.keys(largestDataSet.data);
    }

    public refreshChartDataDisplayOptions() {
        this.chartDataDisplayOptions = _.map(this.displayData, dataItem => dataItem.displayOptions);
    }
}

export class FlowChartDataItem { 
    public readonly id: string;

    constructor(
        public data?: number[],
        public functionArgs = new ProcessFunctionRequestArgs(),
        public displayOptions = new FlowDisplayOptions()) {
        
        this.id = MathUtil.newGuid();
    }
}

export class FlowDisplayOptions {
    public displayedName: string;
    public backgroundColor: string;
    public borderWidth: number;
    public borderColor: string;
    public pointBackgroundColor: string;
    public pointBorderColor: string;
    public hidden = false  
}

var nullFlowItem: FlowChartDataItem = new FlowChartDataItem([0])
