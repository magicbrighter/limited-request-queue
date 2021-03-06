"use strict";
var RequestQueue = require("../../../lib");

var delay = 18;	// long enough without trying everyone's patience
var _urls = 
[
	"https://www.google.com/",
	"https://www.google.com/",
	
	"http://www.google.com/",
	"http://www.google.com/",
	
	"https://google.com/",
	"https://google.com/",
	
	"http://google.com/",
	"http://google.com/",
	
	"https://google.com:8080/",
	"https://google.com:8080/",
	
	"http://google.com:8080/",
	"http://google.com:8080/",
	
	"https://google.com/something.html",
	"https://google.com/something.html",
	
	"http://google.com/something.html",
	"http://google.com/something.html",
	
	"https://127.0.0.1/",
	"https://127.0.0.1/",
	
	"http://127.0.0.1/",
	"http://127.0.0.1/"
];



function doneCheck(result, results, urls, startTime, callback)
{
	var duration;
	
	if (results.push(result) >= urls.length)
	{
		duration = Date.now() - startTime;
		
		callback(results, duration);
	}
}



function expectedSyncMinDuration()
{
	return _urls.length * delay + 50;
}



function testUrls(urls, libOptions, completeCallback, eachCallback)
{
	var queued;
	var results = [];
	var startTime = Date.now();
	
	var queue = new RequestQueue(libOptions, 
	{
		item: function(input, done)
		{
			if (typeof eachCallback === "function")
			{
				eachCallback(input, queue);
			}
			
			// Simulate a remote connection
			setTimeout( () =>
			{
				done();
				doneCheck(input.url, results, urls, startTime, completeCallback);
				
			}, delay);
		}
	});
	
	urls.forEach(url =>
	{
		var error = queue.enqueue(url);
		var input;
		
		if (error instanceof Error)
		{
			if (typeof eachCallback === "function")
			{
				// Simulate `item` handler argument
				input = { url:url };
				
				eachCallback(input, queue);
			}
			
			doneCheck(error, results, urls, startTime, completeCallback);
		}
	});
}



module.exports = 
{
	delay: delay,
	expectedSyncMinDuration: expectedSyncMinDuration,
	testUrls: testUrls,
	urls: _urls
};
