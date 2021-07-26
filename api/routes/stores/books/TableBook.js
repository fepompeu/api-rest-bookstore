const Model = require("./ModelTableBook");
const instance = require("../../../database");
const NotFound = require("../../../errors/NotFound");

module.exports = {
  list(idStore) {
    return Model.findAll({
      where: {
        bookstoreid: idStore,
      },
      raw: true,
    });
  },
  insert(data) {
    return Model.create(data);
  },
  remove(idBook, idStore) {
    return Model.destroy({
      where: {
        id: idBook,
        bookstoreid: idStore,
      },
    });
  },
  async getById(idBook, idStore) {
    const found = await Model.findOne({
      where: {
        id: idBook,
        bookstoreid: idStore,
      },
      raw: true,
    });

    if (!found) {
      throw new NotFound("Book");
    }

    return found;
  },
  update(contentBook, dataToUpdate) {
    return Model.update(dataToUpdate, {
      where: contentBook,
    });
  },
  subtract(idBook, idStore, field, value) {
    return instance.transaction(async (transaction) => {
      const book = await Model.findOne({
        where: {
          id: idBook,
          bookstoreid: idStore,
        },
      });

      book[field] = value;

      await book.save();

      return book;
    });
  },
};
