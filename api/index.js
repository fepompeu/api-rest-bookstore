const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require("config");
const NotFound = require("./errors/NotFound");
const InvalidField = require("./errors/InvalidField");
const MissingData = require("./errors/MissingData");
const ValueNotSupported = require("./errors/ValueNotSupported");
const acceptedFormats = require("./Serializer").acceptedFormats;
const SerializerError = require("./Serializer").SerializerError;

app.use(bodyParser.json());

app.use((req, res, next) => {
  let requestedFormat = req.header("Accept");

  if (requestedFormat === "*/*") {
    requestedFormat = "application/json";
  }

  if (acceptedFormats.indexOf(requestedFormat) === -1) {
    res.status(406);
    res.end();
    return;
  }

  res.setHeader("Content-Type", requestedFormat);
  next();
});

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

const router = require("./routes/stores");
app.use("/api/bookstores", router);

app.use((error, req, res, next) => {
  let status = 500;

  if (error instanceof NotFound) {
    status = 404;
  }

  if (error instanceof InvalidField || error instanceof MissingData) {
    status = 400;
  }

  if (error instanceof ValueNotSupported) {
    status = 406;
  }

  const serializer = new SerializerError(res.getHeader("Content-Type"));
  res.status(status);
  res.send(
    serializer.serialize({
      message: error.message,
      id: error.iderror,
    })
  );
});

app.listen(config.get("api.port"), () => console.log("API is working!"));
