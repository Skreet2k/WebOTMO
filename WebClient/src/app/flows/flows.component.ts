import { Component, OnInit } from '@angular/core';
import { FlowService } from '../services/flow.service';
import { Flow } from '../models/flow'


@Component({
    templateUrl: 'flows.component.html'
})
export class FlowsComponent implements OnInit {
    defaultFlows: Flow[] = [];
    userFlows: Flow[] = [];

    constructor(
        private flowService: FlowService) { }

    ngOnInit(): void {
        this.flowService.getAll().subscribe(data => {
            this.defaultFlows = data.filter(x => x.Id === 0);
            this.userFlows = data.filter(x => x.Id > 0);            
        });
    }

    login() {
        this.flowService.upload("Тестовая загрузка", "[1,2,3]")
            .subscribe(
            data => {
                console.log(data)
            },
            error => {
            });
    }
}
