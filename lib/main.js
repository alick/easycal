// Import the APIs we need.
const widgets = require("widget");
const tabs = require("tabs");
data = require("self").data;
var contextMenu = require("context-menu");
var panel = require("panel");

var widget = widgets.Widget({
  id: "easycal-link",
  label: "EasyCal project homepage",
  contentURL: data.url("huaci-small.png"),
  onClick: function() {
    tabs.open("http://code.google.com/p/easycal/");
  }
});

console.log("The add-on is running well.");

exports.main = function(options, callbacks) {
  console.log(options.loadReason);

  // Create a new context menu item.
  var menuItem = contextMenu.Item({
    label: "EasyCal",
    // Show this item when a selection exists.
    context: contextMenu.SelectionContext(),
    // When this item is clicked, post a message back with the selection
    contentScript: 'self.on("click", function () {' +
                   '  var text = window.getSelection().toString();' +
                   '  self.postMessage(text);' +
                   '});',
    // When we receive a message, look up the item
    onMessage: function (item) {
      console.log('looking up "' + item + '"');
      lookup(item);
    }
  });
};

function lookup(item) {
  wikipanel = panel.Panel({
    width: 240,
    height: 320,
    contentURL: "http://en.wikipedia.org/w/index.php?title=" +
                item + "&useformat=mobile"
  });
  wikipanel.show();
}
