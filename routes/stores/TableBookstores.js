const Model = require("./ModelTableStore");
const NotFound = require("../../errors/NotFound");

module.exports = {
  list() {
    return Model.findAll({ raw: true });
  },
  insert(bookstore) {
    return Model.create(bookstore);
  },
  async getById(id) {
    const encontrado = await Model.findOne({
      where: {
        id: id,
      },
    });

    if (!encontrado) {
      throw new NotFound("Bookstores");
    }

    return encontrado;
  },
  update(id, dataToUpdate) {
    return Model.update(dataToUpdate, {
      where: { id: id },
    });
  },
  remove(id) {
    return Model.destroy({
      where: { id: id },
    });
  },
};
