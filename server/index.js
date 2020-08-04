const express = require('express');
const path = require('path');
const cluster = require('cluster');
const { ifError } = require('assert');
const { ObjectId } = require('mongodb');
const numCPUs = require('os').cpus().length;

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

var mongoUtil = require('./mongoUtil');

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

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  app.get('/api/restaurants', (req, res) => {
    mongoUtil.restaurants().find({}).toArray((err, result) => {
      if(err) {
        res.send(err)
      } else {
        res.json(result)
      }
    });
  });

  app.get('/api/restaurants/:id', (req, res) => {
    var mongoId = ObjectId(req.params.id);
    mongoUtil.restaurants().findOne({'_id': mongoId}).then(doc => {
      if(!doc) {
        throw new Error('No record found.');
      } else {
        res.json(doc);
      }
    });
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
