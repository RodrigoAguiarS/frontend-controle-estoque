import { Routes } from "@angular/router";
import { TipoProdutoCreateComponent } from "./tipo-produto-create/tipo-produto-create.component";
import { TipoProdutoListComponent } from "./tipo-produto-list/tipo-produto-list.component";
import { TipoProdutoUpdateComponent } from "./tipo-produto-update/tipo-produto-update.component";
import { TipoProdutoDeleteComponent } from "./tipo-produto-delete/tipo-produto-delete.component";

export const tipoProdutoRoutes: Routes = [
  { path: 'create', component: TipoProdutoCreateComponent },
  { path: 'list', component: TipoProdutoListComponent },
  { path: 'update/:id', component: TipoProdutoUpdateComponent },
  { path: 'delete/:id', component: TipoProdutoDeleteComponent },
];
