import { Component } from '@angular/core';
import { UnidadeService } from '../../../services/unidade.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Empresa } from '../../../model/Empresa';
import { EmpresaService } from '../../../services/empresa.service';

@Component({
  selector: 'app-unidade-update',
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
  templateUrl: './unidade-update.component.html',
  styleUrl: './unidade-update.component.css'
})
export class UnidadeUpdateComponent {

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
        console.log(unidades);
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
    this.unidadeForm.value.id = this.id;
    this.unidadeService.update(this.unidadeForm.value).subscribe({
      next: (resposta) => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'A unidade - ' + resposta.nome,
            message: 'foi atualizado com sucesso!',
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

