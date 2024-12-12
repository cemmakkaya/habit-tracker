import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HabitDocumentationPage } from './habit-documentation.page';

describe('HabitDocumentationPage', () => {
  let component: HabitDocumentationPage;
  let fixture: ComponentFixture<HabitDocumentationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitDocumentationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
