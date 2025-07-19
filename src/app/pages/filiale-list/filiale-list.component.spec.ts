import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilialeListComponent } from './filiale-list.component';

describe('FilialeListComponent', () => {
  let component: FilialeListComponent;
  let fixture: ComponentFixture<FilialeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilialeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilialeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
