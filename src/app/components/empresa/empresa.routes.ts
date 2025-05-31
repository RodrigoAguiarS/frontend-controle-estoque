import { Routes } from "@angular/router";
import { EmpresaCreateComponent } from "./empresa-create/empresa-create.component";
import { EmpresaListComponent } from "./empresa-list/empresa-list.component";
import { EmpresaUpdateComponent } from "./empresa-update/empresa-update.component";
import { EmpresaDeleteComponent } from "./empresa-delete/empresa-delete.component";


export const empresasRoutes: Routes = [
  { path: 'create', component: EmpresaCreateComponent },
  { path: 'list', component: EmpresaListComponent },
  { path: 'update/:id', component: EmpresaUpdateComponent },
  { path: 'delete/:id', component: EmpresaDeleteComponent },
];
