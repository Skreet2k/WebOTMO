import { Component, OnInit, ViewChild } from '@angular/core';
import { FlowService, Flow } from '../flow.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'flowConfigPage.component.html'
})
export class FlowConfigPageComponent implements OnInit {
    @ViewChild('fileInput') fileInput;
    
    public flow: Flow = new Flow();
    public isLoading: boolean = false;
  
    constructor (
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly flowService: FlowService
    ) {
    }

    public ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.isLoading = true;    
        this.flowService.getById(id).then(data => { 
            this.flow = data; 
            this.isLoading = false; 
        });
    }

    public update() {
        this.isLoading = true;
        const fileBrowser = this.fileInput.nativeElement;
        const file = fileBrowser.files[0];
        if (file != null) {
            const reader = new FileReader();
            reader.onload = () => {
                this.flow.data = JSON.stringify(reader.result.split('\n'));
                const isValid = this.flowService.validate(this.flow);
                if (isValid) {
                    this.flowService.update(this.flow).then(() => 
                        this.redirectToFlowsPage()
                    );
                }
                this.isLoading = false;        
            };
            reader.readAsText(file);
            return;
        }
        this.flowService.update(this.flow).then(() => { 
            this.redirectToFlowsPage(); 
            this.isLoading = false
        });
    }

    public remove() {
        this.isLoading = true;
        this.flowService.remove(this.flow).then(() => { 
            this.redirectToFlowsPage(); 
            this.isLoading = false
        });
    }

    public redirectToFlowsPage() {
        this.router.navigate(['/main/flows']);
    }
}
