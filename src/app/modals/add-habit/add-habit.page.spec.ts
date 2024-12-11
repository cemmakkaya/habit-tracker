import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddHabitPage } from './add-habit.page';

describe('AddHabitPage', () => {
  let component: AddHabitPage;
  let fixture: ComponentFixture<AddHabitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHabitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
