const express = require('express');
const app = express();
const { getCategories } = require ('./controller')

app.get('/api/categories', getCategories)



app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send(err);
    } else next(err);
  });

//psql error
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Invalid input' });
    } else next(err);
  });

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Server Error!');
  });


module.exports = app;