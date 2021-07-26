const models = [
  require("../routes/stores/ModelTableStore"),
  require("../routes/stores/books/ModelTableBook"),
];

function createTables() {
  models.forEach(async (model) => {
    await model.sync();
  });
}

createTables();
