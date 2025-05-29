import { Routes } from "@angular/router";
import { PerfilCreateComponent } from "./perfil-create/perfil-create.component";
import { PerfilListComponent } from "./perfil-list/perfil-list.component";
import { PerfilUpdateComponent } from "./perfil-update/perfil-update.component";
import { PerfilDeleteComponent } from "./perfil-delete/perfil-delete.component";


export const perfilRoutes: Routes = [
  { path: 'create', component: PerfilCreateComponent },
  { path: 'list', component: PerfilListComponent },
  { path: 'update/:id', component: PerfilUpdateComponent },
  { path: 'delete/:id', component: PerfilDeleteComponent },
];
