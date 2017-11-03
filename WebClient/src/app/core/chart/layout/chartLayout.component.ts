import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ChartDataCollectionEntry } from "../chart/chart.component";
import * as _ from "lodash";

@Component({
    selector: "chart-layout",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./chartLayout.component.html"
})
export class ChartLayoutComponent {
    public tabCollection: _.Dictionary<Tab> = {};

    ngOnInit() {
        this.initializeTabs();
    }

    public addNewTab(): void {
        const tabId = this.getUniqueId();
        _.forEach(this.tabCollection, entry => entry.active = false);
        this.tabCollection[tabId] = {
            title: "New tab",
            disabled: false,
            removable: true,
            data: _.cloneDeep(this.chartDataCollection[0]),
            active: true,
        };
    }

    public removeTabHandler(tabKey: number): void {
        this.tabCollection = _.omit(this.tabCollection, [tabKey]);
    }

    public onDataChanged(data: ChartDataCollectionEntry[]) {
        const tabId = data[0].tabId;
        if (this.tabCollection[tabId] == null) {
            console.log(`[ChartLayoutComponent][onDataChanged]: There is no tab with the following ID: ${tabId}. Data change aborted.`);
            return;
        }
        this.tabCollection[tabId].data = data;
    }

    public isTabCollectionEmpty(): boolean {
        return _.isEmpty(this.tabCollection);
    }

    private initializeTabs() {
        this.tabCollection[0] = { title: "Static tab 0", removable: true, data: _.cloneDeep(this.chartDataCollection[0]), active: true };
        this.tabCollection[1] = { title: "Static tab 1", removable: true, data: _.cloneDeep(this.chartDataCollection[1]) };
        this.tabCollection[2] = { title: "Static tab 2", removable: true, data: _.cloneDeep(this.chartDataCollection[2]) };
    }

    private getUniqueId(): number {
        let tabId;
        do {
            tabId = Math.floor(Math.random() * (1000 - 1)) + 1;
        } while (this.tabCollection[tabId] != null)
        return tabId;
    }
    
    public chartDataCollection: ChartDataCollectionEntry[][] = [
        [{ id: 1, tabId: 0, data: [65, 59, 80, 81, 56, 55, 40, 50, 11, 21, 133], label: "Series A" },
        { id: 2,  tabId: 0, data: [28, 48, 40, 19, 86, 27, 90], label: "Series B" },
        { id: 3, tabId: 0, data: [18, 48, 77, 9, 100, 27, 40], label: "Series C" }],
        [{ id: 4, tabId: 1, data: [65, 59, 80, 81, 56, 55, 40, 50, 11, 21, 133], label: "Series A" },
        { id: 5, tabId: 1, data: [28, 48, 40, 19, 86, 27, 90], label: "Series B" },
        { id: 6, tabId: 1, data: [18, 48, 77, 9, 100, 27, 40], label: "Series C" }],
        [{ id: 7, tabId: 2, data: [65, 59, 80, 81, 56, 55, 40, 50, 11, 21, 133], label: "Series A" },
        { id: 8, tabId: 2, data: [28, 48, 40, 19, 86, 27, 90], label: "Series B" },
        { id: 9, tabId: 2, data: [18, 48, 77, 9, 100, 27, 40], label: "Series C" }]
    ];
}

export type Tab = {
    title: string,
    disabled?: boolean,
    removable?: boolean,
    tab?: string,
    data?: ChartDataCollectionEntry[],
    active?: boolean
}