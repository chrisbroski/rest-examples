var http = require('http'),
    msg = "Hello World";

function routeMethods(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    if (req.method === 'GET') {
        res.end(msg);
    } else if (req.method === 'DELETE') {
        msg = '';
        rsp.end('Message deleted.');
    } else {
        res.writeHead(405);
        res.end('GET and DELETE only.');
    }
}

http.createServer(routeMethods).listen(4903, function () {
    console.log('Server started on port :4903');
});

// Delete the message
/*
DELETE / HTTP/1.1
*/
