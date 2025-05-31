import { Perfil } from "./Perfil";
import { Pessoa } from "./Pessoa";
import { Unidade } from "./Unidade";

export class Usuario {
  id: number;
  pessoa: Pessoa;
  email: string;
  senha: string;
  perfis: Perfil[];
  unidade: Unidade;

  constructor(
    id: number = 0,
    pessoa: Pessoa = {} as Pessoa,
    email: string = '',
    senha: string = '',
    perfis: Perfil[] = [],
    unidade: Unidade = {} as Unidade
  ) {
    this.id = id;
    this.pessoa = pessoa;
    this.email = email;
    this.senha = senha;
    this.perfis = perfis;
    this.unidade = unidade;
  }
}
