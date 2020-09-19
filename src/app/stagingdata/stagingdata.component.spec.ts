import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StagingdataComponent } from './stagingdata.component';

describe('StagingdataComponent', () => {
  let component: StagingdataComponent;
  let fixture: ComponentFixture<StagingdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StagingdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StagingdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
