const server = require('http').createServer();

const io = require('socket.io')(server);

server.listen(process.env.PORT || 3000);