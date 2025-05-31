export class Pessoa {
  id: number;
  nome: string;
  telefone: string;

  constructor(
    id: number = 0,
    nome: string = '',
    telefone: string = ''
  ) {
    this.id = id;
    this.nome = nome;
    this.telefone = telefone;
  }
}
