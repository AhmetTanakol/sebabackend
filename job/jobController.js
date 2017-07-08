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

