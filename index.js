const server = require('http').createServer();

const io = require('socket.io')(server);


var players = {};
var rooms = {};
var globalChats = [];
var roomsChats = [];

io.on('connection', function(socket){
	
	socket.actualP;
    socket.playerId;
	
    console.log('a user connected');
	
	io.to(socket.id).emit('allGlobalChats', globalChats);
	io.to(socket.id).emit('roomsList', rooms);
	
    socket.on('roomChat', function(msg){
        
        roomsChats.push(msg);
        console.log('room msg: ' + msg);
        
        if(players[socket.playerId]!=undefined){
            io.to(players[socket.playerId].room).emit('roomChat', msg);
        }
        
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
        console.log('Creada sala: ' + msg[0] + 'por el usuario: ' + msg[1]);
        rooms[msg[0]] = {};
		rooms[msg[0]].people = [{1 : msg[1]}];
        rooms[msg[0]].chief = msg[1];
		socket.join("/"+msg[0])
		players[socket.playerId].room = msg[0];
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
            io.to(players[socket.playerId].room).emit('allRoomChats', msg);
			io.emit('newRoom', rooms);
		}	
    });
	
	socket.on('exitRoom', function(){
        
		socket.leave("/"+players[socket.playerId].room);
        exitRoom(socket);
		io.emit('newRoom', rooms);
		
    });
	
    socket.on('walking', function(msg){
		
		if (socket.actualP != JSON.stringify(msg)){
			socket.actualP = JSON.stringify(msg);
        	io.emit('walking', socket.actualP);
		}
		
    });
	
    socket.on('disconnect', function(){
        
        if(players[socket.playerId].room != undefined){
            
            socket.leave("/"+players[socket.playerId].room);
            exitRoom(socket);
            io.emit('newRoom', rooms);
            
        }
        
        players[socket.playerId].online = false;
        console.log(socket.playerId + ' desconectado');
        io.emit('playersList', players);
        
    });
    
});

function exitRoom(socket){
    
        console.log(socket.playerId + 'saliendo de la sala: ' + players[socket.playerId].room);
    
		rooms[players[socket.playerId].room] -= 1;
    
		io.to(players[socket.playerId].room).emit('exitRoom', true);
    
		socket.leave("/"+players[socket.playerId].room);
    
		players[socket.playerId].room = undefined;
    
}

server.listen(process.env.PORT || 3000);

console.log(process.env.PORT);