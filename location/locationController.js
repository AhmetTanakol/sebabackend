var Location = require('./locationSchema');

module.exports.list = function(req, res) {
  Location
    .find()
    .exec(function (err, locations) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(locations);
    });
};
