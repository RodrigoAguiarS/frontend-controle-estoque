import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormaDePagamentoService } from '../../../services/forma-de-pagamento.service';

@Component({
  selector: 'app-formadepagamento-update',
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
  templateUrl: './formadepagamento-update.component.html',
  styleUrl: './formadepagamento-update.component.css',
})
export class FormadepagamentoUpdateComponent {
  formDePagamentoForm!: FormGroup;
  id!: number;
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly formaDePagamentoService: FormaDePagamentoService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.initForm();
    this.carregarFormaDePagamento();
  }

  private carregarFormaDePagamento(): void {
    this.carregando = true;
    this.formaDePagamentoService.findById(this.id).subscribe({
      next: (tipos) => {
        this.formDePagamentoForm.patchValue(tipos);
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  update(): void {
    this.carregando = true;
    this.formDePagamentoForm.value.id = this.id;
    this.formaDePagamentoService.update(this.formDePagamentoForm.value).subscribe({
      next: (resposta) => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Forma de Pagamento - ' + resposta.nome,
            message: 'Forma de Pagamento foi atualizado com sucesso!',
            createRoute: '/pagamentos/create',
            listRoute: '/pagamentos/list',
          },
        });
      },
      error: (ex) => {
        if (ex.error.errors) {
          ex.error.errors.forEach((element: ErrorEvent) => {
            this.message.error(element.message);
          });
        } else {
          this.message.error(ex.error.message);
        }
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private initForm(): void {
    this.formDePagamentoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      ativo: [false, Validators.required],
      porcentagemAcrescimo: [0, Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
