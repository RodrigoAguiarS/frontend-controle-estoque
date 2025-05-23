import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoProdutoCreateComponent } from './tipo-produto-create.component';

describe('TipoProdutoCreateComponent', () => {
  let component: TipoProdutoCreateComponent;
  let fixture: ComponentFixture<TipoProdutoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoProdutoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoProdutoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
