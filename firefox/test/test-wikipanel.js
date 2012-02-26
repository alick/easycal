var wikipanel = require("easycal/wikipanel")
 
var referenceURL =
  "http://en.wikipedia.org/w/index.php?title=Mozilla&useformat=mobile";
 
function test_getURL(test) {
  test.assertEqual(wikipanel.getURL("Mozilla"), referenceURL);
  test.done();
}
 
function test_empty_string(test) {
  test.assertRaises(function() {
    wikipanel.getURL("");
  },
  "Text to look up must not be empty");
};
 
exports.test_getURL = test_getURL;
exports.test_empty_string = test_empty_string;
