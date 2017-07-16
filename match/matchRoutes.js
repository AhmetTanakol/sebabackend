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

	router.route('/getMatchedJobsAtRefugee/:refugee_id').get(matchRoutesController.getMatchedJobsAtRefugee);
	router.route('/getMatchedJobsAtCompany/:company_id').get(matchRoutesController.getMatchedJobsAtCompany);
	
    return router;
}
