var fs = require("fs");
var Request = require('request');
var Writepath = process.argv[2];
var Readpath = process.argv[3];
var url = process.argv[4];
var workingFile = [];
const errorResponse = "errResponse.res";

if (!Writepath||!Readpath||!url)
{
    console.error("Parameters missing","node app.js WritePath ReadPath Url");
    process.exit(1);
}
if(Writepath) {
    fs.stat(Writepath, function (err, stats) {
        if (err) {
            console.log	("Writepath",Writepath,err);
            Writepath = "";
        }

        if (stats.isDirectory()) {
        } else {
            Writepath = "";
        }
    }); 
} else {
    Writepath = "";
}
if(Readpath) {
    fs.stat(Readpath, function (err, stats) {
        if (err) {
            console.log("readpath",Readpath,err);
            Readpath = "";
        }

        if (stats.isDirectory()) {
        } else {
            Readpath = "";
        }
    }); 
} else {
    Readpath = "";
}
setTimeout(readFolderToSend,100,Readpath);

function readFolderToSend() {
	var filecount;
	fs.readFile( errorResponse, 'utf8', function(err, content) {
		if (err) {
		  console.log("read file",filename, err);
		  return;
		}
		errorContent = content.substr(1);
	});	
    fs.readdir(Readpath, function(err, filenames) {
        if (err) {
            console.log("Readpath", err);
          return;
        }
        filecount=0;
        filenames.forEach(function(filename) {
		if(filename.slice(-3) == "req"){
			if(readArray(workingFile,filename) == -1)
			{			
				filecount = filecount + 1;
				fs.readFile( Readpath + filename, 'utf8', function(err, content) {
					if (err) {
						console.log("read file",filename, err);
						return;
					}				
					sendRequest( filename,content);
				
				});
			}	
        } 
		});
		
        if(filecount == 0) {
			setTimeout(readFolderToSend,100,Readpath);
		}
      });
}
function sendRequest(filename,content){
    var request = JSON.parse(content);
    var options = {
        url:url,
        rejectUnauthorized: false,
        headers: JSON.parse(request.header)
        ,
        body : request.body
      };
	  workingFile.push(filename);
      Request.post(options,function(error,res,body) {
        console.log("Send Response for",filename);
		var headers ;
		try {
            if(res.headers) {headers  = res.headers;}    
        } catch (error) {
            headers = "";
        }
        if (error){
			console.log("hata",error); 
        };
        filename = filename.replace(/^.*[\\\/]/, '');
        if (Writepath) {
            filename = Writepath + "/" + filename;
        };
            var filestr= {};
            filestr.header = JSON.stringify(headers);
            filestr.body = body;
            fs.writeFileSync(filename.replace(/.$/,"s"),JSON.stringify(filestr));
			deleteArray(workingFile,readArray(filename));
			setTimeout(readFolderToSend,100,Readpath);
    });
    }
function readArray(array,value){
	for(var i = 0; i < array.length;i++){
		if (array[i] == value){
			return i;
		}
	}
	return -1;
}
function deleteArray(array,index){
	if (index = -1){return};
    delete array[index];
    var y=0;
	for(var i = 0; i < array.length;i++){
		if (array[i] == undefined){
			y++;
		}
    }
    if (y == array.length){
        array.length = 0;
    }  
	
}