var http = require('http');

http.createServer(function (req, resp) {
    console.log(req.headers['accept']);
    if (req.headers['accept'] === 'application/json') {
        resp.writeHead(200, {'Content-Type': 'application/json'});
        resp.end('{"hello": "world"}\n');
    } else {
        resp.writeHead(200, {'Content-Type': 'text/plain'});
        resp.end('Hello World\n');
    }
}).listen(4902);

console.log('Server started on port :4902');

/*
Example GET
GET / HTTP/1.1

Example POST

POST / HTTP/1.1
Content-Type: application/json
Content-Length: 13

{"hello": "world"}

*/
