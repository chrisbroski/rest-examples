var http = require('http'),
    fs = require('fs'),
    mustache = require('Mustache'),
    qs = require('querystring'),
    commentData = 'comments.json',
    templates = {};

function handleError(err, rsp) {
    if (err) {
        rsp.statusCode = 500;
        rsp.setHeader('content-type', 'text/plain');
        rsp.end(err);

        console.error(err);
        process.exit(1);
    }
}

function loadFiles() {
    console.log('Loading mustache templates...');

    /*jslint stupid: true */
    templates.comments = fs.readFileSync('comments.html.mustache', 'utf-8');
    templates.comment = fs.readFileSync('comment.html.mustache', 'utf-8');
    templates.partialComment = fs.readFileSync('comment.pht.mustache', 'utf-8');

    // if data file doesn't exist, create it
    if (!fs.existsSync(commentData)) {
        fs.writeFileSync(commentData, "[\n]", 'utf-8');
    }
    /*jslint stupid: false */
}

function validate(rsp, body) {
    // Author is required
    if (!body.author) {
        rsp.statusCode = 400;
        rsp.setHeader('content-type', 'text/plain');
        rsp.end('Author name is required', 'utf-8');
        return false;
    }

    // body text is required
    if (!body.text) {
        rsp.statusCode = 400;
        rsp.setHeader('content-type', 'text/plain');
        rsp.end('Comment message is required', 'utf-8');
        return false;
    }
    return true;
}

function get(req, rsp) {
    fs.readFile(commentData, function (err, data) {
        var id;

        handleError(err, rsp);

        data = JSON.parse(data);
        id = parseInt(req.url.slice(req.url.lastIndexOf('/') + 1), 10);

        if (id) {
            data = data.filter(function (comment) {
                return comment.id === id;
            });

            if (data.length < 1) {
                rsp.statusCode = 404;
                rsp.setHeader('content-type', 'text/plain');
                rsp.end('Comment #' + id + ' not found', 'utf-8');
                return;
            }
        }

        rsp.setHeader('Cache-Control', 'max-age=0,no-cache,no-store,post-check=0,pre-check=0');

        if (req.headers['accept'] === 'application/json') {
            rsp.setHeader('content-type', 'application/json');
            rsp.end(JSON.stringify(data));
        } else if (req.headers['accept'] === 'text/pht') {
            rsp.setHeader('content-type', 'text/pht');
            rsp.end(mustache.render(templates.partialComment, data), 'utf-8');
        } else {
            rsp.setHeader('content-type', 'text/html');
            if (id) {
                rsp.end(mustache.render(templates.comment, data), 'utf-8');
            } else {
                rsp.end(mustache.render(templates.comments, data), 'utf-8');
            }
        }
    });
}

function post(rsp, body) {
    fs.readFile(commentData, function (err, data) {
        var comments, newComment;
        handleError(err, rsp)

        comments = JSON.parse(data);
        if (!validate(rsp, body)) {
            return;
        }

        newComment = {
            id: Date.now(),
            author: body.author,
            text: body.text,
        };

        comments.push(newComment);
        fs.writeFile(commentData, JSON.stringify(comments, null, 4), function (err) {
            handleError(err, rsp)

            rsp.writeHead(201, {'content-type': 'text/plain'});
            rsp.end('Comment #' + newComment.id + ' added', 'utf-8');
        });
    });
}

function routeMethods(req, rsp, body) {
    var method = req.method.toUpperCase(), reqBody;

    if (method === 'POST') {
        // if content-type is multipart form data, parse it
        reqBody = qs.parse(body);
        if (reqBody.method) {
            method = reqBody.method;
        }
    }

    if (req.method === 'GET') {
        get(req, rsp);
    } else if (req.method === 'POST') {
        post(rsp, reqBody);
    } else {
        rsp.writeHead(405, {'Content-Type': 'text/plain'});
        rsp.end('Method not allowed');
    }
}

function main(req, rsp) {
    var body = [];

    req.on('error', function (err) {
        console.error(err);
    }).on('data', function (chunk) {
        body.push(chunk);
    }).on('end', function () {
        body = Buffer.concat(body).toString();

        rsp.on('error', function (err) {
            console.error(err);
        });

        routeMethods(req, rsp, body);
    });
}

loadFiles();

http.createServer(main).listen(4999, function () {
    console.log('Server running on port 4999');
});
