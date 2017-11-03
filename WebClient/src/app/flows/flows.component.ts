import { Component, OnInit, ViewChild } from '@angular/core';
import { FlowService } from '../services/flow.service';
import { Flow } from '../models/flow'


@Component({
    templateUrl: 'flows.component.html'
})
export class FlowsComponent implements OnInit {
    defaultFlows: Flow[] = [];
    userFlows: Flow[] = [];
    flowName: string = "";
    @ViewChild('fileInput') fileInput;

    constructor(
        private flowService: FlowService) { }

    ngOnInit(): void {
        this.flowService.getAll().subscribe(data => {
            this.defaultFlows = data.filter(x => x.userId === null);
            this.userFlows = data.filter(x => x.userId != null);
        });
    }

    upload() {
        let fileBrowser = this.fileInput.nativeElement;
        if (fileBrowser.files && fileBrowser.files[0]) {

            var file = fileBrowser.files[0];
            var flowService = this.flowService;
            var flowName = this.flowName;
            var userFlows = this.userFlows;
            var reader = new FileReader();
            reader.onload = function (progressEvent) {
                flowService.upload(flowName, JSON.stringify(this.result.split('\n'))).subscribe(
                    data => { userFlows.push(data); }
                );
            }
            reader.readAsText(file);
        }
    }
}
