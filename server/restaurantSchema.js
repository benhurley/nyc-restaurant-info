let validator = require('validator')

module.exports = {
    name: { type: String, required: true},
    city: { type: String, required: true},
    state: { type: String, enum: ['NY', 'FL', 'TX'], required: true},
    playlist: { type: String },
    playlistUrl: { type: String, validate: (value) => {
      return validator.isUrl(value)
    }},
    scent: { type: String},
    lights: { type: String, enum: ['dim', 'normal', 'bright'] },
    items: { type: Array},
    referralUrl:  { type: String, validate: (value) => {
      return validator.isUrl(value)
    }}
};

