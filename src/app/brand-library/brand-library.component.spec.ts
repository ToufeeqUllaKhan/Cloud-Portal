import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandLibraryComponent } from './brand-library.component';

describe('BrandLibraryComponent', () => {
  let component: BrandLibraryComponent;
  let fixture: ComponentFixture<BrandLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
