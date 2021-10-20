
const db = require('./db');


app.get('/users', (req, res) => {

  db.query('SELECT * FROM Users WHERE UserID = ' + req.query.id);

    .then((users) => {
      res.send(users);

    })

});
