module.exports = educationRoutes;

function educationRoutes(passport) {

    var educationRoutesController = require('./educationController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

	router.route('/:refugee_id').get(educationRoutesController.getEducationsByRefugeeId);
	
    return router;
}
