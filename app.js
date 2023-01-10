require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./routers');


const PORT = process.env.PORT

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

module.exports = app;
