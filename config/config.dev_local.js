var Config = {};
Config.db = {};
Config.app={};
Config.auth = {};

Config.db.user = 'admin'
Config.db.pass = 'd0ntKnowIfThisIsSave'
//todo plaintext password

Config.db.host = 'pcjc5ikfd431jnvz.myfritz.net:60420';
Config.db.name = 'WorkForceDB';

// Use environment defined port or 3000
Config.app.port = process.env.PORT || 3000;

Config.auth.jwtSecret = "very secret secret";
//Todo :set up new secret

module.exports = Config;