import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleModuleViewComponent } from './role-module-view.component';

describe('RoleModuleViewComponent', () => {
  let component: RoleModuleViewComponent;
  let fixture: ComponentFixture<RoleModuleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleModuleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleModuleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
