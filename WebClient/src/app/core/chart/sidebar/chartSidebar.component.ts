import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ChartTabCollectionProviderService, Tab } from "../chartTabCollectionProvider.service";
import * as _ from "lodash";

@Component({
    selector: "chart-sidebar",
    templateUrl: "./chartSidebar.component.html"
})
export class ChartSidebarComponent implements OnChanges {  
    @Input() activeTab: Tab;

    public buttons: Button[];

    constructor(private readonly chartTabCollectionProviderService: ChartTabCollectionProviderService) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["activeTab"] != null) {
            this.buttons = [];
            if (this.activeTab != null) {
                _.forEach(this.activeTab.data, (dataEntry) => {
                    this.buttons.push({ title: dataEntry.label, id: dataEntry.id });
                });
            }
        }
    }

    public toggleVisibility(entry: Button) {
        const chartDataCollectionEntryToChange = _.find(this.activeTab.data, dataEntry => dataEntry.id === entry.id);
        if (chartDataCollectionEntryToChange != null) {
            chartDataCollectionEntryToChange.hidden = !chartDataCollectionEntryToChange.hidden;
            this.chartTabCollectionProviderService.notifyActiveTabContentChanged();
        }
    }
}

export type Button = {
    title: string,
    id: string
}