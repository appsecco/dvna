validator = require('validator')

// We create a custom module to enable customization and consistancy

module.exports = {
	vName : function (val){
		if (val) 
			return validator.isAlpha(val + '')
		return false
	},
	vEmail : function (val){
		if (val)
			return validator.isEmail(val + '')
	},
	vPassword: function (val){
		if (val)
			return val.length>=8
	},
	vIP: function (val){
		if(val)
			return validator.isIP(val + '',4)
	},
	vPID: function (val){
		if(val)
			return validator.isInt(val + '',{gt:0})
	},
	vString: function (val){
		if(val)
			return validator.isAlphanumeric(val + '')
	},
	vEqn: function (val){
		if (val)
			return validator.isWhitelisted(val + '', '1234567890<>+-./()%*^')
	},
	vCode: function (val){
		if(val)
			return validator.isWhitelisted(val + '', 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-')
	},
	vTags: function (val){
		if(val)
			return validator.isWhitelisted(val + '', 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-,')
	},
	vUrl: function (val){
		if(val)
			return validator.isURL(val + '')
	}
}