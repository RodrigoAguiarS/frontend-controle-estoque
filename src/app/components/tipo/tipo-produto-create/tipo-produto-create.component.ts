import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TipoProdutoService } from '../../../services/tipo-produto.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';


@Component({
  selector: 'app-tipo-produto-create',
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
  templateUrl: './tipo-produto-create.component.html',
  styleUrl: './tipo-produto-create.component.css',
})
export class TipoProdutoCreateComponent {
  tiposForm!: FormGroup;
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly tipoService: TipoProdutoService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  criar(): void {
    this.carregando = true;
    this.tipoService.create(this.tiposForm.value).subscribe({
      next: (resposta) => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Status - ' + resposta.nome,
            message: 'A Status foi criado com sucesso!',
            createRoute: '/status/create',
            listRoute: '/status/list',
          },
        });
      },
      error: (ex) => {
        if (ex.error.errors) {
          ex.error.errors.forEach((element: ErrorEvent) => {
            this.message.error(element.message);
            this.carregando = false;
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
