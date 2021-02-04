require("dotenv").config();
require("./database");
const express = require("express");
const cors = require("cors");
const router = require("./routes");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");

const HTTP_PORT = process.env.PORT || 7200;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

app.use(errorHandler);

app.listen(HTTP_PORT, () => console.log(`Server started on port ${HTTP_PORT}`));
