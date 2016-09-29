var http = require('http'),
    msg = "Hello World";

function routeMethods(req, rsp, body) {
    rsp.writeHead(200, {'Content-Type': 'text/plain'});

    if (req.method === 'GET') {
        rsp.end(msg);
    } else if (req.method === 'PUT') {
        msg = body;
        rsp.end('Message updated.');
    } else if (req.method === 'DELETE') {
        msg = '';
        rsp.end('Message deleted.');
    } else {
        rsp.writeHead(405);
        rsp.end('GET, PUT, and DELETE only.');
    }
}

function collectReqBody(req, rsp) {
    var body = [];

    req.on('data', function (chunk) {
        body.push(chunk);
    }).on('end', function () {
        body = Buffer.concat(body).toString();

        routeMethods(req, rsp, body);
    });
}

http.createServer(collectReqBody).listen(4904, function () {
    console.log('Server started on port :4904');
});

/*
Example PUT

PUT / HTTP/1.1
Content-Type: text/plain
Content-Length: 7

Goodbye
*/
