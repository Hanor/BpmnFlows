import { UserTaskRect } from './shape/user.task.rect';
import { StartEventCircle } from './shape/start.event.circle';
import { EndEventCircle } from './shape/end.event.circle';
import { MultiInstanceRect } from './shape/multi.instance.rect'
import { SequenceFlowPath } from './sequence/sequence.flow.path'
import { ExclusiveGatewayRhombus } from './shape/exclusive.gateway.rhombus';
import { ParallelGatewayRhombus } from './shape/parallel.gateway.rhombus';
import { ManualTaskRect } from './shape/manual.task.rect';
import { ScriptTaskRect } from './shape/script.task.rect';
import { LaneRect } from './shape/lane.rect';
import { ParticipantRect } from './shape/participant.rect';

export const BpmnTypes = {
    'userTask': UserTaskRect,
    'scriptTask': ScriptTaskRect,
    'manualTask': ManualTaskRect,
    'startEvent': StartEventCircle,
    'endEvent': EndEventCircle,
    'subProcess': MultiInstanceRect,
    'sequenceFlow': SequenceFlowPath,
    'exclusiveGateway': ExclusiveGatewayRhombus,
    'parallelGateway': ParallelGatewayRhombus,
    'lane': LaneRect,
    'participant': ParticipantRect
}