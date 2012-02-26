// from:
// http://stackoverflow.com/questions/2153070/do-chrome-extensions-have-access-to-local-storage
// Store item in local storage:
function setItem(key, value) {
    try {
        log("Storing [" + key + ":" + value + "]");
        window.localStorage.removeItem(key);      // <-- Local storage!
        window.localStorage.setItem(key, value);  // <-- Local storage!
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
        value = window.localStorage.getItem(key);  // <-- Local storage!
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
        value = window.localStorage.removeItem(key);  // <-- Local storage!
    }catch(e) {
        log("Error inside removeItem() for key:" + key);
        log(e);
        value = "null";
    }
    log("Returning value: " + value);
    return value;
}

// Clears all key/value pairs in local storage.
function clearStrg() {
    log('about to clear local storage');
    window.localStorage.clear(); // <-- Local storage!
    log('cleared');
}

logging = false;
function log(txt) {
    if(logging) {
        console.log(txt);
    }
}

