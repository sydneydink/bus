// This is a default REST route template. 
// This  need to be registered in the route index file using
// router.use('/product', require('./product.js'));

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var request = require('superagent');
var config = require('../../config/config');
/********************************/
/********** CONFIG **************/
/********************************/
var modelName = 'Busstop'; 
var Model = mongoose.model('Busstop'); 
var viewShowAll = "busstop/show-all";
var viewShowOne = "busstop/show-one";
var viewCreateOne = "busstop/create-one";


/********************************/
/********** ROUTES **************/
/********************************/
/*Params */
router.param('param', param);

/* Render view file */
router.get('/', showAll);	//sometimes issue if without trailing slash
router.get('/show', showAll);
router.get('/create', createOne);
router.get('/id/:param', showOne);

/*CRUD calls */
router.post('/api/create', create); //create one
router.get('/api/all', getAll); //show all
router.get('/api/:param', getOne); //show one
router.post('/api/update/:param', update); //update one
router.post('/api/delete/:param', deleteOne); //delete one


/* Custom Routes */
router.get('/timing', function(req,res,next){

	console.log("Bus stop code is ", req.query.BusStopCode)
	var BusStopCode = req.query.BusStopCode	//1619
	if (BusStopCode == 'null'){
		BusStopCode = '66339'
	}
	
	request
		//.get('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=83139')
		.get('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode='+ BusStopCode)
		.set('AccountKey', 'rye8ZK3+QHutdz5yd8JPJw==')
		.set('Accept', 'application/json')
		.end(function(err, data){
		 if (err || !data.ok) {
		   console.log('Oh no! error at request');
		 } else {
	   		Model.findOne (
				{busSt: BusStopCode},
				function (err, model){
					console.log("model is ", model);
					if(err) {
						return next(err);
						console.log(err);
					}
					if(!model){

						console.log("no model");
						res.json(data.body)
						return;
					}
					data.body.model = model
					data.body.Services.sort((x, y)=>{
						var time1 = new Date(x.NextBus.EstimatedArrival)
						var time2 = new Date(y.NextBus.EstimatedArrival)
						return (time2 - time1)
					})
					res.json(data.body)
				}
			)
		 
		 }
	});
	
})


/* CB functions */
function param (req, res, next, id){
	var query = Model.findById(id);
	query.exec (function (err, data){
		if (err) return next (err);
		if (!data) return next (new Error ('can\'t find data'))
		req.model = data;
		return next();
	});
}

function showAll (req, res, next){
	Model.find(
		{}, // find all
		function(err,models){
			if(err) return next(err);

			res.render( viewShowAll , {
				models: models, 
				modelName: "Busstop"
			});
		})
}

function showOne(req, res){
	Model.findById (
		req.model._id,
		function (err, model){
			console.log("id is " + model.name)
			if(err) return next(err);
			res.render(viewShowOne , {
				model: model, 
				modelName: "Busstop"
			});
		}
	)
}

function createOne(req, res){
	res.render(viewCreateOne)
}

/* CRUD CALLS */
function create (req, res, next){
	//if(req.body.auth == config.auth){
		var model = new Model(req.body);

		model.save(function(err){
			if(err){return next(err);}
			res.send("Create success. Click back and reload")
		});
	//} else {
	//	res.send("200 error");
	//}

}

function getAll (req, res, next){
	Model.find (function (err, model){
		if(err) return next(err);
		res.json(model);
	})
}

function getOne (req, res, next){
	Model.find (
		{_id: req.model._id},
		function (err, model){
			if(err) return next(err);
			res.json(model);
		}
	)
}

function update (req, res, next){
	//if(req.body.auth==config.auth){
		Model.findOneAndUpdate(
			{_id: req.model._id},
			req.body,
			function (err, updatedModel){
				if(err) return next(err);
				res.send("update successful");
			}
		)
	//} else {
	//	res.send("200 error");
	//}
}

function deleteOne (req, res){
	if(req.body.auth==config.auth){
		Model.find({_id: req.model._id}).remove().exec();
		res.send('deleted');
	} else {
		res.send("200 error");
	}
}

module.exports = router;