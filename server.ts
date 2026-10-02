import { createServer } from "node:http"

const server = createServer()

const nome: string = "anderson"

const numero: number = 1

const nomeCompleto: number = 0

const lista: number[] = [1, 2, 3]

interface Posts {
    id: number,
    conteudo: string
}

interface Usuario {
    id: number,
    nome: string,
    documento: string,
    ativo: boolean,
    posts: Posts[]
}

const usuarios: Usuario[] = [
    {
        id: 1,
        documento: "teste",
        nome: "pedro 1",
        ativo: true,
        posts: [
            {
                conteudo: "teste",
                id: 3,

            }
        ]
    },

]

function greeting(user: Usuario): string {

    return `Ola ${user.nome}`

}

server.listen(3000, () => {
    const user = greeting(usuarios[0]!)
    console.log("servidor rodando na porta 3000", user)
})