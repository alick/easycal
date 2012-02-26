var ss = require('simple-storage');
var logging = true;

// code originally from:
// http://stackoverflow.com/questions/2153070/do-chrome-extensions-have-access-to-local-storage

// Store item in storage:
function setItem(key, value) {
    try {
        log("Storing [" + key + ":" + value + "]");
        ss.storage[key] = value;
    } catch(e) {
        log("Error inside setItem");
        log(e);
    }
    log("Return from setItem" + key + ":" +  value);
}

// Gets item from local storage with specified key.
function getItem(key) {
    var value;
    log('Retrieving key [' + key + ']');
    try {
        value = ss.storage[key];
    }catch(e) {
        log("Error inside getItem() for key:" + key);
        log(e);
        value = "null";
    }
    log("Returning value: " + value);
    return value;
}

function removeItem(key) {
    var value;
    log('Removing key [' + key + ']');
    try {
        delete ss.storage[key];
    }catch(e) {
        log("Error inside removeItem() for key:" + key);
        log(e);
        value = "null";
    }
    log("Returning value: " + value);
    return value;
}

function dumpAllItems() {
    console.log("<<<<<<<<<<<<<<<");
    for (var key in ss.storage) {
        console.log(key + "=>" + ss.storage[key]);
    }
    console.log(">>>>>>>>>>>>>>>");
}

function log(txt) {
    if(logging) {
        console.log(txt);
    }
}

exports.setItem = setItem;
exports.getItem = getItem;
exports.removeItem = removeItem;
exports.dumpAllItems = dumpAllItems;
