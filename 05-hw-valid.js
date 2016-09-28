var http = require('http'),
    msg = "Hello World";

function rspGet(req, rsp) {
    rsp.writeHead(200, {'Content-Type': 'text/plain'});
    rsp.end(msg);
}

function rspPut(req, rsp, body) {
    if (!body.length) {
        console.log('0 length');
        rsp.writeHead(400, {'Content-Type': 'text/plain'});
        rsp.end('Message text required.');
        return;
    }

    if (body.length > 50) {
        console.log('0 length');
        rsp.writeHead(400, {'Content-Type': 'text/plain'});
        rsp.end('Message text must be 50 characters or less.');
        return;
    }

    rsp.writeHead(200, {'Content-Type': 'text/plain'});
    msg = body;
    rsp.end('Message updated.');
}

function rspDelete(req, rsp) {
    rsp.writeHead(200, {'Content-Type': 'text/plain'});
    msg = '';
    rsp.end('Message deleted.');
}

function routeMethods(req, rsp, body) {
    if (req.method === 'GET') {
        rspGet(req, rsp);
    } else if (req.method === 'PUT') {
        rspPut(req, rsp, body);
    } else if (req.method === 'DELETE') {
        rspDelete(req, rsp);
    } else {
        rsp.writeHead(405, {'Content-Type': 'text/plain'});
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

http.createServer(collectReqBody).listen(4905, function () {
    console.log('Server started on port :4905');
});

/*
Example PUT

PUT / HTTP/1.1
Content-Type: text/plain
Content-Length: 7

Goodbye
*/

/*
Bad PUT (no content)

PUT / HTTP/1.1
*/

/*
Bad PUT (too much content)

PUT / HTTP/1.1
Content-Type: text/plain
Content-Length: 63

Hello World, Hello World, Hello World, Hello World, Hello World
*/
