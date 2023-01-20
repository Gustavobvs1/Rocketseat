const booksByCategory = [
  {
    category: "Riqueza",
    books: [
      {
        title: "Os segredos da mente milionária",
        author: "T. Harv Eker",
      },
      {
        title: "O homem mais rico da Babilônia",
        author: "Georde S. Clason",
      },
      {
        title: "Pai rico, pai pobre",
        author: "Robert T. Kiyosaki e Sharon L. Lechter",
      },
    ],
  },
  {
    category: "Inteligencia Emocional",
    books: [
      {
        title: "Você é insubstituivel",
        author: "Augusto Cury",
      },
      {
        title: "Ansiedade - como enfrentar o mal do século",
        author: "Augusto Cury",
      },
      {
        title: "Os 7 hábitos das pessoas altamente eficazes",
        author: "Stephen R. Covey",
      },
    ],
  },
];

//Contar o numero de categorias

const totalCategories = booksByCategory.length;
console.log(totalCategories);

//Contar o numero de livros em cada categoria

for (let category of booksByCategory) {
  console.log("Total de livros da categoria", category.category);
  console.log(category.books.length);
}

//Contar o numero de autores

function countAuthors() {
  let authors = [];

  for (let category of booksByCategory) {
    for (let book of category.books) {
      if (authors.indexOf(book.author) == -1) {
        authors.push(book.author);
      }
    }
  }

  console.log("Total de autores: ", authors.length);
}

countAuthors();

//Mostrar somente os livros de Augusto Cury

function booksByAugustoCury() {
  let books = [];

  for (let category of booksByCategory) {
    for (let book of category.books) {
      if (book.author === "Augusto Cury") {
        books.push(book.title);
      }
    }
  }

  console.log("Livros do autor Augusto Cury: ", books);
}

booksByAugustoCury();

//Mostrar os livros de acordo com o author

function booksByAuthor(author) {
  let books = [];

  for (let category of booksByCategory) {
    for (let book of category.books) {
      if (book.author === author) {
        books.push(book.title);
      }
    }
  }

  console.log(`Livros do autor ${author}: ${books.join(", ")}`);
}

booksByAuthor("Georde S. Clason");
