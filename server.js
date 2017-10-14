var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');
var db = require('./db.js');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	}

	Object.keys(clientInfo).forEach(function(socketId) {
		var userInfo = clientInfo[socketId];
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	})
}

function newSale(socket) {
	var info = clientInfo[socket.id];

	if (typeof info === 'undefined') {
		return;
	}

	db.salesDetail.destroy({
		where: {
			name: info.name
		}
	})
}

io.on('connection', function(socket) {
	console.log('User connected via socket.io!')

	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id];

		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		});
	});

	socket.on('message', function(message) {
		console.log('Message received: ' + message.text);

		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else if (message.text === '@newSale') {
			newSale(socket);
			io.to(clientInfo[socket.id].room).emit('command', message);
		} else {
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
		}
	});

	socket.on('salesDetail', function(sd) {
		var body = _.pick(sd, 'name', 'plu', 'description','qty', 'amount', 'discount', 'line_total', 'taxable')

		io.to(clientInfo[socket.id].room).emit('salesDetail', sd);
		

		db.salesDetail.create(body).then(function (salesDetail) {
			
		});
	});

	socket.on('insertPO', function(pos) {
		var body = _.pick(pos, 'name', 'PoID')

		io.to(clientInfo[socket.id].room).emit('insertPO', pos);
		
	});

	socket.on('poStatus', function(pos) {
		var body = _.pick(pos, 'name', 'PoID', 'Status')

		io.to(clientInfo[socket.id].room).emit('poStatus', pos);
		
	});

	socket.on('scaleInventory', function(si) {
		var body = _.pick(si, 
			'ProductID', 
			'ProductItemID', 
			'Qty',
			'Barcode',
			'PackageDate',
			'SellByDate',
			'NetWeight',
			'Volume',
			'Cost',
			'UnitPrice',
			'TotalPrice',
			'ScaleID',
			'UserID',
			'ModifiedDate')

		io.to(clientInfo[socket.id].room).emit('scaleInventory', si);
		
	});

	socket.on('sandwichOrder', function(so) {
		io.to(clientInfo[socket.id].room).emit('sandwichOrder', so);
	});

	socket.on('command', function(cmd) {
		io.to(clientInfo[socket.id].room).emit('command', cmd);
	})

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf()
	});
});

db.sequelize.sync({
	// force: true
}).then(function() {
	http.listen(PORT, function() {
		console.log('Server started!')
	});
});