## FlowsBpmn

This is an Angular lib to render a BPMN 2.0 workflow.

Actually this lib only enable viewer.

## To install

To install this lib you only need to execute:

`npm i bpmn-flows`

## To use

This lib load a bpmn 2.0 file and render the workflow. To use this lib you need to:
- Import in your main style.scss this scss:

        @import '../node_modules/bpmn-flows/bpmn-flows.component.scss'

- Import and declare the BpmnFlowsModule in you main module:

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
        export class AppModule {}

- In your html component put this tag:

        <bpmn-flows [fileUrl] = "fileUrl"></bpmn-flows>

    Note: the fileUrl is the path of the bpmn file to be rendered

And that's is it.

## Enjoy