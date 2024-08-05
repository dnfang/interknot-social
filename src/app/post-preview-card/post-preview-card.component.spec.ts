import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPreviewCardComponent } from './post-preview-card.component';

describe('PostPreviewCardComponent', () => {
  let component: PostPreviewCardComponent;
  let fixture: ComponentFixture<PostPreviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPreviewCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostPreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
