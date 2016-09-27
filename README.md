# rest-examples
Code examples for talk REST: What it is, what it isn't and how to use it.

## Hello World with Node.js and HTTP

Node file: `01-hello-world.js`

This is the simplest example of an HTTP server I could find. To connect to it from the terminal:

    telnet 127.0.0.1 4901

To send a basic request:

    GET / HTTP/1.1

## Hello World with Accept Header

Node file: `02-hw-content-type.js`

GET request with Accept header

    GET / HTTP/1.1
    Accept: application/json

## Hello World with DELETE verb

Node file: `03-hw-verbs.js`

    DELETE / HTTP/1.1

## Comment Service

Make an nginx reverse proxy like so

    server {
        listen 60018;
        root /Users/christopherbroski/projects/rest-examples/www;

        location / {
            try_files $uri $uri/ $uri.html $uri.shtml $uri.txt =404;
        }

        location /comment {
            proxy_pass http://127.0.0.1:4999;
            proxy_set_header Host $host;
        }
    }
