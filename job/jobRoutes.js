module.exports = jobRoutes;

function jobRoutes(passport) {

    var jobController = require('./jobController');
    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));
    // router.get('/', jobController.getJoblist);
    router.post('/', jobController.addJob);

    router.route('/:job_id')
        .get(jobController.getJob)
        .delete(jobController.deleteJob);
    router.route('/:job_id/edit')
        .put(jobController.putJob);

    router.route('/getJobsForUser/:user_id').get(jobController.getJobsForUser)

    return router;
}
