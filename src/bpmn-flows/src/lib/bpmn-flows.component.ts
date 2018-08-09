import { Component, OnInit, Input } from '@angular/core';
import { BpmnFlowsService } from './bpmn-flows.service';

@Component({
  selector: 'bpmn-flows',
  templateUrl: './bpmn-flows.component.html',
  styleUrls:['./bpmn-flows.component.scss']
})
export class BpmnFlowsComponent implements OnInit {
  @Input('fileUrl') fileUrl: string;
  constructor(private bpmnFlowsService: BpmnFlowsService) { }

  ngOnInit() {
    console.log("ok")
    this.bpmnFlowsService.initialize( this.fileUrl );
  }

}
