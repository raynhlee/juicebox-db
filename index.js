const PORT = 3000;
const express = require("express");
const server = express();
//
require("dotenv").config();
//
const morgan = require("morgan");
server.use(morgan("dev"));
//
server.use(express.json());
server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});
//
const apiRouter = require("./api");
server.use("/api", apiRouter);

//
//td review:
// const client = new Client("postgres://localhost:5432/juicebox-dev");
// from db/index.js
// what's this doing again?
const { client } = require("./db");
client.connect();

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
