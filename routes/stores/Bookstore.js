const TableBookstores = require("./TableBookstores");
const InvalidField = require("../../errors/InvalidField");
const MissingData = require("../../errors/MissingData");

class Bookstore {
  constructor({ id, name, local, category, createdAt, updatedAt, version }) {
    this.id = id;
    this.name = name;
    this.local = local;
    this.category = category;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.version = version;
  }

  async create() {
    this.validate();
    const resultado = await TableBookstores.insert({
      name: this.name,
      local: this.local,
      category: this.category,
    });

    this.id = resultado.id;
    this.createdAt = resultado.createdAt;
    this.updatedAt = resultado.updatedAt;
    this.version = resultado.version;
  }

  async load() {
    const res = await TableBookstores.getById(this.id);
    this.name = res.name;
    this.local = res.local;
    this.category = res.category;
    this.createdAt = res.createdAt;
    this.updatedAt = res.updatedAt;
    this.version = res.version;
  }

  async update() {
    await TableBookstores.getById(this.id);
    const fields = ["name", "local", "category"];
    const dataToUpdate = {};

    fields.forEach((field) => {
      const value = this[field];

      if (typeof value === "string" && value.length > 0) {
        dataToUpdate[field] = value;
      }
    });

    if (Object.keys(dataToUpdate).length === 0) {
      throw new MissingData();
    }

    await TableBookstores.update(this.id, dataToUpdate);
  }

  remove() {
    return TableBookstores.remove(this.id);
  }

  validate() {
    const fields = ["name", "local", "category"];

    fields.forEach((field) => {
      const value = this[field];

      if (typeof value !== "string" || value.length === 0) {
        throw new InvalidField(field);
      }
    });
  }
}

module.exports = Bookstore;
