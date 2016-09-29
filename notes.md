# REST: What it is, what it isn't, and how to use it

## What it isn’t

##### Alternative to SOAP

Just because a network resource does not use the SOAP protocol, it does not mean that a network resource is RESTful. This is a false dichotomy,

##### Any HTTP service

HTTP is a network protocol designed with REST in mind. In fact, Roy Fielding, the author of Architectural Styles and the Design of Network-based Software Architectures where REST is defined, is the primary architect of HTTP. However, HTTP is flexible enough that the principles of REST can easily be disregarded when creating network applications using the protocol.

##### Writing “file path” style URLs instead of query string

Where did this even come from?

## What it is

We will be taking our knowledge of REST from the origin: Architectural Styles and the Design of Network-based Software Architectures, and not from Wikipedia or any other secondary source. Section 5 of Field’s dissertation expand on REST in depth, but the core concepts are simple.

Client-Server architecture, Statelessness, Caching, Layered System, and Code-On-Demand are all baked into HTTP. Roy used these principles when designing HTTP so If you are using HTTP you don’t have a choice but to use these, so we don’t need to talk about them. The important part to know when designing your own Web application architecture is the Uniform Interface property.

> “REST is defined by four interface constraints: identification of resources; manipulation of resources through representations; self-descriptive messages; and, hypermedia as the engine of application state.”
> -Section 5.1.5

If your network application is using HTTP, it will be RESTish I suppose, but if your network resources also has the four uniform interface constraints, then you should be able to proudly declare it to be truly RESTful.

## Uniform Interface Constraint /#1 – Identification of Resources

HTTP was designed to request resources from a network. And you need a way to identify those resources. In HTTP we are talking about the URL (or URI or whatever) we all should be familiar with. Unfortunately, most developers mess this up because the URL should be used for resource identification and ONLY resources identification. I’ll illustrated what I mean shortly.

## Uniform Interface Constraint /#2 – Manipulation Through Representations

A representation is information about the current or desired state of a resource. This information is separate from the resource and identification data. In HTTP it is contained in the headers and request body. Now let’s look at some right and wrong ways to do this under HTTP.

## What’s Wrong with This URL?

    http://catinthehat.drsuess.com/thing/1?action=delete

This violates constraints #1 ad #2 by mixing representation with identification. Did you hear about the guy that accused Google of deleting his stuff?

    http://thedailywtf.com/articles/The_Spider_of_Doom The URL should simply be:

    http://catinthehat.drsuess.com/thing/1

The desire to get rid of Thing #1 should reside in the request header. HTTP defines a few verbs to describe most types of resource alteration. Some common ones are:

- GET – “Safe” - it should NEVER alter the resource. Has caching.
- POST – Can have request body.
- PUT – Like POST, but should be idempotent
- DELETE

Guess which one we should use for this? Hopefully it is obvious. But how? I suppose now is a good time to go over a few HTTP basics.

## HTTP Basics

Node.js “Hello World” example. `01-hello-world.js`

Hit it with a browser. Check Chrome tools to view network request.

But for the hard core!

    telnet 127.0.0.1 4901
    GET / HTTP/1.1

##### Request

- First line is called the request line
- Lines after that are request headers
- After a blank line is the request body

##### Response

- First line of response is called the status line
- Lines afterward are response headers
- After a blank line is the response body

##### Verbs and content type

`02-hw-content-type.js`

`03-hw-verbs.js`

## What’s Wrong with This URL Round 2

Now that we are more familiar with our HTTP options, let’s try this again with some familiar URLs.

    https://webapp.dc.res0.net/admin/distributors/1/edit

This is a standard Rails URL, and hopefully you can see it is not RESTful out of the box. Whether we want to retrieve, add, modify, or delete a resource, the same resource should always have the same URL. In this case, without the “edit” part.

OK, so what about this one?

    http://resolutebi.com/solution.html

This is not RESTful either. The representation of a RESTful network resource includes its content type. That “.html” in the file path? Completely useless. Your browser does not care what that is. It determines how to display the resource based on the response header’s content type. I’ll prove it to you.

##### Node.js Content File Extension Spoof

Use `01-hello-world.js` with a .html extension.

## What’s Wrong with This URL Round 3

The file extension not only doesn’t belong in the URL from RESTful principles, it is completely worthless. It is common to see Rails serve JSON data like so:

    http://webapp.dc.res0.net/timeseries/consumption/customer/1.json

We should all know by now that this is not a RESTful URL. Is that a bad thing? That’s a different discussion, but I can say with confidence that if you say your web service is RESTful and it has URLs like those above, you are factually incorrect.

Now I am going to nitpick out own app a little more. How about this one?

    https://webapp.dc.res0.net/admin/distributors/1/customers/1/groups/23/buildings/69/floors/214/areas/26179

The above URL does not include representation information, but what is all that other stuff. Why isn’t it just?

    https://webapp.dc.res0.net/admin/areas/26179

I know from looking at the data model that the area id 26179 is unique and the distributor, customer, group, building or floor id is needed to accurately identify the area data. I would argue that the extra path information is not valuable and exposes information to the client that may be better kept quiet. But that’s just, like, my opinion, man. If your tool automatically makes URLs like these, I would not lose too much sleep, just know that there is no good reason for it.

But know that you don’t need to describe the relational model in the URL.

## What’s Wrong with This URL Round 4

This is the last one, I promise, but it is trickier

    http://catinthehat.drsuess.com/thing/1/run-up
    http://catinthehat.drsuess.com/thing/1/run-down

These are two different types of modification, but how does this fit with our four HTTP verbs? Don’t worry because PUT and POST can send request bodies that can contain as much information as you need to describe how to modify a resource. Using the same URL as you would to GET the information for an article’s vote status

http://www.somenewsaggregator.com/article/3/run

you can use PUT or POST (I think PUT is technically more correct in this instance, but since browsers don’t support PUT, it could be simpler to use POST) and include something like this in the request body.

    direction=up

Was that so hard?

## Uniform Interface Constraint /#3 – Self-Descriptive Messages

> “Things that, on error, return a 200 and an error message are the reason I drink.”
> - https://www.reddit.com/user/SheeEttin

HTTP has a clear, concise, and useful status message system that few developers take advantage of to instead invent their own system that can never be as good. Anything designed to handle HTTP should automatically respond to standard HTTP status messages in an appropriate way. Please send appropriate messages. Here’s how!

## HTTP Status Codes

- 2xx – Success
- 3xx – Redirection
- 4xx – Client error
- 5xx – Server error

In the case of 400 and 500 errors, in addition to the status line, you can (and should) include a verbose body (in plain text, HTML, JSON, or whatever content type you deem appropriate) explaining the reason for the error.

You aren’t limited to predefined status code. They are only a good starting point. Your application could send 448 YOUR BROWSER SUCKS or 592 MOUSE CHEWED NETWORK CABLE if you wanted. I’ve never needed to, as I’ve always been able to find a standard code that is appropriate, but it’s good to know you can if you need to.

## Structure of REST Services

Most REST web services should have a similar structure. I am going to walk through building a very simple one using Node.js.

## Handle HTTP Verbs

The verb in in the HTTP request will tell a lot about what needs to be done and each one should be significantly different so typically a flow control structure such as a switch statement runs first to direct execution to the appropriate parts of the code.

Supported methods should be white-listed and default to 405 METHOD NOT ALLOWED. See, those status codes are coming in handy already!

## GET and Caching

In this example, I am turning off all caching. I am doing it the only proper way (don’t bother with meta tags in your HTML – they don’t work.) For my example, and in most development environments, I want to make sure that any changes I make are immediately reflected in any requests. For production applications caching can be a power tool to make your application run blazing fast and scale. Unfortunately, caching could be another hour-long talk so perhaps another time.

Let’s return our data as either JSON or partial HTML depending on the request’s content type.

## POST and Server-Side Validation

After determining what sort of operation is going to be performed on the network resource, the next thing to do is to make sure that the request is well formed. If it is not, return 400 and the reason for rejection. POSTs may create a new resource, so return the URL of the new resource in the 201 response.

## DELETE and Authentication

You probably don’t want just anyone deleting resources, so let’s add some basic authentication to it.

## Add Back Content Types

Notice what content-type we haven't used? `text/html` is only for valid HTML documents. If we want to return a snippet of HTML, it is better to use the `text/pht` (partial HTML) content-type.

## Uniform Interface Constraint /#4 – HATEOAS

No, HATEOAS is not a spiteful breakfast cereal, it stands for Hypermedia as the Engine of Application State. If your web services comply with the first three interface constraints, then good for you. Your web service has now gone from RESTish to very RESTful. But it is not completely RESTful yet. RESTful network resources should be completely accessible through HTML in a web browser. Let’s expose our basic functions in a simple, valid, HTML5 wrapper.

One trick is that browsers won't support methods other and GET and POST, so we'll have to spoof PUT and DELETE with hidden form fields.

Please use CSS to style your HATEOAS wrapper for your REST service - It looks nice, doesn't cost many bytes, and won't mess anything up. No JavaScript is allowed, however. We will use that heavily when wiring this basic REST service into a full-featured Web UI.

## And for My Final Trick

Clucky old HTML forms are not the slickest for of UI (though they are fully accessible to scriptless browsers such as spiders and screen readers. I wired up the REST service with Ajax into a sick front end.

But how do spiders and screen readers deal with this? Noscript tag to HATEOAS, bitches.
