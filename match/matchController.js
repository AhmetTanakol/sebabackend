var Match = require('./matchSchema');

module.exports.matchWithCompany = function (req, res) {
  var query = {
    company: req.body.params.job.company._id,
    refugee: req.body.params.user.refugee,
    job: req.body.params.job._id,
    isAddedByRefugee: false
  };

  Match
    .findOne(query)
    .exec(function(err, match) {
      if (err) {
        res.status(500).send(error);
        return;
      }
      if (match) {
        match.isAddedByRefugee = true;
        match.save();
        res.status(200).send({'status' : 'successful'});
        return;
      }
      var newMatch = new Match({
        company: req.body.params.job.company._id,
        refugee: req.body.params.user.refugee,
        job: req.body.params.job._id,
        isAddedByRefugee: true
      });
      newMatch.save(function (saveError) {
        if (saveError) {
          res.status(500).send(saveError);
          return;
        }
        res.status(200).send({'status' : 'successful'});
      });
    });
};


module.exports.matchWithRefugee = function (req, res) {
  var query = {
    company: req.body.params.user.company,
    refugee: req.body.params.refugee._id,
    job: req.body.params.job,
    isAddedByCompany: false
  };
  Match
    .findOne(query)
    .exec(function(err, match) {
      if (err) {
        res.status(500).send(error);
        return;
      }
      if (match) {
        match.isAddedByCompany = true;
        match.save();
        res.status(200).send({'status' : 'successful'});
        return;
      }
      var newMatch = new Match({
        company: req.body.params.user.company,
        refugee: req.body.params.refugee._id,
        job: req.body.params.job,
        isAddedByCompany: true
      });
      newMatch.save(function (saveError) {
        if (saveError) {
          res.status(500).send(saveError);
          return;
        }
        res.status(200).send({'status' : 'successful'});
      });
    });
};

// Create endpoint /api/match/getMatchedJobsAtRefugee/:refugee_id for GET
module.exports.getMatchedJobsAtRefugee = function(req, res) {
    // Use the Match model to find a specific job match based on refugee_id
	var myquery = { 
		refugee: req.params.refugee_id, 
		isAddedByCompany : true,
		isAddedByRefugee : true
	}
    Match.find(myquery, function(err, jobs) {
        if (err) {
            res.status(500).send(err)
            return;
        };
        res.json(jobs);
    });
};

// Create endpoint /api/match/getMatchedJobsAtRefugee/:refugee_id for GET
module.exports.getMatchedJobsAtCompany = function(req, res) {
    // Use the Match model to find a specific candidate match based on company_id
	var myquery = { 
		company: req.params.company_id, 
		isAddedByCompany : true,
		isAddedByRefugee : true
	}
    Match.find(myquery, function(err, candidate) {
        if (err) {
            res.status(500).send(err)
            return;
        };
        res.json(candidate);
    });
};
