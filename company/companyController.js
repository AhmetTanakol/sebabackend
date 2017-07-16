var Company = require('./companySchema');
var Job = require('./../job/jobSchema');
var Match = require('./../match/matchSchema');

var async = require('async');
var _ = require('lodash');

module.exports.findCompanies = function(req, res) {
  async.seq(
    function(cb) {
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
      Company
        .find(companyQuery)
        .exec(function (error, companies) {
          if (error) {
            cb(error);
            return;
          }
          cb(null, companies);
        });
    },
    function (companies, cb) {
      if (_.isEmpty(companies)) {
        cb(null, []);
        return;
      }
      var jobQuery = {
        company: {
          $in: _.uniq(_.map(companies, '_id'))
        }
      };
      if (req.query.skill) {
        jobQuery.skills = {
          $in: [req.query.skill]
        };
      }

      Job
        .find(jobQuery)
        .populate({
          path: 'company'
        })
        .exec(function (err, jobs) {
          if (err) {
            cb(err);
            return;
          }
          cb(null, jobs);
        });
    },
    function(jobs, cb) {
      if (_.isEmpty(jobs)) {
        cb(null, []);
        return;
      }
      var filteredJobs = [];
      var matchQuery = {
        refugee: req.query.user,
        job: {
          $in: _.map(jobs, '_id')
        },
        isAddedByRefugee: true
      };

      Match
        .find(matchQuery)
        .select('job')
        .exec(function (err, matches) {
          if (err) {
            cb(err);
            return;
          }
          var jobIds = _.map(matches, 'job');
          if (!_.isEmpty(matches)) {
            filteredJobs = _.filter(jobs, function(job) {
              return !_.includes(jobIds, job._id);
            });
          } else {
            filteredJobs = jobs;
          }
          cb(null, filteredJobs);
        });
    }
  )(function(error, jobs) {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).json(jobs);
  });
};
