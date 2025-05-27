import { Routes } from "@angular/router";
import { UnidadeCreateComponent } from "./unidade-create/unidade-create.component";
import { UnidadeListComponent } from "./unidade-list/unidade-list.component";
import { UnidadeUpdateComponent } from "./unidade-update/unidade-update.component";
import { UnidadeDeleteComponent } from "./unidade-delete/unidade-delete.component";


export const unidadeRoutes: Routes = [
  { path: 'create', component: UnidadeCreateComponent },
  { path: 'list', component: UnidadeListComponent },
  { path: 'update/:id', component: UnidadeUpdateComponent },
  { path: 'delete/:id', component: UnidadeDeleteComponent },
];
