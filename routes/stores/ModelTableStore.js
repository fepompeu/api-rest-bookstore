const Sequelize = require("sequelize");
const instance = require("../../database");

const columns = {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  local: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.ENUM("compact store", "full store"),
    allowNull: false,
  },
};

const options = {
  freezeTableName: true,
  tableName: "stores",
  timestamps: true,
};

module.exports = instance.define("stores", columns, options);
