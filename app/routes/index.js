module.exports = function(app) {
  var volunteer = require("../controllers/volunteer.js");
  var lift = require("../controllers/lifts.js");

  // Create a new Note
  app.post("/volunteer", volunteer.create);
  app.post("/volunteers/donors", volunteer.getDistance);
  app.post("/volunteers/foodbank", volunteer.getDistanceBanks);
  app.post("/lift/request", lift.requestLift);
  app.post("/volunteer/availability", volunteer.acceptText);
  app.get("/volunteer", volunteer.findAll);
};
