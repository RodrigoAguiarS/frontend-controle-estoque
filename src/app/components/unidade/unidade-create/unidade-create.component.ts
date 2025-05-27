import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UnidadeService } from '../../../services/unidade.service';
import { Router } from '@angular/router';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../model/Empresa';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-unidade-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NgxMaskDirective,
    NzCardModule,
    NzGridModule,
    NzSpinModule,
    NzSwitchModule,
  ],
  templateUrl: './unidade-create.component.html',
  styleUrl: './unidade-create.component.css',
})
export class UnidadeCreateComponent {
  unidadeForm!: FormGroup;
  carregando = false;
  empresas: Empresa[] = [];

  constructor(
    private readonly message: NzMessageService,
    private readonly unidadeService: UnidadeService,
    private readonly empresaService: EmpresaService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarEmpresas();
  }

  criar(): void {
    this.carregando = true;
    this.unidadeService.create(this.unidadeForm.value).subscribe({
      next: (resposta) => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'A Unidade - ' + resposta.nome,
            message: 'foi criado com sucesso!',
            createRoute: '/unidades/create',
            listRoute: '/unidades/list',
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

  private carregarEmpresas(): void {
    this.carregando = true;
    this.empresaService.findAll().subscribe({
      next: (response) => {
        this.empresas = response;
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
    this.unidadeForm = this.formBuilder.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      empresa: [0, Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
