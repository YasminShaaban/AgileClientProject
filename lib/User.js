var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	username:String,
	password:String,
	firstname:String,
	lastname:String
});



var User = mongoose.model('myuser',userSchema);//the name of the model is the name that is saved in database
console.log('hello user');
module.exports=User;
