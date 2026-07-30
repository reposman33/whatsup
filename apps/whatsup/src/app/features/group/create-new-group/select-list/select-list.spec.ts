import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectList } from './select-list';

describe('SelectList', () => {
  let component: SelectList;
  let fixture: ComponentFixture<SelectList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
