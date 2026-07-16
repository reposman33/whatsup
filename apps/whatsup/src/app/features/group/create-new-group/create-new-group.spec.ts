import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewGroup } from './create-new-group';

describe('CreateNewGroup', () => {
  let component: CreateNewGroup;
  let fixture: ComponentFixture<CreateNewGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
