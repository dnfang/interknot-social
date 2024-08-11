import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageRecentItemComponent } from './message-recent-item.component';

describe('MessageRecentItemComponent', () => {
  let component: MessageRecentItemComponent;
  let fixture: ComponentFixture<MessageRecentItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageRecentItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageRecentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
