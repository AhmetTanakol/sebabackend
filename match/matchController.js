var Match = require('./matchSchema');
var Refugee = require('./../refugee/refugeeSchema');
var Company = require('./../company/companySchema');

var async = require('async');

module.exports.matchWithCompany = function (req, res) {
  async.seq(
    function(cb) {
      Refugee
        .findOne({ user:  req.body.params.user._id })
        .select('_id')
        .exec(function (err, refugee) {
          if (err) {
            cb(err);
            return;
          }
          cb(null, refugee);
        });
    },
    function(refugee, cb) {
      var query = {
        company: req.body.params.job.company._id,
        refugee: refugee._id,
        job: req.body.params.job._id,
        isAddedByRefugee: false
      };
      Match
        .findOne(query)
        .exec(function(err, match) {
          if (err) {
            cb(err);
            return;
          }
          if (match) {
            match.isAddedByRefugee = true;
            match.save(cb);
            return;
          }
          var newMatch = new Match({
            company: req.body.params.job.company._id,
            refugee: refugee._id,
            job: req.body.params.job._id,
            isAddedByRefugee: true
          });
          newMatch.save(function (saveError) {
            if (saveError) {
              cb(saveError);
              return;
            }
            cb();
          });
        });
    }
  )(function(error) {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send({'status' : 'successful'});
  });
};


module.exports.matchWithRefugee = function (req, res) {
  async.seq(
    function(cb) {
      Company
        .findOne({ user:  req.body.params.user._id })
        .select('_id')
        .exec(function (err, company) {
          if (err) {
            cb(err);
            return;
          }
          cb(null, company);
        });
    },
    function(company, cb) {
      var query = {
        company: company._id,
        refugee: req.body.params.refugee._id,
        job: req.body.params.job,
        isAddedByCompany: false
      };
      Match
        .findOne(query)
        .exec(function(err, match) {
          if (err) {
            cb(err);
            return;
          }
          if (match) {
            match.isAddedByCompany = true;
            match.save(cb);
            return;
          }
          var newMatch = new Match({
            company: company._id,
            refugee: req.body.params.refugee._id,
            job: req.body.params.job._id,
            isAddedByCompany: true
          });
          newMatch.save(function (saveError) {
            if (saveError) {
              cb(saveError);
              return;
            }
            cb();
          });
        });
    }
  )(function(error) {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send({'status' : 'successful'});
  });
};
