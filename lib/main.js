// Import the APIs we need.
const widgets = require("widget");
const tabs = require("tabs");
var data = require("self").data;
var contextMenu = require("context-menu");
var wikipanel = require("wikipanel");

var easycalIsOn = false;

function toggleActivation () {
    easycalIsOn = !easycalIsOn;
    return easycalIsOn;
}

console.log("The add-on is running well.");

exports.main = function(options, callbacks) {
    console.log(options.loadReason);

    // Create a new context menu item.
    var menuItem = contextMenu.Item({
        label: "EasyCal --> look it up in wikipedia",
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
            wikipanel.lookup(item);
        }
    });

    var widget = widgets.Widget({
        id: "easycal-link",
        label: "EasyCal project homepage",
        contentURL: data.url("widget/easycal-small-off.png"),
        /*
           onClick: function() {
           tabs.open("http://code.google.com/p/easycal/");
           }
           */
        contentScriptWhen: 'ready',
        contentScriptFile: data.url('widget/widget.js'),
    });

    widget.port.on('left-click', function() {
        console.log('activate/deactivate');
        widget.contentURL = toggleActivation() ?
        data.url('widget/easycal-small-on.png') :
        data.url('widget/easycal-small-off.png');
    });

    widget.port.on('right-click', function() {
        console.log('show annotation list');
    });

};
