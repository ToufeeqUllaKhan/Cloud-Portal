import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibleModulesComponent } from './accessible-modules.component';

describe('AccessibleModulesComponent', () => {
  let component: AccessibleModulesComponent;
  let fixture: ComponentFixture<AccessibleModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccessibleModulesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibleModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
