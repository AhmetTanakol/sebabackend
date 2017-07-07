module.exports = matchRoutes;

function matchRoutes(passport) {

    var matchRoutesController = require('./matchController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.post('/matchWithRefugee', matchRoutesController.matchWithRefugee);
    router.post('/matchWithCompany', matchRoutesController.matchWithCompany);

    return router;
}
