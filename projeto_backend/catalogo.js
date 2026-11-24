// Workshop: API da XYZ Bookstore - Step 1 & 6
// Definição do catálogo com identificadores únicos (IDs estáveis)

const livros = [
  {
    id: "Uma história de amor",
    titulo: "Uma história de amor",
    autor: "Carlos Heitor Cony",
    descricao: "Em Uma História de Amor, Henrique e Helena protagonizam uma história de amor que transcende os limites da dor e das adversidades.",
    preco: 79.90,
  },
  {
    id: "O Pequeno Príncipe",
    titulo: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    descricao: "O Pequeno Príncipe é uma obra literária que narra a história de um jovem príncipe que viaja por diferentes planetas, aprendendo lições valiosas sobre a vida e a natureza humana.",
    preco: 49.90,
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
