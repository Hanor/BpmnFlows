import { PrimitiveRect } from './primitive.rect';
import { LaneRect } from './lane.rect';

export class ParticipantRect extends PrimitiveRect {
    lanes: Array<LaneRect> = [];
    constructor( ) {
        super();
        this.textCssClass = 'bpmn-flows-lane-name';
    }
}