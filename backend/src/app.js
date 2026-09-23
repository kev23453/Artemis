const ErrorMiddleware = require("./Presentatiton/http/Middlewares/errorHandler");
const HttpLogger = require("./Presentatiton/http/Middlewares/httpLogger");

const express = require("express");

const app = express();

app.use(express.json());

app.use(HttpLogger);

app.get("/health", (req, res) => {
    res.json(
        {
            message: "Api is running"
        }
    )
})

app.use(ErrorMiddleware);
module.exports = app;

