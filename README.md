README

Hello, while working at Acquire Media, there was a point where we transitioned
from XML server calls to JSON. I wrote this NodeJS server to to act as a proxy
converting those server calls so the front-end engineers (myself included)
could continue working using only JSON calls.

Note: this is NOT proprietary code to Acquire Media. It was created for dev use
		only. None of it is being used in production. I wrote 100% of this and
		stripped as much meaninful information from it as possible. I also 
		deleted a lot of methods and omitted an entire parser package I wrote.
		As such this code WILL NOT RUN. It is intended purely to demonstrate 
		my own coding skills and serve as an example for others trying to learn
		Node.

Demonstrated Abilities
	-NodeJS
	-Express
	-Regular Expressions
	-Closures
	-XML
	-JSON
	-Server Routing
	-Error Handling
	-Custom Node Packages

_________________________________________________________________


Below is the original documentation I wrote for the other engineers at my
company

==============================================================================
==============================================================================

README - ParserServer
_________________________________________________________________

written by Dixon Minnick
last updated 8/3/2015
_________________________________________________________________

Running on [DEV APACHE SERVER]

START:
/$ forever start /filepath/app.js

STATUS of running services:
/$ forever list

STOP:
/$ forever stop [pid]

OTHER forever ACTIONS:
stopall
restart
restartall
logs

See full forever documentation:
https://github.com/foreverjs/forever
_________________________________________________________________

Debugging on [DEV APACHE SERVER]

Run Companion Server With Terminal Output:
/$ node app.js

check if running:
/$ fuser tcp/8000

to kill:
/$ kill [pid]
_________________________________________________________________

To install on your local machine:

1)Create Directory
/$ mkdir companionServer
/$ cd companionServer

2)Install Node
/$ apt-get install nodejs

3)Install Express*
/$ npm install --save express

	*If npm is an unrecognized command:
	/$ apt-get install npm

4)Install body-parser
/$ npm install --save body-parser

5)Install Requestify
/$ npm install --save requestify

6)Install xml2js parser
/$ npm install --save xml2js
___________________________________________________________________

To run on local machine:


Add the following to your httpd.conf inside your NewsEdge virtual host:
	ProxyPass /json/ http://localhost:8000/
	ProxyPassReverse /json/ http://localhost:8000/

Start the companionServer
/$ node app.js
___________________________________________________________________

This server was written with the ability to be expanded to support
Desktop NewsEdge. One must simply uncomment the needed fields 
within the parser packages
___________________________________________________________________



