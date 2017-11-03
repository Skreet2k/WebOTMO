import { Component, ChangeDetectionStrategy, Input, Output, OnChanges, EventEmitter, SimpleChanges } from "@angular/core";
import { ChartDataCollectionEntry } from "../chart/chart.component";
import * as _ from "lodash";

@Component({
    selector: "chart-sidebar",
    templateUrl: "./chartSidebar.component.html"
})
export class ChartSidebarComponent {
    @Input() chartDataCollection: ChartDataCollectionEntry[];
    @Output() chartDataCollectionChanged = new EventEmitter();
    
    public buttons: Button[];

    ngOnChanges(changes: SimpleChanges) {
        if (changes["chartDataCollection"] != null) {
            this.buttons = [];
            _.forEach(this.chartDataCollection, (dataEntry) => {
                this.buttons.push({ title: dataEntry.label, id: dataEntry.id });
            });
        }
    }

    public toggleVisibility(entry: Button) {
        const chartDataCollectionEntryToChange = _.find(this.chartDataCollection, dataEntry => dataEntry.id === entry.id);
        chartDataCollectionEntryToChange.hidden = !chartDataCollectionEntryToChange.hidden;
        this.chartDataCollectionChanged.emit(this.chartDataCollection);
    }
}

export type Button = {
    title: string,
    id: number
}