var db = require('../models')
var bCrypt = require('bcrypt')
var md5 = require('md5')
var vh = require('./validationHandler')
var cryptoRandomString = require('crypto-random-string')
var s512 = require('hash.js/lib/hash/sha/512')
var coolDownTime = 5*60*1000 // 5 mins

function sha512 (val) {
	return s512().update(val).digest('hex')
}

var createHash = function (password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports.isAdmin = function (req, res, next){
    if(req.user.role=='admin')
        next()
    else
        res.status(401).send('Unauthorized')
}

module.exports.isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		req.flash('authenticated', true)
		return next();
	}
	res.redirect('/login');
}

module.exports.isNotAuthenticated = function (req, res, next) {
	if (!req.isAuthenticated())
		return next();
	res.redirect('/learn');
}

module.exports.forgotPw = function (req, res) {
	if (vh.vCode(req.body.login)) {
		db.User.find({
			where: {
				'login': req.body.login
			}
		}).then(user => {
			if (user) {
				db.Passreset.findAll({limit:1,where:{'userId':user.id},order:[['createdAt','DESC']]}).then(passreset => {
					passreset = passreset[0]
					if(!passreset || passreset.used==true || (Date.now() - passreset.requestedAt)>coolDownTime){
						pr = new db.Passreset()
						var token = cryptoRandomString(30)
						pr.userId = user.id
						pr.used = false
						pr.requestedAt = Date.now()
						pr.tokenHash = sha512(token)
						pr.save()
						// SEND_EMAIL (token) at this step
						req.flash('info', 'If account exists, you will get an email on the registered email')
						res.redirect('/login')
					}else{
						// Cooldown time to prevent DoS
						req.flash('info', 'If account exists, you will get an email on the registered email')
						res.redirect('/login')
					}
				})
			} else {
				req.flash('info', 'If account exists, you will get an email on the registered email')
				res.redirect('/login')
			}
		})
	} else {
		req.flash('danger', "Error, Username contains special charecters")
		res.redirect('/forgotpw')
	}
}

module.exports.resetPw = function (req, res) {
	if (vh.vCode(req.query.login)&&vh.vCode(req.query.token)) {
		db.User.find({
			where: {
				'login': req.query.login
			}
		}).then(user => {
			if (user) {
				db.Passreset.find({where:{'tokenHash': sha512(req.query.token)}}).then(resetpass => {
					if(resetpass&&((Date.now() - resetpass.requestedAt)<coolDownTime)&&resetpass.used==false){
						res.render('resetpw', {
							login: req.query.login,
							token: req.query.token
						})							
					}else if(resetpass){
						req.flash('warning', "Link Expired")
						res.redirect('/forgotpw')							
					} else {
						req.flash('danger', "Invalid reset link")
						res.redirect('/forgotpw')
					}
				})
			} else {
				req.flash('danger', "Invalid reset link")
				res.redirect('/forgotpw')
			}
		})
	} else {
		req.flash('danger', "Invalid reset link")
		res.redirect('/forgotpw')
	}
}

module.exports.resetPwSubmit = function (req, res) {
	if (vh.vPassword(req.body.password) && req.body.cpassword && vh.vCode(req.body.login) && vh.vString(req.body.token)) {
		if (req.body.password == req.body.cpassword) {
			db.User.find({
				where: {
					'login': req.body.login
				}
			}).then(user => {
				if (user) {
					db.Passreset.find({where:{'tokenHash': sha512(req.body.token)}}).then(resetpass => {
						if(resetpass&&((Date.now() - resetpass.requestedAt)<coolDownTime)&&resetpass.used==false){
							user.password = createHash(req.body.password)
							user.save()
							resetpass.used = true
							resetpass.save()
							req.flash('success',"Password successfuly changed")
							res.redirect('/login')
						}else if(resetpass){
							req.flash('warning', "Link Expired")
							res.redirect('/forgotpw')							
						} else {
							req.flash('danger', "Invalid reset link")
							res.redirect('/forgotpw')
						}
					})
				} else {
					req.flash('danger', "Invalid reset link")
					res.redirect('/forgotpw')
				}
			})
		} else {
			req.flash('danger', "Passwords do not match")
			res.render('resetpw', {
				login: req.query.login,
				token: req.query.token
			})
		}

	} else {
		req.flash('danger', "Input validation failed")
		res.render('resetpw', {
			login: req.query.login,
			token: req.query.token
		})
	}
}