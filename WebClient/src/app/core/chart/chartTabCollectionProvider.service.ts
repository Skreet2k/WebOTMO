import { Injectable, OnDestroy } from "@angular/core";
import { FormulaDisplayData } from "./chart/chart.component";
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
        this.tabCollection[tab.id].data = this.getRandomDataSet(); // Remove this
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
        this.tabCollection = _.omit(this.tabCollection, tab.id);
        if (_.isEmpty(this.tabCollection)) {
            this.setActiveTab(null);
        }
    }

    public removeActiveFormula(formulaId: string) {
        const actibeTab = this.getActiveTab();
        const removedFormula = _.remove(actibeTab.data, datum => datum.id === formulaId);
        if (removedFormula != null) {
            this.notifyActiveTabContentChanged();
        }
    }

    private load() {
        // TODO: All source data should be loaded from DB
        for(let i = 0; i < 3; i++) {
            const tab = new Tab("Static tab " + i, this.getRandomDataSet());
            this.tabCollection[tab.id] = tab;
        }
        this.setActiveTab((_.values(this.tabCollection)[0] as Tab).id);
    }

    private clear() {
        // TODO: State should be saved
        this.tabCollection = {};
        const activeTabInternal = null;
    }

    public getRandomDataSet(): FormulaDisplayData[] {
        const data: FormulaDisplayData[] = [];
        for (let i = 0; i < 3; i++) {
            data.push(new FormulaDisplayData("Series" + _.random(0, 100), _.map([5, 10, 20, 30, 40, 50, 60, 70, 50, 10], val => _.random(0, val))));
        }
        return data;
    }
}

export class Tab {
    public readonly id;
    
    constructor(
        public title: string,
        public data?: FormulaDisplayData[],
        public active = false,
        public removable = true,
        public disabled = false,
    ) {
        this.id = MathUtil.newGuid();
    }
}