import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedQuestionsComponent } from './created-questions.component';

describe('CreatedQuestionsComponent', () => {
  let component: CreatedQuestionsComponent;
  let fixture: ComponentFixture<CreatedQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatedQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
