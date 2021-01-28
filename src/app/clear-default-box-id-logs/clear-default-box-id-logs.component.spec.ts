import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearDefaultBoxIdLogsComponent } from './clear-default-box-id-logs.component';

describe('ClearDefaultBoxIdLogsComponent', () => {
  let component: ClearDefaultBoxIdLogsComponent;
  let fixture: ComponentFixture<ClearDefaultBoxIdLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearDefaultBoxIdLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearDefaultBoxIdLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
