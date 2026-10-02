import express from "express" // Importa o Express, usado para criar o servidor e definir as rotas.

const app = express() // Cria a aplicação que receberá e encaminhará as requisições HTTP.
const port = 3000 // Define a porta local em que a API ficará disponível.

app.use(express.json()) // Converte corpos JSON das requisições em objetos acessíveis por req.body.

app.get('/', (req, res) => { // Registra uma rota GET na raiz para responder a uma requisição de teste.
    res.send('Hello World!') // Envia uma mensagem de texto e encerra a resposta dessa requisição.
}) // Finaliza a definição da rota GET da raiz.
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

    res.status(201).json({ // Responde com status de criação após todas as validações passarem.
        username: username.trim(), // Retorna o nome sem espaços no início ou no fim.
        email // Retorna somente o email esperado; campos extras da requisição são ignorados.
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