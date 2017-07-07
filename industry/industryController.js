var Industry = require('./industrySchema');

module.exports.list = function(req, res) {
  Industry
    .find()
    .exec(function (err, industries) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(industries);
    });
};

