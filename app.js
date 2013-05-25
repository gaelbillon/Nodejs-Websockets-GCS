/**
 * Module dependencies.
 */

var  express = require('express'),
      socket = require('./routes/socket.js'),
      routes = require('./routes');

var      app = module.exports = express();
var   server = require('http').createServer(app);

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

// Configuration
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});
app.configure('production', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);

// Socket.io Communication
io.sockets.on('connection', socket);

// Start server
server.listen(3000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});