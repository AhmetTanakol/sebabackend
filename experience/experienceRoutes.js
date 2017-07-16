module.exports = experienceRoutes;

function experienceRoutes(passport) {

    var experienceRoutesController = require('./experienceController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));
	
	router.route('/:refugee_id').get(experienceRoutesController.getExperiencesByRefugeeId);

    return router;
}
