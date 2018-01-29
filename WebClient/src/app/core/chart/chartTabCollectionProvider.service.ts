import { Injectable, OnDestroy } from "@angular/core";
import { FlowChartDataItem } from "./chart/chart.component";
import { MathUtil } from "../../common/MathUtil";
import { Subject, Observable } from "rxjs";
import * as _ from "lodash";

@Injectable()
export class ChartCollectionProviderService implements OnDestroy {
    private tabCollection: _.Dictionary<Tab> = {};
    private activeTabId: string;

    private activeTabContentChangedEvent = new Subject<{}>();
    public activeTabContentChanged(): Observable<{}> {
        return this.activeTabContentChangedEvent;
    }

    public notifyActiveTabContentChanged() {
        this.activeTabContentChangedEvent.next();
    }

    constructor() {
        this.load();
    }

    public ngOnDestroy() {
        this.clear();
    }

    public getActiveTab(): Tab {
        return this.tabCollection[this.activeTabId];
    }

    public setActiveTab(tabId: string) {
        if (this.activeTabId == null || tabId == null || tabId != this.activeTabId) {
            _.forOwn(this.tabCollection, tab => {
                tab.active = false;
            });
            this.activeTabId = tabId;
            if (this.activeTabId != null) {
                this.tabCollection[this.activeTabId].active = true;
            }
            this.notifyActiveTabContentChanged();
        }
    }

    public getAllTabs(): Tab[] {
        return _.values(this.tabCollection);
    }

    public addNewTab(tab: Tab) {
        this.tabCollection[tab.id] = tab;
        this.tabCollection[tab.id].data = []
        this.setActiveTab(tab.id);
    }

    public modifyTab(tab: Tab) {
        if (this.tabCollection[tab.id] == null) {
            console.error(`[ChartTabCollectionProviderService.modifyTab] There is no tab with such id ${tab.id}.`);
            return;
        }
        this.tabCollection[tab.id] = tab;
    }

    public removeTab(tab: Tab) {
        if (this.tabCollection[tab.id] == null) {
            console.error(`[ChartTabCollectionProviderService.removeTab] There is no tab with such id ${tab.id}.`);
            return;
        }
        const nextActiveTabId = this.getClosestTabId(tab.id);
        this.tabCollection = _.omit(this.tabCollection, tab.id);
        if (nextActiveTabId == null) {
            this.setActiveTab(null);
        } else {
            this.setActiveTab(nextActiveTabId);
        }
    }

    private getClosestTabId(tabId: string): string {
        const tabCollectionKeys = _.keys(this.tabCollection);
        for (let index = 0; index < tabCollectionKeys.length; index++) {
            if (tabCollectionKeys[index] === tabId) {
                if (this.tabCollection[tabCollectionKeys[index + 1]] != null) {
                    return tabCollectionKeys[index + 1];
                } else if (this.tabCollection[tabCollectionKeys[index - 1]] != null) {
                    return tabCollectionKeys[index - 1];
                } else {
                    return null;
                }
            }
        }
        return null;
    };

    public removeFlow(flowId: string) {
        const actibeTab = this.getActiveTab();
        const removedFormula = _.remove(actibeTab.data, datum => datum.id === flowId);
        if (removedFormula != null) {
            this.notifyActiveTabContentChanged();
        }
    }

    public addFlow(flow: FlowChartDataItem) {
        const actibeTab = this.getActiveTab();
        actibeTab.data.push(flow);
        this.notifyActiveTabContentChanged();
    }

    private load() {
        // TODO: All source data should be loaded from DB
    }

    private clear() {
        // TODO: State should be saved
        this.tabCollection = {};
        const activeTabInternal = null;
    }

    public getRandomDataSet(): FlowChartDataItem[] {
        const data: FlowChartDataItem[] = [];
        for (let i = 0; i < 3; i++) {
            const dataItem = new FlowChartDataItem(_.map([5, 10, 20, 30, 40, 50, 60, 70, 50, 10], val => _.random(0, val)));
            dataItem.displayOptions.displayedName = "Series " + _.random(0, 100);
            dataItem.displayOptions.xAxesStep = 1;
            data.push(dataItem);
        }
        return data;
    }
}

export class Tab {
    public readonly id;
    
    constructor(
        public title: string,
        public data?: FlowChartDataItem[],
        public active = false,
        public removable = true,
        public disabled = false,
    ) {
        this.id = MathUtil.newGuid();
    }
}
