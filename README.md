# Express Books API

A REST API built with Express for a collection of 15 books (in-memory data).

## Run it

```bash
npm install
npm start
```

Server runs at http://localhost:3000

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/books | Get all books (optional `?genre=Fiction`) |
| GET | /api/books/:id | Get one book |
| POST | /api/books | Create a book |
| PUT | /api/books/:id | Replace a book |
| DELETE | /api/books/:id | Delete a book |

A book looks like:

```json
{ "id": 1, "title": "Things Fall Apart", "author": "Chinua Achebe", "year": 1958, "genre": "Fiction" }
```

POST and PUT require `title`, `author`, `year` (integer), and `genre`.

Status codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found.

## Testing

Every endpoint was tested with Postman (see `requests.http` for the same requests).
