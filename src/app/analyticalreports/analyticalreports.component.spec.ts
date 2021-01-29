import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticalreportsComponent } from './analyticalreports.component';

describe('AnalyticalreportsComponent', () => {
  let component: AnalyticalreportsComponent;
  let fixture: ComponentFixture<AnalyticalreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticalreportsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticalreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
