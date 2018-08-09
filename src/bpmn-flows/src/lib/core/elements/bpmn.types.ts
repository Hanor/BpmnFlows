import { UserTaskRect } from './shape/user.task.rect';
import { StartEventCircle } from './shape/start.event.circle';
import { EndEventCircle } from './shape/end.event.circle';
import { MultiInstanceRect } from './shape/multi.instance.rect'
import { SequenceFlowPath } from './sequence/sequence.flow.path'

export const BpmnTypes = {
    'userTask': UserTaskRect,
    'startEvent': StartEventCircle,
    'endEvent': EndEventCircle,
    'subProcess': MultiInstanceRect,
    'sequenceFlow': SequenceFlowPath
}