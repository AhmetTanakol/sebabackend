var Config = require('./config/config');
/**
 * db connect
 */
var mongoose = require('mongoose');
mongoose.connect([Config.db.host, '/', Config.db.name].join(''),{
    //eventually it's a good idea to make this secure
    user: Config.db.user,
    pass: Config.db.pass
});
/**
 * create application
 */
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
/**
 * app setup
 */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//passport
var passport = require('passport');
var jwtConfig = require('./passport/jwtConfig');
app.use(passport.initialize());
jwtConfig(passport);
/**
 * routing
 */
var userRoutes = require('./user/userRoutes');
var matchRoutes = require('./match/matchRoutes');
var certificateRoutes = require('./certificate/certificateRoutes');
var companyRoutes = require('./company/companyRoutes');
var educationRoutes = require('./education/educationRoutes');
var experienceRoutes = require('./experience/experienceRoutes');
var industryRoutes = require('./industry/industryRoutes');
var jobRoutes = require('./job/jobRoutes');
var languageRoutes = require('./language/languageRoutes');
var locationRoutes = require('./location/locationRoutes');
var refugeeRoutes = require('./refugee/refugeeRoutes');
var skillRoutes = require('./skill/skillRoutes');
//todo add routes here

app.use('/api/user', userRoutes(passport));
app.use('/api/match', matchRoutes(passport));
app.use('/api/certificate', certificateRoutes(passport));
app.use('/api/company', companyRoutes(passport));
app.use('/api/education', educationRoutes(passport));
app.use('/api/experience', experienceRoutes(passport));
app.use('/api/industry', industryRoutes(passport));
app.use('/api/job', jobRoutes(passport));
app.use('/api/language', languageRoutes(passport));
app.use('/api/location', locationRoutes(passport));
app.use('/api/refugee', refugeeRoutes(passport));
app.use('/api/skill', skillRoutes(passport));
module.exports = app;

