var http = require('http'),
    msg = "Hello World\n";

http.createServer(function (req, resp) {
    if (req.method === 'GET') {
        resp.writeHead(200, {'Content-Type': 'text/plain'});
        resp.end(msg);
    } else if (req.method === 'DELETE') {
        resp.writeHead(200, {'Content-Type': 'text/plain'});
        msg = '';
        resp.end('Message deleted.');
    } else {
        resp.writeHead(405, {'Content-Type': 'text/plain'});
        resp.end('GET and DELETE only.');
    }
}).listen(4903, function () {
    console.log('Server started on port :4903');
});

// Delete the message
/*
DELETE / HTTP/1.1
*/

/*
Example POST

POST / HTTP/1.1
Content-Type: application/json
Content-Length: 13

{"hello": "world"}
*/
