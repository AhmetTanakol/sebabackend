var Wishlist = require('./wishlistSchema');

module.exports.list = function(req, res) {
  Wishlist
    .find()
    .exec(function (err, wishlist) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(wishlist);
    });
};


// Create endpoint /api/wishlist/:refugee_id for GET
module.exports.getWishlistByRefugeeId = function(req, res) {
    // Use the Wishlist model to find a specific Wishlist based on refugee_id
	var myquery = { refugee: req.params.refugee_id, isDeleted : false }
    Wishlist.find(myquery, function(err, wish) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(wish);
    });
};