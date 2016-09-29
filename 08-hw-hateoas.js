var http = require('http'),
    qs = require('querystring'),
    msg = "Hello World";

const htmlStart = '<!doctype html><title>REST Hello World</title><form method="POST" action=""><label>Message</label><br><input name="msg" value="';
const htmlEnd = '"><br><button>Update</button><input name="method" type="hidden" value="PUT"></form>';
const htmlDeleteForm = '<form method="POST" action=""><input name="method" type="hidden" value="DELETE"><button>Delete</button></form>';

function escapeHTML(s) {
    return s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeJSON(s) {
    return s.replace(/"/g, "\\\"");
}

function escapeAttribute(s) {
    return s.replace(/"/g, "&quot;");
}

function rspGet(req, rsp) {
    rsp.setHeader('Cache-Control', 'max-age=0,no-cache,no-store,post-check=0,pre-check=0');

    if (req.headers['accept'] === 'text/plain') {
        rsp.writeHead(200, {'Content-Type': 'text/plain'});
        rsp.end(msg);
    } else if (req.headers['accept'] === 'application/json') {
        rsp.writeHead(200, {'Content-Type': 'application/json'});
        rsp.end('{"message": "' + escapeJSON(msg) + '"}');
    } else if (req.headers['accept'] === 'text/pht') {
        rsp.writeHead(200, {'Content-Type': 'text/pht'});
        rsp.end('<p>' + escapeHTML(msg) + '</p>');
    } else {
        rsp.writeHead(200, {'Content-Type': 'text/html'});
        rsp.end(htmlStart + escapeAttribute(msg) + htmlEnd + htmlDeleteForm);
    }
}

function rspPut(req, rsp, body) {
    if (!body.msg.length) {
        rsp.writeHead(400, {'Content-Type': 'text/plain'});
        rsp.end('Message text required.');
        return;
    }

    if (body.msg.length > 50) {
        rsp.writeHead(400, {'Content-Type': 'text/plain'});
        rsp.end('Message text must be 50 characters or less.');
        return;
    }

    rsp.writeHead(200, {'Content-Type': 'text/plain'});
    msg = body.msg;
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
    var method = req.method.toUpperCase(),
        reqBody;

    if (method === 'POST') {
        reqBody = qs.parse(body);
        if (reqBody.method) {
            method = reqBody.method;
        }
    }
    if (method === 'GET') {
        rspGet(req, rsp);
    } else if (method === 'PUT') {
        rspPut(req, rsp, reqBody);
    } else if (method === 'DELETE') {
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

http.createServer(collectReqBody).listen(4908, function () {
    console.log('Server started on port :4908');
});
