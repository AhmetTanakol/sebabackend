module.exports = refugeeRoutes;

function refugeeRoutes(passport) {

    var refugeeRoutesController = require('./refugeeController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.get('/findRefugees', refugeeRoutesController.findRefugees);
	
	router.route('/:refugee_id')
        .get(refugeeRoutesController.getRefugee)
        .put(refugeeRoutesController.putRefugee);
	
    return router;
}
