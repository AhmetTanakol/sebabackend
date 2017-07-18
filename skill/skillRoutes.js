module.exports = skillRoutes;

function skillRoutes(passport) {

    var skillController = require('./skillController');

    var router = require('express').Router();
    var unless = require('express-unless')

    var mw = passport.authenticate('jwt', {session: false});

    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.route('/')
        .get( skillController.list)
        // .post( skillController.addSkill);
    router.route('/:skill_id')
        .get(skillController.getSkill)

    return router;
}
