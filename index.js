const server = require('http').createServer();

const io = require('socket.io')(server);

io.on('connection', function(socket){
	
	socket.actualP;
    socket.playerId;
	
    console.log('a user connected');
    
    socket.on('chat', function(msg){
        console.log('message: ' + msg);
        io.emit('chat', msg);
    });
	
	socket.on('id', function(msg){
        console.log('message: ' + msg);
		socket.playerId = msg;
        io.emit('id', msg);
    });
	
    socket.on('walking', function(msg){
		if (socket.actualP != JSON.parse('['+msg+']')){
			console.log('walking to ' + msg);
			socket.actualP = msg;
			console.log('walking to ' + socket.actualP);
        	io.emit('walking', msg);
		}
    });
	
    socket.on('disconnect', function(){
        
        console.log('user disconnected');
        
    });
    
});

server.listen(process.env.PORT || 3000);

console.log(process.env.PORT);