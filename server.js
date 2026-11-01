const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory collection of 15 books
let books = [
  { id: 1, title: "Things Fall Apart", author: "Chinua Achebe", year: 1958, genre: "Fiction" },
  { id: 2, title: "Beloved", author: "Toni Morrison", year: 1987, genre: "Fiction" },
  { id: 3, title: "The Color Purple", author: "Alice Walker", year: 1982, genre: "Fiction" },
  { id: 4, title: "Their Eyes Were Watching God", author: "Zora Neale Hurston", year: 1937, genre: "Fiction" },
  { id: 5, title: "Invisible Man", author: "Ralph Ellison", year: 1952, genre: "Fiction" },
  { id: 6, title: "1984", author: "George Orwell", year: 1949, genre: "Dystopian" },
  { id: 7, title: "Brave New World", author: "Aldous Huxley", year: 1932, genre: "Dystopian" },
  { id: 8, title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, genre: "Fantasy" },
  { id: 9, title: "Dune", author: "Frank Herbert", year: 1965, genre: "Science Fiction" },
  { id: 10, title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Romance" },
  { id: 11, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction" },
  { id: 12, title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Fiction" },
  { id: 13, title: "Fahrenheit 451", author: "Ray Bradbury", year: 1953, genre: "Dystopian" },
  { id: 14, title: "The Alchemist", author: "Paulo Coelho", year: 1988, genre: "Adventure" },
  { id: 15, title: "Sapiens", author: "Yuval Noah Harari", year: 2011, genre: "Non-fiction" }
];

let nextId = books.length + 1;

// Validate request body; returns an error message or null
function validateBook(body) {
  const { title, author, year, genre } = body;
  if (typeof title !== "string" || title.trim() === "") return "title is required (non-empty string)";
  if (typeof author !== "string" || author.trim() === "") return "author is required (non-empty string)";
  if (!Number.isInteger(year)) return "year is required (integer)";
  if (typeof genre !== "string" || genre.trim() === "") return "genre is required (non-empty string)";
  return null;
}

// Root
app.get("/", (req, res) => {
  res.json({ message: "Books API. Try GET /api/books" });
});

// GET all (optional ?genre= filter)
app.get("/api/books", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    return res.json(books.filter((b) => b.genre.toLowerCase() === genre.toLowerCase()));
  }
  res.json(books);
});

// GET one
app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// POST (create)
app.post("/api/books", (req, res) => {
  const error = validateBook(req.body);
  if (error) return res.status(400).json({ error });

  const { title, author, year, genre } = req.body;
  const newBook = { id: nextId++, title: title.trim(), author: author.trim(), year, genre: genre.trim() };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT (replace)
app.put("/api/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const error = validateBook(req.body);
  if (error) return res.status(400).json({ error });

  const { title, author, year, genre } = req.body;
  books[index] = { id: books[index].id, title: title.trim(), author: author.trim(), year, genre: genre.trim() };
  res.json(books[index]);
});

// DELETE
app.delete("/api/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const [removed] = books.splice(index, 1);
  res.json({ message: "Book deleted", book: removed });
});

// Handle malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Books API running at http://localhost:${PORT}`);
});
