import { PrimitiveRect } from './primitive.rect';
import { ParticipantRect } from './participant.rect';

export class LaneRect extends PrimitiveRect {
    childLanes: Array<LaneRect> = [];
    flowRefs: Array<string> = [];
    father: LaneRect | ParticipantRect;
    constructor( ) {
        super();
        this.textCssClass = 'bpmn-flows-lane-name';
    }
}