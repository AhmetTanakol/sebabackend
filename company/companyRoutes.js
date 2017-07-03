module.exports = companyRoutes;

function companyRoutes(passport) {

    var companyRoutesController = require('./companyController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    return router;
}
