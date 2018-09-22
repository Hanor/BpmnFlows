import { PrimitiveElement } from '../primitive.element';

export class PrimitiveRhombus extends PrimitiveElement {
    height: number;
    icon: string;
    iconCssClass: string;
    rx: number;
    ry: number;
    textX: number;
    textY: number;
    textCssClass: string;
    type: string;
    width: number;
    points: string;
    constructor() { 
        super();
        this.rx = 2,
        this.ry = 2,
        this.type = 'polygon';
        this.width = 0;
        this.height = 0;
        this.position = { x: 0, y: 0 };
        this.points = '';
        this.textCssClass = 'flows-io-text';
        this.cssClass = 'flows-io-gateway';
        this.iconCssClass = 'flows-io-gateway-icon';
     }
}