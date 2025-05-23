import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormaDePagamentoService } from '../../../services/forma-de-pagamento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-formadepagamento-delete',
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
  templateUrl: './formadepagamento-delete.component.html',
  styleUrl: './formadepagamento-delete.component.css'
})
export class FormadepagamentoDeleteComponent {

  formaDepagamentoForm!: FormGroup;
  carregando = false;
  id!: number;

  constructor(
    private readonly message: NzMessageService,
    private readonly tipoProdutoService: FormaDePagamentoService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.iniciarForm();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.iniciarForm();
    this.carregarFormaDePagamento();
  }

  private carregarFormaDePagamento(): void {
    this.carregando = true;
    this.tipoProdutoService.findById(this.id).subscribe({
      next: (tipoProduto) => {
        this.formaDepagamentoForm.patchValue(tipoProduto);
        this.formaDepagamentoForm.disable();
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
    this.formaDepagamentoForm.value.id = this.id;
    this.tipoProdutoService.delete(this.formaDepagamentoForm.value.id).subscribe({
      next: () => {
        this.message.success('Tipo Produto foi desativado com sucesso!');
        this.router.navigate(['/pagamentos/list']);
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
    this.formaDepagamentoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      ativo: ['', Validators.required],
      porcentagemAcrescimo: ['', Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
