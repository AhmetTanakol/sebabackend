var Education = require('./educationSchema');

// Create endpoint /api/education/:refugee_id for GET
module.exports.getEducationsByRefugeeId = function(req, res) {
    // Use the Education model to find a specific education based on refugee_id
	var myquery = { refugee: req.params.refugee_id }
    Education.find(myquery, function(err, edu) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(edu);
    });
};
