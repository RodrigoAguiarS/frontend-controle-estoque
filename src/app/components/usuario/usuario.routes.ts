import { Routes } from "@angular/router";
import { UsuarioCreateComponent } from "./usuario-create/usuario-create.component";
import { UsuarioListComponent } from "./usuario-list/usuario-list.component";
import { UsuarioUpdateComponent } from "./usuario-update/usuario-update.component";
import { UsuarioDeleteComponent } from "./usuario-delete/usuario-delete.component";


export const usuarioRoutes: Routes = [
  { path: 'create', component: UsuarioCreateComponent },
  { path: 'list', component: UsuarioListComponent },
  { path: 'update/:id', component: UsuarioUpdateComponent },
  { path: 'delete/:id', component: UsuarioDeleteComponent },
];
