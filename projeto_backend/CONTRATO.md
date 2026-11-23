# Contrato de API — XYZ Bookstore
*Especificação formal dos endpoints conforme Steps 17 e 19 do Workshop de Backend.*

---

## 📋 Tabela de Endpoints (Contrato)

| # | Rota | Método | Body (Payload) | Sucesso (OK) | Erros Tratados | Auditoria |
|---|------|--------|----------------|--------------|----------------|-----------|
| 1 | `/livros` | GET | — | `200` `[{livro}]` | — | ✔ auditado |
| 2 | `/livros?autor=X` | GET | — | `200` `[{filtrados}]` (ou `[]`) | — | ✔ auditado |
| 3 | `/livros/:id` | GET | — | `200` `{livro}` | `404` `{erro: "livro não encontrado"}` | ✔ auditado |
| 4 | `/carrinho` | GET | — | `200` `[{livroId, quantidade, titulo, preco, subtotal}]` | — | ✔ auditado |
| 5 | `/carrinho` | POST | `{livroId, quantidade}` | `201` `{item, carrinho}` (item enriquecido) | `400` faltando campos / id inexistente / quantidade inválida / JSON malformado | ✔ auditado |
| 6 | `/carrinho/:id` | DELETE | — | `200` `{mensagem, carrinho}` | `400` `{erro: "item não encontrado no carrinho"}` | ✔ auditado |
| 7 | `/checkout` | POST | — | `200` `{numero, itens, total}` | `400` `{erro: "carrinho vazio"}` | ✔ auditado |
| 8 | *(qualquer outra)* | * | — | — | `404` `{erro: "rota inexistente"}` | ✔ auditado |

---

## 🛡️ Justificativa de Decisão Técnica (Step 19 - Desafio Final)

> **Pergunta do Professor:** Por que você escolheu responder **`400`** e não `404` no `DELETE /carrinho/:id` quando o item não existe no carrinho?
> 
> **Defesa oral:** A rota `/carrinho/:id` existe no servidor, portanto a URL não é inexistente. O erro decorre de uma referência semântica inválida enviada pelo cliente (tentativa de remover um recurso que não pertence ao carrinho da sessão). Pelo padrão HTTP/REST, `400 Bad Request` sinaliza requisição incorreta do cliente, mantendo o `404 Not Found` reservado para endpoints ausentes no roteamento da API.

---

## 🧪 Bateria de Testes de Auditoria (curl -i)

```bash
# 1. Lista todos os livros
curl -i http://localhost:3000/livros

# 2. Filtro com correspondência inexistente (deve responder 200 com [])
curl -i "http://localhost:3000/livros?autor=desconhecido"

# 3. Busca por ID existente
curl -i http://localhost:3000/livros/sally-adventure-book

# 4. Busca por ID inexistente (deve responder 404 JSON)
curl -i http://localhost:3000/livros/id-fantasma

# 5. Adiciona item ao carrinho (POST com JSON válido)
curl -i -X POST http://localhost:3000/carrinho \
  -H "content-type: application/json" \
  -d '{"livroId":"sally-adventure-book","quantidade":2}'

# 6. Adiciona com erro de validação (livro inexistente -> 400)
curl -i -X POST http://localhost:3000/carrinho \
  -H "content-type: application/json" \
  -d '{"livroId":"invalido","quantidade":1}'

# 7. Consulta estado do carrinho
curl -i http://localhost:3000/carrinho

# 8. Remove item do carrinho (DELETE do Step 19)
curl -i -X DELETE http://localhost:3000/carrinho/sally-adventure-book

# 9. Checkout do carrinho restante
curl -i -X POST http://localhost:3000/checkout

# 10. Checkout com carrinho vazio (deve responder 400 {erro: "carrinho vazio"})
curl -i -X POST http://localhost:3000/checkout

# 11. Rota inexistente (deve responder 404 JSON)
curl -i http://localhost:3000/rota-que-nao-existe
```
