import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { ResultComponent } from './components/result/result.component';

export const routes: Routes = [
  // Rotas sem menu (exemplo: login)
  // { path: 'login', component: LoginComponent },
  {
    path: '',
    component: NavComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'tipos-produto',
        loadChildren: () =>
          import('./components/tipo/tipo-produto.routes').then(
            (m) => m.tipoProdutoRoutes
          ),
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('./components/produto/produto.routes').then(
            (m) => m.produtoRoutes
          ),
      },
      {
        path: 'result',
        component: ResultComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
