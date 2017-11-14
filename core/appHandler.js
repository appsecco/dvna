var db = require('../models')
var bCrypt = require('bcrypt')
const exec = require('child_process').exec;
var mathjs = require('mathjs')
const Op = db.Sequelize.Op

module.exports.userSearch = function (req,res){
    // SQL Injection
    var query = "SELECT name FROM Users WHERE login='" + req.body.login + "'";
    db.sequelize.query(query,{ model: db.User }).then(user => {
    	if(user.length){
	    	var output ={
	    		user: {
	    			name: user[0].name
	    		}
	    	}
    		res.render('app/usersearch',{output:output})
    	}else{
	    	var output ={
	    		user: 'none'
	    	}    		
    		res.render('app/usersearch',{output:output})
    	}
    }).catch(err => {
    	var output ={
    		user: 'none'
    	}    	
    	req.flash('error','Internal Error')
    	res.render('app/usersearch',{output:output})
    })
}

module.exports.ping = function (req,res){
	exec('ping -c 2 ' + req.body.address, function(err,stdout,stderr){
		console.log(err)
		output = stdout + stderr
		res.render('app/ping',{authenticated:true, output: output})
	})
}

module.exports.listProducts = function (req,res){
    db.Product.findAll().then(products => {
    	output ={
    		products : products
    	}
    	res.render('app/products', {authenticated:true, output: output})
    })
}

module.exports.productSearch = function (req,res){
    db.Products.findAll({where:{name:{[Op.like]:req.body.name}}}).then( products => {
    	output ={
    		products : products,
    		searchTerm: req.body.name
    	}
    	console.log(output)
    	res.render('app/products', {output: output})		
	})
}

module.exports.modifyProduct = function (req,res){
	if(!req.query.id||req.query.id==''){
		output ={
			product : {}
		}
	res.render('app/modifyproduct', {output: output})		
	}else{
	    db.Product.find({where:{'id': req.query.id}}).then(product => {
	    	if(!product) {
	    		product ={}
	    	}
	    	output ={
	    		product : product
	    	}
	    	res.render('app/modifyproduct', {output: output})
	    })		
	}

}

module.exports.modifyProductSubmit = function (req,res){
	if (!req.body.id||req.body.id==''){
		req.body.id=0
	}
    db.Product.find({where:{'id': req.body.id}}).then(product => {
    	if(!product){
    		product = new db.Product()
    	}
		product.code= req.body.code
		product.name = req.body.name
		product.description = req.body.description
		product.tags = req.body.tags
		product.save().then(p => {
			if(p){
				req.flash('message','Product added/modified!')
				res.redirect('/app/products')
			}
		}).catch(err => {
			output = {
				product: product,
				error: err
			}
			res.render('app/modifyproduct', {output: output})			
		})	
    })
}

module.exports.userEdit = function(req,res){
	res.render('app/useredit',{userId:req.user.id,userEmail:req.user.email})
}

module.exports.userEditSubmit = function(req,res){
	if(req.body.password==req.body.cpassword){
		db.User.find({where:{'id':req.body.id}}).then(user=>{
			if(user){
				user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null)
				user.save().then(function(){
					res.redirect('/app/products')
				})
			}else{
				req.flash('error','Non Existant User')
				res.render('app/useredit',{userId:req.user.id,userEmail:req.user.email})
			}
		})
	}else{
		req.flash('error','Passwords dont match')
		res.render('app/useredit',{userId:req.user.id,userEmail:req.user.email})
	}
}

module.exports.redirect = function(req,res){
	if(req.query.url){
		res.redirect(req.query.url)
	}else{
		res.send('invalid redirect url')
	}
}

module.exports.calc = function(req,res){
	if(req.body.eqn){
		req.flash('result',mathjs.eval(req.body.eqn))
		res.render('app/calc')
	}else{
		req.flash('result','Enter a valid math string like (3+3)*2')
		res.render('app/calc')
	}
}

module.exports.listUsersAPI = function(req,res){
	db.User.findAll({}).then(users => {
		res.status(200).json({
			success: true,
			users: users
		})
	})
}