var Job = require('./jobSchema');
var Company = require('./../company/companySchema');
var async = require('async');

module.exports.list = function(req, res) {
  async.seq(
    function(cb) {
      Company
        .findOne({ user: req.query.user })
        .exec(function(err, company) {
          if (err) {
            cb(err);
            return;
          }
          if (!company) {
            var companyNotFound = new Error('Company not found');
            companyNotFound.status = 400;
            cb(companyNotFound);
            return;
          }
          cb(null, company);
        });
    },
    function (company, cb) {
      Job
        .find({ company: company._id })
        .exec(function (err, jobs) {
          if (err) {
            cb(err);
            return;
          }
          cb(null, jobs);
        });
    }
  )(function(err, jobs) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(jobs);
  });
};

