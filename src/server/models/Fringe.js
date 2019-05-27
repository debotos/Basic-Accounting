const mongoose = require('mongoose')

const Schema = new mongoose.Schema(
	{
		voucher: {
			type: String,
			required: true,
			minlength: 2,
			maxlength: 100,
			trim: true
		},
		date: {
			type: Number, // store timestamp
			required: true,
			index: true,
			trim: true
		},
		month: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 20,
			trim: true
		},
		name: {
			type: String,
			required: true,
			minlength: 2,
			maxlength: 100,
			trim: true
		},
		designation: {
			type: String,
			required: true,
			minlength: 2,
			maxlength: 100,
			trim: true
		},
		amount: {
			type: Number,
			required: true,
			trim: true
		}
	},
	{
		timestamps: true
	}
)

module.exports = Fringe = mongoose.model('Fringe', Schema)