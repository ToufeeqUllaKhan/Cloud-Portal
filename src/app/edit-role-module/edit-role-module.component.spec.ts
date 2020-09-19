import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleModuleComponent } from './edit-role-module.component';

describe('EditRoleModuleComponent', () => {
  let component: EditRoleModuleComponent;
  let fixture: ComponentFixture<EditRoleModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRoleModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoleModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
