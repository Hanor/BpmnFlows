import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmnFlowsComponent } from './bpmn-flows.component';

describe('BpmnFlowsComponent', () => {
  let component: BpmnFlowsComponent;
  let fixture: ComponentFixture<BpmnFlowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmnFlowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmnFlowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
