import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoProdutoDeleteComponent } from './tipo-produto-delete.component';

describe('TipoProdutoDeleteComponent', () => {
  let component: TipoProdutoDeleteComponent;
  let fixture: ComponentFixture<TipoProdutoDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoProdutoDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoProdutoDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
