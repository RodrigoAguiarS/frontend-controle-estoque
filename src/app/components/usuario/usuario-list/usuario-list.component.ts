import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Usuario } from '../../../model/Usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AlertaService } from '../../../services/alerta.service';
import { Perfil } from '../../../model/Perfil';
import { PerfilService } from '../../../services/perfil.service';
import { UnidadeService } from '../../../services/unidade.service';
import { Unidade } from '../../../model/Unidade';
import { TelefonePipe } from '../../../../pipe';

@Component({
  selector: 'app-usuario-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzSelectModule,
    NzPaginationModule,
    RouterModule,
    NzTagModule,
    TelefonePipe,
    NzPopconfirmModule,
    NzSkeletonModule,
    NzModalModule,
    NzAlertModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
  ],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css',
})
export class UsuarioListComponent {
  usuarios: Usuario[] = [];
  perfis: Perfil[] = [];
  unidades: Unidade[] = [];
  filtroForm!: FormGroup;
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;
  modalVisible = false;
  descricaoCompleta = '';
  nenhumResultadoEncontrado = false;

  constructor(
    private readonly tipoService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly perfilService: PerfilService,
    private readonly unidadeService: UnidadeService,
    private readonly message: NzMessageService,
    public readonly alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.formBuilder.group({
      id: [''],
      nome: [''],
      email: [''],
      telefone: [''],
      perfil: [null],
      unidade: [null],
    });
    this.alertaService.limparAlerta();
    this.buscarUsuarios();
    this.carregarPerfis();
    this.carregarUnidades();
  }

  private carregarPerfis(): void {
    this.perfilService.findAll().subscribe({
      next: (perfis) => {
        this.perfis = perfis;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  private carregarUnidades(): void {
    this.unidadeService.findAll().subscribe({
      next: (unidades) => {
        this.unidades = unidades;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  buscarUsuarios(): void {
    this.carregando = true;
    const params = {
      ...this.filtroForm.value,
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      nome: this.filtroForm.get('nome')?.value.trim().toLowerCase() ?? '',
      email: this.filtroForm.get('email')?.value.trim().toLowerCase() ?? '',
    };
    this.tipoService.buscarPaginado(params).subscribe({
      next: (response) => {
        this.usuarios = response.content;
        console.log(response);
        this.nenhumResultadoEncontrado = this.usuarios.length === 0;
        this.totalElementos = response.page.totalElements;
        this.carregando = false;
        if (this.nenhumResultadoEncontrado) {
          this.alertaService.mostrarAlerta(
            'info',
            'Nenhum resultado encontrado.'
          );
        } else {
          this.alertaService.limparAlerta();
        }
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
    });
  }

  cancel(): void {
    this.message.info('Ação Cancelada');
  }

  aoMudarPagina(pageIndex: number): void {
    this.paginaAtual = pageIndex;
    this.buscarUsuarios();
  }
}
