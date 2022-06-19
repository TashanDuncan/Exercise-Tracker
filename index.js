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

app.route('/api/users').get((req,res) =>{
  User.find({},(err, users) =>{
    if (err) return console.error(err);
    res.json(users);
    console.log('retrieved list of names', users.length, users[0].name);
})
}).post((req,res) =>{
  const {username} = req.body

  let newuser = new User({
    username
  });
  newuser.save((err, data) => {
    if (err) return console.error(err);
    return res.json(data)
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});


