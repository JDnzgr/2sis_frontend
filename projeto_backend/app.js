// ==========================================================================
// Workshop: API da XYZ Bookstore (Steps 01 a 19 - Desafio Final)
// Servidor Express completo com CORS, rotas REST e validações de contrato
// ==========================================================================

const express = require("express");
const cors = require("cors");
const path = require("path");
const livros = require("./catalogo");

const app = express();
const PORT = 3000;

// Estado da aplicação (em memória)
let carrinho = [];

// Funções auxiliares
function getCarrinhoEnriquecido() {
  return carrinho.map((item) => {
    const livro = livros.find((l) => l.id === item.livroId);
    const preco = livro ? livro.preco : 0;
    const subtotal = +(preco * item.quantidade).toFixed(2);
    return {
      livroId: item.livroId,
      quantidade: item.quantidade,
      titulo: livro ? livro.titulo : "Desconhecido",
      preco: preco,
      subtotal: subtotal,
    };
  });
}

// Step 16: CORS para permitir comunicação cross-origin (ex: Live Server na 5500)
app.use(cors());

// Step 15: express.json() para processar corpos de requisições JSON
app.use(express.json());

// Servir os arquivos estáticos da pasta pagina/ (Step 18)
app.use(express.static(path.join(__dirname, "pagina")));

// --------------------------------------------------------------------------
// Rotas da API (Contrato de Rotas)
// --------------------------------------------------------------------------

// 1 & 2: GET /livros (com suporte a filtro opcional ?autor=X)
app.get("/livros", (req, res) => {
  const { autor } = req.query;
  if (autor) {
    const filtrados = livros.filter((l) =>
      l.autor.toLowerCase().includes(autor.toLowerCase())
    );
    return res.status(200).json(filtrados);
  }
  res.status(200).json(livros);
});

// 3: GET /livros/:id
app.get("/livros/:id", (req, res) => {
  const livro = livros.find((l) => l.id === req.params.id);
  if (!livro) {
    return res.status(404).json({ erro: "livro não encontrado" });
  }
  res.status(200).json(livro);
});

// 4: GET /carrinho (retorna array com itens enriquecidos)
app.get("/carrinho", (req, res) => {
  res.status(200).json(getCarrinhoEnriquecido());
});

// 5: POST /carrinho (adiciona item enriquecido)
app.post("/carrinho", (req, res) => {
  const { livroId, quantidade } = req.body;

  // Validação: presença dos campos
  if (!livroId || quantidade === undefined) {
    return res.status(400).json({ erro: "faltam campos: livroId, quantidade" });
  }

  // Validação: tipo e valor da quantidade
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    return res
      .status(400)
      .json({ erro: "quantidade deve ser inteiro positivo" });
  }

  // Validação: livro existente no catálogo
  const livro = livros.find((l) => l.id === livroId);
  if (!livro) {
    return res
      .status(400)
      .json({ erro: "livro inexistente: " + livroId });
  }

  // Adição ou incremento no carrinho
  const itemExistente = carrinho.find((i) => i.livroId === livroId);
  if (itemExistente) {
    itemExistente.quantidade += quantidade;
  } else {
    carrinho.push({ livroId, quantidade });
  }

  const itemEnriquecido = {
    livroId,
    quantidade,
    titulo: livro.titulo,
    preco: livro.preco,
    subtotal: +(livro.preco * quantidade).toFixed(2),
  };

  res.status(201).json({ item: itemEnriquecido, carrinho: getCarrinhoEnriquecido() });
});

// Step 19 (Desafio Final): DELETE /carrinho/:id (remove por livroId)
app.delete("/carrinho/:id", (req, res) => {
  const { id } = req.params;
  const index = carrinho.findIndex((i) => i.livroId === id);

  if (index === -1) {
    // Escolha de 400 justificada: referência inválida enviada pelo cliente
    return res.status(400).json({ erro: "item não encontrado no carrinho: " + id });
  }

  carrinho.splice(index, 1);
  res.status(200).json({
    mensagem: "item removido com sucesso",
    carrinho: getCarrinhoEnriquecido(),
  });
});

// 6: POST /checkout (finaliza a compra e esvazia o carrinho)
app.post("/checkout", (req, res) => {
  if (carrinho.length === 0) {
    return res.status(400).json({ erro: "carrinho vazio" });
  }

  const itens = getCarrinhoEnriquecido();
  const total = +itens.reduce((acc, curr) => acc + curr.subtotal, 0).toFixed(2);
  const numero = Math.floor(100000 + Math.random() * 900000);

  // Esvazia o carrinho após finalização
  carrinho = [];

  res.status(200).json({
    numero,
    itens,
    total,
  });
});

// 7: Catch-all para rotas inexistentes (404 em JSON)
app.use((req, res) => {
  res.status(404).json({ erro: "rota inexistente" });
});

// Step 15: Middleware de erro de 4 parâmetros (trata JSON malformado)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "corpo nao e JSON valido" });
  }
  res.status(500).json({ erro: "falha interna" });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log("===============================================");
  console.log(` Servidor XYZ Bookstore rodando com sucesso!`);
  console.log(` URL base: http://localhost:${PORT}`);
  console.log(` Frontend: http://localhost:${PORT}/index.html`);
  console.log(` API Livros: http://localhost:${PORT}/livros`);
  console.log("===============================================");
});
