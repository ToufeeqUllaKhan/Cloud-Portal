import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangehistoryComponent } from './changehistory.component';

describe('ChangehistoryComponent', () => {
  let component: ChangehistoryComponent;
  let fixture: ComponentFixture<ChangehistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangehistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
