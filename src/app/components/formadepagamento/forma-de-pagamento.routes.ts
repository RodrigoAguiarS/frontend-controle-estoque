import { Routes } from "@angular/router";
import { FormadepagamentoCreateComponent } from "./formadepagamento-create/formadepagamento-create.component";
import { FormadepagamentoListComponent } from "./formadepagamento-list/formadepagamento-list.component";
import { FormadepagamentoUpdateComponent } from "./formadepagamento-update/formadepagamento-update.component";
import { FormadepagamentoDeleteComponent } from "./formadepagamento-delete/formadepagamento-delete.component";

export const formaPagamentoRoutes: Routes = [
  { path: 'create', component: FormadepagamentoCreateComponent },
  { path: 'list', component: FormadepagamentoListComponent },
  { path: 'update/:id', component: FormadepagamentoUpdateComponent },
  { path: 'delete/:id', component: FormadepagamentoDeleteComponent },
];
