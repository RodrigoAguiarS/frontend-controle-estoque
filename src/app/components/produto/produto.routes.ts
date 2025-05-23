import { Routes } from "@angular/router";
import { ProdutoCreateComponent } from "./produto-create/produto-create.component";
import { ProdutoListComponent } from "./produto-list/produto-list.component";
import { ProdutoUpdateComponent } from "./produto-update/produto-update.component";
import { ProdutoDeleteComponent } from "./produto-delete/produto-delete.component";

export const produtoRoutes: Routes = [
  { path: 'create', component: ProdutoCreateComponent },
  { path: 'list', component: ProdutoListComponent },
  { path: 'update/:id', component: ProdutoUpdateComponent },
  { path: 'delete/:id', component: ProdutoDeleteComponent },
];
