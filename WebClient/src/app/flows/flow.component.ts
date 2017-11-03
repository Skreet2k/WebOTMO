import { Component, OnInit, ViewChild } from '@angular/core';
import { FlowService } from '../services/flow.service';
import { Flow } from '../models/flow'
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    templateUrl: 'flow.component.html'
})
export class FlowComponent implements OnInit {
    flow: Flow = new Flow();
    @ViewChild('fileInput') fileInput;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private flowService: FlowService
    ) { }

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.flowService.getById(id).subscribe(data => this.flow = data);
    }

    update() {
        let fileBrowser = this.fileInput.nativeElement;
        if (fileBrowser.files && fileBrowser.files[0]) {

            var file = fileBrowser.files[0];
            var flowService = this.flowService;
            var reader = new FileReader();
            var flow = this.flow;
            var router = this.router;
            reader.onload = function (progressEvent) {
                flow.Data = JSON.stringify(this.result.split('\n'));
                flowService.update(flow).subscribe(() =>
                    router.navigate(['/main/flows'])
                );
            }
            reader.readAsText(file);
            return;
        }
        this.flowService.update(this.flow).subscribe(() =>
            this.router.navigate(['/main/flows']));
    }

    cancel() {
        this.router.navigate(['/main/flows']);
    }
}
