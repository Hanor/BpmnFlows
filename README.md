## BpmnFlows

BpmnFlows is an Angular lib to render a BPMN 2.0 workflow. The proposal of this lib is build a mechanism to render an existing BPMN 2.0 (.bpmn) or create a new one, enabling all the features of the bpmn 2.0 to the creation or to the edition.

In this moment, this lib only enable viewer from an existing bpmn 2.0 file.

## Status

BpmnFlows is under development and some features will come in the future. If you have some idea or got an error, please, open an issue here https://github.com/Hanor/BpmnFlows/issues. Help me to give a great BPMN 2.0 library to the Angular.

## Demo

BpmnFlows actually don't give a live demo but you can have more details to use in the repository especially in the directory bpmn-flows-demo.

## To install

To install this lib you only need to execute:

`npm i bpmn-flows`

## To use

This lib load a bpmn 2.0 file and render the workflow. To use this lib you need to:
- Import in your main style.scss this scss:

        $fa-font-path: '../../node_modules/font-awesome/fonts';
        @import '../../node_modules/font-awesome/scss/font-awesome.scss';
        @import '../../dist/bpmn-flows/bpmn-flows.component.scss';

    Note: The bpmn 2.0 types icons is from the font-awesome. Then the scss import is to load this icons to use in the  library

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

    Note: the fileUrl is the path of the bpmn file(`.bpmn`) to be rendered

And that's is it.

## Enjoy.

## To donate

https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=96LEHU7G2Z2MC

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="96LEHU7G2Z2MC">
<input type="image" src="https://www.paypalobjects.com/pt_BR/BR/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - A maneira fácil e segura de enviar pagamentos online!">
<img alt="" border="0" src="https://www.paypalobjects.com/pt_BR/i/scr/pixel.gif" width="1" height="1">
</form>
