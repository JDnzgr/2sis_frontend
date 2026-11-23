// Workshop: API da XYZ Bookstore - Step 1 & 6
// Definição do catálogo com identificadores únicos (IDs estáveis)

const livros = [
  {
    id: "sally-adventure-book",
    titulo: "Sally's SciFi Adventure",
    autor: "A. Writer",
    descricao: "This is an epic story of Sally and her dog Rex as they navigate through other worlds.",
    preco: 39.9,
  },
  {
    id: "dave-cooking-book",
    titulo: "Dave's Cooking Adventure",
    autor: "D. Chef",
    descricao: "This is the story of Dave as he learns to cook everything from pancakes to pasta, one recipe at a time.",
    preco: 29.5,
  },
];

// Imprime no terminal o catálogo e a contagem
console.log(livros);
console.log("Catálogo com " + livros.length + " livros");

module.exports = livros;
