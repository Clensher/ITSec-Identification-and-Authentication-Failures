import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincheckinComponent } from './admincheckin.component';

describe('AdmincheckinComponent', () => {
  let component: AdmincheckinComponent;
  let fixture: ComponentFixture<AdmincheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmincheckinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmincheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
