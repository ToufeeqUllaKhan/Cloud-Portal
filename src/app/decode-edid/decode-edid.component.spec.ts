import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecodeEdidComponent } from './decode-edid.component';

describe('DecodeEdidComponent', () => {
  let component: DecodeEdidComponent;
  let fixture: ComponentFixture<DecodeEdidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecodeEdidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecodeEdidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
