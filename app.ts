import express from "express" // Importa o Express, usado para criar o servidor e definir as rotas.
import { data, ReturnUsuario } from "./data";

const app = express() // Cria a aplicação que receberá e encaminhará as requisições HTTP.
const port = 3000 // Define a porta local em que a API ficará disponível.

app.use(express.json()) // Converte corpos JSON das requisições em objetos acessíveis por req.body.

app.get("/user", (req, res) => {
  res.status(200).json(data);
});

app.get("/user/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({
            erro: "O ID deve ser um número inteiro",
        });
    }
    const findUser = data.find((user) => user.id === id);
  if (!findUser) {
        return res.status(404).json({
      erro: "Usuário não encontrado",
    });
  }
  if (findUser) {
    const returnUser: ReturnUsuario = {
      email: findUser.email,
      id: findUser.id,
      username: findUser.username,
    };
    res.status(200).json(returnUser);
  }
});

app.delete("/user/:id", (req, res) => {
    // Registra uma rota DELETE que recebe o ID do usuário pela URL.
    const id = Number(req.params.id); // Converte o parâmetro, que chega como texto, para number.
    if (!Number.isInteger(id)) { // Impede a busca se o valor não for um número inteiro.
        return res.status(400).json({ // Responde 400 para indicar que o ID enviado é inválido.
            erro: "O ID deve ser um número inteiro", // Explica ao cliente qual formato de ID é aceito.
        }); // Finaliza a resposta de erro e o objeto JSON.
    } // Encerra a validação do ID.

    const userIndex = data.findIndex((user) => user.id === id); // Localiza a posição do usuário com esse ID no array.
    if (userIndex === -1) { // findIndex retorna -1 quando não encontra correspondência.
        return res.status(404).json({ // Responde 404 porque não há usuário para remover.
            erro: "Usuário não encontrado", // Informa que nenhum usuário possui o ID solicitado.
        }); // Finaliza a resposta de usuário inexistente.
    } // Encerra o tratamento do caso em que o ID não existe.

    const [deletedUser] = data.splice(userIndex, 1); // Remove um item do array e guarda o usuário removido.
    const returnUser: ReturnUsuario = { // Cria uma resposta pública compatível com ReturnUsuario.
        id: deletedUser.id, // Inclui o ID para identificar qual usuário foi removido.
        email: deletedUser.email, // Inclui o email para confirmar o usuário removido.
        username: deletedUser.username, // Inclui o nome, sem expor a senha armazenada.
    }; // Finaliza o objeto com os dados públicos do usuário.

    return res.status(200).json({ // Retorna status 200 para indicar que a remoção foi concluída.
        mensagem: "Usuário removido com sucesso", // Confirma a operação para quem chamou a API.
        usuario: returnUser, // Devolve os dados públicos do usuário removido.
    }); // Finaliza e envia a resposta JSON de sucesso.
}); // Encerra a definição da rota DELETE.

app.post("/", (req, res) => { // Registra uma rota POST na raiz, independente das rotas de usuário.
    res.status(201).json({ // Define o status de criação e envia um objeto JSON como resposta.
        id: 1 // Retorna um identificador fixo de exemplo para essa rota.
    }) // Finaliza o objeto JSON retornado.
}) // Finaliza a definição da rota POST da raiz.

const isValidEmail = (email: string): boolean => // Cria uma função que verifica o tipo e o formato do email recebido.
    typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) // Aceita somente texto no formato básico nome@dominio.extensão.

const isValidPassword = (password: string): boolean => // Cria uma função que verifica se a senha recebida é um texto.
    typeof password === "string" && password.length >= 8 // Considera válida a senha com pelo menos oito caracteres.

app.post("/cadastro", (req, res) => { // Registra o endpoint POST usado para receber dados de cadastro.
    const { username, email, password } = req.body ?? {} // Extrai os campos esperados; usa objeto vazio se não houver corpo.
    const erros: string[] = [] // Cria uma lista para acumular todos os problemas encontrados nos dados.

    if (typeof username !== "string" || !username.trim()) { // Verifica se o nome foi enviado como texto não vazio.
        erros.push("Username é obrigatório") // Adiciona uma mensagem quando o nome está ausente ou inválido.
    } // Finaliza a validação do nome.
    if (!isValidEmail(email)) { // Chama a validação de email para verificar tipo e formato.
        erros.push("Informe um email válido") // Adiciona uma mensagem quando o email não passa na validação.
    } // Finaliza a validação do email.
    if (!isValidPassword(password)) { // Chama a validação de senha para verificar tipo e tamanho mínimo.
        erros.push("A senha deve ter pelo menos 8 caracteres") // Adiciona uma mensagem quando a senha não passa na validação.
    } // Finaliza a validação da senha.

    if (erros.length > 0) { // Confere se alguma validação falhou antes de aceitar o cadastro.
        res.status(400).json({ erros }) // Responde com status de requisição inválida e lista os problemas encontrados.
        return // Interrompe a rota para não enviar também uma resposta de sucesso.
    } // Finaliza o tratamento de dados inválidos.

    // Monta o registro interno com os campos validados e o username sem espaços nas bordas.
    const usuario = {
            // Gera o próximo ID inteiro disponível para manter o tipo numérico e evitar repetições.
            id: data.reduce((maxId, currentUser) => Math.max(maxId, currentUser.id), 0) + 1,
            username: username.trim(),
            email,
            password,
    }
    // GET /user lê este array; inserir aqui faz o cadastro aparecer na listagem em memória.
    // Como não há banco de dados, os registros adicionados são perdidos ao reiniciar o servidor.
    data.push(usuario)

    res.status(201).json({ // Responde com status de criação após todas as validações passarem.
        username: usuario.username, // Retorna o nome sem espaços no início ou no fim.
        email: usuario.email // Retorna somente os campos esperados; campos extras são ignorados.
    }) // Finaliza o objeto JSON de sucesso, sem expor a senha.
}) // Finaliza a definição do endpoint de cadastro.

app.post("/login", (req, res) => { // Registra o endpoint POST usado para receber os dados de login.
    const { email, password } = req.body ?? {} // Extrai apenas email e senha; usa objeto vazio se não houver corpo.
    const erros: string[] = [] // Cria uma lista para acumular problemas nos dados de login.

    if (!isValidEmail(email)) { // Verifica se o email tem tipo e formato aceitos.
        erros.push("Informe um email válido") // Adiciona um erro quando o email é inválido.
    } // Finaliza a validação do email no login.
    if (!isValidPassword(password)) { // Verifica se a senha é texto com pelo menos oito caracteres.
        erros.push("A senha deve ter pelo menos 8 caracteres") // Adiciona um erro quando a senha é inválida.
    } // Finaliza a validação da senha no login.

    if (erros.length > 0) { // Verifica se algum campo falhou na validação.
        res.status(400).json({ erros }) // Devolve status de requisição inválida junto com os erros encontrados.
        return // Encerra o processamento para impedir a resposta de sucesso.
    } // Finaliza o tratamento de dados de login inválidos.

    res.status(200).json({ email }) // Aceita os dados no formato esperado e retorna o email, sem expor a senha.
}) // Finaliza a definição do endpoint de login.
app.listen(port, () => { // Inicia o servidor HTTP e o mantém aguardando requisições na porta definida.
    console.log(`Example app listening on port ${port}`) // Exibe no terminal uma mensagem quando o servidor iniciar.
}) // Finaliza a inicialização do servidor.