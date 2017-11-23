var router = require('express').Router()
var vulnDict = require('../config/vulns')
var authHandler = require('../core/authHandler')
var vh = require('../core/validationHandler')

module.exports = function (passport) {
	router.get('/', authHandler.isAuthenticated, function (req, res) {
		res.redirect('/learn')
	})

	router.get('/login', authHandler.isNotAuthenticated, function (req, res) {
		res.render('login')
	})

	router.get('/learn/vulnerability/:vuln', authHandler.isAuthenticated, function (req, res) {
		if(vh.vVuln(req.params.vuln)){
			res.render('vulnerabilities/layout', {
				vuln: req.params.vuln,
				vuln_title: vulnDict[req.params.vuln],
				vuln_scenario: req.params.vuln + '/scenario',
				vuln_description: req.params.vuln + '/description',
				vuln_reference: req.params.vuln + '/reference'
			}, function (err, html) {
				if (err) {
					res.status(404).send('404')
				} else {
					res.send(html)
				}
			})			
		}else{
			res.end('nice try ;)')
		}
	})

	router.get('/learn', authHandler.isAuthenticated, function (req, res) {
		res.render('learn')
	})

	router.get('/register', authHandler.isNotAuthenticated, function (req, res) {
		res.render('register')
	})

	router.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	})

	router.get('/forgotpw', function (req, res) {
		res.render('forgotpw')
	})

	router.get('/resetpw', authHandler.resetPw)

	router.post('/login', passport.authenticate('login', {
		successRedirect: '/learn',
		failureRedirect: '/login',
		failureFlash: true
	}))

	router.post('/register', passport.authenticate('signup', {
		successRedirect: '/learn',
		failureRedirect: '/register',
		failureFlash: true
	}))

	router.post('/forgotpw', authHandler.forgotPw)

	router.post('/resetpw', authHandler.resetPwSubmit)

	return router
}