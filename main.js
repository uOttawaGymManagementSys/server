const {Client} = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');


/* Configurations */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet);
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());


const connection = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "WessCha3loma!@",
    database: "gyminsight"

});

connection.connect()
    .then(() => console.log("connected to database successfully"))
    .catch((err) => console.log(err));