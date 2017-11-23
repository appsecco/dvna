var router = require('express').Router()
var csrf = require('csurf')
var appHandler = require('../core/appHandler')
var authHandler = require('../core/authHandler')
var csrfProtection = csrf()

function csrfErrorHandler (err, req, res, next){
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  res.status(403)
  res.send('csrf token error')    
}

module.exports = function () {
    router.get('/', authHandler.isAuthenticated, function (req, res) {
        res.redirect('/learn')
    })

    router.get('/usersearch', authHandler.isAuthenticated, function (req, res) {
        res.render('app/usersearch', {
            output: null
        })
    })

    router.get('/ping', authHandler.isAuthenticated, function (req, res) {
        res.render('app/ping', {
            output: null
        })
    })

    router.get('/products', authHandler.isAuthenticated, appHandler.listProducts)

    router.get('/modifyproduct', authHandler.isAuthenticated, csrfProtection, appHandler.modifyProduct)

    router.get('/useredit', authHandler.isAuthenticated, csrfProtection, appHandler.userEdit)

    router.get('/calc', authHandler.isAuthenticated, function (req, res) {
        res.render('app/calc',{output:null})
    })

    router.get('/admin', authHandler.isAuthenticated, function (req, res) {
        res.render('app/admin', {
            admin: (req.user.role == 'admin')
        })
    })

    router.get('/admin/usersapi', authHandler.isAuthenticated, authHandler.isAdmin, appHandler.listUsersAPI)

    router.get('/admin/users', authHandler.isAuthenticated, authHandler.isAdmin, function(req, res){
        res.render('app/adminusers')
    })

    router.get('/redirect', csrfProtection, appHandler.redirect)

    router.post('/redirect', csrfProtection, csrfErrorHandler, appHandler.redirectSubmit)

    router.post('/usersearch', authHandler.isAuthenticated, appHandler.userSearch)

    router.post('/ping', authHandler.isAuthenticated, appHandler.ping)

    router.post('/products', authHandler.isAuthenticated, appHandler.productSearch)

    router.post('/modifyproduct', authHandler.isAuthenticated, csrfProtection, csrfErrorHandler, appHandler.modifyProductSubmit)

    router.post('/useredit', authHandler.isAuthenticated,  csrfProtection, csrfErrorHandler, appHandler.userEditSubmit)

    router.post('/calc', authHandler.isAuthenticated, appHandler.calc)

    return router
}
