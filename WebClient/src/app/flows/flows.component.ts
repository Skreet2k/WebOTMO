import { Component, OnInit, ViewChild } from '@angular/core';
import { FlowService } from '../services/flow.service';
import { Flow } from '../models/flow';


@Component({
    templateUrl: 'flows.component.html'
})
export class FlowsComponent implements OnInit {
    defaultFlows: Flow[] = [];
    userFlows: Flow[] = [];
    flowName = '';
    isUpdate: boolean = false;
    isLoading: boolean = true;
    startPacket: number = 1;
    endPacket: number = 999;
    @ViewChild('fileInput') fileInput;

    constructor(
        private flowService: FlowService) { }

    ngOnInit(): void {
        this.flowService.getAll().subscribe(data => {
            this.defaultFlows = data.filter(x => x.userId === null);
            this.userFlows = data.filter(x => x.userId != null);
            this.isLoading = false;
        });
    }

    upload() {
        this.isUpdate = true;
        const that = this;
        const fileBrowser = this.fileInput.nativeElement;
        if (fileBrowser.files && fileBrowser.files[0]) {

            const file = fileBrowser.files[0];
            const flowService = this.flowService;
            const flowName = this.flowName;
            const userFlows = this.userFlows;
            const startPacket = this.startPacket;
            const endPacket = this.endPacket;
            const reader = new FileReader();
            reader.onload = function (progressEvent) {
                flowService.upload(flowName, JSON.stringify(this.result.split('\n').slice(startPacket,endPacket))).subscribe(
                    data => { userFlows.push(data); that.isUpdate = false; }
                );
            };
            reader.readAsText(file);
        }
    }
}
