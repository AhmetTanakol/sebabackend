var Config = require('./config/config');
var async = require('async');
var _ = require('lodash');
var mongoose = require('mongoose');
var Chance = require('chance');
var chance = new Chance();
var Company = require('./company/companySchema');
var Language = require('./language/languageSchema');
var Location = require('./location/locationSchema');
var Industry = require('./industry/industrySchema');
var Skill = require('./skill/skillSchema');
var User = require('./user/userSchema');
var Refugee = require('./refugee/refugeeSchema');
var Certificate = require('./certificate/certificateSchema');
var Education = require('./education/educationSchema');
var Experience = require('./experience/experienceSchema');
var Job = require('./job/jobSchema');

var languageObjects = [];
var locationObjects = [];
var industryObjects = [];
var skillObjects = [];
var genders = ['Male', 'Female'];

var companyUsers = [];
var refugeeUsers = [];
var createdRefugees = [];
var createdCompanies = [];

var savedLocations = [];
var savedLanguages = [];
var savedIndustries = [];
var savedSkills = [];

var password = 'asdfg';

var languages = ['Mandarin', 'Spanish', 'English ', 'Hindi',
  'Arabic', 'Portuguese', 'Bengali', 'Russian', 'Japanese',
  'German', 'Telugu', 'Vietnamese', 'Korean', 'French', 'Urdu',
  'Turkish', 'Italian', 'Thai', 'Persian'];
var locations = ['Berlin','Hamburg','München','Köln',
  'Frankfurt','Stuttgart','Düsseldorf','Dortmund','Essen',
  'Leipzig','Bremen','Dresden','Hannover','Nürnberg',
  'Duisburg','Bochum','Wuppertal','Bielefeld','Bonn','Münster'];
var industries = ['Agricultural Services & Products', 'Agriculture', 'Air Transport',
  'Air Transport Unions', 'Airlines', 'Alcoholic Beverages', 'Bars & Restaurants',
  'Beer, Wine & Liquor', 'Books, Magazines & Newspapers', 'Broadcasters, Radio/TV',
  'Builders/General Contractors', 'Builders/Residential', 'Car Dealers, Imports',
  'Car Manufacturers', 'Conservative/Republican', 'Construction', 'Education ',
  'Electric Utilities', 'Electronics Manufacturing & Equipment', 'Farm Bureaus',
  'Farming', 'Food & Beverage', 'Food Processing & Sales', 'Food Products Manufacturing',
  'Foundations, Philanthropists & Non-Profits', 'Funeral Services'];
var skills = ['Aircraft Mechanic', 'Automotive', 'Boilermaker', 'Brick Mason', 'Carpenter',
  'Construction', 'Custodian', 'Electrician', 'EMT / Firefighter',
  'Heavy Equipment Operator', 'Home Health Aide', 'Gardening',
  'Landscaping', 'Groundskeeping', 'Law Enforcement Skills', 'Machinist',
  'Maintenance and Janitorial', 'Painter', 'Pipefitter', 'Plumber',
  'Truck Driver', 'Welder'];
var companies = ['Company1', 'Company2', 'Company3', 'Company4', 'Company5', 'Company6',
  'Company7', 'Company8', 'Company9', 'Company10', 'Company11'];
var users = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6',
  'User7', 'User8', 'User9', 'User10', 'User11'];
var educations = ['Education1','Education2','Education3','Education4','Education5'];
var experiences = ['Experience1','Experience2','Experience3','Experience4','Experience5'];
var certificates = ['Certificate1','Certificate2','Certificate3','Certificate4','Certificate5'];

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len;
  }
  return result;
}

function populateRefugeeInfo(createdRefugeeUser, refugeeUser) {
  var newRefugee = new Refugee({
    user: createdRefugeeUser._id,
    certificates: [],
    city: savedLocations[_.random(0, savedLocations.length - 1)],
    dateOfBirth: new Date(1989, 8, 7),
    description: chance.paragraph({sentences: 3}),
    education: [],
    email: refugeeUser.email,
    experience: [],
    gender: genders[_.random(0, genders.length - 1)],
    language: [],
    skills: [],
    maritalStatus: 'Single',
    phone: chance.phone({ country: "us" }),
    photo: '',
    placeOfBirth: chance.country({ full: true }),
    postalCode: _.random(10000,99999),
    address: chance.address(),
    name: refugeeUser.name
  });
  var randomSkills = getRandom(savedSkills, 5);
  _.each(randomSkills, function(randomSkill) {
    newRefugee.skills.push(_.zipObject(['name','power'],[randomSkill, _.random(0,10)]));
  });
  return newRefugee;
}

function addCertificates(refugee, callbck) {
  var refugeeCertificates = getRandom(certificates, 2);
  async.each(refugeeCertificates, function(certificate, kb) {
    var newCertificate = new Certificate({
      refugee: refugee._id,
      title: certificate,
      from: new Date(2011, 9, 16),
      to: new Date(2012, 9, 16),
      photo: '',
      description: chance.paragraph({sentences: 3})
    });
    newCertificate.save(function(saveError, createdCertificate) {
      refugee.certificates.push(createdCertificate._id);
      refugee.save();
      kb();
    });
  }, function() {
    callbck();
  });
}

function addEducations(refugee, callbck) {
  var refugeeEducations = getRandom(educations, 2);
  async.each(refugeeEducations, function(education, kb) {
    var newEducation = new Education({
      refugee: refugee._id,
      school: education,
      degree: 'Degree',
      fieldOfStudy: 'Field of Study',
      from: new Date(2011, 9, 16),
      to: new Date(2012, 9, 16),
      description: chance.paragraph({sentences: 3})
    });
    newEducation.save(function(saveError, createdEducation) {
      refugee.education.push(createdEducation._id);
      refugee.save();
      kb();
    });
  }, function() {
    callbck();
  });
}

function addExperiences(refugee, callbck) {
  var refugeeExperiences = getRandom(experiences, 2);
  async.each(refugeeExperiences, function(experience, kb) {
    var newExperience = new Experience({
      refugee: refugee._id,
      companyName: 'Company' + _.random(20,30),
      companyLocation: chance.city(),
      title: 'Title',
      from: new Date(2011, 9, 16),
      to: new Date(2012, 9, 16),
      description: chance.paragraph({sentences: 3})
    });
    newExperience.save(function(saveError, createdExperience) {
      refugee.experience.push(createdExperience._id);
      refugee.save();
      kb();
    });
  }, function() {
    callbck();
  });
}

function addRefugeeDetails(refugee, kallback) {
  async.seq(
    function(cbk) {
      addCertificates(refugee, cbk);
    },
    function(cbk) {
      addEducations(refugee, cbk);
    },
    function(cbk) {
      addExperiences(refugee, cbk);
    }
  )(function() {
    kallback();
  });
}

async.seq(
  function(cb) {
    mongoose.connect(Config.mongouri);

    var db = mongoose.connection;
    db.on('error', function (err) {
       cb(new Error(err));
       return;
    });
    db.once('open', function () {
      console.log('db connection is established');
      cb();
      return;
    });
  },
  function(cb) {
    _.each(languages, function(language) {
      var newLanguage = new Language();
      newLanguage.name = language;
      languageObjects.push(newLanguage);
    });
    async.each(languageObjects, function(languageObj, callback) {
        languageObj.save(function(err, savedLanguage) {
          savedLanguages.push(savedLanguage._id);
        });
        callback();
      }, function() {
      cb();
    });
  },
  function(cb) {
    _.each(locations, function(location) {
      var newLocation = new Location();
      newLocation.name = location;
      locationObjects.push(newLocation);
    });
    async.each(locationObjects, function(locationObj, callback) {
      locationObj.save(function(err, savedLocation) {
        savedLocations.push(savedLocation._id);
      });
      callback();
    }, function() {
      cb();
    });
  },
  function(cb) {
    _.each(industries, function(industry) {
      var newIndustry = new Industry();
      newIndustry.name = industry;
      industryObjects.push(newIndustry);
    });
    async.each(industryObjects, function(industryObj, callback) {
      industryObj.save(function(err, savedIndustry) {
        savedIndustries.push(savedIndustry._id);
      });
      callback();
    }, function() {
      cb();
    });
  },
  function(cb) {
    _.each(skills, function(skill) {
      var newSkill = new Skill();
      newSkill.name = skill;
      skillObjects.push(newSkill);
    });
    async.each(skillObjects, function(skillObj, callback) {
      skillObj.save(function(err, savedSkill) {
        savedSkills.push(savedSkill._id);
      });
      callback();
    }, function() {
      cb();
    });
  },
  function(cb) {
    _.each(companies, function(company) {
      var newCompanyUser = new User();
      newCompanyUser.name = company;
      newCompanyUser.type = 'company';
      newCompanyUser.password = password;
      newCompanyUser.email = chance.email();
      companyUsers.push(newCompanyUser);
    });
    async.each(companyUsers, function(companyUser, callback) {
      companyUser.save(function(err, createdCompanyUser) {
        var newCompany = new Company({
          name: companyUser.name,
          user: createdCompanyUser._id,
          info: chance.paragraph({sentences: 3}),
          image : '',
          location: getRandom(savedLocations, 5),
          industry: getRandom(savedIndustries, 5),
          phone: chance.phone({ country: 'us' }),
          email: companyUser.email
        });
        newCompany.save(function(e, createdCompany) {
          createdCompanyUser.company = createdCompany._id;
          createdCompanies.push({id: createdCompany._id, name: createdCompany.name});
          createdCompanyUser.save();
          callback();
        });
      });
    }, function() {
      cb();
    });
  },
  function(cb) {
    async.each(createdCompanies, function(company, callback) {
      var companiesJobs = [];
      for(var j=0;j<3;j++) {
        var newJob = new Job({
          title: company.name + ' Job' + j,
          company: company.id,
          description: chance.paragraph({sentences: 3}),
          startDate: new Date(2011, 9, 16),
          endDate: new Date(2012, 9, 16),
          applicants: [],
          skills: []
        });
        companiesJobs.push(newJob);
      }
      Job.insertMany(companiesJobs, function() {
        callback();
      });
    }, function() {
      cb();
    });
  },
  function(cb) {
    _.each(users, function(user) {
      var newRefugeeUser = new User();
      newRefugeeUser.name = user;
      newRefugeeUser.type = 'refugee';
      newRefugeeUser.password = password;
      newRefugeeUser.email = chance.email();
      refugeeUsers.push(newRefugeeUser);
    });
    async.each(refugeeUsers, function(refugeeUser, callback) {
      refugeeUser.save(function(err, createdRefugeeUser) {
        var newRefugee = populateRefugeeInfo(createdRefugeeUser, refugeeUser);
        newRefugee.save(function(e, createdRefugee) {
          createdRefugeeUser.refugee = createdRefugee._id;
          createdRefugees.push(createdRefugee);
          createdRefugeeUser.save();
          callback();
        });
      });
    }, function() {
      cb();
    });
  },
  function(cb) {
    async.each(createdRefugees, function(refugee, callback) {
      addRefugeeDetails(refugee,callback);
    },function() {
      cb();
    });
  }
)(function (error) {
  if (error) {
    console.log(error);
  }
  console.log('done');
  process.exit(0);
});
