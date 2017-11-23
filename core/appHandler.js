var db = require('../models')
var vh = require('./validationHandler')
var bCrypt = require('bcrypt')
const execFile = require('child_process').execFile
var mathjs = require('mathjs')
const Op = db.Sequelize.Op

module.exports.userSearch = function (req, res) {
	if (vh.vCode(req.body.login)){
		db.User.find({where:{'login':req.body.login}}).then(user => {
			if (user) {
				var output = {
					user: {
						name: user.name,
						id: user.id
					}
				}
				res.render('app/usersearch', {
					output: output
				})
			} else {
				req.flash('warning', 'User not found')
				res.render('app/usersearch', {
					output: null
				})
			}
		}).catch(err => {
			req.flash('danger', 'Internal Error')
			res.render('app/usersearch', {
				output: null
			})
		})
	}else{
		req.flash('danger', 'Input Validation Failed')
		res.render('app/usersearch', {
			output: null
		})		
	}
}

module.exports.ping = function (req, res) {
	if (vh.vIP(req.body.address)){
		execFile('ping', ['-c', '2', req.body.address] , function(err,stdout,stderr){
		output = stdout + stderr
			res.render('app/ping', {
				output: output
			})
		})			
	}else{
		res.render('app/ping', {
			output: 'Input Validation Failed'
		})	
	}
}

module.exports.listProducts = function (req, res) {
	db.Product.findAll().then(products => {
		output = {
			products: products
		}
		res.render('app/products', {
			output: output
		})
	})
}

module.exports.productSearch = function (req, res) {
	if(vh.vName(req.body.name)){
		db.Product.findAll({
			where: {
				name: {
					[Op.like]: '%' + req.body.name + '%'
				}
			}
		}).then(products => {
			output = {
				products: products,
				searchTerm: req.body.name
			}
			res.render('app/products', {
				output: output
			})
		})				
	}else{
		req.flash('danger', 'Invalid Product name')
		res.render('app/products', {
			output: null
		})					
	}
}

module.exports.modifyProduct = function (req, res) {
	if (!req.query.id || req.query.id == '') {
		output = {
			product: {}
		}
		res.render('app/modifyproduct', {
			output: output,
			csrfToken: req.csrfToken()
		})
	} else {
		if(vh.vPID(req.query.id)){
			db.Product.find({
				where: {
					'id': req.query.id
				}
			}).then(product => {
				if (!product) {
					product = {}
				}
				output = {
					product: product
				}
				res.render('app/modifyproduct', {
					output: output,
					csrfToken: req.csrfToken()
				})
			})
		}else{
			req.flash('danger', 'Input Product ID')
			res.render('app/products', {
				output: null
			})
		}
	}
}

module.exports.modifyProductSubmit = function (req, res) {
	if (!vh.vPID(req.body.id)) {
		req.body.id = 0
	}
	db.Product.find({
		where: {
			'id': req.body.id
		}
	}).then(product => {
		if(vh.vName(req.body.name)&&vh.vCode(req.body.code)&&vh.vString(req.body.description)&&vh.vTags(req.body.tags)){
			if (!product) {
				product = new db.Product()
			}			
			product.code = req.body.code
			product.name = req.body.name
			product.description = req.body.description
			product.tags = req.body.tags
			product.save().then(p => {
				if (p) {
					req.flash('success', 'Product added/modified!')
					res.redirect('/app/products')
				}
			}).catch(err => {
				output = {
					product: product
				}
				req.flash('danger',err)
				res.render('app/modifyproduct', {
					output: output,
					csrfToken: req.csrfToken()
				})
			})
		}else{
			req.flash('danger', 'Input Validation Failed')
			var output= {
				product: {
					id: req.body.id,
					name: req.body.name,
					code: req.body.code,
					description: req.body.description,
					tags: req.body.tags
				}
			}
			res.render('app/modifyproduct', {
				output: output,
				csrfToken: req.csrfToken()
			})		
		}
	})
}

module.exports.userEdit = function (req, res) {
	res.render('app/useredit', {
		userId: req.user.id,
		userEmail: req.user.email,
		userName: req.user.name,
		csrfToken: req.csrfToken()
	})
}

module.exports.userEditSubmit = function (req, res) {
	if(vh.vEmail(req.body.email)&&vh.vName(req.body.name)){
		if(req.body.password.length>0){
			if(vh.vPassword(req.body.password)){
				if (req.body.password == req.body.cpassword) {
					req.user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null)
				}else{
					req.flash('warning', 'Passwords dont match')
					res.render('app/useredit', {
						userId: req.user.id,
						userEmail: req.user.email,
						userName: req.user.name,
						csrfToken: req.csrfToken()
					})
					return		
				}
			}else{
				req.flash('warning', 'Invalid Password. Minimum length of a password is 8')
				res.render('app/useredit', {
					userId: req.body.id,
					userEmail: req.body.email,
					userName: req.body.name,
					csrfToken: req.csrfToken()
				})
				return
			}
		}
		req.user.email = req.body.email
		req.user.name = req.body.name
		req.user.save().then(function () {
			req.flash('success',"Updated successfully")
			res.render('app/useredit', {
				userId: req.user.id,
				userEmail: req.user.email,
				userName: req.user.name,
				csrfToken: req.csrfToken()
			})
		})
	}else{
		req.flash('danger', 'Invalid Profile information')
		res.render('app/useredit', {
			userId: req.body.id,
			userEmail: req.body.email,
			userName: req.body.name,
			csrfToken: req.csrfToken()
		})
	}
}

module.exports.redirect = function (req, res) {
	if (vh.vUrl(req.query.url)) {
		res.render('app/redirect',{url:req.query.url, csrfToken:req.csrfToken()})
	} else {
		res.send('invalid redirect url')
	}
}

module.exports.redirectSubmit = function (req, res) {
	if (vh.vUrl(req.body.url)) {
		res.redirect(req.body.url)
	} else {
		res.send('invalid redirect url')
	}
}

module.exports.calc = function (req, res) {
	if(vh.vEqn(req.body.eqn)){
		try{
			if (req.body.eqn) {
				res.render('app/calc', {
					output: mathjs.eval(req.body.eqn)
				})
			} else {
				res.render('app/calc', {
					output: 'Enter a valid math string like (3+3)*2'
				})
			}
		}catch(err){
			res.render('app/calc', {
				output: 'Enter a valid math string like (3+3)*2'
			})				
		}		
	}else{
		res.render('app/calc', {
			output: 'Enter a valid math string like (3+3)*2'
		})
	}
}

module.exports.listUsersAPI = function (req, res) {
	db.User.findAll({attributes: [ 'id' ,'name', 'email']}).then(users => {
		res.status(200).json({
			success: true,
			users: users
		})
	})
}
