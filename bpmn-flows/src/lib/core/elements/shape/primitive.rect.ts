import { PrimitiveElement } from '../primitive.element';

export class PrimitiveRect extends PrimitiveElement {
    height: number;
    icon: string;
    iconCssClass: string;
    position: { x: number, y: number };
    rx: number;
    ry: number;
    textCssClass: string;
    type: string;
    width: number;
    constructor() { 
        super(null, null)
        this.rx = 2,
        this.ry = 2,
        this.type = 'rect';
        this.width = 0;
        this.height = 0;
        this.position = { x: 0, y: 0 };
        this.cssClass = 'flows-io-rect';
        this.textCssClass = 'flows-io-text';
        this.iconCssClass = 'flows-io-task-icon';
     }
}