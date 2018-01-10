import { Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import { MathUtil } from "../../../common/MathUtil";
import * as _ from "lodash";
import { Subscription } from "rxjs";
import { Modal, overlayConfigFactory } from "ngx-modialog";
import { FlowChartDataItem } from "../chart/chart.component";
import { ChartCollectionProviderService, Tab } from "../chartTabCollectionProvider.service";
import { PromptDialogContext, PromptModalDialog } from "../../../common/dialog/prompt/promptDialog.component";
import { TabsetComponent } from "ngx-bootstrap";

@Component({
    selector: "chart-tabset",
    templateUrl: "./chartTabset.component.html"
})
export class ChartTabsetComponent implements OnInit, OnDestroy {
    public displayData: FlowChartDataItem[]

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
        this.displayData = activeTab != null ? _.cloneDeep(activeTab.data) : [];
    }

    public get tabCollection(): Tab[] {
        return this.chartTabCollectionProviderService.getAllTabs();
    }

    public onTabSelected(tab: Tab) {
        this.chartTabCollectionProviderService.setActiveTab(tab.id);
    }

    public removeTab(tab: Tab) {
        this.chartTabCollectionProviderService.removeTab(tab);
    }

    public isTabCollectionEmpty(): boolean {
        return _.isEmpty(this.tabCollection);
    }

    public openEditTabDialog(dialogTitle: string, tabTitle?: string): Promise<string> {
        // TODO: There should be available to customize chart options
        return this.modal.open(PromptModalDialog, overlayConfigFactory({ 
            "title": dialogTitle,
            "bodyContent": "Enter tab name",
            "promptText": tabTitle
        }, PromptDialogContext)).result;
    }

    public editActiveTab() {
        const activeTab = this.chartTabCollectionProviderService.getActiveTab();
        this.openEditTabDialog("Rename tab", activeTab.title)
            .then(result => {
                activeTab.title = result;
            }, () => {});
    }

    public addNewTab(): void {
        this.openEditTabDialog("Add new tab")
            .then(result => {
                const newTab = new Tab(result);
                this.chartTabCollectionProviderService.addNewTab(newTab)
            }, () => {});
    }
}
