
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
        mensagem.textContent =
            "Não foi possível cadastrar. Confira as colunas e permissões do Supabase.";
    } finally {
        if (botao) botao.disabled = false;
    }
}

// NÃO MOSTRAR OS PRODUTOS CADASTRADOS
function listarProdutos() {
    const lista = document.getElementById("lista");

    if (lista) {
        lista.innerHTML = "";
        lista.style.display = "none";
    }
}

// CONECTAR O FORMULÁRIO
const formulario = document.getElementById("formProduto");

if (formulario) {
    formulario.addEventListener("submit", salvar);
}

// NÃO CARREGAR PRODUTOS ANTIGOS
listarProdutos();
