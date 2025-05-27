import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { ResultComponent } from './components/result/result.component';
import { LoginComponent } from './components/login/login.component';
import { NoAuthGuard } from './auth/noauth.guard';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { ACESSO } from './model/Acesso';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  {
    path: '',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'tipos-produto',
        loadChildren: () =>
          import('./components/tipo/tipo-produto.routes').then(
            (m) => m.tipoProdutoRoutes
          ),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.SUPERADM, ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('./components/produto/produto.routes').then(
            (m) => m.produtoRoutes
          ),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.SUPERADM, ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'vendas',
        loadChildren: () =>
          import('./components/venda/venda.routes').then((m) => m.vendasRoutes),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.SUPERADM, ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'pagamentos',
        loadChildren: () =>
          import(
            './components/formadepagamento/forma-de-pagamento.routes'
          ).then((m) => m.formaPagamentoRoutes),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.SUPERADM, ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'unidades',
        loadChildren: () =>
          import(
            './components/unidade/unidade.routes'
          ).then((m) => m.unidadeRoutes),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.SUPERADM, ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'result',
        component: ResultComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
