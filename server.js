var express = require('express')
var bodyParser = require('body-parser')
var passport = require('passport')
var session = require('express-session')
var ejs = require('ejs')
var morgan = require('morgan')

//Initialize Express
var app = express()

//Configure passport
require('./core/passport')(passport)

//Configure App
app.use(express.static('public'))
app.use(morgan('combined')) // Logging
app.set('view engine','ejs')
//app.set('trust proxy', 1)
app.use(bodyParser.urlencoded({ extended: false }))

// Always change default passwords and secrets. Always use secure cookies with HTTPS
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(require('express-flash')());

// Routing
app.use('/app',require('./routes/app')())
app.use('/',require('./routes/main')(passport))

app.listen(9090)