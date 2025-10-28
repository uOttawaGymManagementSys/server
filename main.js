const {Client} = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

const gymEquipmentRoutes = require('./routes/gymEquipmentRoutes.js');
const gymTrafficRoutes = require('./routes/gymTrafficRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js');


/* Configurations */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

/* Postgres setup */
const client = new Client({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    port: process.env.PG_PORT,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE

});

client.connect()
    .then(() => console.log("connected to database successfully"))
    .catch((err) => console.log(err));


/* ROUTES */
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gymTrafficRoutes', gymTrafficRoutes);
app.use('/api/gymEquipmentRoutes', gymEquipmentRoutes);