const mongoose = require('mongoose');

const UserPreferencesSchema = new mongoose.Schema({
	userId: { type: String, required: true, unique: true },
	columnColors: {
		today: { type: String, default: '#e66642' },
		upcoming: { type: String, default: '#ffc849' },
		optional: { type: String, default: '#4b87b4' }
	}
});

const UserPreferences = mongoose.model('UserPreferences', UserPreferencesSchema);

module.exports = UserPreferences;
