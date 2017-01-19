var mongoose = require('mongoose');

var Schema = mongoose.Schema;

module.exports = mongoose.model('Order',new Schema({
	userid: String,
	videoid: String,
	dateoforder: String,
	orderstatus: String
}));