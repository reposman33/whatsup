import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsUp } from './whats-up';

describe('WhatsUp', () => {
  let component: WhatsUp;
  let fixture: ComponentFixture<WhatsUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsUp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsUp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
