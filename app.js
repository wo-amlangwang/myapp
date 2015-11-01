var request = require('request');
var fs = require('fs');
var abb = require('./abbreviation.json');
var Promise = require('promise');
var chalk = require('chalk');
var error = chalk.bold.red;
var success = chalk.bold.blue;


var callme = function(abbre){
	var ps = new Promise(function(resolved,reject){
		var url = 'http://api.purdue.io/odata/Courses?$filter=Subject/Abbreviation eq \''+ abbre +'\'&$orderby=Number asc';
		var filename = './' + abbre + '.json';
		console.log(filename);
		request({url : url,
				 json : true},function(err,response,body){
			if(!err && response.statusCode === 200){
				fs.writeFile(filename,JSON.stringify(body),function(err){
				if(err){
					reject(err);
				}
				resolved(abbre);
			});
			}
		});
	});
	return ps;
}



for (var a in abb.abbrevation){
	console.log(abb.abbrevation[a]);
	callme(abb.abbrevation[a]).then(function(msg){
		console.log(success(msg  + ' success!\n'));
	}).catch(function(err){
		console.log(error(err));
	});
}



