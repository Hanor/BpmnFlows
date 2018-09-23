import { PrimitiveSequence } from './primitive.sequence';

export class SequenceFlowPath extends PrimitiveSequence {
    constructor() {
        super();
        this.cssClass = 'bpmn-flows-path';
        this.textCssClass = 'bpmn-flows-path-name';
    }
}