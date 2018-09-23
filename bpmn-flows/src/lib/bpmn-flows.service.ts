import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BpmnImporter } from './core/importer/bpmn.importer';
import { Scene } from './core/scene/scene';
import { BpmnElements } from './core/elements/bpmn.elements';


@Injectable({
  providedIn: 'root'
})
export class BpmnFlowsService {
  bpmnElements: BpmnElements;
  bpmnImporter: BpmnImporter;
  scene: Scene;
  constructor( private http: HttpClient ) {}

  initialize( bpmnFile: string ) {
      this.getBpmnDiagram( bpmnFile );
  }
  bpmnDiagramParser( text ) {
      const parser = new DOMParser();
      const xml = parser.parseFromString( text, "text/xml" );
      this.bpmnImporter = new BpmnImporter( xml );
      this.eventImportedBpmn();
  }
  eventImportedBpmn() {
      this.bpmnImporter.bpmnElements$.subscribe(( bpmnElements ) => {
          this.bpmnElements = bpmnElements;
          if ( this.bpmnElements ) {
              this.renderBpmn();
          }
      })
  }
  eventRenderedBpmn() {
      this.scene.loaded$.subscribe(( loaded ) => {
          if ( loaded ) {
              
          }
      })
  }
  getBpmnDiagram( bpmnFilePath ) {
      this.http.get( bpmnFilePath,  {responseType: 'text'}).subscribe(( response ) => {
          this.bpmnDiagramParser( response );
      })
  }
  renderBpmn() {
      this.scene = new Scene( this.bpmnElements, 'bpmn-flows-container' );
      this.scene.init();
      this.eventRenderedBpmn();
  }
}
