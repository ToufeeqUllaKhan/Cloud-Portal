import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportConfigurationListComponent } from './report-configuration-list.component';

describe('ReportConfigurationListComponent', () => {
  let component: ReportConfigurationListComponent;
  let fixture: ComponentFixture<ReportConfigurationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportConfigurationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportConfigurationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
