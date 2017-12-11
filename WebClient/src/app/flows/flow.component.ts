import { Component, OnInit, ViewChild } from '@angular/core';
import { FlowService } from '../services/flow.service';
import { Flow } from '../models/flow';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'flow.component.html'
})
export class FlowComponent implements OnInit {
  flow: Flow = new Flow();
  @ViewChild('fileInput') fileInput;
  isLoading: boolean = false;
  isUpdate: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flowService: FlowService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;    
    this.flowService.getById(id).subscribe(data => {this.flow = data; this.isLoading = false;});
  }

  update() {
    const fileBrowser = this.fileInput.nativeElement;
    this.isUpdate = true;
    const that = this;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const file = fileBrowser.files[0];
      const flowService = this.flowService;
      const reader = new FileReader();
      const flow = this.flow;
      const router = this.router;
      reader.onload = function(progressEvent) {
        flow.data = JSON.stringify(this.result.split('\n'));
        const isValid = flowService.validate(flow);
        if (isValid) {
          flowService.update(flow).subscribe(() => router.navigate(['/main/flows']));
        }
        that.isUpdate = false;        
      };
      reader.readAsText(file);
      return;
    }
    this.flowService
      .update(this.flow)
      .subscribe(() => {this.router.navigate(['/main/flows']); this.isUpdate = false});
  }

  cancel() {
    this.router.navigate(['/main/flows']);
  }
}
