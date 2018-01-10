import { Component, OnInit, ViewChild,  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlowService, Flow } from '../flow.service';
import { ListItem, ListModel } from '../../../common/list/list.component';
import * as _ from "lodash";

@Component({
    templateUrl: 'flowsPage.component.html'
})
export class FlowsPageComponent implements OnInit {
    @ViewChild('fileInput') fileInput;
    
    public defaultFlowListModel: ListModel;
    public userFlowListModel: ListModel;

    public flowName = '';
    public isUpdate: boolean = false;
    public startPacketIndex: number = 1;
    public endPacketIndex: number = 999;

    public constructor(
        private readonly flowService: FlowService,
        private readonly router: Router, 
        private readonly route: ActivatedRoute) { 
    }

    public ngOnInit() {
        this.userFlowListModel = new ListModel('Your Flows', [], true);
        this.defaultFlowListModel = new ListModel('Default Flows', [], true);

        this.flowService.getAll().then(flows => {
            _.forEach(flows, flow => {
                const listItem = { 
                    name: flow.name,
                    description: "",
                    onClickAction: () => this.openFlowContentPage(flow) 
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

    private openFlowContentPage(flow: Flow) {
        this.router.navigate(['../flow', flow.id], { relativeTo: this.route });
    }

    public upload() {
        this.isUpdate = true;
        const fileBrowser = this.fileInput.nativeElement;
        const file = fileBrowser.files[0];
        if (file != null) {
            const reader = new FileReader();
            reader.onload = () => {
                this.flowService.upload(this.flowName, JSON.stringify(reader.result.split('\n').slice(this.startPacketIndex, this.endPacketIndex))).then(data => { 
                    this.userFlowListModel.items.push(data); 
                    this.isUpdate = false; 
                }
            )};
            reader.readAsText(file);
        }
    }

    public get isValid() {
        return this.startPacketIndex > 0;
    }
}
