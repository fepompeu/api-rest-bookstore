const Table = require("./TableBook");
const MissingData = require("../../../errors/MissingData");
const InvalidField = require("../../../errors/InvalidField");

class Book {
  constructor({
    id,
    book,
    price,
    inventory,
    bookstoreId,
    createdAt,
    updatedAt,
    version,
  }) {
    this.id = id;
    this.book = book;
    this.price = price;
    this.inventory = inventory;
    this.bookstoreId = bookstoreId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.version = version;
  }

  validate() {
    if (typeof this.book !== "string" || this.book.length === 0) {
      throw new InvalidField("book");
    }

    if (typeof this.price !== "number" || this.price === 0) {
      throw new InvalidField("price");
    }
  }

  async create() {
    this.validate();
    const res = await Table.insert({
      book: this.book,
      price: this.price,
      inventory: this.inventory,
      bookstoreId: this.bookstoreId,
    });

    this.id = res.id;
    this.createdAt = res.createdAt;
    this.updatedAt = res.updatedAt;
    this.version = res.version;
  }

  delete() {
    return Table.remove(this.id, this.bookstoreId);
  }

  async load() {
    const book = await Table.getById(this.id, this.bookstoreId);
    this.book = book.book;
    this.price = book.price;
    this.inventory = book.inventory;
    this.createdAt = book.createdAt;
    this.updatedAt = book.updatedAt;
    this.version = book.version;
  }

  update() {
    const dataToUpdate = {};

    if (typeof this.book === "string" && this.book.length > 0) {
      dataToUpdate.book = this.book;
    }

    if (typeof this.price === "number" && this.price > 0) {
      dataToUpdate.price = this.price;
    }

    if (typeof this.inventory === "number") {
      dataToUpdate.inventory = this.inventory;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new MissingData();
    }

    return Table.update(
      {
        id: this.id,
        bookstoreId: this.bookstoreId,
      },
      dataToUpdate
    );
  }

  decressInventory() {
    return Table.subtract(
      this.id,
      this.bookstoreId,
      "inventory",
      this.inventory
    );
  }
}

module.exports = Book;
