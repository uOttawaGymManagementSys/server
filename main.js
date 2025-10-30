const { Client } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const gymEquipmentRoutes = require("./routes/gymEquipmentRoutes.js");
const gymTrafficRoutes = require("./routes/gymTrafficRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");

const client = require("./db"); // import the db connection

/* Configurations */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/traffic", gymTrafficRoutes);
app.use("/api/machinestatus", gymEquipmentRoutes);

/* Listening for requests*/
const PORT = process.env.SERVER_PORT;
console.log(PORT);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = client;
