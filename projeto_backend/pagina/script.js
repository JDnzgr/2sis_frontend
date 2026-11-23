// ==========================================================================
// Workshop: API da XYZ Bookstore (Step 18 & Step 19 - Desafio Final)
// Integração do Front-End com o Back-End REST
// ==========================================================================

const API_BASE = "http://localhost:3000";

const containerLivros = document.querySelector(".card-container");
const btnViewCart = document.getElementById("view-cart-btn");
const btnCheckout = document.getElementById("checkout-btn");
const carrinhoView = document.getElementById("carrinho-view");
const carrinhoConteudo = document.getElementById("carrinho-conteudo");
const mensagemStatus = document.getElementById("mensagem-status");

// Função para exibir alertas visuais na interface
function exibirMensagem(texto, tipo = "sucesso") {
  mensagemStatus.textContent = texto;
  mensagemStatus.className = `alerta-status alerta-${tipo}`;
  mensagemStatus.style.display = "block";

  // Rola até a mensagem suavemente
  mensagemStatus.scrollIntoView({ behavior: "smooth", block: "center" });
}

function limparMensagem() {
  mensagemStatus.style.display = "none";
  mensagemStatus.textContent = "";
}

// --------------------------------------------------------------------------
// 1. Carregamento dos Livros da API (Step 18)
// --------------------------------------------------------------------------
function montarCard(livro) {
  const precoFormatado = Number(livro.preco).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return `
    <div class="card" id="${livro.id}">
      <h2>${livro.titulo}</h2>
      <p>${livro.descricao}</p>
      <p class="preco">${precoFormatado}</p>
      <button class="btn buy-now" data-id="${livro.id}">Buy Now</button>
    </div>
  `;
}

async function carregarLivros() {
  try {
    const res = await fetch(`${API_BASE}/livros`);
    if (!res.ok) {
      throw new Error("Erro ao carregar catálogo: " + res.status);
    }
    const livros = await res.json();
    containerLivros.innerHTML = "";
    livros.forEach((livro) => {
      containerLivros.insertAdjacentHTML("beforeend", montarCard(livro));
    });
  } catch (erro) {
    console.error("Falha ao conectar com o backend:", erro);
    containerLivros.innerHTML = `
      <p style="color: red;">Não foi possível carregar os livros. Verifique se o servidor Node.js está em execução na porta 3000.</p>
    `;
  }
}

// --------------------------------------------------------------------------
// 2. Delegação de Eventos: Clique em "Buy Now" para adicionar ao carrinho
// --------------------------------------------------------------------------
containerLivros.addEventListener("click", async (evento) => {
  const btn = evento.target.closest(".buy-now");
  if (!btn) return;

  limparMensagem();

  try {
    const res = await fetch(`${API_BASE}/carrinho`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ livroId: btn.dataset.id, quantidade: 1 }),
    });

    if (!res.ok) {
      const { erro } = await res.json();
      exibirMensagem(`Erro ao adicionar item: ${erro}`, "erro");
      return;
    }

    const { item } = await res.json();
    exibirMensagem(`"${item.titulo}" adicionado ao carrinho!`, "sucesso");

    // Se a visualização do carrinho estiver aberta, atualiza-a
    if (carrinhoView.style.display !== "none") {
      carregarCarrinho();
    }
  } catch (erro) {
    exibirMensagem("Erro de conexão ao adicionar item ao carrinho.", "erro");
  }
});

// --------------------------------------------------------------------------
// 3. Botão "View Cart": Consulta GET /carrinho e renderiza na tela (Step 19)
// --------------------------------------------------------------------------
async function carregarCarrinho() {
  limparMensagem();
  try {
    const res = await fetch(`${API_BASE}/carrinho`);
    if (!res.ok) {
      throw new Error("Erro ao buscar carrinho");
    }
    const itens = await res.json();

    carrinhoView.style.display = "block";

    if (itens.length === 0) {
      carrinhoConteudo.innerHTML = "<p>Seu carrinho está vazio.</p>";
      return;
    }

    let linhasHtml = "";
    let total = 0;

    itens.forEach((item) => {
      total += item.subtotal;
      linhasHtml += `
        <tr>
          <td><strong>${item.titulo}</strong></td>
          <td>${item.quantidade}</td>
          <td>R$ ${Number(item.preco).toFixed(2)}</td>
          <td>R$ ${Number(item.subtotal).toFixed(2)}</td>
          <td>
            <button class="btn-remover" data-id="${item.livroId}">Remover</button>
          </td>
        </tr>
      `;
    });

    carrinhoConteudo.innerHTML = `
      <table class="carrinho-tabela">
        <thead>
          <tr>
            <th>Livro</th>
            <th>Qtd</th>
            <th>Preço</th>
            <th>Subtotal</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          ${linhasHtml}
        </tbody>
      </table>
      <div class="carrinho-total-linha">
        Total do Carrinho: R$ ${total.toFixed(2)}
      </div>
    `;

    carrinhoView.scrollIntoView({ behavior: "smooth" });
  } catch (erro) {
    exibirMensagem("Erro ao carregar o carrinho do servidor.", "erro");
  }
}

btnViewCart.addEventListener("click", () => {
  if (carrinhoView.style.display === "none") {
    carregarCarrinho();
  } else {
    carrinhoView.style.display = "none";
  }
});

// --------------------------------------------------------------------------
// 4. Delegação de Eventos: Remoção de item DELETE /carrinho/:id (Step 19)
// --------------------------------------------------------------------------
carrinhoConteudo.addEventListener("click", async (evento) => {
  const btn = evento.target.closest(".btn-remover");
  if (!btn) return;

  const id = btn.dataset.id;
  try {
    const res = await fetch(`${API_BASE}/carrinho/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const { erro } = await res.json();
      exibirMensagem(`Erro ao remover: ${erro}`, "erro");
      return;
    }

    exibirMensagem("Item removido com sucesso!", "sucesso");
    carregarCarrinho();
  } catch (erro) {
    exibirMensagem("Erro ao comunicar exclusão com o servidor.", "erro");
  }
});

// --------------------------------------------------------------------------
// 5. Botão "Checkout": Finalização POST /checkout (Step 19)
// --------------------------------------------------------------------------
btnCheckout.addEventListener("click", async () => {
  limparMensagem();

  try {
    const res = await fetch(`${API_BASE}/checkout`, {
      method: "POST",
    });

    if (!res.ok) {
      // Regra de UX do Step 19: exibir erro 400 na tela!
      const { erro } = await res.json();
      exibirMensagem(`Não foi possível finalizar: ${erro.toUpperCase()}`, "erro");
      return;
    }

    const { numero, total } = await res.json();
    exibirMensagem(
      `🎉 Pedido #${numero} realizado com sucesso! Total: R$ ${Number(total).toFixed(2)}`,
      "sucesso"
    );

    // Limpa a visualização do carrinho
    carrinhoView.style.display = "none";
    carrinhoConteudo.innerHTML = "";
  } catch (erro) {
    exibirMensagem("Erro de comunicação ao processar checkout.", "erro");
  }
});

// Inicialização da página
carregarLivros();
