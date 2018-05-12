const server = require('http').createServer();

const io = require('socket.io')(server);

io.on('connection', function(socket){
    
    console.log('a user connected');
    
    socket.on('chat', function(msg){
        console.log('message: ' + msg);
        io.emit('chat', msg);
    });
    
    socket.on('disconnect', function(){
        
        console.log('user disconnected');
        
    });
    
});

server.listen(process.env.PORT || 3000);

console.log(process.env.PORT);