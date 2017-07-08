var Skill = require('./skillSchema');
var _ = require('lodash');

module.exports.list = function(req, res) {
  Skill
    .find()
    .exec(function (err, skills) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(_.uniqBy(skills, 'name'));
    });
};


