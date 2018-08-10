import { BehaviorSubject } from 'rxjs';
import { BpmnElements } from '../elements/bpmn.elements';

export class BpmnImporter {
    private processo;
    private diagram;
    private bpmnElements = new BpmnElements();
    bpmnElements$ = new BehaviorSubject<BpmnElements>(null);

    constructor( xml ) {
        this.getElements( xml );
    }
    private createSubProcess( dom, type ) {
        const childs = this.htmlCollectionToArray( dom.children );
        const sequenceIn = [];
        const sequenceOut = [];
        const sequences = [];

        const xmlElement = {
            form: dom.getAttribute( 'camunda:formKey' ),
            id: dom.getAttribute( 'id' ),
            name: dom.getAttribute( 'name' ),
            type: type
        };
        const shape = this.bpmnElements.createElement( xmlElement );

        childs.forEach(( child ) => {
            const tagName = child.tagName;
            
            if ( tagName === 'bpmn:incoming' ) {
                sequenceIn.push( child );
            } else if ( tagName === 'bpmn:outgoing' ) {
                sequenceOut.push( child )
            } else  if ( tagName === 'bpmn:sequenceFlow') {
                sequences.push( child )
            } else if (child.tagName !== 'bpmn:multiInstanceLoopCharacteristics') {
                this.importElement( child, shape );
            }
        });

        sequences.forEach(( sequence ) => {
            this.importSequenceFlow( sequence );   
        })
    }
    private getElements( xml ) {
        this.processo = xml.getElementsByTagName( 'bpmn:process' )[0];
        this.diagram = xml.getElementsByTagName( 'bpmndi:BPMNDiagram' )[0];
        this.processBpmnProcess();
        this.processDiagram();
        this.bpmnElements.bindElementAndSequence();
        this.bpmnElements$.next( this.bpmnElements );
    }
    private htmlCollectionToArray( doms ) {
        const childs = [];
        for( let i = 0; i < doms.length; i++ ) {
            childs.push( doms[i] )
        }
        return childs;
    }
    private importElement( dom, father) {
        const type = dom.tagName.split(':')[1];
        if ( type != 'subProcess' ) {
            try {
                const xmlElement = {
                    form: dom.getAttribute( 'camunda:formKey' ),
                    id: dom.getAttribute( 'id' ),
                    name: dom.getAttribute( 'name' ),
                    type: type
                };
                let shape = this.bpmnElements.createElement( xmlElement );
                if ( father ) {
                    shape.father = father;
                }
            } catch ( ex ) {
                console.error( "Tipo não possui shape associado." );
                console.error( ex );
            }
        } else if ( type === 'subProcess' ) {
            this.createSubProcess( dom, type );
        }
    }
    private importSequenceFlow( sequence ) {
        const source = sequence.getAttribute( 'sourceRef' );
        const target = sequence.getAttribute( 'targetRef' );
        const id = sequence.getAttribute( 'id' );

        this.bpmnElements.createSequence( id, source, target );
    }
    private processBpmnProcess() {
        const childs = this.htmlCollectionToArray( this.processo.children );
        const sequenceFlows = childs.filter(( child ) => child.tagName === 'bpmn:sequenceFlow' );
        const elements = childs.filter(( child ) => child.tagName !== 'bpmn:sequenceFlow' );

        elements.forEach(( element ) => this.importElement( element, null ));
        sequenceFlows.forEach(( sequence ) => this.importSequenceFlow( sequence ));
    }
    private processDiagram() {
        const plane = this.diagram.getElementsByTagName("bpmndi:BPMNPlane")[0];
        const childs = plane.childNodes;
        childs.forEach(( child ) => {
            if ( child.tagName ) {
                if ( child.tagName === 'bpmndi:BPMNShape' ) {
                    this.processShape( child );
                } else if ( child.tagName === 'bpmndi:BPMNEdge' ) {
                    this.processEdge( child );
                } else {
                    console.log( "Elemento do diagrama não conhecido." );
                }
            }
        })
    }
    private processEdge( child ) {
        const id = child.getAttribute( 'bpmnElement' );
        const childNodes = child.childNodes;
        
        childNodes.forEach(( node ) => {
            if ( node.tagName ) {
                if ( node.tagName === 'di:waypoint' )  {
                    const attributes = {
                        waypoints: { x: parseInt(node.getAttribute('x')), y: parseInt( node.getAttribute('y')) }
                    }
                    this.bpmnElements.setSequenceSVGAttributes( id, attributes );
                } else if( node.tagName === 'bpmndi:BPMNLabel' ) {
                    console.log( "Label do bpmn:" );
                    console.log( node );
                } else {
                    console.log("Elemento não conhecido")
                    console.log( node );
                }
            }
        })
    }
    private processShape( child ) {
        const id = child.getAttribute( 'bpmnElement' );
        const childNodes = child.childNodes;
        childNodes.forEach(( node ) => {
            if ( node.tagName ) {
                if ( node.tagName === 'dc:Bounds' ) {
                    const attributes = {
                        height: parseInt(node.getAttribute( 'height' )),
                        width: parseInt(node.getAttribute( 'width' )),
                        position: { x: parseInt(node.getAttribute( 'x' )), y: parseInt(node.getAttribute( 'y' )) }
                    }
                    this.bpmnElements.setShapeSVGAttributes( id, attributes );
                } else if( node.tagName === 'bpmndi:BPMNLabel' ) {
                    console.log( "Label do bpmn:" );
                    console.log( node );
                } else {
                    console.log("Elemento não conhecido")
                    console.log( node );
                }
            }
        })
    }
}