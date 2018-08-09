import { SequenceFlow } from '../sequence/sequence.flow.model';
import { PrimitiveElement } from '../primitive.element';
import { BpmnTypes } from '../bpmn.types';

export class Shape {
    father: Element;
    form: string;
    id: string;
    name: string;
    position: {};
    in: Array<SequenceFlow>;
    out: Array<SequenceFlow>;
    element: PrimitiveElement;
    constructor( xmlShape ) {
        this.form = xmlShape.form;
        this.id = xmlShape.id;
        this.name = xmlShape.name;
        this.in = [];
        this.out = [];
        this.element = new BpmnTypes[ xmlShape.type ]();
    }
}