const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const timeRestriction = require('./timeRestriction');
let masterWorker = null;

app.use(timeRestriction);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const originWhiteList = [...process.env.ALLOWED_ORIGIN.split(', ')];
const corsOptions = {
  origin: (origin, callback) => {
    const originIsWhitelisted = originWhiteList.includes(origin) || originWhiteList.includes('*');
    callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted)
  }
};

app.post('/send', cors(corsOptions), (req, res, next) => {
  masterWorker.addTask({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  res.status(200).send('thanks');
  console.log('task added');
});

const init = (master) => {
  masterWorker = master;
  app.listen(process.env.PORT, () => {
    console.log(`CORS-enabled web server listening on port ${process.env.PORT}`)
  })
}

module.exports = {
  init
};