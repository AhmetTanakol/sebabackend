module.exports = wishlistRoutes;

function wishlistRoutes(passport) {

    var wishlistController = require('./wishlistController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));
	
	router.get('/', wishlistController.list);
	
	router.route('/:refugee_id').get(wishlistController.getWishlistByRefugeeId);

    return router;
}
