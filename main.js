const util = require('./util');
const http_doc_server = require("./http_doc_server");
const { exit } = require('node:process');


const VERSION = "V0.1";
const EXIT_CODE_SERVER_FAILURE = 1;

util.log_write("main","=== Server Startup ===");
util.log_write("main","Version: " + VERSION);

const HTTP_DOC_PORT = 8080;
util.log_write("main","Generating HTTP doc server");
var http_doc_handle = new http_doc_server.httpDocServer(HTTP_DOC_PORT);
http_doc_server.init();

util.log_write("main","Starting servers");
http_doc_handle.start();
util.log_write("main","Started servers")

// Check status of servers every 60 seconds, restart if needed, if it fails twice fail
var HTTP_DOC_SERVER_OK = true;
setInterval(function () {

  if(!http_doc_handle.handle.listening) {
    if(!HTTP_DOC_SERVER_OK) {
      util.log_write_error("main","http doc server failed to restart, failing out");
      exit(EXIT_CODE_SERVER_FAILURE);
    }
    util.log_write_error("main","Failure on http doc server, restarting");
    http_doc_handle.start();
    HTTP_DOC_SERVER_OK = false;
  }
  else {
    HTTP_DOC_SERVER_OK = true;
  }

  util.log_write("main","Server running ...");
}, 60000);