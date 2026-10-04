const ErrorMiddleware = require("./Presentatiton/http/Middlewares/errorHandler");
const HttpLogger = require("./Presentatiton/http/Middlewares/httpLogger");
const config = require("./Infrastructure/Config/config");
const UserRoutes = require("./Presentatiton/http/Routes/User.routes");

const express = require("express");

const app = express();

app.use(express.json());

app.use(HttpLogger);

app.get("/health", (req, res) => {res.json({ message: "Api is running" })})

app.use(`/api/${config.api_version}/user`, UserRoutes);

app.use(ErrorMiddleware);

module.exports = app;

