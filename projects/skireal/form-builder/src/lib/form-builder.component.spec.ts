import { TestBed, async } from '@angular/core/testing';
import { FormBuilderComponent } from './form-builder.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormBuilderComponent]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FormBuilderComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
