import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericLogsComponent } from './generic-logs.component';

describe('GenericLogsComponent', () => {
  let component: GenericLogsComponent;
  let fixture: ComponentFixture<GenericLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
