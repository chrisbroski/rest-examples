var http = require('http');

http.createServer(function (req, rsp) {
    rsp.writeHead(200, {'Content-Type': 'text/plain'});
    rsp.end('Hello World');
}).listen(4901, function () {
    console.log('Server started on port :4901');
});

// Simple GET
/*
GET / HTTP/1.1
*/
