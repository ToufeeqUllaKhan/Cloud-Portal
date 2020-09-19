import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectVersionComponent } from './add-project-version.component';

describe('AddProjectVersionComponent', () => {
  let component: AddProjectVersionComponent;
  let fixture: ComponentFixture<AddProjectVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProjectVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
