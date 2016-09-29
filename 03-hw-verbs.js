var http = require('http'),
    msg = "Hello World";

function routeMethods(req, rsp) {
    rsp.writeHead(200, {'Content-Type': 'text/plain'});

    if (req.method === 'GET') {
        rsp.end(msg);
    } else if (req.method === 'DELETE') {
        msg = '';
        rsp.end('Message deleted.');
    } else {
        rsp.writeHead(405);
        rsp.end('GET and DELETE only.');
    }
}

http.createServer(routeMethods).listen(4903, function () {
    console.log('Server started on port :4903');
});

// Delete the message
/*
DELETE / HTTP/1.1
*/
