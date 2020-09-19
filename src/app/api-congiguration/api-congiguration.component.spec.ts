import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiCongigurationComponent } from './api-congiguration.component';

describe('ApiCongigurationComponent', () => {
  let component: ApiCongigurationComponent;
  let fixture: ComponentFixture<ApiCongigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiCongigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiCongigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
