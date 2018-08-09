import { Shape } from '../shape/shape.model';
import { PrimitiveSequence } from './primitive.sequence';
import { SequenceFlowPath } from './sequence.flow.path';

export class SequenceFlow {
    source: Shape;
    target: Shape;
    id: string;
    element: PrimitiveSequence;
    constructor( id: string, source: Shape, target: Shape ) {
        this.id = id;
        this.source = source;
        this.target = target;
        this.element = new SequenceFlowPath();
    }
}