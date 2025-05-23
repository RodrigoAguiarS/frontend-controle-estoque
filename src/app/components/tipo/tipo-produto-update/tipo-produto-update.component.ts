import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  selector: 'app-tipo-produto-update',
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
  templateUrl: './tipo-produto-update.component.html',
  styleUrl: './tipo-produto-update.component.css',
})
export class TipoProdutoUpdateComponent {
  tiposForm!: FormGroup;
  id!: number;
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly tipoProdutoService: TipoProdutoService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.initForm();
    this.carregarStatus();
  }

  private carregarStatus(): void {
    this.carregando = true;
    this.tipoProdutoService.findById(this.id).subscribe({
      next: (tipos) => {
        this.tiposForm.patchValue(tipos);
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
    this.tiposForm.value.id = this.id;
    this.tipoProdutoService.update(this.tiposForm.value).subscribe({
      next: (resposta) => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Tipo de Produto - ' + resposta.nome,
            message: 'O Tipo Produto foi atualizado com sucesso!',
            createRoute: '/tipos-produto/create',
            listRoute: '/tipos-produto/list',
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
    this.tiposForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      ativo: [false, Validators.required],
      margemLucro: [0, Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
