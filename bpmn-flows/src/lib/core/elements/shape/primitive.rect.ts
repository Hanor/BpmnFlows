import { PrimitiveElement } from '../primitive.element';

export class PrimitiveRect extends PrimitiveElement {
    rx: number;
    ry: number;
    type: string;
    constructor() { 
        super()
        this.rx = 2,
        this.ry = 2,
        this.type = 'rect';
        this.width = 0;
        this.height = 0;
        this.position = { x: 0, y: 0 };
        this.cssClass = 'bpmn-flows-rect';
        this.textCssClass = 'bpmn-flows-text';
        this.iconCssClass = 'bpmn-flows-task-icon';
     }
}