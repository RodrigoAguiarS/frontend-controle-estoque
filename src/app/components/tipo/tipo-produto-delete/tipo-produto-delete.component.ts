import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoProdutoService } from '../../../services/tipo-produto.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-tipo-produto-delete',
    imports: [
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
    NzCheckboxModule,
    NzCardModule,
  ],
  templateUrl: './tipo-produto-delete.component.html',
  styleUrl: './tipo-produto-delete.component.css',
})
export class TipoProdutoDeleteComponent {
  tipoProdutoForm!: FormGroup;
  carregando = false;
  id!: number;

  constructor(
    private readonly message: NzMessageService,
    private readonly tipoProdutoService: TipoProdutoService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.iniciarForm();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.iniciarForm();
    this.carregarTipos();
  }

  private carregarTipos(): void {
    this.carregando = true;
    this.tipoProdutoService.findById(this.id).subscribe({
      next: (tipoProduto) => {
        this.tipoProdutoForm.patchValue(tipoProduto);
        this.tipoProdutoForm.disable();
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
      complete: () => (this.carregando = false),
    });
  }

  delete(): void {
    this.carregando = true;
    this.tipoProdutoForm.value.id = this.id;
    this.tipoProdutoService.delete(this.tipoProdutoForm.value.id).subscribe({
      next: () => {
        this.message.success('Tipo Produto foi desativado com sucesso!');
        this.router.navigate(['/tipos-produto/list']);
      },
      error: (ex) => {
        if (ex.error.errors) {
          ex.error.errors.forEach((element: ErrorEvent) => {
            this.message.error(element.message);
            this.carregando = false;
          });
        } else {
          this.message.error(ex.error.message);
          this.carregando = false;
        }
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private iniciarForm(): void {
    this.tipoProdutoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      ativo: ['', Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
