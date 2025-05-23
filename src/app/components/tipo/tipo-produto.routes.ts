import { Routes } from "@angular/router";
import { TipoProdutoCreateComponent } from "./tipo-produto-create/tipo-produto-create.component";
import { TipoProdutoListComponent } from "./tipo-produto-list/tipo-produto-list.component";

export const tipoProdutoRoutes: Routes = [
  { path: 'create', component: TipoProdutoCreateComponent },
  { path: 'list', component: TipoProdutoListComponent },
];
