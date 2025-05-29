import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PerfilService } from '../../../services/perfil.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';

const ROUTES = {
  HOME: '/home',
  PERFIS_LIST: '/perfis/list',
};

@Component({
  selector: 'app-perfil-delete',
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
  templateUrl: './perfil-delete.component.html',
  styleUrl: './perfil-delete.component.css'
})
export class PerfilDeleteComponent {
perfilForm!: FormGroup;
  carregando = false;
  id!: number;

  constructor(
    private readonly message: NzMessageService,
    private readonly perfilService: PerfilService,
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
    this.perfilService.findById(this.id).subscribe({
      next: (perfil) => {
        this.perfilForm.patchValue(perfil);
        this.perfilForm.disable();
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
    this.perfilForm.value.id = this.id;
    this.perfilService.delete(this.perfilForm.value.id).subscribe({
      next: () => {
        this.message.success('Tipo Produto foi desativado com sucesso!');
        this.router.navigate([ROUTES.PERFIS_LIST]);
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
    this.perfilForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      ativo: ['', Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate([ROUTES.HOME]);
  }
}

