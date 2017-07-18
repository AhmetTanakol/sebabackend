var Certificate = require('./certificateSchema');

// Create endpoint /api/certificates/:refugee_id for GET
module.exports.getCertificatesByRefugeeId = function(req, res) {
    // Use the Certificate model to find a specific Certificate based on refugee_id
	var myquery = { refugee: req.params.refugee_id, isDeleted : false }
    Certificate.find(myquery, function(err, cert) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(cert);
    });
};
