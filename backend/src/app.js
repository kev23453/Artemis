const ErrorMiddleware = require("./Presentatiton/http/Middlewares/errorHandler");
const HttpLogger = require("./Presentatiton/http/Middlewares/httpLogger");
const config = require("./Infrastructure/Config/config");
const UserRoutes = require("./Presentatiton/http/Routes/User.routes");
const AuthRoutes = require("./Presentatiton/http/Routes/Auth.routes");
const BeneficiaryRoutes = require("./Presentatiton/http/Routes/Beneficiary.routes");
const SavingAccountRoutes = require("./Presentatiton/http/Routes/SavingAccount.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors({
    origin: config.frontend.url,
    credentials: true
}))

app.use(express.json());

app.use(cookieParser());

app.use(HttpLogger);

app.get("/health", (req, res) => {res.json({ message: "Api is running" })})

app.use(`/api/${config.api_version}/user`, UserRoutes);
app.use(`/api/${config.api_version}/auth`, AuthRoutes);
app.use(`/api/${config.api_version}/beneficiary`, BeneficiaryRoutes);
app.use(`/api/${config.api_version}/saving_account`, SavingAccountRoutes);

app.use(ErrorMiddleware);

module.exports = app;