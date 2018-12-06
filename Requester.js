var http = require('http');
var fs = require("fs");
var JSON = require("JSON");
var uniqid = require('uniqid');
var Writepath = process.argv[2];
var Readpath = process.argv[3];
if (!Writepath||!Readpath)
{
    console.error("Parameters missing","node app.js WritePath ReadPath");
    process.exit(1);
}

if(Writepath) {
    fs.stat(Writepath, function (err, stats) {
        if (err) {
            console.error("Folder folder access  error ",Writepath);
            process.exit(1);
        }

        if (stats.isDirectory()) {
        } else {
            Writepath = "";
        }
    }); 
}
if(Readpath) {
    fs.stat(Readpath, function (err, stats) {
        if (err) {
            console.error("Folder folder access  error ",Readpath);
            process.exit(1);
        }

        if (stats.isDirectory()) {
        } else {
            Readpath = "";
        }
    }); 
} 
http.createServer(function (req, res) {
    if (req.method == 'POST')
    {
        collectRequestData(req,function(body){
            var filestr= {};
            var filename = uniqid();
            var readfilename = filename;
            filestr.header = JSON.stringify(req.headers);
            filestr.body = body;
            if (Writepath) {
                filename = Writepath + "/" + filename;
            };
            if (Readpath) {
                readfilename = Readpath + "/" + readfilename;
            };
            console.log("Send Reques for",filename+".req");
            fs.writeFileSync(filename+".req",JSON.stringify(filestr),"utf8");
            getResponseData(readfilename+".res",function(ret){
                var response = JSON.parse(ret);
                response.header = JSON.parse(response.header);
                res.writeHead(200,response.header);    
                res.end(response.body);     
				setTimeout(function(){
					try{
						fs.unlinkSync(filename+".req");                
						console.log(readfilename);
						fs.unlinkSync(readfilename+".res");   
					} catch
					{
					}
 				},1000);
            })
        });
       
    }
}).listen(3080);
function collectRequestData(req,callback ){
    var body = "";
    req.on('data',function(chunk){ 
            body += chunk.toString();
        }
    );    
    req.on('end', () => {
        callback(body);
    });
};
function getResponseData(filename,callback){
        readFileresponse(filename,callback)
};
function readFileresponse(filename ,callback){
    fs.stat(filename, function (err, stats) {
        if (!err && stats.isFile() ) {
            filefound = 1;
            fs.readFile(filename,"utf8",function read(err,data){
				if(!err){
					callback(data);
				} else {
					console.log(err);
					setTimeout(readFileresponse,100,filename,callback);
				}				
            });
            
        } else {
            setTimeout(readFileresponse,100,filename,callback);
        }
    });     

}
