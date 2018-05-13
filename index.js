const server = require('http').createServer();

const io = require('socket.io')(server);


var players = {};
var rooms = {};
io.on('connection', function(socket){
	
	socket.actualP;
    socket.playerId;
	
    console.log('a user connected');
	
    socket.on('chat', function(msg){
        console.log('message: ' + msg);
        io.emit('chat', msg);
    });
	
	socket.on('id', function(msg){
        console.log('Jugador identificado como: ' + msg);
		socket.playerId = msg;
		players[msg] = socket.id;
    });
	
	socket.on('newRoom', function(msg){
        console.log('Creada sala: ' + msg);
		rooms[msg] = 1;
		io.emit('newRoom', msg);
    });
	
	socket.on('enterRoom', function(msg){
		if(rooms[msg] < 4 ){
			console.log(socket.playerId + ' entrando en sala: ' + msg);
			rooms[msg]+= 1;
			io.emit('newRoom', msg);
		}else{
			console.log('Sala llena');
			io.emit('RoomFull', msg);
		}	
    });
	
	socket.on('exitRoom', function(msg){
		
        console.log(socket.playerId + 'saliendo de la sala: ' + msg);
		rooms[msg] -= 1;
		io.emit('exitRoom', msg);
		
    });
	
    socket.on('walking', function(msg){
		
		if (socket.actualP != JSON.stringify(msg)){
			console.log('walking to ' + msg);
			socket.actualP = JSON.stringify(msg);
        	io.emit('walking', msg);
		}
		
    });
	
    socket.on('disconnect', function(){
        
        console.log('user disconnected');
        
    });
    
});

server.listen(process.env.PORT || 3000);

console.log(process.env.PORT);