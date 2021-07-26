const router = require("express").Router({ mergeParams: true });
const Table = require("./TableBook");
const Book = require("./Book");
const Serializer = require("../../../Serializer").SerializerBook;

router.options("/", (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.status(204);
  res.end();
});

router.get("/", async (req, res) => {
  const books = await Table.list(req.bookstore.id);
  const serializer = new Serializer(res.getHeader("Content-Type"));
  res.send(serializer.serialize(books));
});

router.post("/", async (req, res, next) => {
  try {
    const idBookstore = req.bookstore.id;
    const body = req.body;
    const data = Object.assign({}, body, { bookstoreId: idBookstore });
    const book = new Book(data);
    await book.create();
    const serializer = new Serializer(res.getHeader("Content-Type"));
    res.set("ETag", book.version);
    const timestamp = new Date(book.updatedAt).getTime();
    res.set("Last-Modified", timestamp);
    res.set("Location", `/api/bookstore/${book.bookstoreId}/books/${book.id}`);
    res.status(201);
    res.send(serializer.serialize(book));
  } catch (error) {
    next(error);
  }
});

router.options("/:id", (req, res) => {
  res.set("Access-Control-Allow-Methods", "DELETE, GET, HEAD, PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.status(204);
  res.end();
});

router.delete("/:id", async (req, res) => {
  const data = {
    id: req.params.id,
    bookstore: req.bookstore.id,
  };

  const book = new Book(data);
  await book.delete();
  res.status(204);
  res.end();
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = {
      id: req.params.id,
      bookstore: req.bookstore.id,
    };

    const book = new Book(data);
    await book.load();
    const serializer = new Serializer(res.getHeader("Content-Type"), [
      "preco",
      "estoque",
      "bookstore",
      "dataCriacao",
      "updatedAt",
      "version",
    ]);
    res.set("ETag", book.version);
    const timestamp = new Date(book.updatedAt).getTime();
    res.set("Last-Modified", timestamp);
    res.send(serializer.serialize(book));
  } catch (error) {
    next(error);
  }
});

router.head("/:id", async (req, res, next) => {
  try {
    const data = {
      id: req.params.id,
      bookstore: req.bookstore.id,
    };

    const book = new Book(data);
    await book.load();
    res.set("ETag", book.version);
    const timestamp = new Date(book.updatedAt).getTime();
    res.set("Last-Modified", timestamp);
    res.status(200);
    res.end();
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = Object.assign({}, req.body, {
      id: req.params.id,
      bookstore: req.bookstore.id,
    });

    const book = new Book(data);
    await book.update();
    await book.load();
    res.set("ETag", book.version);
    const timestamp = new Date(book.updatedAt).getTime();
    res.set("Last-Modified", timestamp);
    res.status(204);
    res.end();
  } catch (error) {
    next(error);
  }
});

router.options("/:id/decress-inventory", (req, res) => {
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.status(204);
  res.end();
});

router.post("/:id/decress-inventory", async (req, res, next) => {
  try {
    const book = new Book({
      id: req.params.id,
      bookstore: req.bookstore.id,
    });

    await book.load();
    book.estoque = book.estoque - req.body.quantidade;
    await book.decressInventory();
    await book.load();
    res.set("ETag", book.version);
    const timestamp = new Date(book.updatedAt).getTime();
    res.set("Last-Modified", timestamp);
    res.status(204);
    res.end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
