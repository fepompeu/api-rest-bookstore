const Sequelize = require("sequelize");
const instance = require("../../../database");

const columns = {
  book: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  inventory: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  bookstoreId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: require("../ModelTableStore"),
      key: "id",
    },
  },
};

const options = {
  freezeTableName: true,
  tableName: "books",
  timestamps: true,
};

module.exports = instance.define("books", columns, options);
