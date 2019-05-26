REST Intro
==========

## Identification of Resources

### Implemented on WWW As

URL

### Doing it Wrong

    http://catinthehat.drsuess.com/thing/1?action=delete

Using URLs properly will allows a network application to be able to be bookmarked and properly use navigation history (back/forward.)

## Manipulation Through Representations

### Implemented on WWW As

Verbs: GET, POST, PUT, DELETE, etc.

The URL should be the same pointer to a resource whether it is being retrieved, created, or modified. GET should never make a change on the server. PUT and DELETE should do the same thing even if identical requests are made multiple times.

## Self-Descriptive Messages

### Implemented on WWW As

Status: 200, 404, etc

### Doing it Wrong

Returning an error page with status 200

## HATEOAS

### Implemented on WWW As

HTML
