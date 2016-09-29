var http = require('http'),
    msg = "Hello World";

function escapeHTML(s) {
    return s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeJSON(s) {
    return s.replace(/"/g, "\\\"");
}

function rspGet(req, rsp) {
    rsp.setHeader('Cache-Control', 'max-age=0,no-cache,no-store,post-check=0,pre-check=0');

    if (req.headers['accept'] === 'application/json') {
        rsp.writeHead(200, {'Content-Type': 'application/json'});
        rsp.end('{"message": "' + msg.replace('"', "\\\"") + '"}');
    } else if (req.headers['accept'] === 'text/pht') {
        rsp.writeHead(200, {'Content-Type': 'text/pht'});
        rsp.end('<p>' + escapeHTML(msg) + '</p>');
    } else {
        rsp.writeHead(200, {'Content-Type': 'text/plain'});
        rsp.end(msg);
    }
}

function rspPut(req, rsp, body) {
    if (!body.length) {
        rsp.writeHead(400, {'Content-Type': 'text/plain'});
        rsp.end('Message text required.');
        return;
    }

    if (body.length > 50) {
        rsp.writeHead(400, {'Content-Type': 'text/plain'});
        rsp.end('Message text must be 50 characters or less.');
        return;
    }

    rsp.writeHead(200, {'Content-Type': 'text/plain'});
    msg = body;
    rsp.end('Message updated.');
}

function rspDelete(req, rsp) {
    var b64auth = (req.headers.authorization || '').split(' ')[1] || '',
        authData = new Buffer(b64auth, 'base64').toString().split(':')

    if (!authData[0] || !authData[1] || authData[1] !== 'swordfish') {
          rsp.writeHead(401, {'WWW-Authenticate': 'Basic'});
          rsp.end('Bad password');
          return;
    }

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

http.createServer(collectReqBody).listen(4907, function () {
    console.log('Server started on port :4907');
});
