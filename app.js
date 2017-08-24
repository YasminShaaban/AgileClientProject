var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session=require('express-session')
var where=require('node-where')
var fs=require('fs');
var path=require('path')
var NodeGeocoder = require('node-geocoder');
//mongoose.Promise=require('bluebird');
//mongoose.connect('mongodb://10.7.0.3:27107/data/db');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var User = require('./lib/User');
app.use(express.static(__dirname));
var Benefits=require('./lib/Benefits')
app.engine('handlebars',handlebars.engine);
/*app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    helpers: {
        toJSON : function(object) {
            return JSON.stringify(object);
        }
    }
}));*/
app.set('view engine','handlebars');
//Before declaring any routes put this line
//-------------using what is in public directory-------------------------------
//app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//------------------------------Connection to mongo database--------------------------------------

mongoose.connect('mongodb://YasminShaaban:chemistry1234@ds161630.mlab.com:61630/client', function(err) {
    if (err) {
    	console.log('error in connection'+err);
    }
});

//-------------------------------------Home page -----------------
app.get('/',function(req,res){
	// res.type('text/plain');
	// res.send('HOME PAGE');
	console.log("homepage");
	res.render('home');
	console.log("after rendering home page");
});
//----------------------------Not used registration dummy trail--------------------
app.post('/register',function(req,res){
	console.log("welcome registration");
	res.render('registration');
	
});
//-------------------------Saving benefits in database--------------------
/*var newbenefit=new Benefits();
newbenefit.zone="new city";
newbenefit.name="El Ezz";
newbenefit.address="El Attaba";
newbenefit.details="bad description";
newbenefit.phonenumber1="400d";
newbenefit.phonenumber2="6005";
newbenefit.phonenumber3="1239";
newbenefit.industry="machines' industry";
newbenefit.postaladdress="4 yawkey way boston ma";
newbenefit.latitude=50;
newbenefit.longitude=42;
var lati=5;
var longi=6;
var options = {
    provider: 'google',
	// Optional depending on the providers
    httpAdapter: 'https', // Default
    //apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder();

// Using callback
geocoder.geocode('29 champs elysée paris', function(err, res) {
    console.log("google"+res);
});
where.is(newbenefit.postaladdress, function(err, result) {
	lati= result.get('lat');
	 console.log( lati);
     longi= result.get('lng');
    console.log( longi);
});
newbenefit.latitude=lati;
newbenefit.longitude=longi;
newbenefit.save(function(err , savedObject){
    console.log('hellow save benefits');
    if(err){
        console.log(err);
        console.log("error in saving benefits");
        //return res.status(500).send();
    }else{
        console.log('no error in saving benefits');
        //return res.status(200).send();
    }
});
*/
//-------------------------------Login Profile page after authentication occurs---------------------
app.post('/login', function(req,res){
	var username = req.body.userid; //req.body.userid should be defined in the handlebars file as name="userid"
	var password = req.body.pswrd;
	console.log(username);
	console.log(password);
	User.findOne({username:username,password:password},function(err, user){
		if(err){
			console.log("error")
			console.log(err);
			return res.status(500).send();
			res.render('500')
		}
		if(!user){
			console.log("not found");
            console.log(user);
            return res.status(404).send();

		}
        console.log(user);
        Benefits.find({},function (err,foundData) {
            if(err){
                console.log(err);
                res.status(500).send();
            }
            else{
                if(!foundData){
                    console.log("no data found");
                }
                console.log(foundData);
                var content=JSON.stringify(foundData);
                //var benefits="benefits"+":"+content+"}";
                fs.writeFile('benefits.json',content,function (err) {
                	if(err)
                    return console.log(err);
                });
                console.log("The file was saved!");
                res.sendFile(__dirname+"/benefits.html");


            }
        });


	});
});
//--------------------- Trail of registration and saving in database not used--------------
app.get('/db',function(req,res){
	console.log("hellooooo db ");
	User.find({},function(err,foundData){

		if(err){
		console.log(err);
		res.status(500).send();
	}
	else{
		if(!foundData){
			console.log("no data found");
		}
		console.log(foundData.username);
		console.log(foundData.password);
		console.log(foundData.firstname);
		console.log(foundData.lastname);
		console.log("found! :)");
	}

	});
});
//-----------------------------
app.get('/index', function(req, res) {
    res.sendFile(__dirname+"/benefits.html");
});

//---------------------------Saving in database registration saving--------------------
app.post('/register2',function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	var firstname= req.body.firstname;
	var lastname=req.body.lastname;

	var newuser = new User();
	newuser.username=username;
	newuser.password=password;
	newuser.firstname=firstname;
	newuser.lastname=lastname;

	console.log(username);
		console.log(password);
		console.log(firstname);
		console.log(lastname);
		console.log('da5el 3ala el saving');

	newuser.save(function(err , savedObject){
		console.log('hellow SAVE');
		if(err){
			console.log(err);
			console.log("error in saving data");
			return res.status(500).send();
		}else{


		console.log('no error before redirecting');
		res.render('home');
		console.log('no error after redirecting');
		//return res.status(200).send();
	}
	});
	//res.render('home');
	//console.log("after second redirecting");

});
//-------------------------Trail of login profile page----------------------------------
app.post('/process',function(req,res){ // when requesting posting /process do that
	console.log('smdasdasdasd');
	console.log(req.body.pswrd);
	console.log(req.body.userid);
	res.render('process');

});
//---------------------------About page----------------------------
app.get('/about',function(req,res){
	console.log('abouhht');
	res.render('about');
});
//-------------------- Login session not completed -----------------------
app.get('/dashboard',function (req,res) {
	if(!loggedIn){
		return res.status(401).send();
	}
	return res.status(200).send();

});

//---------------------------------Not found 404 Error page-----------------------
app.use(function(req, res, next){ 
	console.log("404");
	res.status(404);
	res.render('404');
});
//-------------------------------500 middle ware  error handler  500 Error page
app.use(function(err, req, res, next){ 
	console.error(err.stack);
	console.log("500");
	res.status(500);        
	res.render('500');
});

//--------------------Listen to 3000 port -----------------------------------
//app.set('port',process.env.PORT||3000);
//app.use(express.static(__dirname + '/public'));
// app.engine('handlebars',handlebars.engine);
// app.set('view engine','handlebars');
app.listen(3000,function(){
	console.log("express started");
});
//module.exports = app;


