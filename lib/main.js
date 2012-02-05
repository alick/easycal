// Import the APIs we need.
var widgets = require("widget");
//var tabs = require("tabs");
var contextMenu = require("context-menu");
var panels = require("panel");

var simpleStorage = require('simple-storage');
var notifications = require("notifications");
var privateBrowsing = require('private-browsing');

var data = require("self").data;

var easycalIsOn = true;

function toggleActivation () {
    easycalIsOn = !easycalIsOn;
    return easycalIsOn;
}

console.log("The add-on is running well.");

exports.main = function(options, callbacks) {
    console.log(options.loadReason);

    // Create a new context menu item.
    var menuItem = contextMenu.Item({
        label: "[EasyCal]Add into the schedule",
        // Show this item when a selection exists.
        context: contextMenu.SelectionContext(),
        contentScriptFile: data.url('contextmenu.js'),
        // When we receive a message, set the right sched_id
        onMessage: function (schedule) {
            console.log('schedule: ' + JSON.stringify(schedule));
            editcalPanel.schedule = schedule;
            editcalPanel.show();
        }
    });

    var editcalPanel= panels.Panel({
        width: 450,
        height: 280,
        contentURL: data.url('editcal/editcal.html'),
        contentScriptWhen: 'ready',
        contentScriptFile: data.url('editcal/editcal.js'),
        onMessage: function(schedule) {
            if (schedule) {
                console.log(schedule);
                //handleNewSchedule(schedule);
            }
            editcalPanel.hide();
        },
        onShow: function() {
            this.postMessage(editcalPanel.schedule);
        }

    });

    var widget = widgets.Widget({
        id: "easycal-link",
        label: "EasyCal project homepage",
        contentURL: data.url("widget/easycal-small-on.png"),
        onClick: function() {
            console.log('show annotation list');
        },
        contentScriptWhen: 'ready',
        contentScriptFile: data.url('widget/widget.js'),
    });

    /*
    widget.port.on('left-click', function() {
        console.log('activate/deactivate');
        widget.contentURL = toggleActivation() ?
        data.url('widget/easycal-small-on.png') :
        data.url('widget/easycal-small-off.png');
    });

    widget.port.on('right-click', function() {
        console.log('show annotation list');
    });
    */

};
