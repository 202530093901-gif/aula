
const URL = "https://uqqbqsrldydbuiimzyfk.supabase.co";

const KEY = "sb_publishable_k7qTjmFn6lgEWpxUXgLL3A_M2T8ZlJX";

// SALVAR PRODUTO
async function salvar() {
    const campoNome = document.getElementById("nome");
    const mensagem = document.getElementById("mensagem");

    const nome = campoNome.value.trim();

    if (nome === "") {
        mensagem.innerText = "Digite o nome do produto!";
        return;
    }

    try {
        const resposta = await fetch(
            URL + "/rest/v1/produtos",
            {
                method: "POST",
                headers: {
                    "apikey": KEY,
                    "Authorization": "Bearer " + KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome
                })
            }
        );

        if (resposta.ok) {
            mensagem.innerText = "Produto salvo!";
            campoNome.value = "";
        } else {
            const erro = await resposta.text();
            console.error(erro);
            mensagem.innerText = "Erro ao salvar produto.";
        }
    } catch (erro) {
        console.error(erro);
        mensagem.innerText = "Erro de conexão com o Supabase.";
    }
}

// NÃO LISTAR PRODUTOS CADASTRADOS
function listarProdutos() {
    const lista = document.getElementById("lista");

    if (lista) {
        lista.innerHTML = "";
        lista.style.display = "none";
    }
}

// NÃO CARREGAR PRODUTOS AO ABRIR A PÁGINA
listarProdutos();

