var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var nodemailer = require('nodemailer');
var fetch = require('isomorphic-fetch');
var request = require('superagent');

/* Call sub-routes */
router.use('/busstop', require('./busstop.js'));


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/data', function(req,res){
	res.json([
		{"name": "test1", "email": "test2"}, 
		{"name": "test1", "email": "test2"}
	])
})


// Catch all for 404 error.
router.use(function(req,res,next){
	console.log ('call error');
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
})

module.exports = router;
