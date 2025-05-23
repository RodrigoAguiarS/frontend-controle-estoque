import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoProdutoListComponent } from './tipo-produto-list.component';

describe('TipoProdutoListComponent', () => {
  let component: TipoProdutoListComponent;
  let fixture: ComponentFixture<TipoProdutoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoProdutoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoProdutoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
