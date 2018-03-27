var axios = require('axios');

var Volunteer = require('../models/volunteer.js');
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyD_LPYQsjwLnEh1fcK74vSsytYgvWHndZQ'
});


// Create and Save a new Note
exports.create = function (req, res) {
    // Create and Save a new Note
    if (!req.body.name) {
        return res.status(400).send({ message: "Name can not be empty" });
    }

    var volunteer = new Volunteer({ name: req.body.name, phone: req.body.phone, postalCode: req.body.postalCode, availability: req.body.availability });

    volunteer.save(function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({ message: "Some error occurred while creating the Note." });
        } else {
            res.send(data);
        }
    });
};
mapsCall = (origin, dest) => {
    return axios({
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${dest}&key=AIzaSyD_LPYQsjwLnEh1fcK74vSsytYgvWHndZQ`,
    })
}
getVolunteers = (origin, dest) => {
    return Volunteer.find()
}
exports.getDistance = function (req, res) {
    var postalCodes = []
    if (!req.body) {
        return res.status(400).send({ message: "Body can not be empty" });
    }
    let distancevolunteers = this.getVolunteers()
    distancevolunteers.then((vol) => {
        vol.forEach((volunteer) => {
            postalCodes.push(volunteer.postalCode)
        })
        let promises = postalCodes.map((postalcode) => {
            return this.mapsCall(req.body.origin,postalcode)
        })
        Promise.all(promises).then((values) => {
            let valData = values.map((item,index) => {
                return {
                    data: item.data.rows[0].elements[0],
                    volunteer: vol[index]
                }
            }).sort(function(a, b) {
                let itemA = a.data.duration.value // ignore upper and lowercase
                let itemB = b.data.duration.value // ignore upper and lowercase
                if (itemA < itemB) {
                  return -1;
                }
                if (itemA > itemB) {
                  return 1;
                }
                return 0;
              })

              let timeSorted = valData.filter((item) => {
                  let bool = false
                   req.body.availability.forEach((available) => {
                      item.volunteer.availability.forEach((volAvail) => {
                         if(available.day.toLowerCase() === volAvail.day.toLowerCase()){
                             bool =  true
                         }
                      })
                  })
                  return bool
               }).filter((item) => {
                let bool = false
                 req.body.availability.forEach((available) => {
                    item.volunteer.availability.forEach((volAvail) => {
                       if(volAvail.day.toLowerCase() === available.day.toLowerCase()){
                           if((volAvail.timeStart.hour >= available.timeStart.hour) && (volAvail.timeStart.hour < available.timeFinish.hour)){
                            bool =  true
                           }
                       }
                    })
                })
                return bool
             })
            // return res.status(200).send(valData)
            return res.status(200).send(timeSorted)
          }).catch((error) =>{
              console.log(error)
          });
    })
};

exports.getDistanceBanks = function (req, res) {
    var postalCodes = []
    if (!req.body) {
        return res.status(400).send({ message: "Body can not be empty" });
    }
    let distancevolunteers = this.getVolunteers()
    distancevolunteers.then((vol) => {
        vol.forEach((volunteer) => {
            postalCodes.push(volunteer.postalCode)
        })
        let promises = postalCodes.map((postalcode) => {
            return this.mapsCall(req.body.origin,postalcode)
        })
        Promise.all(promises).then((values) => {
            let valData = values.map((item,index) => {
                return {
                    data: item.data.rows[0].elements[0],
                    volunteer: vol[index]
                }
            }).sort(function(a, b) {
                let itemA = a.data.duration.value // ignore upper and lowercase
                let itemB = b.data.duration.value // ignore upper and lowercase
                if (itemA < itemB) {
                  return -1;
                }
                if (itemA > itemB) {
                  return 1;
                }
                return 0;
              })
            return res.status(200).send(valData)
          }).catch((error) =>{
              console.log(error)
          });
    })
}

exports.findAll = function (req, res) {
    // Retrieve and return all notes from the database.
    Volunteer.find(function(err, volunteers){
        if(err) {
            console.log(err);
            res.status(500).send({message: "Some error occurred while retrieving volunteers."});
        } else {
            res.send(volunteers);
        }
    });
};

exports.findOne = function (req, res) {
    // Find a single note with a noteId

};

exports.update = function (req, res) {
    // Update a note identified by the noteId in the request

};

exports.delete = function (req, res) {
    // Delete a note with the specified noteId in the request

};