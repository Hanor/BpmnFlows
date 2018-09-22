import { PrimitiveSequence } from './primitive.sequence';

export class SequenceFlowPath extends PrimitiveSequence {
    constructor() {
        super();
        this.cssClass = 'flows-io-path';
        this.textCssClass = 'flows-io-path-name';
    }
}