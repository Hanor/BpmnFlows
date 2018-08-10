import { PrimitiveElement } from '../primitive.element';

export class PrimitiveCircle extends PrimitiveElement {
    type: string;
    ratio: number;
    position: {x: number, y: number}
    constructor( ) {
        super(null, null );
        this.type = 'circle';
        this.ratio = null;
        this.position = { x: 0, y: 0 };
        this.cssClass = 'flows-io-circle';
    }
}