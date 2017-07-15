var Job = require('./jobSchema');

module.exports.list = function(req, res) {
  Job
    .find({ company: req.query.user })
    .exec(function (err, jobs) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(jobs);
    });
};

// Create endpoint /api/job/jobs for POST
module.exports.getJobs = function(req, res) {
	
    // Use the Job model to find jobs in array
	var myquery = { _id: { $in: req.body.params.job_ids } };
    Job.find(myquery, function(err, jobs) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(jobs);
    });
};
