import { TestBed, inject } from '@angular/core/testing';

import { BpmnFlowsService } from './bpmn-flows.service';

describe('BpmnFlowsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BpmnFlowsService]
    });
  });

  it('should be created', inject([BpmnFlowsService], (service: BpmnFlowsService) => {
    expect(service).toBeTruthy();
  }));
});
