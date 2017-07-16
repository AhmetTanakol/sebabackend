module.exports = industryRoutes;

function industryRoutes(passport) {

    var industryRoutesController = require('./industryController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.get('/', industryRoutesController.list);

    return router;
}
