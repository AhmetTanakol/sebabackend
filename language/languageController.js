var Language = require('./languageSchema');

module.exports.list = function(req, res) {
  Language
    .find()
    .exec(function (err, languages) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(languages);
    });
};