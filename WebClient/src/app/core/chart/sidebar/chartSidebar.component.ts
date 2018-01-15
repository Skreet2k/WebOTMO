import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ChartCollectionProviderService, Tab } from "../chartTabCollectionProvider.service";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap";
import { Modal, overlayConfigFactory } from "ngx-modialog";
import { ModifyOnChartFlowDialog } from "../modifyOnChartFlowDialog/modifyOnChartFlowDialog.component";
import { ModifyFlowDialogContext } from "../modifyOnChartFlowDialog/modifyOnChartFlowDialog.component"
import { FlowFunctionsService } from "../../flows/flowFunctions.service";
import { FlowChartDataItem } from "../chart/chart.component";
import * as _ from "lodash";

@Component({
    selector: "chart-sidebar",
    templateUrl: "./chartSidebar.component.html"
})
export class ChartSidebarComponent implements OnChanges {  
    @Input() activeTab: Tab;

    public buttons: OnChartFlowButton[];

    constructor(
        private readonly chartCollectionProviderService: ChartCollectionProviderService,
        private readonly flowFunctionsService: FlowFunctionsService,
        private readonly modal: Modal) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["activeTab"] != null) {
            this.refreshDisplayedData();
        }
    }

    public toggleFlowVisibility(entry: OnChartFlowButton) {
        const flow = _.find(this.activeTab.data, dataEntry => dataEntry.id === entry.id);
        if (flow != null) {
            flow.displayOptions.hidden = !flow.displayOptions.hidden;
            this.chartCollectionProviderService.notifyActiveTabContentChanged();
        }
    }

    public removeFlow(entry: OnChartFlowButton) {
        _.remove(this.buttons, button => button.id === entry.id);
        this.chartCollectionProviderService.removeFlow(entry.id);
    }

    public editFlow(entry: OnChartFlowButton) {
        let flow = _.find(this.activeTab.data, dataEntry => dataEntry.id === entry.id);
        this.openModifyFlowDialog("Modify flow on chart", flow)
            .then(resultFlow => {
                this.flowFunctionsService.processFunction(resultFlow.functionArgs)
                    .then((resultData) => {
                        flow = resultFlow;
                        flow.data = resultData;
                        this.chartCollectionProviderService.notifyActiveTabContentChanged();
                        this.refreshDisplayedData();
                    })
                }, () => {});
    }

    public addFlow() {
        this.openModifyFlowDialog("Add flow to chart")
            .then(resultFlow => {
                this.flowFunctionsService.processFunction(resultFlow.functionArgs)
                    .then((resultData) => {
                        resultFlow.data = resultData;
                        this.chartCollectionProviderService.addFlow(resultFlow);
                        this.refreshDisplayedData();
                    })
                }, () => {});
    }

    private openModifyFlowDialog(title: string, dataItem?: FlowChartDataItem): Promise<FlowChartDataItem> {
        const actualChartXAxesStepFactor = this.activeTab.data.length > 1 
            || (this.activeTab.data[0] != null && dataItem == null) 
            || (this.activeTab.data[0] != null && this.activeTab.data[0].id != dataItem.id)
                ? this.activeTab.data[0].displayOptions.xAxesStepFactor
                : null;
        return this.modal.open(ModifyOnChartFlowDialog, overlayConfigFactory( 
            new ModifyFlowDialogContext(title, actualChartXAxesStepFactor, dataItem), ModifyFlowDialogContext)).result;
    }

    private refreshDisplayedData() {
        this.buttons = [];
        if (this.activeTab != null) {
            _.forEach(this.activeTab.data, (dataEntry) => {
                this.buttons.push({ title: dataEntry.displayOptions.displayedName, id: dataEntry.id });
            });
        }
    }
}

export type OnChartFlowButton = {
    title: string,
    id: string
}