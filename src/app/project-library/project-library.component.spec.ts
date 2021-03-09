import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLibraryComponent } from './project-library.component';

describe('ProjectLibraryComponent', () => {
  let component: ProjectLibraryComponent;
  let fixture: ComponentFixture<ProjectLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
