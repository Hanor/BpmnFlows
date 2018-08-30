import { BehaviorSubject } from 'rxjs';
import { BpmnElements } from '../elements/bpmn.elements';
import { MultiInstanceRect } from '../elements/shape/multi.instance.rect';
import { Shape } from '../elements/shape/shape.model';
import { LaneRect } from '../elements/shape/lane.rect';

export class BpmnImporter {
    private process;
    private diagram;
    private collaboration;
    private bpmnElements = new BpmnElements();
    bpmnElements$ = new BehaviorSubject<BpmnElements>(null);

    constructor(xml) {
        this.getElements(xml);
    }
    private createLane(dom: any, type: string, father: any): Shape {
        const childs = this.htmlCollectionToArray( dom.children );
        if (type === 'laneSet') {
            for (let lane of childs) {
                this.importElement(lane, null);
            }
            return;
        }
        
        const xmlElement = {
            id: dom.getAttribute( 'id' ),
            name: dom.getAttribute( 'name' ),
            type: type
        };
        const shape = this.bpmnElements.createElement(xmlElement);
        const element = <LaneRect>shape.element;

        if ( father ) {
            shape.father = father;
        }

        for (let child of childs) {
            if (child.tagName === 'bpmn:flowNodeRef') {
                element.flowRefs.push(child.childNodes[0]);
            } else if (child.tagName === 'bpmn:childLaneSet') {
                const laneChilds = this.htmlCollectionToArray( child.children );
                for (let laneChild of laneChilds) {
                    shape.childrens.push(this.importElement(laneChild, shape));
                }
            }
        }
        return shape;
    }
    private createShape(dom: any, type: string, father: any): Shape {
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
            return shape;
        } catch ( ex ) {
            console.warn(dom);
            console.warn('Tipo não possui shape associado: ' + type);
        }
    }
    private createSubProcess(dom: any, type: string, father: any): Shape {
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
        const shape: Shape = this.bpmnElements.createElement( xmlElement );

        if ( father ) {
            shape.father = father;
        }

        childs.forEach(( child ) => {
            const tagName = child.tagName;       
            if ( tagName === 'bpmn:incoming' ) {
                sequenceIn.push( child );
            } else if ( tagName === 'bpmn:outgoing' ) {
                sequenceOut.push( child )
            } else  if ( tagName === 'bpmn:sequenceFlow') {
                sequences.push( child )
            } else if (child.tagName !== 'bpmn:multiInstanceLoopCharacteristics') {
                shape.childrens.push(this.importElement( child, shape ));
            }
        });

        sequences.forEach(( sequence ) => {
            this.importSequenceFlow( sequence );   
        })
        return shape;
    }
    private getElements(xml: any): void {
        this.collaboration = xml.getElementsByTagName('bpmn:collaboration')[0];
        this.process = xml.getElementsByTagName('bpmn:process')[0];
        this.diagram = xml.getElementsByTagName('bpmndi:BPMNDiagram')[0];
        this.processCollaboration();
        this.processBpmnProcess();
        this.processDiagram();
        this.bpmnElements.bindElementAndSequence();
        this.bpmnElements$.next(this.bpmnElements);
    }
    private getNodePosition(node: any): any {
        return {x: parseInt(node.getAttribute('x')), y: parseInt( node.getAttribute('y'))}
    }
    private htmlCollectionToArray(doms: any): any {
        const childs = [];
        for( let i = 0; i < doms.length; i++ ) {
            childs.push( doms[i] )
        }
        return childs;
    }
    private importElement(dom: any, father: any): Shape {
        const type = dom.tagName.split(':')[1];
        if (type === 'subProcess') {
            return this.createSubProcess(dom, type, father);
        } else if (type === 'laneSet' || type === 'lane') {
            return this.createLane(dom, type, father);
        } else {
            return this.createShape(dom, type, father);
        }
    }
    private importSequenceFlow(sequence: any): void {
        const source: string = sequence.getAttribute('sourceRef');
        const target: string = sequence.getAttribute('targetRef');
        const id: string = sequence.getAttribute('id');
        const name: string = sequence.getAttribute('name')

        this.bpmnElements.createSequence(id, name, source, target);
    }
    private processCollaboration(): void {
        const childs: any = this.htmlCollectionToArray( this.collaboration.children );
        for (let child of childs) {
            if ( child.tagName === 'bpmn:participant' ) {
                this.importElement( child, null );
            } else {
                console.warn('Collaboration not known: ' + child.tagName);
            }
        }
    }
    private processBpmnProcess(): void {
        const childs: any = this.htmlCollectionToArray( this.process.children );
        const sequenceFlows: any = childs.filter(( child ) => child.tagName === 'bpmn:sequenceFlow' );
        const elements: any = childs.filter(( child ) => child.tagName !== 'bpmn:sequenceFlow' );
        
        this.bpmnElements.processId = this.process.getAttribute('id');
        this.bpmnElements.processName = this.process.getAttribute('name');

        elements.forEach(( element ) => this.importElement( element, null ));
        sequenceFlows.forEach(( sequence ) => this.importSequenceFlow( sequence ));
    }
    private processDiagram(): void{
        const plane = this.diagram.getElementsByTagName('bpmndi:BPMNPlane')[0];
        const childs = plane.childNodes;
        childs.forEach((child) => {
            if (child.tagName) {
                if (child.tagName === 'bpmndi:BPMNShape') {
                    this.processShapes(child);
                } else if (child.tagName === 'bpmndi:BPMNEdge') {
                    this.processSequences(child);
                } else {
                    console.warn('Elemento do diagrama não conhecido: ' + child.tagName);
                }
            }
        })
    }
    private processSequences(child): void{
        const id = child.getAttribute( 'bpmnElement' );
        const childNodes = child.childNodes;
        
        childNodes.forEach(( node ) => {
            this.processSequenceChild(id, node);
        })
    }

    private processSequenceChild(id: string, node: any) {
        if (node.nodeName !== '#text') {
            if (node.tagName === 'di:waypoint')  {
                let position = this.getNodePosition(node);
                this.bpmnElements.setSequenceWaypoints(id, position);
            } else if(  node.tagName === 'bpmndi:BPMNLabel') {
                let position = this.getNodePosition(node.childNodes[1]);
                this.bpmnElements.setSequenceNamePlacement(id, position);
            }
        }
    }
    private processShapes(child: any): void {
        const id: any = child.getAttribute( 'bpmnElement' );
        const childNodes: any = child.childNodes;
        childNodes.forEach(( node ) => {
            this.processShapeChild(id, node);
        })
    }
    private processShapeChild(id: string, node: any) {
        if (node.nodeName !== '#text') {
            if (node.tagName === 'dc:Bounds') {
                let position: any = this.getNodePosition(node);
                let height: number = parseInt(node.getAttribute( 'height' ));
                let width: number = parseInt(node.getAttribute( 'width' ));
                this.bpmnElements.setShapeAttributes(id, width, height, position);
            } else if (node.tagName === 'bpmndi:BPMNLabel') {
                let position = this.getNodePosition(node.childNodes[1]);
                this.bpmnElements.setShapeNamePlacement(id, position);
            } else {
                console.warn(node);
                console.warn('Elemento não conhecido.')
            }
        }
    }
}