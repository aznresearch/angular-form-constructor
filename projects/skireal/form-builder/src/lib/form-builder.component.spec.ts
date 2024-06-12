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

  it(`should have as title 'formBuilder'`, () => {
    const fixture = TestBed.createComponent(FormBuilderComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('formBuilder');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(FormBuilderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain(
      'formBuilder app is running!'
    );
  });
});
