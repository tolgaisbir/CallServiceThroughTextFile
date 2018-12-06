# CallServiceThroughTextFile
Call Webservice Through Text File, there 2 Node.js file
1.	Requester.js  save the text file transmitted request header and body. Requester Application wait after saving the requested text file. When Responder Application forwards to response file, Reuester Application response the initial Request.

2.	Responder.js checks a specified folder forwarded the requested text file. When the requested text file is forwarded to responder application, it creates http request by the requested file and post actual webservice.  Webservice returns the response. Responder convert file to this response.  


Transferring Http POST request via Text file For private network request access to public network webservice.
