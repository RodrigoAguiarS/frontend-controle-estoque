import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UnidadeService } from '../../../services/unidade.service';
import { EmpresaService } from '../../../services/empresa.service';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'app-unidade-delete',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCardModule,
    NzGridModule,
    NzSpinModule,
    NzSwitchModule,
  ],
  templateUrl: './unidade-delete.component.html',
  styleUrl: './unidade-delete.component.css',
})
export class UnidadeDeleteComponent {
  unidadeForm!: FormGroup;
  id!: number;
  carregando = false;
  empresas: Empresa[] = [];

  constructor(
    private readonly message: NzMessageService,
    private readonly unidadeService: UnidadeService,
    private readonly empresaService: EmpresaService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.initForm();
    this.carregarUnidade();
    this.carregarEmpresas();
  }

  private carregarEmpresas(): void {
    this.carregando = true;
    this.empresaService.findAll().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
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

  private carregarUnidade(): void {
    this.carregando = true;
    this.unidadeService.findById(this.id).subscribe({
      next: (unidades) => {
        this.unidadeForm.patchValue(unidades);
        this.unidadeForm.get('empresa')?.setValue(unidades.empresa.id);
        this.unidadeForm.disable();
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

  delete(): void {
    this.carregando = true;
    this.unidadeForm.value.id = this.id;
    this.unidadeService.delete(this.unidadeForm.value.id).subscribe({
      next: () => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'A unidade - ',
            message: 'Foi Desativada com sucesso!',
            createRoute: '/unidades/create',
            listRoute: '/unidades/list',
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
    this.unidadeForm = this.formBuilder.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      ativo: [false, Validators.required],
      empresa: [0, Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
