module.exports = jobRoutes;

function jobRoutes(passport) {

    var jobController = require('./jobController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));
    router.get('/', jobController.getJobs);
    router.post('/', jobController.addJob);

    router.route('/:job_id')
        .get(jobController.getJob)
        .put(jobController.putJob)
        .delete(jobController.deleteJob())

    return router;
}
