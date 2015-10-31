var request = require('request');
var fs = require('fs');
var url,filename;
var abb = require('./abbreviation.json');
var Promise = require('promise');

for (var a in abb.abbrevation){
	console.log(abb.abbrevation[a]);

url = 'http://api.purdue.io/odata/Courses?$filter=Subject/Abbreviation eq \''+ abb.abbrevation[a] +'\'&$orderby=Number asc'
filename = './' + abb.abbrevation[a] + '.json';
request({url : url,
	 json : true},function(err,response,body){
		if(!err && response.statusCode === 200){
			/*
			console.log('=====================');
			console.log(body);
			console.log('=====================');
			*/
			fs.writeFile(filename,JSON.stringify(body),function(err){
				if(err){
					console.log(err);
				}
				console.log(filename + 'done!\n' );
			});
		}
	});

}


var callme = function(abbre){
	var ps = new promise()
}

