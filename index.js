const server = require('http').createServer();

const io = require('socket.io')(server);


var players = {};
var rooms = {};
var globalChats = [];
var roomsChats = {};

io.on('connection', function(socket){
	
	socket.actualP;
    socket.playerId;
	
    console.log('a user connected');
	
	io.to(socket.id).emit('allGlobalChats', globalChats);
	io.to(socket.id).emit('roomsList', rooms);
	
    socket.on('roomChat', function(msg){
        console.log('message: ' + msg);
        io.to(players[socket.playerId].room).emit('roomChat', msg);
    });
	
	socket.on('globalChat', function(msg){
		globalChats.push(msg);
		console.log(msg);
        io.emit('globalChat', msg);
    });
	
	socket.on('id', function(msg){
        console.log( socket.id +' identificado como: ' + msg);
		socket.playerId = msg;
		players[msg] = {id : socket.id, online : true};
		console.log(players);
		io.to(socket.id).emit('playersList', players);
    });
	
	socket.on('newRoom', function(msg){
        console.log('Creada sala: ' + msg);
		rooms[msg] = 1;
		socket.join("/"+msg)
		players[socket.playerId].room = msg;
		io.emit('newRoom', rooms);
    });
	
	socket.on('enterRoom', function(msg){
		if(rooms[msg] < 4 ){
			console.log(socket.playerId + ' entrando en sala: ' + msg);
			rooms[msg]+= 1;
			socket.join("/"+msg);
			players[socket.playerId].room = msg;
			io.to("/"+msg).emit('enterRoom', socket.playerId);
			io.emit('newRoom', rooms);
		}else{
			console.log('Sala llena');
			io.to(socket.id).emit('enterRoom', false);
			io.emit('newRoom', rooms);
		}	
    });
	
	socket.on('exitRoom', function(msg){
		
        console.log(socket.playerId + 'saliendo de la sala: ' + msg);
		rooms[msg] -= 1;
		io.to(players[socket.playerId].room).emit('exitRoom', msg);
		socket.leave("/"+msg);
		players[socket.playerId].room = undefined;
		io.emit('newRoom', rooms);
		
    });
	
    socket.on('walking', function(msg){
		
		if (socket.actualP != JSON.stringify(msg)){
			socket.actualP = JSON.stringify(msg);
        	io.emit('walking', socket.actualP);
		}
		
    });
	
    socket.on('disconnect', function(){
        
        console.log('user disconnected');
        
    });
    
});

server.listen(process.env.PORT || 3000);

console.log(process.env.PORT);