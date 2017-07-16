var Config = require('../config/config.js');
var User = require('./userSchema');
var Refugee = require('./../refugee/refugeeSchema');
var Company = require('./../company/companySchema');
var jwt = require('jwt-simple');

module.exports.login = function(req, res){

    if(!req.body.email){
        res.status(400).send('email required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }

    User.findOne({email: req.body.email}, function(err, user){
        if (err) {
            res.status(500).send(err);
            return
        }

        if (!user) {
            res.status(401).send('Invalid Credentials');
            return;
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if(!isMatch || err){
                res.status(401).send('Invalid Credentials');
            } else {
                res.status(200).json({token: createToken(user)});
            }
        });
    });

};

module.exports.signup = function(req, res){
    if(!req.body.email){
        res.status(400).send('email required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }

    var user = new User();

    user.email = req.body.email;
    user.password = req.body.password;
    user.type = req.body.type;

    user.save(function(err, newUser) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if (user.type === 'refugee') {
          var newRefugee = new Refugee({
            user: newUser
          });
          newRefugee.save(function(saveError,createdRefugee) {
            if (saveError) {
              res.status(500).send(saveError);
              return;
            }
            user.refugee = createdRefugee._id;
            user.save();
            res.status(201).json({token: createToken(user)});
          });
        } else {
          var newCompany = new Company({
            user: newUser
          });
          newCompany.save(function(saveError,createdCompany) {
            if (saveError) {
              res.status(500).send(saveError);
              return;
            }
            user.company = createdCompany._id;
            user.save();
            res.status(201).json({token: createToken(user)});
          });
        }
    });
};

module.exports.unregister = function(req, res) {
    req.user.remove().then(function (user) {
        res.sendStatus(200);
    }, function(err){
        res.status(500).send(err);
    });
};

module.exports.getUsers =
//todo remove
    function (req, res) {
    User.find(function(err, users) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(users);
    });
}


function createToken(user) {
    var tokenPayload = {
        user: {
            _id: user._id,
            email: user.email,
            type: user.type
        }
    };
    if (user.type === 'refugee') {
      tokenPayload.user.refugee = user.refugee;
    } else {
      tokenPayload.user.company = user.company;
    }
    return jwt.encode(tokenPayload,Config.auth.jwtSecret);
};
