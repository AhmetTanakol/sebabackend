module.exports = companyRoutes;

function companyRoutes(passport) {

    var companyRoutesController = require('./companyController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.get('/findCompanies', companyRoutesController.findCompanies);
    // zabir edit to get a company info
    router.get('/:company_id', companyRoutesController.getCompany);
    router.put('/:company_id', companyRoutesController.putCompany);

    return router;
}
