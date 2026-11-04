
const URL = "https://uqqbqsrldydbuiimzyfk.supabase.co";
const KEY = "sb_publishable_k7qTjmFn6lgEWpxUXgLL3A_M2T8ZlJX";

// CADASTRAR NOVO PRODUTO
async function salvar(evento) {
    if (evento) evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const precoTexto = document.getElementById("preco").value;
    const imagem = document.getElementById("imagem").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const mensagem = document.getElementById("mensagem");
    const botao = document.getElementById("botaoSalvar");

    const preco = Number(precoTexto);

    if (
        !nome ||
        precoTexto === "" ||
        !Number.isFinite(preco) ||
        preco < 0 ||
        !imagem ||
        !descricao
    ) {
        mensagem.textContent = "Preencha todos os campos corretamente.";
        return;
    }

    if (botao) botao.disabled = true;
    mensagem.textContent = "Salvando produto...";

    try {
        const resposta = await fetch(`${URL}/rest/v1/produtos`, {
            method: "POST",
            headers: {
                "apikey": KEY,
                "Authorization": `Bearer ${KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify({
                nome: nome,
                preco: preco,
                imagem: imagem,
                descricao: descricao
            })
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            throw new Error(erro);
        }

        mensagem.textContent = "Produto cadastrado com sucesso!";

        document.getElementById("nome").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("imagem").value = "";
        document.getElementById("descricao").value = "";

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        mensagem.textContent = "Erro: " + erro.message;

    } finally {
        if (botao) botao.disabled = false;
    }
}

// NÃO MOSTRAR OS PRODUTOS CADASTRADOS
// LISTAR PRODUTOS CADASTRADOS
async function listarProdutos() {
    const lista = document.getElementById("lista");

    if (!lista) return;

    lista.innerHTML = "<p>Carregando produtos...</p>";
    lista.style.display = "block";

    try {
        const resposta = await fetch(
            `${URL}/rest/v1/produtos?select=*&order=id.desc`,
            {
                method: "GET",
                headers: {
                    "apikey": KEY,
                    "Authorization": `Bearer ${KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!resposta.ok) {
            const erro = await resposta.text();
            throw new Error(erro);
        }

        const produtos = await resposta.json();

        lista.innerHTML = "";

        if (produtos.length === 0) {
            lista.innerHTML = "<p>Nenhum produto cadastrado.</p>";
            return;
        }

        produtos.forEach(produto => {
            const item = document.createElement("div");

            item.className = "produto";

            const nome = document.createElement("h3");
            nome.textContent = produto.nome;

            const preco = document.createElement("p");
            preco.textContent = Number(produto.preco).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

            const descricao = document.createElement("p");
            descricao.textContent = produto.descricao;

            const imagem = document.createElement("img");
            imagem.src = produto.imagem;
            imagem.alt = produto.nome;
            imagem.style.maxWidth = "200px";

            item.appendChild(imagem);
            item.appendChild(nome);
            item.appendChild(preco);
            item.appendChild(descricao);

            lista.appendChild(item);
        });

    } catch (erro) {
        console.error("Erro ao listar produtos:", erro);
        lista.innerHTML = "<p>Erro ao carregar produtos.</p>";
    }
}

// CONECTAR O FORMULÁRIO
const formulario = document.getElementById("formProduto");

if (formulario) {
    formulario.addEventListener("submit", salvar);
}

// NÃO CARREGAR PRODUTOS ANTIGOS
listarProdutos();
