import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudApiModulesComponent } from './cloud-api-modules.component';

describe('CloudApiModulesComponent', () => {
  let component: CloudApiModulesComponent;
  let fixture: ComponentFixture<CloudApiModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudApiModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudApiModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
