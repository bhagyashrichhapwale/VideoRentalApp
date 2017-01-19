var express = require('express');
var router = express.Router();
var User = require('../app/models/user.js');
var monk = require('monk');
var jwt = require('jsonwebtoken');

var db = monk('localhost:27017/vidzy');
//var db = monk('mongodb://bhagyashrichhapwale:mlab@123@ds01316.mlab.com:1316/bkcvideorental');


console.log("Insdide user set up file");
router.post('/',function(req,res){
	console.log('Inside the setup');

	//res.json({sucess:true});

	var newUser = new User({
		name: req.body.name,
		password:req.body.password,
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		emailid:req.body.emailid,
		address1:req.body.address1,
		address2:req.body.address2,
		city:req.body.city,
		state:req.body.state,
		zipcode:req.body.zipcode,
		admin:false
	});



	newUser.save(function(err){
		if(err) throw err;

		console.log("User saved successfully");
		res.json({sucess:true});
	});

});


router.post('/authenticate',function(req,res,next)
{
	console.log("Inside authenticate");
	console.log(req.body.name);

	var User = db.get('users');
/*
	User.find({},function(err,users)
	{
		if(err) throw err;
		
		res.json(users);
	});
*/
	User.findOne({
		name:req.body.name
	},function(err,user){
		if(err) throw err;

		if(!user)
		{
			res.json({sucess:false,message:"User not found"});
		}
		else
		{
			if(user)
			{
				//Check if password matches
				if(user.password != req.body.password)
				{
					res.json({sucess:false,message:"Incorrect password"});
				}
				else
				{
					console.log("The user entered is correct");

					var token = jwt.sign(user,'iloveabudi',
					{	expiresIn:60*60*24
					});

					console.log("Got the token now sending the response");

					console.log(user);
					console.log(user._id);

					res.json({
						sucess:true,
						message:"Token fetched successfully!",
						token:token,
						admin:user.admin,
						userid:user._id

					});

					req.token = token;

				}
			}
		}
	

	})	
});


module.exports = router;

