require('dotenv').config();
const { Client } = require('pg');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const sequelize = require('./db');
const router = require('./routes/index');
const path = require('path');

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(cookieParser());
app.use(fileUpload());
app.use('/api', router);

app.get('/', (req, res) => {
  res.send('working');
});

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection has been established successfully.');
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
