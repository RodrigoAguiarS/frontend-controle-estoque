import { Component } from '@angular/core';
import { Unidade } from '../../../model/Unidade';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Perfil } from '../../../model/Perfil';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioService } from '../../../services/usuario.service';
import { UnidadeService } from '../../../services/unidade.service';
import { PerfilService } from '../../../services/perfil.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-usuario-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCardModule,
    NzSpinModule,
    NzGridModule,
    NgxMaskDirective,
  ],
  templateUrl: './usuario-create.component.html',
  styleUrl: './usuario-create.component.css',
})
export class UsuarioCreateComponent {
  usuarioForm!: FormGroup;
  unidades: Unidade[] = [];
  perfis: Perfil[] = [];
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly produtoService: UsuarioService,
    private readonly unidadeService: UnidadeService,
    private readonly perfilService: PerfilService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarPerfis();
    this.carregarUnidades();
  }

  criar(): void {
    if (this.usuarioForm.valid) {
      this.carregando = true;
      this.produtoService.create(this.usuarioForm.value).subscribe({
        next: (resposta) => {
          console.log(resposta);
          this.router.navigate(['/result'], {
            queryParams: {
              type: 'success',
              title: 'Usuário de nome - ' + resposta.pessoa.nome,
              message: 'Foi criado com sucesso!',
              createRoute: '/usuarios/create',
              listRoute: '/usuarios/list',
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
            this.carregando = false;
          }
        },
        complete: () => {
          this.carregando = false;
        },
      });
    }
  }

  private carregarUnidades(): void {
    this.carregando = true;
    this.unidadeService.findAll().subscribe({
      next: (response) => {
        this.unidades = response;
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

  private carregarPerfis(): void {
    this.carregando = true;
    this.perfilService.findAll().subscribe({
      next: (response) => {
        this.perfis = response;
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

  private initForm(): void {
    this.usuarioForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.maxLength(50)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      telefone: ['', Validators.required],
      perfil: [null, Validators.required],
      unidade: [null, Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
