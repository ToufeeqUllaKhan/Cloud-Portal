import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleModulePermissionComponent } from './edit-role-module-permission.component';

describe('EditRoleModulePermissionComponent', () => {
  let component: EditRoleModulePermissionComponent;
  let fixture: ComponentFixture<EditRoleModulePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRoleModulePermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoleModulePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
