import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CecEdidViewComponent } from './cec-edid-view.component';

describe('CecEdidViewComponent', () => {
  let component: CecEdidViewComponent;
  let fixture: ComponentFixture<CecEdidViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CecEdidViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CecEdidViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
