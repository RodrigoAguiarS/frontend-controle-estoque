import { Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { NavComponent } from "./components/nav/nav.component";

export const routes: Routes = [
  // Rotas sem menu (exemplo: login)
  // { path: 'login', component: LoginComponent },

  // Rotas com menu (NavComponent)
  {
    path: '',
    component: NavComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'tipos-produto',
        loadChildren: () =>
          import('./components/tipo/tipo-produto.routes').then(m => m.tipoProdutoRoutes)
      },
      // Outras rotas internas...
    ]
  },
  { path: '**', redirectTo: 'home' }
];
