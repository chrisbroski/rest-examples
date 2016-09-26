var http = require('http');

http.createServer(function (req, resp) {
    if (req.headers['accept'] === 'application/json') {
        resp.writeHead(200, {'Content-Type': 'application/json'});
        resp.end('{"message": "Hello World"}\n');
    } else {
        resp.writeHead(200, {'Content-Type': 'text/plain'});
        resp.end('Hello World\n');
    }
}).listen(4902, function () {
    console.log('Server started on port :4902');
});

// Simple GET
/*
GET / HTTP/1.1
*/

// GET with Accept header
/*
GET / HTTP/1.1
Accept: application/json
*/
