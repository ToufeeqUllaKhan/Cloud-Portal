import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLibraryComponent } from './client-library.component';

describe('ClientLibraryComponent', () => {
  let component: ClientLibraryComponent;
  let fixture: ComponentFixture<ClientLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
