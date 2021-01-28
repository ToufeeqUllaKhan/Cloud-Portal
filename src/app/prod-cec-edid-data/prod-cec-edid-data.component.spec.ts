import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdCecEdidDataComponent } from './prod-cec-edid-data.component';

describe('ProdCecEdidDataComponent', () => {
  let component: ProdCecEdidDataComponent;
  let fixture: ComponentFixture<ProdCecEdidDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdCecEdidDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdCecEdidDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
