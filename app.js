var request = require('request');
var url = 'http://api.purdue.io/odata/Courses?%24filter=Subject/Abbreviation%20eq%20%27CS%27&%24orderby=Number%20asc';

request({url : url,
	 json : true},function(err,response,body){
		if(!err && response.statusCode === 200){
			console.log(body);
		}
	});


