var express = require('express');
var router = express.Router();
var Order = require('../app/models/order.js');
var monk = require('monk');
var jwt = require('jsonwebtoken');

var db = monk('localhost:27017/vidzy');
//var db = monk('mongodb://bhagyashrichhapwale:mlab@123@ds01316.mlab.com:1316/bkcvideorental');

router.use(function(req,res,next){

	//Check header or url parameters or post parameters for token
	

	console.log("Inide checking the token"+req.query.token);
	var token = req.body.token || req.query.token ||req.headers['x-access-token'] || req.token;

	//decode token
	if(token)
	{
		console.log('Inside token found')

		//verifies secret and checks expiry
		jwt.verify(token,'iloveabudi',function(err,decoded){

			if(err)
			{
				return res.json({success:false,message:'Failed to authenticate the token'});
			}
			else
			{
				//if everything is good save to the request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	}
	else
	{
		console.log('inside token not found');
		//if there is no token return error
		return res.json({
			success:false,
			message:'No token provided'
		});
	}

});


console.log("Insdide order file");

router.post('/',function(req,res)
{
	console.log('Inside the order post '+req.body.userid);

	//res.json({sucess:true});

	var order = new Order({
		userid:req.body.userid,
		videoid:req.body.videoid,
		dateoforder:req.body.dateoforder,
		lastname:req.body.lastname,
		orderstatus:req.body.orderstatus
	});

	console.log('Inside the order post');


	order.save(function(err){
		console.log("Inside save func");
		if(err) throw err;

		console.log("Order saved successfully");
		res.json({sucess:true});
	});

});

module.exports = router;
