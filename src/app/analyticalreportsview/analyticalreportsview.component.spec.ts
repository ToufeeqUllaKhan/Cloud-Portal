import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticalreportsviewComponent } from './analyticalreportsview.component';

describe('AnalyticalreportsviewComponent', () => {
  let component: AnalyticalreportsviewComponent;
  let fixture: ComponentFixture<AnalyticalreportsviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticalreportsviewComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticalreportsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
