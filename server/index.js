const express = require('express');
const path = require('path');
const cluster = require('cluster');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const numCPUs = require('os').cpus().length;
require('dotenv').config();

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const mongoUtil = require('./mongoUtil');

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Middleware for CRUD
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Answer API requests.
  app.get('/api', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Connected"}');
  });

  app.get('/jwt', (req, res) => {
    let privateKey = process.env.PRIVATE_KEY
    let token = jwt.sign({"body": "stuff"}, privateKey, {algorithm: 'HS256'});
    res.send(token);
  });

  // get all restaurants
  app.get('/api/restaurants', isAuthorized, (req, res) => {
    if (mongoUtil.restaurants()){
      mongoUtil.restaurants().find({}).toArray((err, result) => {
        if(err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });
    }
  });

  // get a specific restaurant
  app.get('/api/restaurants/:id', (req, res) => {
    var mongoId = ObjectId(req.params.id);
    if (mongoUtil.restaurants()){
      mongoUtil.restaurants().findOne({'_id': mongoId}).then(doc => {
        if(!doc) {
          res.send('Error returning restaurant data. Restaurant may not exist.');
          throw new Error('Error returning restaurant data. Restaurant may not exist.');
        } else {
          res.json(doc);
        }
      });
    }
  });

  // add a restaurant
  app.post("/api/restaurants", (req, res) => {
    mongoUtil.restaurants().insertOne(req.body)
    .then(res.redirect('/'))
    .catch(error => {
      console.error(error)
    })
  });

  // update a restaurant
  app.put('/api/restaurants/:id', (req, res) => {
    var mongoId = ObjectId(req.params.id);
    mongoUtil.restaurants().findOne({'_id': mongoId}).then(doc => {
      if(!doc) {
        res.send('Error finding restaurant data. Restaurant may not exist.');
        throw new Error('Error finding restaurant data. Restaurant may not exist.');
      } else {
        mongoUtil.restaurants().updateOne({'_id': mongoId}, {$set: req.body})
        .then((doc, err) => {
          if (!doc) {
            res.send(err);
            throw new Error('Error updating restaurant data. Restaurant may not exist.');
          } else {
            res.send('Restaurant info successfully udpated.');
          }
        });
      }
    });
  });

  // update all restaurants
  app.put('/api/restaurants', (req, res) => {
    mongoUtil.restaurants().updateMany({}, {$set: req.body}).then((doc, err) => {
      if (!doc) {
        res.send(err);
        throw new Error('Error updating all restaurants data.');
      } else {
        res.send('All restaurants successfully udpated.');
      }
    });
  });

  // delete a restaurant
  app.delete('/api/restaurants/:id', (req, res) => {
    var mongoId = ObjectId(req.params.id);
    mongoUtil.restaurants().findOne({'_id': mongoId}).then(doc => {
      if(!doc) {
        res.send('Error deleting restaurant data. Restaurant may not exist.');
        throw new Error('Error deleting restaurant data. Restaurant may not exist.');
      } else {
        mongoUtil.restaurants().deleteOne({'_id': mongoId}).then((doc, err) => {
          if(!doc) {
            res.send(err);
            throw new Error('Could not delete record.');
          } else {
            res.send('Restaurant deleted successfully.');
          }
        });
      }
    })
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  function isAuthorized(req, res, next) {
    if(!isDev) {
      if(typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization.split(" ")[1];
        let privateKey = process.env.PRIVATE_KEY

        jwt.verify(token, privateKey, {algorithm: "HS256"}, (err, decoded) => {
            if (err) {
                res.status(500).json({ error: "Not Authorized"});
                throw new Error("Not Authorized");
            }
            return next();
        });
      } else {
        res.status(500).json({error: "Not Authorized"});
        throw new Error("Not Authorized");
      }
    } else {
      next();
    }
  }

  app.listen(PORT, () => {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
