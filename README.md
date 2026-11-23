# 📚 2SIS Front-End — Sistema Completo da Livraria XYZ

Repositório contendo a implementação completa dos três workshops da disciplina de **Front-End**:
1. **`projeto2/`**: Workshop de Estrutura HTML da Livraria (Steps 01 a 19).
2. **`Estilização/`**: Workshop de Estilo CSS da Livraria (Steps 01 a 30).
3. **`projeto_backend/`**: Workshop de API REST com Node.js, Express, CORS e Consumo no Front-End (Steps 01 a 19 - Desafio Final).

---

## 📁 Estrutura do Repositório

```text
2sis_frontend/
├── projeto2/
│   ├── index.html            # Estrutura HTML5 com cartões semânticos e botões (Step 19)
│   └── ...                   # Documentação passo a passo do workshop
│
├── Estilização/
│   ├── index.html            # HTML integrado com folha de estilos e viewport (Step 29)
│   ├── styles.css            # CSS3 com variáveis (:root), tema escuro, grid e media queries (Step 30)
│   └── ...                   # Documentação passo a passo do workshop
│
└── projeto_backend/
    ├── catalogo.js           # Catálogo de livros em array de objetos (Step 01 & 06)
    ├── package.json          # Configuração NPM (express, cors, nodemon)
    ├── app.js                # Servidor Express completo com rotas REST e validações
    ├── CONTRATO.md           # Tabela de contrato e auditoria com curl -i (Step 17 & 19)
    ├── pagina/               # Aplicação Front-end integrada consumindo a API (Step 18 & 19)
    │   ├── index.html        # Página da loja conectada
    │   ├── styles.css        # Estilos da loja com suporte a tema escuro
    │   └── script.js         # Lógica de consumo da API (GET /livros, POST/DELETE carrinho, POST checkout)
    └── ...                   # Documentação passo a passo do workshop
```

---

## 🚀 Como Executar e Demonstrar para o Professor

### 1. Testando o Catálogo em Linha de Comando (Step 01)
```bash
cd projeto_backend
node catalogo.js
```
*Saída no terminal:* Exibe o array dos livros cadastrados e a frase `"Catálogo com 2 livros"`.

---

### 2. Iniciando a API Backend (Node.js + Express + CORS)
Dentro da pasta `projeto_backend`:
```bash
cd projeto_backend
npm install
npm start
```
*O servidor iniciará na porta **3000**:*
- **URL Base:** `http://localhost:3000`
- **Catálogo de Livros (JSON):** `http://localhost:3000/livros`
- **Frontend Integrado:** `http://localhost:3000/index.html`

---

### 3. Testando o Ciclo Completo da Loja (Desafio Final - Step 19)
Com o servidor rodando, abra no navegador:
👉 **[http://localhost:3000/index.html](http://localhost:3000/index.html)**

1. **Listagem:** Os livros são carregados automaticamente via requisição `GET /livros`.
2. **Adicionar ao Carrinho:** Clique em **"Buy Now"** em qualquer livro. Uma requisição `POST /carrinho` adiciona o item e uma mensagem de confirmação aparece na tela.
3. **Visualizar o Carrinho:** Clique em **"View Cart"**. A tabela do carrinho é renderizada com subtotais e botões de **"Remover"**.
4. **Remover Item:** Clique em **"Remover"** em um dos livros. A requisição `DELETE /carrinho/:id` remove o item e atualiza o total instantaneamente, sem recarregar a página.
5. **Finalizar Compra:** Clique em **"Checkout"**. A requisição `POST /checkout` gera o número do pedido, exibe o total na tela e esvazia o carrinho.
6. **Validação de Erro:** Se clicar em **"Checkout"** com o carrinho vazio, a mensagem de erro `400` é exibida de forma clara na tela (não apenas no console).

---

## 📋 Resumo dos Critérios Técnicos Atendidos

- **HTML (projeto2):** Tags semânticas (`h1`, `h2`, `p`, `button`), organização modular com `div`, classes semânticas (`card`, `btn`, `card-container`, `btn-container`) e IDs únicos (`sally-adventure-book`, `dave-cooking-book`, `view-cart-btn`, `checkout-btn`).
- **CSS (Estilização):**
  - Reset universal com `box-sizing: border-box`.
  - 10 tokens de cor no `:root` consumidos via `var()`.
  - Layout responsivo usando CSS Grid (`auto-fit` com `minmax`) e Flexbox.
  - Especificidade calculada: zero seletores de ID no CSS, uso de classes combinadas (`.btn.btn-primary:hover`).
  - Suporte completo a **Tema Escuro** via `@media (prefers-color-scheme: dark)`.
  - Media queries mobile-first com unidades relativas (`rem`).
- **Backend & API (projeto_backend):**
  - Modularização com `catalogo.js` e `app.js`.
  - Middleware `cors()` habilitado para permitir consumo cross-origin.
  - Middleware `express.json()` para parsing automático de requisições.
  - Middleware de erro de 4 parâmetros para tratar JSON malformado (respondendo `400` em JSON).
  - Rotas REST completas: `GET /livros`, `GET /livros/:id`, `GET /carrinho`, `POST /carrinho`, `DELETE /carrinho/:id`, `POST /checkout`.
  - Documentação formal no arquivo `CONTRATO.md` auditada com `curl -i`.
