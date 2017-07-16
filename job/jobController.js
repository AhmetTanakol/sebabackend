var Job = require('./jobSchema');
var User = require('./../user/userSchema');
var Company = require('./../company/companySchema');
var Skill = require('./../skill/skillSchema');
var async = require('async')

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

    var skills = req.body.skills;
    for (var i = 0, len = skills.length; i < len; i++){
        job.skills.push({
                name: skills[i]._id,
                power: skills[i].power
            });
    }
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
module.exports.getJobsForUser = function (req, res) {
    Job
        .find({company: getCompanyFromUser(req.params.user_id)})
        .exec(function(err, jobs) {
            if(err){
                res.status(500).send(err);
                return;
            }
            res.status(201).json(jobs);
    })
}

function getSkillNameList(inputSkills, cb) {
    var skillsWithName =[];
    async.each(inputSkills,function (inSkill, callback) {
        Skill.findOne({_id: inSkill.name})
            .exec(function (err, dbSkill){
                errorcheck(err);
                var newSkill = {
                    _id: dbSkill['_id'],
                    name: dbSkill['name'],
                    power: inSkill['power']
                };
                skillsWithName.push(newSkill);
                callback()
            });
        }, function (err) {
            if (err) {
                console.log('Error Building SkillList: '+err);
            } else {
                if(skillsWithName.length == inputSkills.length) {
                    console.log("setting Skilllist: done "+skillsWithName);
                    if(typeof cb == "function") {
                        cb(skillsWithName);
                    }
                } else {

                    console.log("Skilllst: length mistmach");
                }
            }
        }


    );
}

// Create endpoint /api/jobs/:job_id for GET
module.exports.getJob = function (req, res) {
    Job
        .findById(req.params.job_id)
        .exec(function (err, job) {
            console.log('processing job :'+job.title);
            errorcheck(err);
            getSkillNameList( job.skills , function (skillsWithName) {
                    job.skills = skillsWithName;
                    console.log('job which will be returend: '+job);
                    res.status(201).json(job);
                }
            );

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
                console.log(err);
                res.status(500).send(err);
                return;
            } else {
                console.dir(user);
                return user.company['_id']
            }
        })
}










// Create endpoint /api/job/jobs for POST
module.exports.getJobs = function(req, res) {
	
    // Use the Job model to find jobs in array
	var myquery = { _id: { $in: req.body.params.job_ids } };
    Job.find(myquery, function(err, jobs) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(jobs);
    });
};
