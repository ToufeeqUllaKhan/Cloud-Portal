import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdCecEdidHistoryComponent } from './prod-cec-edid-history.component';

describe('ProdCecEdidHistoryComponent', () => {
  let component: ProdCecEdidHistoryComponent;
  let fixture: ComponentFixture<ProdCecEdidHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdCecEdidHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdCecEdidHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
