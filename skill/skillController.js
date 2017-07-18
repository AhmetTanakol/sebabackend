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

module.exports.getSkill = function (req, res) {
    Skill
        .findById(req.params.skill_id)
        .exec(function (err, skill) {
            errorcheck(err);
            res.status(201).json(skill);
        })
}

function errorcheck(err){
    if (err) {
        res.status(500).send(error);
        return;
    }
}
