var Country = require('./countrySchema');

module.exports.list = function(req, res) {
  Country
    .find()
    .exec(function (err, countries) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(countries);
    });
};
