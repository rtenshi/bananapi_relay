var http = require('http');
var shell = require('shelljs');
var fs = require('fs');
var index = fs.readFileSync('/home/test/socket/index.html');
//var index = fs.readFileSync('index.html');
var port = 1234;
var front = 80;

http.createServer(function(req,res){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(index);
}).listen(8080);
var server = http.createServer(function(request,response) {});
var count = 0;
var clients = {};
var slots = {};
slots[1] = {pin:1,status:false};
slots[2] = {pin:2,status:false};
slots[3] = {pin:3,status:false};

server.listen(port, function() {
    console.log((new Date()) + ' Server on port '+port);
});

var WebSocketServer = require('websocket').server;

wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request',function(r){
    // on Connection
    var connection = r.accept('echo-protocol', r.origin);
    var id = count++;
    clients[id] = connection;
    console.log((new Date()) + ' Connection accepted as '+id);
    
    connection.on('message', function(message) {
        
        var msg = JSON.parse(message.utf8Data);

        changePin(msg.pin, msg.status);
        slots[msg.pin].status = msg.status;

        for(var i in clients){
            clients[i].sendUTF(JSON.stringify(slots));
        }
    });
    connection.on('close', function(reasonCode, description){
        delete clients[id];
        console.log((new Date()) + ' Peer '+connection.remoteAddress +' disconnected.')
    });
});

function changePin(id, val)
{
    if (val) {
        shell.exec('gpio write '+id+' 1');
    } else {
        shell.exec('gpio write '+id+' 0');
    }
    
}
