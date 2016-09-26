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
