import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaodosUserComponent } from './daodos-user.component';

describe('DaodosUserComponent', () => {
  let component: DaodosUserComponent;
  let fixture: ComponentFixture<DaodosUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaodosUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaodosUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
