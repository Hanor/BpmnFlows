import { PrimitiveCircle } from './primitive.circle';

export class EndEventCircle extends PrimitiveCircle {
    constructor() {
        super();
        this.cssClass += ' flows-io-end-event-circle';
    }
}