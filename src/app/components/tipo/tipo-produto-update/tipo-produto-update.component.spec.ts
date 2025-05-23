import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoProdutoUpdateComponent } from './tipo-produto-update.component';

describe('TipoProdutoUpdateComponent', () => {
  let component: TipoProdutoUpdateComponent;
  let fixture: ComponentFixture<TipoProdutoUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoProdutoUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoProdutoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
