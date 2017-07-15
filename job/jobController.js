var Job = require('./jobSchema');
var User = require('./../user/userSchema');
var Company = require('./../company/companySchema');


module.exports.addJob = function (req, res) {
    if(!req.body.user){
        res.status(400).send('user required');
        return;
    }
    if(!req.body.title){
        res.status(400).send('title required');
        return;
    }
    if(!req.body.description){
        res.status(400).send('description required');
        return;
    }
    if(!req.body.startDate){
        res.status(400).send('startDate required');
        return;
    }
    if(!req.body.endDate){
        res.status(400).send('endDate required');
        return;
    }
    if(!req.body.skills){
        res.status(400).send('skills required');
        return;
    }
    var job = new Job();

    job.title = req.body.title;
    job.description = req.body.description;
    job.startDate = req.body.startDate;
    job.endDate = req.body.endDate;
    job.applicants = [];

    //todo skills via datenbank im front oder backend
    var skills = req.body.skills;
    /*var skillIds = [];

    forEachOf(job.skills, function(skill){
        skillIds.ad(skill._id);
    })
    job.skills = skillIds;*/
    /*
    todo check if user is user in data?
    req.user == req.body.user
    */
    if (!req.user.equals(req.body.user)) {
        res.sendStatus(401);
    }


    User.findOne({_id: req.user})
        .exec(function (err, requestingUser) {
            if (err) {
                res.status(500).send(error);
                return;
            }
            if (requestingUser) {
                job.company = requestingUser.company
                job.save(function (err, newJob) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                res.status(201).json(newJob)   ;
                });
            }
        })

    }
module.exports.getJobs = function (req, res) {
    Job
        .find({company: getCompanyFromUser(req.user)})
        .exec(function(err, jobs) {
            if(err){
                res.status(500).send(err);
                return;
            }
            res.status(201).json(jobs);
    })
}

// Create endpoint /api/jobs/:job_id for GET
module.exports.getJob = function (req, res) {
    Job
        .findById(req.params.job_id)
        .exec(function (err, job) {
            errorcheck(err);
            res.status(201).json(job);
        })
}

module.exports.putJob = function (req, res) {
    Job
        .findByIdAndUpdate(req.params.job_id,req.body,
            {//pass the new object to cb function
                new: true,
                //run validations
                runValidators: true})
        .exec(function (err, job) {
            errorcheck(err);
            res.json(job);
        });
}

module.exports.deleteJob = function (req, res) {
    Job
        .findById(req.param.job_id)
        .exec(function (err, job) {
            errorcheck(err);
            job.remove();
            res.sendStatus(200);
        })
}


function errorcheck(err){
    if (err) {
        res.status(500).send(error);
        return;
    }
}
function getCompanyFromUser(userId) {
    User
        .findOne({_id: userId})
        .exec(function (err, user) {
            if (err) {
                res.status(500).send(error);
                return;
            }
            return user.company['_id']
        })
}


