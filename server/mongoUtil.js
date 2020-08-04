
const MongoClient = require('mongodb').MongoClient;
const mongo_uri = process.env.MONGODB_URL;
let dbClient;
let collection;

MongoClient
  .connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 10 })
  .then(client => {
    db = client.db('restaurantathome');
    dbClient = client;
    //collection = db.collection('restaurants');
  })
  .catch(error => console.error(error));

// listen for the signal interruption (ctrl-c)
process.on('SIGINT', () => {
  dbClient.close();
  process.exit();
});

