import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';
import { StateManagerServiceService } from '../../services/state-manager-service.service';
import { Usuario } from '../../model/Usuario';
import { ACESSO } from '../../model/Acesso';
import { UsuarioService } from '../../services/usuario.service';
import { Pessoa } from '../../model/Pessoa';

@Component({
  selector: 'app-nav',
  imports: [
    NzLayoutModule,
    CommonModule,
    NzMenuModule,
    RouterModule,
    NzIconModule,
    NzBadgeModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  isCollapsed = false;
  ACESSO = ACESSO;
  roles: string[] = [];
  usuario: Usuario = new Usuario();
  pessoa: Pessoa = new Pessoa();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
    private readonly stateService: StateManagerServiceService,
    private readonly message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.carregarUsuario();
    this.stateService.stateChanged$.subscribe(() => {
      this.carregarUsuario();
    });
  }

  private carregarUsuario(): void {
    this.usuarioService.usuarioLogado().subscribe({
      next: (usuario: Usuario | null) => {
        if (usuario) {
          this.usuario = usuario;
          this.pessoa = usuario.pessoa;
          this.roles = usuario.perfis.map((perfil) => perfil.nome);
        }
      },
      error: (error) => {
        this.message.error(error.error.message);
      },
      complete: () => {
        console.log('Usuário carregado:', this.usuario);
      },
    });
  }

  onCollapse(collapsed: boolean): void {
    requestAnimationFrame(() => {
      this.isCollapsed = collapsed;
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    console.log('Tecla pressionada:', event.key);
  }

  deslogar(): void {
    this.authService.logout();
    this.router.navigate(['login']);
    this.message.info('Usuário deslogado com sucesso');
  }
}
