const fs = require('fs');
const path = require('path');

module.exports = {readAllFiles, console_log, log_write, log_write_error}

// Get all files in a directory, recursively
function* readAllFiles(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            yield* readAllFiles(path.join(dir, file.name));
        } else {
            yield path.join(dir, file.name);
        }
    }
}
// Writes an entry to console
function console_log(caller, log){
    var d = new Date();
    var time = "";
    time += d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
    time += " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
    console.log(time + " | " + caller + " | "+ log);
}

const LOG_PREFIX = "log_";
const LOG_DIR = "./log/"

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}
// Write a entry to log
async function log_write(caller, log) {
    log_write_wait_on(caller,log);
}
// Runs in background and writes to the file
async function log_write_wait_on(caller, log) {
    return new Promise((_) => {
        var d = new Date();
        var time = "";
        time += d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
        time += " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
        var log_file = LOG_DIR + LOG_PREFIX + d.getFullYear() + d.getMonth() + d.getDate() + ".txt";

        console.log(time + " | " + caller + " | "+ log);
        fs.appendFile(log_file, time + " | " + caller + " | " + log + "\n", err => {
            if (err) {
                console.error(err);
            }
        });
    });
}

// Write an error to the log file and console
function log_write_error(caller, log) {
    var d = new Date();
    var time = "";
    time += d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
    time += " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
    var log_file = LOG_DIR + LOG_PREFIX + d.getFullYear() + d.getMonth() + d.getDate() + ".txt";

    console.log(time + " | " + caller + " | Error | "+ log);
    fs.appendFileSync(log_file, time + " | " + caller + " | Error | "+ log + "\n", err => {
        if (err) {
            console.error(err);
        }
    });
}