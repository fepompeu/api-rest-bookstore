class NotFound extends Error {
  constructor(nome) {
    super(`${nome} not found!`);
    this.name = "NotFound";
    this.idError = 0;
  }
}

module.exports = NotFound;
