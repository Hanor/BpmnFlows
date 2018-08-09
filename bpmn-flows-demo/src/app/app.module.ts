import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BpmnFlowsModule } from 'bpmn-flows';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BpmnFlowsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
