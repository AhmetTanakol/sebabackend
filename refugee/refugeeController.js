var Refugee = require('./refugeeSchema');

module.exports.findRefugees = function (req, res) {
  var refugeeQuery = {};

  if (req.query.location) {
    refugeeQuery.city = req.query.location;
  }

  if (req.query.skill) {
    refugeeQuery['skills.name'] = req.query.skill;
  }

  if (req.query.gender) {
    refugeeQuery.gender = req.query.gender;
  }

  Refugee
    .find(refugeeQuery)
    .populate('city')
    .exec(function (err, refugees) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(refugees);
    });
};
