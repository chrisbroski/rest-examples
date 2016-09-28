var http = require('http');

http.createServer(function (req, rsp) {
    if (req.headers['accept'] === 'application/json') {
        rsp.writeHead(200, {'Content-Type': 'application/json'});
        rsp.end('{"message": "Hello World"}');
    } else {
        rsp.writeHead(200, {'Content-Type': 'text/plain'});
        rsp.end('Hello World');
    }
}).listen(4902, function () {
    console.log('Server started on port :4902');
});

// GET with Accept header
/*
GET / HTTP/1.1
Accept: application/json
*/
