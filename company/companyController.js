var Company = require('./companySchema');
var Job = require('./../job/jobSchema');
var _ = require('lodash');

module.exports.findCompanies = function(req, res) {
  var companyQuery = {};
  if (req.query.location) {
    companyQuery.location = {
      $in: [req.query.location]
    };
  }

  if (req.query.industry) {
    companyQuery.industry = {
      $in: [req.query.industry]
    };
  }

  var jobQuery = {};
  if (req.query.skill) {
    jobQuery.skills = {
      $in: [req.query.skill]
    };
  }

  Job
    .find(jobQuery)
    .populate({
      path: 'company',
      match: companyQuery
    })
    .exec(function (err, jobs) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(jobs);
    });
};
