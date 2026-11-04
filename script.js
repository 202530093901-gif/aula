
const URL = "https://yzgrsszkievjzalcfnzc.supabase.co";
const KEY = "sb_publishable_ECLRLkVa2R79loAMKvQjSw_c6E2So0v";
  
// CADASTRAR PRODUTO NO SUPABASE
document.getElementById("formProduto").addEventListener("submit", salvar);

async function salvar(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const preco = document.getElementById("preco").value;
    const descricao = document.getElementById("descricao").value.trim();
    const imagem = document.getElementById("imagem").value.trim();
    const mensagem = document.getElementById("mensagem");
    const botao = document.getElementById("btnSalvar");

    if (!nome || preco === "" || Number(preco) < 0) {
        mensagem.textContent = "Informe o nome e um preço válido.";
        return;
    }

    // Os nomes abaixo correspondem às colunas da tabela public.produtos:
    // nome, preco, descricao e imagem.
    const novoProduto = {
        nome: nome,
        preco: Number(preco),
        descricao: descricao || null,
        imagem: imagem || null
    };

    botao.disabled = true;
    botao.textContent = "Salvando...";
    mensagem.textContent = "";

    try {
        const resposta = await fetch(URL + "/rest/v1/produtos", {
            method: "POST",
            headers: {
                "apikey": KEY,
                "Authorization": "Bearer " + KEY,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            body: JSON.stringify(novoProduto)
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            throw new Error(erro || "Erro ao cadastrar produto.");
        }

        mensagem.textContent = "Produto cadastrado com sucesso!";
        document.getElementById("formProduto").reset();
        await listarProdutos();
    } catch (erro) {
        mensagem.textContent = "Não foi possível cadastrar o produto. Verifique os dados e as permissões do Supabase.";
        console.error("Erro ao salvar produto:", erro);
    } finally {
        botao.disabled = false;
        botao.textContent = "Salvar produto";
    }
}

// CRIAR UM CARD PARA CADA PRODUTO
function criarCard(produto) {
    const card = document.createElement("article");
    card.className = "produto-card";

    if (produto.imagem) {
        const imagem = document.createElement("img");
        imagem.className = "produto-imagem";
        imagem.src = produto.imagem;
        imagem.alt = produto.nome || "Imagem do produto";
        imagem.loading = "lazy";
        imagem.onerror = () => {
            imagem.remove();
        };
        card.appendChild(imagem);
    }

    const conteudo = document.createElement("div");
    conteudo.className = "produto-conteudo";

    const identificacao = document.createElement("span");
    identificacao.className = "produto-id";
    identificacao.textContent = `Produto #${produto.id}`;

    const nome = document.createElement("h3");
    nome.className = "produto-nome";
    nome.textContent = produto.nome || "Produto sem nome";

    const descricao = document.createElement("p");
    descricao.className = "produto-descricao";
    descricao.textContent = produto.descricao || "Sem descrição cadastrada.";

    const preco = document.createElement("p");
    preco.className = "produto-preco";
    const valor = Number(produto.preco);
    preco.textContent = produto.preco !== null && produto.preco !== undefined && produto.preco !== ""
        ? valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        : "Preço não informado";

    conteudo.append(identificacao, nome, descricao, preco);
    card.appendChild(conteudo);
    return card;
}

// LISTAR PRODUTOS DO SUPABASE
async function listarProdutos() {
    const lista = document.getElementById("lista");
    lista.innerHTML = '<p class="estado-lista">Carregando produtos...</p>';

    try {
        const resposta = await fetch(URL + "/rest/v1/produtos?select=*&order=id.desc", {
            method: "GET",
            headers: {
                "apikey": KEY,
                "Authorization": "Bearer " + KEY
            }
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos: " + resposta.status);
        }

        const produtos = await resposta.json();
        lista.innerHTML = "";

        if (produtos.length === 0) {
            lista.innerHTML = '<p class="estado-lista">Nenhum produto cadastrado ainda.</p>';
            return;
        }

        produtos.forEach(produto => lista.appendChild(criarCard(produto)));
    } catch (erro) {
        lista.innerHTML = '<p class="estado-lista">Não foi possível carregar os produtos.</p>';
        console.error(erro);
    }
}

// CARREGAR PRODUTOS QUANDO A PÁGINA ABRIR
listarProdutos();
