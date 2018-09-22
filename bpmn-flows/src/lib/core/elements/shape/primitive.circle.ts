import { PrimitiveElement } from '../primitive.element';

export class PrimitiveCircle extends PrimitiveElement {
    type: string;
    ratio: number;
    constructor( ) {
        super();
        this.type = 'circle';
        this.ratio = null;
        this.position = { x: 0, y: 0 };
        this.cssClass = 'flows-io-circle';
        this.textCssClass = 'flows-io-circle-name';
    }

    setRatio(ratio: number) {
        this.width = ratio;
        this.height = ratio;
        this.ratio = ratio;
    }
}