
const MongoClient = require('mongodb').MongoClient;
var creds = require('../db-credentials');
const mongo_uri = `mongodb+srv://restaurantathome:${creds.password}@cluster0.536qw.mongodb.net/${creds.collection}?retryWrites=true&w=majority`;
let dbClient;
let collection;

MongoClient
  .connect(mongo_uri, { useNewUrlParser: true, poolSize: 10 })
  .then(client => {
    db = client.db('restaurantathome');
    dbClient = client;
    collection = db.collection('restaurants');
  })
  .catch(error => console.error(error));

// listen for the signal interruption (ctrl-c)
process.on('SIGINT', () => {
  dbClient.close();
  process.exit();
});

module.exports = {
    restaurants: () => collection,
    getDbClient: () => dbClient
};