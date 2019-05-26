I/O Comparisons with HATEOAS
============================

Most software requires a way to accept and return information. A user interface (UI) is intended to be used by humans, while an application programming interface (API) is for use by other computer programs. There are several common styles of interface design, some of which can be used by both people and software.

Whether an interface is intended for a person or computer, it needs documentation. Both end users and software integration developers need a way to learn how to communicate with the interface.

## Graphical User Interface (GUI)

A GUI is a user interface designed to be easy for people. It's key feature is not that it has pretty picture, but that it is self-documenting. The instructions on how to use the interface are combined with the interface controls: common tasks are explained on a screen, menus list available features, and further help documentation can be searched. (If a GUI requires additional videos and training, it is probably poorly designed.)

It is possible for other computer programs to use a GUI, but only with specialized tools (for example, automated testing software) and are typically a larger time investment than using an API.

## Software Development Kit (SDK)

Some software is built only to be used as a utility inside other software. It will often come with specialized interfaces to help other developers integrate it into their own programs.

This is never self-documenting. Typically SDKs require a large amount of external tutorials and reference materials. It may also employ plugins for (or provide dedicated) development tools to assist programmers.

## Command-Line Interface (CLI)

A CLI is one of the simplest standard ways to get data in and out of a computer program. It can be used by both people and other programs. It takes the form of a single line of text, staring with the name of the application followed by with optional data and instructions.

CLIs are not strictly self-documenting, but typically include documentation accessible in a standard way (using the `help` flag) and should provide helpful error messages.

## Hypermedia as the Engine of Application State (HATEOAS)

HATEOAS is an interface that, like a CLI, is designed to be used by both people and other computer programs. Unlike a CLI, it is meant specifically for client-server network applications using a communications protocol like HTTP.

One of the main benefits of HATEOAS is self-documentation. HTML defines how to create HTTP requests that can be integrated in software. HTTP responses bodies and status messages sent back to a web browser should be nearly identical to the responses to a computer program.
