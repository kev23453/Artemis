const ErrorMiddleware = require("./Presentatiton/http/Middlewares/errorHandler");

const express = require("express");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json(
        {
            message: "Api is running"
        }
    )
})

app.use(ErrorMiddleware);

module.exports = app;

