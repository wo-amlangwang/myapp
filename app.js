var request = require('request');
var fs = require('fs');

var Promise = require('promise');
var chalk = require('chalk');
var error = chalk.bold.red;
var success = chalk.bold.blue;


var callme = function(abbre){
	var ps = new Promise(function(resolved,reject){
		var url = 'http://api.purdue.io/odata/Courses?$filter=Subject/Abbreviation eq \''+ abbre +'\'&$orderby=Number asc';
		var filename = './' + abbre + '.json';
		//console.log(filename);
		request({url : url,
				 json : true},function(err,response,body){
			if(!err && response.statusCode === 200){
				fs.writeFile(filename,JSON.stringify(body),function(err){
				if(err){
					reject(err);
				}
				var m = JSON.parse(fs.readFileSync(filename).toString());
				
				for(var a in m.value){
					m.value[a]['Abbreviation'] = abbre;
				}
				fs.writeFile(filename, JSON.stringify(m));
				/*
				m.forEach(function(p){
    				p.pic = abbre;
				});
				fs.writeFile(filename, JSON.stringify(m));
	*/
				resolved(abbre);
			});
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

var mergeeverythingintoonefile = function(abbre) {
	var ps = new Promise(function(resolved,reject){
		var mergefile = './Everything.json';
		var filename = './' + abbre + '.json';
		fs.stat(mergefile,function(err,stat) {
			if(err == null) {
				console.log(success('find file and keep doning\n'));
			}else{
				var buffer = {'result' : '[]'};
				fs.writeFile(mergefile, JSON.stringify(buffer));
			}
			var m = JSON.parse(fs.readFileSync(mergefile).toString());
			var o = JSON.parse(fs.readFileSync(filename).toString());
			for(var a in o.value){
				m['result'].push(o.value[a]);				
			}
			resolved(abbre);
		});
	});
	return ps;
}


getabbrevation().then(function (argument) {
	//console.log(argument.value);
	for(var a in argument.value){
		//console.log(a);
		callme(argument.value[a]['Abbreviation']).then(function(msg){
			console.log(success(msg  + ' success!\n'));
			mergeeverythingintoonefile(argument.value[a]['Abbreviation']).then(function(message){
				console.log(success(message + ' merged!'));
			});
		}).catch(function(err){
			console.log(error(err));
		});
		
	}
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

