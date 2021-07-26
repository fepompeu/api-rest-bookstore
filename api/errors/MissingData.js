class MissingData extends Error {
  constructor() {
    super("It wasn't provided values to update!");
    this.name = "MissingData";
    this.idError = 2;
  }
}

module.exports = MissingData;
