module.exports = {
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, enum: ['NY', 'FL', 'TX'], required: true },
    playlistUrl: { type: String },
    scent: { type: String },
    lights: { type: String, enum: ['dim', 'normal', 'bright'] },
    items: { type: Array },
    referralUrl: { type: String },
};
