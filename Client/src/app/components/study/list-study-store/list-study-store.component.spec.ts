import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStudyStoreComponent } from './list-study-store.component';

describe('ListStudyStoreComponent', () => {
  let component: ListStudyStoreComponent;
  let fixture: ComponentFixture<ListStudyStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStudyStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStudyStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
