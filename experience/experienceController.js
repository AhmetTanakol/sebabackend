var Experience = require('./experienceSchema');

// Create endpoint /api/experience/:refugee_id for GET
module.exports.getExperiencesByRefugeeId = function(req, res) {
    // Use the Experience model to find a specific experience based on refugee_id
	var myquery = { refugee: req.params.refugee_id }
    Experience.find(myquery, function(err, exp) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(exp);
    });
};