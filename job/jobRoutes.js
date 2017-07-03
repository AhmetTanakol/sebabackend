module.exports = jobRoutes;

function jobRoutes(passport) {

    var jobRoutesController = require('./jobController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    return router;
}
