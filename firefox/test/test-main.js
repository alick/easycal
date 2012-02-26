const main = require("main");

exports.test_test_run = function(test) {
  test.pass("Unit test running!");
};

exports.test_id = function(test) {
  test.assert(require("self").id.length > 0);
};

exports.test_url = function(test) {
  require("request").Request({
    url: "http://www.google.com/",
    onComplete: function(response) {
      test.assertEqual(response.statusText, "OK");
      test.done();
    }
  }).get();
  test.waitUntilDone(20000);
};

exports.test_open_tab = function(test) {
  const tabs = require("tabs");
  tabs.open({
    url: "http://www.baidu.com/",
    onReady: function(tab) {
      test.assertEqual(tab.url, "http://www.baidu.com/");
      test.done();
    }
  });
  test.waitUntilDone(20000);
};
