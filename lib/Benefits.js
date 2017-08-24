var mongoose = require("mongoose");
var where=require('node-where')

var benefitsSchema = new mongoose.Schema({
    name:String,
    address:String,
    details:String,
    zone:String,
    phonenumber1:String,
    phonenumber2:String,
    phonenumber3:String,
    industry:String,
    postaladdress:String,
    longitude:Number,
    latitude:Number
});



var Benefits = mongoose.model('mybenef',benefitsSchema);
console.log('hello benefits');
module.exports=Benefits;