import { NgModule } from '@angular/core';
import { BpmnFlowsComponent } from './bpmn-flows.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [ HttpClient ],
  declarations: [BpmnFlowsComponent],
  exports: [BpmnFlowsComponent]
})
export class BpmnFlowsModule { }
