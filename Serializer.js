const ValueNotSupported = require("./errors/ValueNotSupported");
const jsontoxml = require("jsontoxml");

class Serializer {
  json(data) {
    return JSON.stringify(data);
  }

  xml(data) {
    let tag = this.tagSimple;

    if (Array.isArray(data)) {
      tag = this.tagPlural;
      data = data.map((item) => {
        return {
          [this.tagSimple]: item,
        };
      });
    }

    return jsontoxml({ [tag]: data });
  }

  serialize(data) {
    data = this.filter(data);

    if (this.contentType === "application/json") {
      return this.json(data);
    }

    if (this.contentType === "application/xml") {
      return this.xml(data);
    }

    throw new ValueNotSupported(this.contentType);
  }

  filterObject(data) {
    const newObject = {};

    this.publicFields.forEach((field) => {
      if (data.hasOwnProperty(field)) {
        newObject[field] = data[field];
      }
    });

    return newObject;
  }

  filter(data) {
    if (Array.isArray(data)) {
      data = data.map((item) => {
        return this.filterObject(item);
      });
    } else {
      data = this.filterObject(data);
    }

    return data;
  }
}

class Serializerbookstore extends Serializer {
  constructor(contentType, extraField) {
    super();
    this.contentType = contentType;
    this.publicFields = ["id", "category"].concat(extraField || []);
    this.tagSimple = "bookstore";
    this.tagPlural = "bookstores";
  }
}

class SerializerBook extends Serializer {
  constructor(contentType, extraField) {
    super();
    this.contentType = contentType;
    this.publicFields = ["id", "book"].concat(extraField || []);
    this.tagSimple = "book";
    this.tagPlural = "books";
  }
}

class SerializerError extends Serializer {
  constructor(contentType, extraField) {
    super();
    this.contentType = contentType;
    this.publicFields = ["id", "message"].concat(extraField || []);
    this.tagSimple = "error";
    this.tagPlural = "errors";
  }
}

module.exports = {
  Serializer: Serializer,
  Serializerbookstore: Serializerbookstore,
  SerializerError: SerializerError,
  SerializerBook: SerializerBook,
  acceptedFormats: ["application/json", "application/xml"],
};
