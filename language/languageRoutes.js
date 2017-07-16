module.exports = languageRoutes;

function languageRoutes(passport) {

    var languageRoutesController = require('./languageController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));
	
	router.get('/', languageRoutesController.list);

    return router;
}
