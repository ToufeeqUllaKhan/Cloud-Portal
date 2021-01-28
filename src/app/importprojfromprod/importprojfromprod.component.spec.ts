import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportprojfromprodComponent } from './importprojfromprod.component';

describe('ImportprojfromprodComponent', () => {
  let component: ImportprojfromprodComponent;
  let fixture: ComponentFixture<ImportprojfromprodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportprojfromprodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportprojfromprodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
