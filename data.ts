interface Usuario {
  id: number;
  email: string;
  password: string;
  username: string;
}
export interface ReturnUsuario {
  id: number;
  email: string;
  username: string;
}
export const data: Usuario[] = [
  {
    id: 2,
    email: "teste@email.com",
    password: "1234",
    username: "teste",
  },
  {
    id: 3,
    username: "Francesco",
    email: "fran@gmail.com.br",
    password: "Senha783"
  }
];