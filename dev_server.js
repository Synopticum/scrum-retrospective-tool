var path = require('path');
var express = require('express');
var http = require('http');
var webpack = require('webpack');
var jsonServer = require('json-mock');
var config = require('./webpack.config');

var app       = express();
var compiler  = webpack(config);
var host      = 'localhost';
var port      = 4003;

// voting state for each retrospective voting saved in memory during the voting
var currentVoting = {
    state: {},

    initState: function () {
        var self = this,
            users = require('./db.json').available_users;

        this.state = {};

        users.forEach(function (user) {
            self.state[user.name] = 0;
        });
    }
};

currentVoting.initState();

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(express.static('public'));

var apiRouter = jsonServer.router('db.json');

app.use(apiRouter);

// socket.io server
var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
    socket.emit('server:votes-stat-updated', currentVoting.state);

    // changed sprint
    socket.on('client:active-sprint-changed', (sprintId) => {
        socket.broadcast.emit('server:active-sprint-changed', sprintId);
    });

    // added point
    socket.on('client:point-added', (point) => {
        socket.broadcast.emit('server:point-added', point);
    });

    // deleted point
    socket.on('client:point-deleted', (point) => {
        socket.broadcast.emit('server:point-deleted', point);
    });

    // toggled voting
    socket.on('client:toggled-voting', (isVoting) => {
        socket.broadcast.emit('server:toggled-voting', isVoting);
    });

    // created action point
    socket.on('client:action-point-added', (point) => {
        socket.broadcast.emit('server:action-point-added', point);
    });

    // deleted action point
    socket.on('client:action-point-deleted', (point) => {
        socket.broadcast.emit('server:action-point-deleted', point);
    });

    // user voted
    socket.on('client:voted', (point) => {
        socket.broadcast.emit('server:voted', point);
    });

    socket.on('client:votes-stat-updated', (vote) => {
        vote.undo ? currentVoting.state[vote.user]-- : currentVoting.state[vote.user]++;

        socket.emit('server:votes-stat-updated', currentVoting.state);
        socket.broadcast.emit('server:votes-stat-updated', currentVoting.state);
    });

    socket.on('client:votes-count-updated', (votesCount) => {
        socket.emit('server:votes-count-updated', votesCount);
    });

    socket.on('client:action-point-updated', (data) => {
        socket.broadcast.emit('server:action-point-updated', data);
    });
});

server.listen(port, (err) => {
    if (err) {
        throw err;
    }

    var addr = server.address();
    console.log('Listening at http://%s:%d', addr.address, addr.port)
});