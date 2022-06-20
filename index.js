const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mySecret = process.env['MONGO_URI'];
const User = require('./models/user');

mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app
  .route('/api/users')
  .get((req, res) => {
    User.find({}, (err, users) => {
      if (err) return console.error(err);
      res.json(users);
      console.log('retrieved list of names', users.length, users[0].name);
    });
  })
  .post((req, res) => {
    const { username } = req.body;

    let newuser = new User({
      username,
    });
    newuser.save((err, data) => {
      if (err) return console.error(err);
      return res.json({ username: data.username, _id: data._id });
    });
  });

app.post('/api/users/:_id/exercises', (req, res) => {
  const id = req.params._id;
  let { description, duration, date } = req.body;
  if (!date) {
    date = new Date().toDateString();
  } else {
    date = new Date(date).toDateString();
  }

  User.findById(id, (err, user) => {
    if (err) return console.error(err);

    const exercise = {
      description,
      duration: Number(duration),
      date,
    };

    user.log.push(exercise);
    user.save((err, data) => {
      if (err) return console.error(err);
      return res.json({
        username: data.username,
        _id: data._id,
        date: exercise.date,
        duration: Number(exercise.duration),
        description: description,
      });
    });
  });
});

app.get('/api/users/:_id/logs', (req, res) => {
  const id = req.params._id;

  User.findById(id, (err, user) => {
    if (err) return console.error(err);
    const count = user.log.length;
    return res.json({
      id_: user._id,
      username: user.username,
      count,
      log: user.log
    })
  });
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
