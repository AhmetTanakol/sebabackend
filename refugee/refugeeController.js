var Refugee = require('./refugeeSchema');
var Match = require('./../match/matchSchema');

var async = require('async');
var _ = require('lodash');
var moment = require('moment');

// Create endpoint /api/refugee/:refugee_id for GET
module.exports.getRefugee = function(req, res) {
    // Use the Refugee model to find a specific refugee
    Refugee.findById(req.params.refugee_id, function(err, refugee) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(refugee);
    });
};

// Create endpoint /api/refugee/:refugee_id for PUT
module.exports.putRefugee = function(req, res) {
    // Use the Refugee model to find a specific refugee and update it
    Refugee.findByIdAndUpdate(
        req.params.refugee_id,
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, refugee) {
        if (err) {
            res.status(500).send(refugee_id);
            return;
        }
        res.json(refugee);
    });
};

module.exports.findRefugees = function (req, res) {
  if(!req.query.job) {
    var jobNotFound = new Error('Job field is missing');
    res.status(400).send(jobNotFound);
    return;
  }
  async.seq(
    function(cb) {
      var refugeeQuery = {};

      if (req.query.location) {
        refugeeQuery.city = req.query.location;
      }

      if (req.query.skill) {
        refugeeQuery['skills.name'] = req.query.skill;
      }

      if (req.query.gender) {
        refugeeQuery.gender = req.query.gender;
      }

      if (req.query.age) {
        var ages = _.split(req.query.age, '-');
        var endAge = Number.parseInt(ages[0]);
        var startAge = Number.parseInt(ages[1]);
        var startDate = moment().subtract(startAge, 'years');
        var endDate = moment().subtract(endAge, 'years');
        refugeeQuery.$and = [
          {
            dateOfBirth: {
              $lte: endDate.toDate()
            }
          },
          {
            dateOfBirth: {
              $gte: startDate.toDate()
            }
          }
        ];
      }
      Refugee
        .find(refugeeQuery)
        .populate('city skills.name')
        .exec(function (err, refugees) {
          if (err) {
            cb(err);
            return;
          }
          cb(null,refugees);
        });
    },
    function(refugees, cb) {
      if (_.isEmpty(refugees)) {
        cb(null, []);
        return;
      }
      var filteredRefugees = [];
      var matchQuery = {
        company: req.query.user,
        job: req.query.job,
        isAddedByCompany: true
      };

      Match
        .find(matchQuery)
        .exec(function (err, matches) {
          if (err) {
            cb(err);
            return;
          }
          if (!_.isEmpty(matches)) {
            filteredRefugees = _.flatten(_.map(matches, function(match) {
              return _.filter(refugees, match.refugee);
            }));
          } else {
            filteredRefugees = refugees;
          }
          cb(null, filteredRefugees);
        });
    }
  )(function(err, refugees) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(refugees);
  });
};

module.exports.updateResume = function (req, res) {
	
	var myresume = req.body.params.refugee;
	var myquery = { _id: req.body.params.refugee._id };
	delete myresume._id;
	Refugee.updateOne(myquery, myresume, function(err, result) {
		if (err) {
          res.status(500).send(err);
          return;
        }
		
        res.status(200).send({'status' : 'successful'});	
	});
};

// Create endpoint /api/refugee/refugees for POST
module.exports.getRefugees = function(req, res) {
	
    // Use the Refugee model to find refugees in array
	var myquery = { _id: { $in: req.body.params.refugee_ids } };
    Refugee.find(myquery, function(err, refugees) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(refugees);
    });
};
