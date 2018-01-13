import { Component, Input, OnInit, ViewChild, OnDestroy, NgZone } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Modal, ModalComponent, DialogRef } from "ngx-modialog";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap";
import { ListItem, ListModel } from "../../../common/list/list.component";
import { FlowService } from "../../flows/flow.service";
import { FlowChartDataItem, FlowDisplayOptions } from "../chart/chart.component";
import { FlowFunctionsService, ProcessFunctionRequestArgs } from "../../flows/flowFunctions.service";
import * as _ from "lodash";

@Component({
    selector: "modify-on-chart-flow-dialog",
    templateUrl: "./modifyOnChartFlowDialog.component.html"
})
export class ModifyOnChartFlowDialog implements OnInit, OnDestroy, ModalComponent<BSModalContext> {
    @ViewChild("form") public form: NgForm;
    public readonly model: ModifyFlowDialogModel;

    public dialogTitle: string;
    public actualChartXAxesStep: number;

    public defaultFlowListModel: ListModel;
    public userFlowListModel: ListModel;
    public functionListModel: ListModel;
    public numberOfServiceUnits: string;
    public loadFactor: string;
    public backgroundColor: string;

    public colorPickerDialogPosition: string;
    public refreshColorPickerDialogPosition() {
        this.colorPickerDialogPosition = window.innerWidth < 900 ? "bottom" : "right";
    }
    private unsubscribeFromWindowResizeEvent: Function;

    public displayLoadFactorInput: boolean = true;

    constructor(
        private readonly flowService: FlowService,
        private readonly flowFunctionsService: FlowFunctionsService,
        private readonly ngZone: NgZone,
        public readonly dialog: DialogRef<ModifyFlowDialogContext>) { 

        this.model = dialog.context.dialogModel;
        this.dialogTitle = dialog.context.title;
        this.actualChartXAxesStep = dialog.context.actualChartXAxesStep;
        dialog.context.dialogClass = "modal-dialog modal-hg";
    }

    public ngOnInit() {
        this.loadFlows();
        this.loadFunctions();

        this.displayLoadFactorInput = !!this.model.loadFactor;
        this.unsubscribeFromWindowResizeEvent = window.onresize = (e) => {
            this.ngZone.run(() => {
                this.refreshColorPickerDialogPosition();
            })
        };
    }

    public ngOnDestroy() {
        if (this.unsubscribeFromWindowResizeEvent != null) {
            this.unsubscribeFromWindowResizeEvent();
        }
    }

    private loadFlows() {
        this.defaultFlowListModel = new ListModel("Default flows", [], true, true);
        this.userFlowListModel = new ListModel("Your flows", [], true, true);
        this.flowService.getAll().then(flows => {
            _.forEach(flows, flow => {
                const listItem = { 
                    name: flow.name,
                    description: "",
                    onClickAction: () => {
                        _.forEach(this.userFlowListModel.items, item => {
                            item.active = false;
                        });
                        _.forEach(this.defaultFlowListModel.items, item => {
                            item.active = false
                        });
                        this.model.flowId = flow.id;
                    },
                    active: flow.id === this.model.flowId,
                    disabled: false
                };
                if (flow.userId != null) {
                    this.userFlowListModel.items.push(listItem);
                } else {
                    this.defaultFlowListModel.items.push(listItem);
                }
            });
            this.defaultFlowListModel.loading = false;
            this.userFlowListModel.loading = false;
        });
    }

    private loadFunctions() {
        this.functionListModel = new ListModel("Functions", [], true, true);
        this.flowFunctionsService.getAll().then(functionDisplayItem => {
            _.forEach(functionDisplayItem, item => {
                const disabled = this.actualChartXAxesStep != null && this.actualChartXAxesStep != item.deltaX;
                this.functionListModel.items.push({ 
                    name: item.name,
                    description: (disabled ? "You cannot use this function since there is at least one function with another abscissa data step interval on current chart. " : "") 
                        + item.description,
                    onClickAction: () => {
                        this.displayLoadFactorInput = item.isNeedMaxLoadFactor;
                        this.model.loadFactor = this.displayLoadFactorInput ? DefaultFunctionOptions.loadFactor : "";
                        this.model.xAxesStep = item.deltaX;
                        this.model.functionId = item.id;
                    },
                    active: item.id === this.model.functionId,
                    disabled: disabled
                })
            });
            this.functionListModel.loading = false;
        });
    }

    public close() {
        this.dialog.dismiss();
    }

    public submit() {
        if (this.isValid) {
            const dataItem = this.model.createDataItem();
            this.dialog.close(dataItem); 
        }
    }
    
    public get isValid(): boolean {
        return this.model.isValid && this.form.valid;
    }
}

export class ModifyFlowDialogContext extends BSModalContext {
    public readonly dialogModel: ModifyFlowDialogModel;

    constructor(
        public title: string,
        public actualChartXAxesStep?: number,
        chartDataItem: FlowChartDataItem = new FlowChartDataItem()) {
        
        super();
        this.dialogModel = new ModifyFlowDialogModel(chartDataItem);
    }
}

export class ModifyFlowDialogModel {
    public displayedName: string;
    public functionId: number;
    public flowId: number;
    public numberOfServiceUnits: string;
    public loadFactor: string;
    public backgroundColor: string;
    public borderWidth: string;
    public borderColor: string;
    public pointBackgroundColor: string;
    public pointBorderColor: string;
    public xAxesStep: number;

    constructor(
        private chartDataItem: FlowChartDataItem) {
        
        this.assignData(chartDataItem);
    }

    private assignData(chartDataItem: FlowChartDataItem) {
        this.functionId = chartDataItem.functionArgs.id;
        this.flowId = chartDataItem.functionArgs.flowId;
        this.numberOfServiceUnits = chartDataItem.functionArgs.numberOfServiceUnits ? String(chartDataItem.functionArgs.numberOfServiceUnits) : DefaultFunctionOptions.numberOfServiceUnits;
        this.loadFactor = chartDataItem.functionArgs.loadFactor != null ? String(chartDataItem.functionArgs.loadFactor) : "";
        this.displayedName = chartDataItem.displayOptions.displayedName || DefaultFlowDisplayOptions.displayedName;
        this.backgroundColor = chartDataItem.displayOptions.backgroundColor || DefaultFlowDisplayOptions.backgroundColor;
        this.borderWidth = chartDataItem.displayOptions.borderWidth != null ? String(chartDataItem.displayOptions.borderWidth) : DefaultFlowDisplayOptions.borderWidth;
        this.borderColor = chartDataItem.displayOptions.borderColor || DefaultFlowDisplayOptions.borderColor;
        this.pointBackgroundColor = chartDataItem.displayOptions.pointBackgroundColor || DefaultFlowDisplayOptions.pointBackgroundColor;
        this.pointBorderColor = chartDataItem.displayOptions.pointBorderColor || DefaultFlowDisplayOptions.pointBorderColor;
        this.xAxesStep = chartDataItem.displayOptions.xAxesStep || Number(DefaultFlowDisplayOptions.xAxesStep);
    }

    public createDataItem(): FlowChartDataItem {
        const functionArgs = new ProcessFunctionRequestArgs();
        functionArgs.id = Number(this.functionId);
        functionArgs.flowId = Number(this.flowId);
        functionArgs.loadFactor = _.isNumber(this.loadFactor) ? Number(this.loadFactor): null;
        functionArgs.numberOfServiceUnits = Number(this.numberOfServiceUnits);

        const displayOptions = new FlowDisplayOptions();
        displayOptions.displayedName = this.displayedName;
        displayOptions.backgroundColor = this.backgroundColor;
        displayOptions.borderColor = this.borderColor;
        displayOptions.borderWidth = Number(this.borderWidth);
        displayOptions.pointBackgroundColor = this.pointBackgroundColor;
        displayOptions.pointBorderColor = this.pointBorderColor;
        displayOptions.xAxesStep = this.xAxesStep;

        this.chartDataItem.functionArgs = functionArgs;
        this.chartDataItem.displayOptions = displayOptions;
        return this.chartDataItem;
    }

    public get isValid(): boolean {
        return this.validateLoadFactor()
            && this.validateNumberOfServiceUnits()
            && this.flowId != null
            && this.functionId != null
            && !_.isEmpty(this.displayedName);
    }

    private validateLoadFactor(): boolean {
        if (this.loadFactor) {
            const loadFactor = Number(this.loadFactor);
            if (!_.isNaN(loadFactor) && loadFactor > 0 && loadFactor <= 1) {
                return true;
            }
            return false;
        }
        return true;
    }

    private validateNumberOfServiceUnits(): boolean  {
        if (this.numberOfServiceUnits) {
            const numberOfServiceUnits = Number(this.numberOfServiceUnits);
            if (_.isInteger(numberOfServiceUnits) && numberOfServiceUnits > 0 && numberOfServiceUnits <= 10) {
                return true;
            }
            return false;
        }
        return true;
    }
}

export enum DefaultFlowDisplayOptions {
    displayedName = "New flow",
    backgroundColor = "rgba(77,83,96,0.2)",
    borderWidth = "1",
    borderColor = "rgba(77,83,96,1)",
    pointBackgroundColor = "rgba(77,83,96,1)",
    pointBorderColor = "rgba(148,159,177, 0.8)",
    xAxesStep = "1"
}

export enum DefaultFunctionOptions {
    loadFactor = "0.1",
    numberOfServiceUnits = "1"
}
