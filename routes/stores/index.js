const router = require("express").Router();
const TableBookstores = require("./TableBookstores");
const Bookstore = require("./Bookstore");
const Serializerbookstore = require("../../Serializer").Serializerbookstore;

router.options("/", (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.status(204);
  res.end();
});

router.get("/", async (req, res) => {
  const resultados = await TableBookstores.list();
  res.status(200);
  const serializer = new Serializerbookstore(res.getHeader("Content-Type"), [
    "name",
  ]);
  res.send(serializer.serialize(resultados));
});

router.post("/", async (req, res, next) => {
  try {
    const dataReceived = req.body;
    const bookstore = new Bookstore(dataReceived);
    await bookstore.create();
    res.status(201);
    const serializer = new Serializerbookstore(res.getHeader("Content-Type"), [
      "name",
    ]);
    res.send(serializer.serialize(bookstore));
  } catch (error) {
    next(error);
  }
});

router.options("/:idBookstore", (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, PUT, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.status(204);
  res.end();
});

router.get("/:idBookstore", async (req, res, next) => {
  try {
    const id = req.params.idBookstore;
    const bookstore = new Bookstore({ id: id });
    await bookstore.load();
    res.status(200);
    const serializer = new Serializerbookstore(res.getHeader("Content-Type"), [
      "local",
      "name",
      "createdAt",
      "updatedAt",
      "version",
    ]);
    res.send(serializer.serialize(bookstore));
  } catch (error) {
    next(error);
  }
});

router.put("/:idBookstore", async (req, res, next) => {
  try {
    const id = req.params.idBookstore;
    const dataReceived = req.body;
    const data = Object.assign({}, dataReceived, { id: id });
    const bookstore = new Bookstore(data);
    await bookstore.atualizar();
    res.status(204);
    res.end();
  } catch (error) {
    next(error);
  }
});

router.delete("/:idBookstore", async (req, res, next) => {
  try {
    const id = req.params.idBookstore;
    const bookstore = new Bookstore({ id: id });
    await bookstore.load();
    await bookstore.remove();
    res.status(204);
    res.end();
  } catch (error) {
    next(error);
  }
});

const routerBooks = require("./books");

const verifyBookstore = async (req, res, next) => {
  try {
    const id = req.params.idBookstore;
    const bookstore = new Bookstore({ id: id });
    await bookstore.load();
    req.bookstore = bookstore;
    next();
  } catch (error) {
    next(error);
  }
};

router.use("/:idBookstore/books", verifyBookstore, routerBooks);

module.exports = router;
