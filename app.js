var request = require('request');
var fs = require('fs');

var Promise = require('promise');
var chalk = require('chalk');
var error = chalk.bold.red;
var success = chalk.bold.blue;
var Q = require('q');
var myarray = [];
var promises = [];

var callme = function(abbre){
	var ps = new Promise(function(resolved,reject){
		var url = 'http://api.purdue.io/odata/Courses?$filter=Subject/Abbreviation eq \''+ abbre +'\'&$orderby=Number asc';
		//console.log(filename);
		request({url : url,
				 json : true},function(err,response,body){
				if(!err && response.statusCode === 200){
					for(var a in body.value){
						body.value[a]['Abbreviation'] = abbre;
						myarray.push(body.value[a]);
					}
					resolved(abbre);
				}
			});
		});
	return ps;
}

var getabbrevation = function() {
	var ps = new Promise(function(resolved,reject){
		var url = 'http://api.purdue.io/odata/Subjects';
		request({url : url,json : true},function (err,response,body) {
			if(!err && response.statusCode === 200){
				resolved(body);
			}
		});
	});
	return ps;
}


getabbrevation().then(function(argument){
	delete argument['@odata.context'];
	argument['results'] = argument['value'];
	delete argument['value'];
	fs.writeFile('./abbrevation.json', JSON.stringify(argument),function(){
			console.log(success('done\n'));
			
	});
});



/*
getabbrevation().then(function (argument) {
	//console.log(argument.value);
	for(var a in argument.value){
		//console.log(a);

		var ps = callme(argument.value[a]['Abbreviation']).then(function(msg){
			console.log(success(msg  + ' success!\n'));
		}).catch(function(err){
			console.log(error(err));
		});
		promises.push(ps);
		
	}
	Q.all(promises).done(function(){
		console.log(success('all done\nstart merging\n'));
		var buffer = {'result' : myarray};
		fs.writeFile('./everything.json', JSON.stringify(buffer),function(){
			console.log(success('done\n'));
		});

	});
});



/*
for (var a in abb.abbrevation){
	//console.log(abb.abbrevation[a]);
	callme(abb.abbrevation[a]).then(function(msg){
		console.log(success(msg  + ' success!\n'));
	}).catch(function(err){
		console.log(error(err));
	});
}

*/

