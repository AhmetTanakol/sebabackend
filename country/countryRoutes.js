module.exports = countryRoutes;

function countryRoutes(passport) {

    var countryRoutesController = require('./countryController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.get('/', countryRoutesController.list);

    return router;
}
