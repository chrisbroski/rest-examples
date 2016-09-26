var http = require('http');

http.createServer(function (req, resp) {
    resp.writeHead(200, {'Content-Type': 'text/plain'});
    resp.end('Hello World\n');
}).listen(4901, function () {
    console.log('Server started on port :4901');
});
