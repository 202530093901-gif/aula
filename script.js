
const URL = "https://yzgrsszkievjzalcfnzc.supabase.co";
const KEY = "sb_publishable_ECLRLkVa2R79loAMKvQjSw_c6E2So0v";

// Elementos do HTML
const campoNome = document.getElementById("nome");
const campoPreco = document.getElementById("preco");
const campoImagem = document.getElementById("imagem");
const campoDescricao = document.getElementById("descricao");
const mensagem = document.getElementById("mensagem");
const lista = document.getElementById("lista");

// Cabeçalhos de comunicação com o Supabase
const headers = {
    "apikey": KEY,
    "Authorization": "Bearer " + KEY
};

// =====================================
// SALVAR PRODUTO
// =====================================
async function salvar(evento) {
    if (evento) evento.preventDefault();

    const nome = campoNome.value.trim();
    const precoTexto = campoPreco.value;
    const imagem = campoImagem.value.trim();
    const descricao = campoDescricao.value.trim();
    const preco = Number(precoTexto);

    // Validar os campos
    if (
        !nome ||
        !imagem ||
        !descricao ||
        precoTexto === "" ||
        !Number.isFinite(preco) ||
        preco < 0
    ) {
        mensagem.textContent =
            "Preencha todos os campos corretamente.";
        return;
    }

    const botao = document.getElementById("botaoSalvar");

    if (botao) botao.disabled = true;
    mensagem.textContent = "Salvando produto...";

    try {
        const resposta = await fetch(
            URL + "/rest/v1/produtos",
            {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
                    nome: nome,
                    preco: preco,
                    imagem: imagem,
                    descricao: descricao
                })
            }
        );

        if (!resposta.ok) {
            const erro = await resposta.text();
            throw new Error(erro);
        }

        mensagem.textContent = "Produto salvo com sucesso!";

        // Limpar o formulário
        campoNome.value = "";
        campoPreco.value = "";
        campoImagem.value = "";
        campoDescricao.value = "";

        // Atualizar a lista
        await listarProdutos();

    } catch (erro) {
        console.error("Erro ao salvar produto:", erro);

        mensagem.textContent =
            "Erro ao salvar. Verifique as colunas e permissões do Supabase.";
    } finally {
        if (botao) botao.disabled = false;
    }
}

// =====================================
// LISTAR PRODUTOS
// =====================================
async function listarProdutos() {
    lista.replaceChildren();

    const carregando = document.createElement("p");
    carregando.textContent = "Carregando produtos...";
    lista.appendChild(carregando);

    try {
        const resposta = await fetch(
            URL + "/rest/v1/produtos?select=*",
            {
                method: "GET",
                headers: headers
            }
        );

        if (!resposta.ok) {
            const erro = await resposta.text();
            throw new Error(erro);
        }

        const produtos = await resposta.json();

        lista.replaceChildren();

        if (produtos.length === 0) {
            const vazio = document.createElement("p");
            vazio.textContent = "Nenhuma roupa cadastrada ainda.";
            lista.appendChild(vazio);
            return;
        }

        produtos.forEach((produto) => {
            // Cartão do produto
            const cartao = document.createElement("article");
            cartao.className = "produto";

            // Imagem
            const imagem = document.createElement("img");
            imagem.alt = produto.nome || "Imagem da roupa";
            imagem.loading = "lazy";

            if (produto.imagem) {
                imagem.src = produto.imagem;

                imagem.onerror = () => {
                    imagem.removeAttribute("src");
                    imagem.alt = "Imagem indisponível";
                };
            }

            // Conteúdo do cartão
            const conteudo = document.createElement("div");
            conteudo.className = "produto-conteudo";

            // Nome
            const nome = document.createElement("h3");
            nome.textContent = produto.nome || "Sem nome";

            // Descrição
            const descricao = document.createElement("p");
            descricao.className = "produto-descricao";
            descricao.textContent =
                produto.descricao || "Sem descrição.";

            // Preço
            const preco = document.createElement("p");
            preco.className = "produto-preco";

            if (produto.preco !== null && produto.preco !== undefined) {
                preco.textContent = Number(produto.preco).toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                );
            } else {
                preco.textContent = "Preço não informado";
            }

            // Código do produto, se houver coluna id
            conteudo.append(nome, descricao, preco);

            if (produto.id !== undefined && produto.id !== null) {
                const id = document.createElement("small");
                id.textContent = "Código: " + produto.id;
                conteudo.appendChild(id);
            }

            cartao.append(imagem, conteudo);
            lista.appendChild(cartao);
        });

    } catch (erro) {
        console.error("Erro ao listar produtos:", erro);

        lista.replaceChildren();

        const aviso = document.createElement("p");
        aviso.textContent =
            "Não foi possível carregar os produtos. Verifique sua conexão e as permissões do Supabase.";

        lista.appendChild(aviso);
    }
}

// =====================================
// CONECTAR O FORMULÁRIO
// =====================================
const formulario = document.getElementById("formProduto");

if (formulario) {
    formulario.addEventListener("submit", salvar);
}

// =====================================
// CARREGAR PRODUTOS AO ABRIR A PÁGINA
// =====================================
listarProdutos();

