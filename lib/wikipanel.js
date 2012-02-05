// Define the 'lookup' function using Panel
function lookup(item) {
  var panel = require("panel").Panel({
    width: 480,
    height: 320,
    contentURL: getURL(item)
  });
  panel.show();
}

// Define a function to build the URL
function getURL(item) {
  if (item.length === 0) {
    throw ("Text to look up must not be empty");
  }
  return "http://en.wikipedia.org/w/index.php?title=" + item + "&useformat=mobile";
}

// Export the 'lookup' and 'getURL' functions
exports.lookup = lookup;
exports.getURL = getURL;
