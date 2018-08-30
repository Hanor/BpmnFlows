import { PrimitiveElement } from '../primitive.element';

export class PrimitiveSequence extends PrimitiveElement {
    waypoints: Array<any>;
    constructor() {
        super();
        this.waypoints = [];
    }
}