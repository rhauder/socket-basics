var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/wcmi-api.sqlite'
});
var db = {};

db.salesDetail = sequelize.import(__dirname + '/models/salesDetail.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;