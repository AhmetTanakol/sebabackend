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
                res.status(500).send(err);
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
    async.seq(
        function (cb) {
            getCompanyFromUser(req.params.user_id, function (err, company) {
                if (err){
                    res.status(500).send(err);
                    return
                }
                cb(null, company)
            });

        },
        function (company, cb) {
            console.log('searching jobs for company-id: '+company);
            Job
                .find({company: company})
                .exec(function(err, jobs) {
                    if(err){
                        cb(err,null)
                        return;
                    }
                    cb(null, jobs);
            })
        }
    )(function (err, jobs) {
        if (err){
            res.status(500).send(err);
            return
        }

        res.status(201).json(jobs);
    });
}

function getSkillNameList(inputSkills, cb) {
    var skillsWithName =[];
    async.each(inputSkills,function (inSkill, callback) {
        console.log('searching for skill');
        console.log(inSkill);
        if(inSkill._id == null){
            Skill.findOne({_id: inSkill.name})
                .exec(function (err, dbSkill){
                    if(err){
                        cb(err,null);
                        return;
                    }
                    var newSkill = {
                        _id: dbSkill['_id'],
                        name: dbSkill['name'],
                        power: inSkill['power']
                    };
                    skillsWithName.push(newSkill);
                    callback();
                });
        }else{
            skillsWithName.push(inSkill);
            callback()
        }
        }, function (err) {
            if (err) {
                console.log('Error Building SkillList: '+err);
            } else {
                if(skillsWithName.length == inputSkills.length) {
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
    console.log('getting job for id: '+req.params.job_id)
    Job
        .findById(req.params.job_id)
        .exec(function (err, job) {
            if (err) {
                res.status(500).send(err);
                console.log('get err: '+err);
                return;
            }
            if (job==null) {
                res.status(500).send(job);
                console.log('get err: job empty');
                return;
            }
            console.log('processing job :'+job);
            if(job.skills){
                getSkillNameList( job.skills , function (skillsWithName) {
                        job.skills = skillsWithName;
                        res.status(201).json(job);
                        return;
                    }
                );
            }else{
                res.status(201).json(job);
            }
        })
}


module.exports.putJob = function (req, res) {
    if(!req.body.user){
        res.status(400).send('user required');
        return;
    }
    var job = req.body

    console.log(req.body);

    console.log("req body._id vs params: "+job._id+" "+req.params.job_id)
    console.log('updating job_id: '+req.params.job_id);
    Job
        .findByIdAndUpdate(req.params.job_id,job,
            {//pass the new object to cb function
                new: true,
                //run validations
                runValidators: true})
        .exec(function (err, job) {
            console.log('updateerror: '+err);
            //todo errorscheck not working do it inline
            errorcheck(err, res);
            console.log('returning updated job: '+job);
            res.json(job);
        });
}

module.exports.deleteJob = function (req, res) {
    Job
        .findByIdAndRemove(req.params.job_id)
        .exec(function (err, job) {
            errorcheck(err, res);
            console.log('removed job: '+job.title);
            res.sendStatus(200);
        })
}


function errorcheck(err, res){
    if (err) {
        res.status(500).send(err);
        return;
    }
}






function getCompanyFromUser(userId, cb) {
    User
        .findOne({_id: userId})
        .exec(function (err, user) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
                cb(err, null);
                return;
            } else {
                console.log('found company for user: '+user.email+'; company: '+user.company);
                cb(null,user.company);
                return;
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

module.exports.list = function(req, res) {
  Job
    .find({ company: req.query.user })
    .exec(function (err, jobs) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(jobs);
    });
};