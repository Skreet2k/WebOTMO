import { Component, OnDestroy, OnInit} from "@angular/core";
import { MathUtil } from "../../../common/MathUtil";
import * as _ from "lodash";
import { Subscription } from "rxjs";
import { Modal } from "ngx-modialog/plugins/bootstrap";
import { FormulaDisplayData } from "../chart/chart.component";
import { ChartCollectionProviderService, Tab } from "../chartTabCollectionProvider.service";

@Component({
    selector: "chart-tabset",
    templateUrl: "./chartTabset.component.html"
})
export class ChartTabsetComponent implements OnInit, OnDestroy {
    public displayData: FormulaDisplayData[]

    public activeTabContentChangedSubscription: Subscription;

    constructor(
        private readonly modal: Modal, 
        private readonly chartTabCollectionProviderService: ChartCollectionProviderService) {
    }

    public ngOnInit() {
        this.refreshChartDisplayedData();
        this.activeTabContentChangedSubscription = this.chartTabCollectionProviderService.activeTabContentChanged().subscribe(() => this.refreshChartDisplayedData())
    }

    public ngOnDestroy() {
        this.activeTabContentChangedSubscription.unsubscribe();
    }

    private refreshChartDisplayedData() {
        const activeTab = this.chartTabCollectionProviderService.getActiveTab();
        this.displayData = activeTab != null ? _.clone(activeTab.data) : [];
    }

    public get tabCollection(): Tab[] {
        return this.chartTabCollectionProviderService.getAllTabs();
    }

    public onTabSelected(tab: Tab) {
        this.chartTabCollectionProviderService.setActiveTab(tab.id);
    }

    public onTabRemoved(tab: Tab) {
        this.chartTabCollectionProviderService.removeTab(tab);
    }

    public isTabCollectionEmpty(): boolean {
        return _.isEmpty(this.tabCollection);
    }

    public openEditTabDialog(dialogTitle?: string): Promise<string> {
        // TODO: There should be available to customize chart options
        return this.modal.prompt()
            .size("sm")
            .showClose(true)
            .title(dialogTitle != null ? dialogTitle : "Rename tab")
            .body("Enter tab name")
            .dialogClass("modal-centered")
            .open()
            .result;
    }

    public editActiveTab() {
        this.openEditTabDialog()
            .then(result => {
                this.chartTabCollectionProviderService.getActiveTab().title = result;
            });
    }

    public addNewTab(): void {
        this.openEditTabDialog("Add new tab")
            .then(result => {
                const newTab = new Tab(result);
                this.chartTabCollectionProviderService.addNewTab(newTab);
            });
    }
}
