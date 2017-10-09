var mongoose = require('mongoose');
 
var busstopSchema = new mongoose.Schema({ 	
  siteNo: {type: String, unique: true},
  finalface: String,
  bsNo: String, 
  description: String, 
  facing: String, 
  busSt: String, 
  panelId: String, 
  mrt: String, 
  busNo: String, 
  chosenPoi: String, 
  distanceFromPoi: String, 
  minsToWalk: String, 
  noOfBusStop: String, 
  remarks: String, 
  image: String, 
});

mongoose.model("Busstop", busstopSchema);