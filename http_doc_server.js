const http = require('http');
const fs = require('fs');
const util = require('./util');
const fs_promise = require('fs').promises;
const url = require('url');


const HTTP_DOC = "/HTTP_DOCS/"

// Preload error pages into memory
var error_404 = fs.readFileSync("."+HTTP_DOC + "404.html");
var error_500 = fs.readFileSync("."+HTTP_DOC + "500.html");

class httpDocServer {
    files = {};

    constructor(port) {
        this.port = port;
        this.handle = http.createServer(run);
        util.console_log("http_doc_server","Created http doc server, callback handle set");
    }

    start() {
        this.handle.close(); // close it if its already open
        this.handle.listen(this.port);
    }
}

// Preload a list of allowed files, all within HTTP_DOCS. This stops the escaping into the environment to download stuff
var files = {}
function init(){
    util.console_log("http_doc_server","Getting file list");
    for(const file of util.readAllFiles("."+HTTP_DOC)) {
        files["/" + file.replace("\\", "/")] = fs.readFileSync(file);
    }
    util.console_log("http_doc_server","Files preloaded");
}

function run(req, res) {
    var q = url.parse(req.url, true);
    var filename = HTTP_DOC + q.pathname.substring(1);

    util.console_log("test", req.headers);

    if (filename in files) {

        var file_type = "html";
        var content_type="text/html";
        if(filename.search('.')){
            file_type = filename.split('.')[1];
            switch(file_type) {

                case "html":
                    content_type = "text/html";
                    break;
    
                case "js":
                    content_type = "text/javascript";
                    break;
    
                case "css":
                    content_type = "text/css";
                    break;

                case "ico":
                    content_type = "image/x-icon";
                    break;
    
                case "png":
                    content_type = "image/png";
                    break;

                case "gif":
                    content_type = "image/gif";
                    break;
                
                case "jpeg":
                case "jpg":
                    content_type = "image/jpeg";
                    break;
                                
                default:
                    content_type = "text/plain";
                    break;
            }
        }

        util.console_log("http_doc_server","Received request of type " + content_type);
        fs_promise.readFile("." + filename)
            .then(contents => {
                res.setHeader("Content-Type", content_type);
                res.writeHead(200);
                res.end(contents);
            }).catch(err => {
                res.writeHead(500);
                util.log_write_error("http_doc_server", "500 error on request for " + filename);
                util.log_write_error("http_doc_server", "500 error output: " + err);
                res.end(error_500);
                return;
            });

    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        util.log_write_error("http_doc_server","404 error on request for " + filename);
        res.end(error_404);
    }
}


  
module.exports = {httpDocServer, init}