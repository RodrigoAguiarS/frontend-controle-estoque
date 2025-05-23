import { Routes } from "@angular/router";
import { VendaCreateComponent } from "./venda-create/venda-create.component";
import { VendaListComponent } from "./venda-list/venda-list.component";

export const vendasRoutes: Routes = [
  { path: 'create', component: VendaCreateComponent },
  { path: 'list', component: VendaListComponent },
];
