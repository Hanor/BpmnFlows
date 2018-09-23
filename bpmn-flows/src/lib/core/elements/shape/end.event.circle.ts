import { PrimitiveCircle } from './primitive.circle';

export class EndEventCircle extends PrimitiveCircle {
    constructor() {
        super();
        this.cssClass += ' bpmn-flows-end-event-circle';
    }
}