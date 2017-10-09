var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var nodemailer = require('nodemailer');
var fetch = require('isomorphic-fetch');
var request = require('superagent');

var Participant = mongoose.model('Participant');

var transporter = nodemailer.createTransport({
    host: 'mail.dinkevents.com',
    port: 26,
    secure: false,
    tls: {
        rejectUnauthorized:false
    },
  auth: {
    user: 'noreply@dinkevents.com',
    pass: 'Tornado13245678'
  }
});



/* Call sub-routes */
router.use('/', require('./middleware.js'))
router.use('/user', require('./users.js'));
router.use('/product', require('./product.js'));
router.use('/participant', require('./participant.js'));
router.use('/busstop', require('./busstop.js'));


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/bus', function(req,res,next){

	var BusStopCode = req.query.BusStopCode	//1619
	console.log(BusStopCode)
	request
		//.get('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=83139')
		.get('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode='+ BusStopCode)
		.set('AccountKey', 'rye8ZK3+QHutdz5yd8JPJw==')
		.set('Accept', 'application/json')
		.end(function(err, data){
		 if (err || !data.ok) {
		   console.log('Oh no! error');
		 } else {
		   	console.log("data body is ", data.body);
		 	res.json(data.body)
		 }
	});
	
})

router.post('/email', function(req,res,next){

	console.log('req.body is ', req.body)


	var mailOptions = {
	  from: 'noreply@dinkevents.com',
	  to: req.body.emailPost,
	  subject: req.body.subjectPost,
	  text: req.body.messagePost,

      attachments: [
        // String attachment
       {
	  		filename: req.body.recipePost, 
	  		path:"./app/public/files/" + req.body.recipePost
	  	},
	  	]
	};
	
	transporter.sendMail(mailOptions, function(error, info){
	  
	  if (error) {

	    console.log(error);
	    return next(err);

	  } else {
	    console.log('Email sent: ' + info.response);

	    //save the participant when successful.
    	var participant = new Participant({
			email: req.body.emailPost,
			recipe: req.body.recipePost
		});

		participant.save(function(err){
			if(err){return next(err);}
			//return true if successful.
			res.send(true)
		});
	    
	  }
	});

})

// Catch all for 404 error.
router.use(function(req,res,next){
	console.log ('call error');
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
})

module.exports = router;
