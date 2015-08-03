var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var parseXML2json = require('xml2js').parseString; //XML to JSON parsing plugin

var requestify = require('requestify'); //HTTP request plugin

//URL building for server calls
var demonsUrlBuilder = require('./urlBuilder.js');
var urlBuilder = new demonsUrlBuilder();

//parser for demons and User Data
var demonsUserDataParser = require('./userDataParser.js');
var userDataParser = new demonsUserDataParser();

//parser for story retrieval and Glasses
var demonsStoryGlassesDataParser = require('./storyGlassesDataParser.js');
var storyGlassesDataParser = new demonsStoryGlassesDataParser();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  //App Root
  res.send('m-dev Parser Server!');
  console.log('m-dev Parser Server');
});

app.get('/hello', function (req, res) {
  //App Root
  res.send('Hello World!');
  console.log('Hello World!')
});

app.get('/UserLogin/UserLogin', function (req, res) {
  var cmd = req.query.cmd;
  var url = urlBuilder.buildUserLoginUrl("") + '?cmd=' + cmd;
  if(cmd == 'heartbeat' || cmd == 'logout'){
  	url += '&field1=' + req.query.field1;
  	url += '&cat=' + req.query.cat;
  	url += '&taco=' + req.query.taco;
  }
  else{
	  url += '&name=' + req.query.name;
	  if(cmd == 'login'){
	  	url += '&password=' + req.query.password;
	  	url += '&force=' + req.query.force;
	  }
  }
  url += '&_=' + req.query._;
  requestify.request(url, {
  		method : 'GET',
	   dataType : 'xml'

  }).then(function(response) {
	    //Get the response body 
	    parseXML2json(response.body, function(error, result){
	    	if(error){
	    		console.log(error);
	    		res.send(error);
	    	}
	    	result = result['userlogin-chocolate'];
	    	var jsonResponse = {};
	    	var command = result['$']['cmd'];
	    	console.log(command);
	    	if(command == 'login'){
	    		jsonResponse = { 'userlogin-chocolate' : {
		    		cmd : command,
		    		status : result['status'][0],
		    		user_cat : result['user-cat'][0],
		    		field1 : result['field1'][0],
		    		cookie_expiry : result['cookie-expiry'][0],
		    		active_sandal_type : result['active-sandal-type'][0]//,
		    		// ui_skin : result['ui_skin'][0]
		    	} };
	    	}
	    	else if(command == 'prelogin'){
	    		jsonResponse = { 'userlogin-chocolate' : {
		    		cmd : command,
		    		status : result['status'][0],
		    		sso_status : result['sso_status'][0]
		    	} };
	    	}
	    	else if(command == 'heartbeat' || command == 'logout'){
	    		jsonResponse = { 'userlogin-chocolate' : {
		    		cmd : command,
		    		status : result['status'][0]
		    	} };
	    	}
	    	res.json(jsonResponse);
	    });
  		
  });
});

app.get('/UserAdmin/user', function (req, res) {
  var cmd = req.query.cmd;
  console.log(cmd);
  if(cmd == 'loadUserData'){
	  var sandalId = null;
	  if(req.query.sandal != null){
	  	sandalId = req.query.sandal;
	  }
	  var url = urlBuilder.buildLoadUserDataUrl(req.query.field1, req.query.taco, sandalId);
	  requestify.request(url, {
	  		method : 'GET',
		   dataType : 'xml'

	  }).then(function(response) {
		    //Get the response body 
		    parseXML2json(response.body, function(error, result){
		    	if(error){
		    		console.log(error);
		    		res.send(error);
		    	}
		    	var jsonResponse = {};
		    	try{
		    		jsonResponse = userDataParser.parseUserData(result);
		    	}
		    	catch(error){
					console.log('=============================================');
					console.log(error);
					console.log(error.stack);
					console.log('=============================================');

					jsonResponse = {
						'user-chocolate' : {
							status : 'ERROR - beep boop beep some server thingy went wrong'
						}
					}
				}
		    	res.json(jsonResponse);
		    });
	  		
	  });
	} else if(cmd == 'getmangos'){
		var mangos = null;
		var permission = null;
		var level = null;
		var ck = null;
		if(req.query.ck != null){
			ck = req.query.ck;
		}
		if(req.query.mangos != null){
			mangos = req.query.mangos;
		}
		if(req.query.permission != null){
			permission = req.query.permission;
		}
		if(req.query.level != null){
			level = req.query.level;
		}
		var url = urlBuilder.buildGetmangosUrl(req.query.field1, mangos, permission, level, ck, req.query.taco);
		requestify.request(url, {
		  		method : 'GET',
			   dataType : 'xml'

		}).then(function(response) {
		    //Get the response body 
		    parseXML2json(response.body, function(error, result){
		    	if(error){
		    		console.log(error);
		    		res.send(error);
		    	}
		    	var jsonResponse = {};
		    	try{
		    		jsonResponse = userDataParser.parsemangosJson(result); 
		    	}
		    	catch(error){
					console.log('=============================================');
					console.log(error);
					console.log(error.stack);
					console.log('=============================================');
					jsonResponse = {
						status : 'ERROR - ' + error,
				        count : 0,
				        mangos : []
					}
				}
		    	res.json(jsonResponse);
		    });
	  		
		});
	} else if(cmd == 'getsandal'){
		var ck = null;
		if(req.query.ck != null){
			ck = req.query.ck;
		}
		var url = urlBuilder.buildGetsandalUrl(req.query.field1, req.query.sandal, ck, req.query.taco);
		requestify.request(url, {
		  		method : 'GET',
			   dataType : 'xml'

		}).then(function(response) {
		    //Get the response body 
		    parseXML2json(response.body, function(error, result){
		    	if(error){
		    		console.log(error);
		    		res.send(error);
		    	}
		    	var jsonResponse = {
		    		'user-chocolate' : userDataParser.parsesandalJson(result['user-chocolate'])
		    	}; 
		    	res.json(jsonResponse);
		    });
	  		
		});
	} else if(cmd == 'setActivesandal' || cmd == 'setActiveGroup'){
		var ck = null;
		if(req.query.ck != null){
			ck = req.query.ck;
		}
		var groupid = null;
		if(cmd == 'setActiveGroup'){
			groupid = req.query.group;
		}
		var url = urlBuilder.buildSetActivesandalOrGroupUrl(cmd, req.query.field1, req.query.sandal, ck, req.query.taco, groupid);
		requestify.request(url, {
		  		method : 'GET',
			   dataType : 'xml'

		}).then(function(response) {
		    //Get the response body 
		    parseXML2json(response.body, function(error, result){
		    	if(error){
		    		console.log(error);
		    		res.send(error);
		    	}
		    	var jsonResponse = {
		    		'user-chocolate' : {
		    			cmd : cmd,
		    			status : result['user-chocolate']['status'][0]
		    		}
		    	};
		    	res.json(jsonResponse);
		    });
	  		
		});
	} else if(cmd == 'savedlogin'){
		var url = urlBuilder.buildUserUrl(cmd, req.query.field1, req.query.cat, '') + '&_=' + req.query._;
		requestify.request(url, {
		  		method : 'GET',
			   dataType : 'xml'

		}).then(function(response) {
		    //Get the response body 
		    parseXML2json(response.body, function(error, result){
		    	if(error){
		    		console.log(error);
		    		res.send(error);
		    	}
		    	var jsonResponse = {
		    		'user-chocolate' : {
		    			cmd : cmd,
		    			status : 'OK'
		    		}
		    	};
		    	res.json(jsonResponse);
		    });
	  		
		});
	} else if(cmd == 'getAllGlasses'){
		var url = urlBuilder.buildGetAllGlassesUrl(req.query.field1, req.query.ck, req.query.taco, req.query.minimum);
		requestify.request(url, {
		  		method : 'GET',
			   dataType : 'xml'

		}).then(function(response) {
		    parseXML2json(response.body, function(error, result){
		    	if(error){
		    		console.log(error);
		    		res.send(error);
		    	}
		    	var getAllGlassesJson = userDataParser.parseGetAllGlasses(result['user-chocolate']['Glasses'][0])
		    	var jsonResponse = {
		    		'user-chocolate' : {
		    			cmd : cmd,
		    			status : result['user-chocolate']['status'][0],
		    			Glass : getAllGlassesJson
		    		}
		    	};
		    	res.json(jsonResponse);
		    });
	  		
		});
	} else if(cmd == 'getGlass'){
		var url = urlBuilder.buildGetGlassUrl(req.query.field1, req.query.ss, req.query.ck, req.query.taco);
		requestify.request(url, {
		  		method : 'GET',
			   dataType : 'xml'

		}).then(function(response) {
		    //Get the response body 
		    parseXML2json(response.body, function(error, result){
		    	if(error){
		    		console.log(error);
		    		res.send(error);
		    	}
		    	var jsonResponse = {
		    		'user-chocolate' : {
		    			cmd : cmd,
		    			status : result['user-chocolate']['status'][0],
		    			Glass : result['user-chocolate']['Glass'][0]['$']
		    		}
		    	};
		    	res.json(jsonResponse);
		    });
	  		
		});
	} else if(cmd == 'getmango'){
		var url = urlBuilder.buildGetmangoUrl(req.query.field1, req.query.mangos, req.query.mango, req.query.resultsPersandal, req.query.resultssandal, req.query.forceFill, req.query.ck, req.query.taco);
		
		requestify.request(url, {
		  		method : 'GET',
			   dataType : 'xml'

		}).then(function(response) {
		    //Get the response body 
		    parseXML2json(response.body, function(error, result){
		    	if(error){
		    		console.log(error);
		    		res.send(error);
		    	}
		    	result = result['user-chocolate'];
		    	try{
			    	var getmangoJson = userDataParser.parseGetmango(result['mangos'][0]);
			    	var jsonResponse = {
			    		'user-chocolate' : {
			    			cmd : cmd,
			    			status : result['status'][0],
			    			mangos : getmangoJson
			    		}
			    	};
			    	
			    } catch(error){
			    	console.log('=============================================');
					console.log(error);
					console.log(error.stack);
					console.log('=============================================');
					jsonResponse = {
						'user-chocolate' : {
							error : error
						}
					}
			    }
			    res.json(jsonResponse);
		    });
	  		
		});
	} else {
		res.json({ 'user-chocolate' : { error : 'Invalid Server Command. This is probably the server\'s fault.'}})
	}
});

app.get('/Glass/OPENSGlass', function (req, res) {
  console.log('OPENSGlass');
  var url = urlBuilder.buildOPENSGlassUrl(req.query);
  requestify.request(url, {
  		method : 'GET',
	   dataType : 'xml'

  }).then(function(response) {
	    //Get the response body 
	    parseXML2json(response.body, function(error, result){
	    	if(error){
	    		console.log(error);
	    		res.send(error);
	    	}
	    	var jsonResponse;
	    	try{
		    	result = result['GlassResults'];
		    	if(result['results'][0]['error'] != null){
		    			status : 'ERROR',
		    			error : {
		    				msg : result['results'][0]['error'][0]['msg'][0],
		    				'error-position' : result['results'][0]['error'][0]['error-position'][0]
		    			}
		    		};
		    	}
		    	else{
			    	var GlassJson = storyGlassesDataParser.parseGlass(result['Glass']);
			    	// console.log('Glass complete');
					var sandalInfoJson = storyGlassesDataParser.parsesandalInfo(result['sandalInfo']);
					// console.log('sandalInfo complete');
					var resultsJson = storyGlassesDataParser.parseResults(result['results']);
					// console.log('results complete');
				
					
			    	jsonResponse = {
			    		GlassResults : {
			    			GlassKey : result['$']['GlassKey'],
			    			Glass : GlassJson,
			    			sandalInfo : sandalInfoJson,
			    			results : resultsJson
			    		}
			    	};
			    }
	    	}
			catch(error){
				console.log('=============================================');
				console.log(error);
				console.log(error.stack);
				console.log('=============================================');
				jsonResponse = {
					GlassResults : {
						error : error
					}
				}
			}
	    	// console.log('hello World');
	    	res.json(jsonResponse);
	    });
  		
  });
});


app.get('/PdfUtil/GetDoc/:doc', function (req, res) {
  console.log('PdfUtil GET:   ' + req.params.doc);
  res.redirect(req.headers.referer + '/PdfUtil/GetDoc/' + req.params.doc)
});

app.post('/PdfUtil/GetDoc', function (req, res) {
  console.log('PdfUtil POST');
  var url = urlBuilder.buildGetPdfUrl(req.body);
  requestify.post(url, {
	   dataType : 'xml'

  }).then(function(response) {
	    //Get the response body 
	    parseXML2json(response.body, function(error, result){
	    	if(error){
	    		console.log(error);
	    		res.send(error);
	    	}

	    	try{
		    	
				console.log(result);
				
		    	var jsonResponse = {
		    		'pdf-utility' : {
		    			status : result['pdf-utility']['status'][0],
		    			pdfkey : result['pdf-utility']['pdfkey'][0]
		    		}
		    	};
	    	}
			catch(error){
				console.log('=============================================');
				console.log(error);
				console.log(error.stack);
				console.log('=============================================');
				jsonResponse = {
					error : error
				}
			}
	    	res.json(jsonResponse);
	    });
  		
  });
});

app.post('/StoryRetrieval/GetStory', function (req, res) {
	console.log('GetStory');
  
  var url = urlBuilder.buildStoryRetrievalUrl() + '?key=' + req.body.key + '&format=' + req.body.format + '&taco=' + req.body.taco + '&Somethingient=' + req.body.Somethingient + '&allowRedirect=' + req.body.allowRedirect ;

  requestify.post(url, {
	    dataType : 'xml'

  }).then(function(response) {
  		console.log('response');
  		var storyContent = response.body.toString();
  		if(storyContent.indexOf('<readerror>') != -1){
  			storyContent = storyContent.slice(storyContent.indexOf('<readerror>') + 11, storyContent.indexOf('</readerror>'));
  			var readErrorJsonResponse = {
				demons : {
					status : 'ERROR',
					readerror : {
						msg : 'Internal Server Error',
						serverReason : storyContent
					}
				}
			};
			res.json(readErrorJsonResponse);
			return;
  		}
	    storyContent = storyContent.slice(storyContent.indexOf('<content>') + 9, storyContent.indexOf('</content>'));
	    var encodedStoryContent = storyGlassesDataParser.parseStoryContent(storyContent);
	    response.body = response.body.toString().replace(storyContent, 'CONTENT_PLACEHOLDER');
	    var contentSomethingClosure = function(value){
	    	if(value == 'CONTENT_PLACEHOLDER'){
	    		return encodedStoryContent;     		//YO CHECK ME OUT I know how to use closures
	    	}
	    	return value;
	    }

	    //Get the response body 
	    parseXML2json(response.body,
	    	// {tagNameProcessors: [storyGlassesDataParser.parseStoryContent]},
	    	{valueProcessors: [contentSomethingClosure]},
	      function(error, result){
	    	if(error){
	    		console.log(error);
	    		res.send(error);
	    	}
	    	console.log('jsonPreParse')
	    	result = result['demons'];
	    	// console.log(result);
	    	var jsonResponse = {};
	    	try{
	    		var asset = '';
	    		var assMedia = '';
	    		if(result['asset'] != null){
	    			asset = storyGlassesDataParser.parseStoryAsset(result['asset']);
	    		}
	    		if(result['associated-media'] != null){
	    			assMedia = storyGlassesDataParser.parseMedia(result['associated-media']);
	    		}
	    		jsonResponse = {
	    			demons : {
	    				status : 'OK',
	    				version : result['$']['version'],
	    				header : storyGlassesDataParser.parseStoryHeader(result['header']),
	    				asset : asset,
	    				'associated-media' : assMedia
	    			}
	    		};
	    	}
	    	catch(error){
				console.log('=============================================');
				console.log(error);
				console.log(error.stack);
				console.log('=============================================');
				jsonResponse = {
					demons : {
						status : 'ERROR',
						readerror : {
							msg : 'Internal Server Error',
							serverReason : error
						}
					}
				}
			}
	    	res.json(jsonResponse);
	    });
  });
  
});

var server = app.listen(8000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Parser Server listening at http://%s:%s', host, port);

});