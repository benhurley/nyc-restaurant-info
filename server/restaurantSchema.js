// module.exports = {
//     name: { type: String, required: true },
//     city: { type: String, required: true },
//     state: { type: String, enum: ['NY', 'FL', 'TX'], required: true },
//     playlistUrl: { type: String },
//     scent: { type: String },
//     lights: { type: String, enum: ['dim', 'normal', 'bright'] },
//     items: { type: Array },
//     referralUrl: { type: String },
// };

module.exports = {
    borough: { type: String, required: false },
    restaurantname: { type: String, required: false },
    seatingchoice: { type: String, required: false },
    legalbusinessname: { type: String, required: false },
    businessaddress: { type: String, required: false },
    restaurantinspectionid: { type: Number, required: false },
    isRoadwaycompliant: { type: String, required: false },
    inspectedon: { type: String, required: false },
    agencycode: { type: String, required: false },
    postcode: { type: Number, required: false },
    latitude: { type: String, required: false },
    longitude: { type: String, required: false }
}