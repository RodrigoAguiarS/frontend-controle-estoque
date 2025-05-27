import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeDeleteComponent } from './unidade-delete.component';

describe('UnidadeDeleteComponent', () => {
  let component: UnidadeDeleteComponent;
  let fixture: ComponentFixture<UnidadeDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadeDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
