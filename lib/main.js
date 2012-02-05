// Import the APIs we need.
var widgets = require("widget");
//var tabs = require("tabs");
var contextMenu = require("context-menu");
var panels = require("panel");

var simpleStorage = require('simple-storage');
var notifications = require("notifications");
var privateBrowsing = require('private-browsing');

var data = require("self").data;

var storage = require("storage");

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
            console.debug('contextMenu receive msg...');
            console.log('schedule: ' + JSON.stringify(schedule));
            // Get uniqe key
            var sched_index = storage.getItem('sched_index');
            console.log('sched_index: "'+sched_index+'"');
            if ((sched_index === null) || (sched_index === undefined)) {
                console.debug('set initial sched_index');
                sched_index = 0;
            } else {
                sched_index = parseInt(sched_index);
            }
            schedule.id = sched_index;
            // FIXME
            // If the schedule is not stored at last,
            // then one hole is born.
            storage.setItem('sched_index', sched_index + 1);
            console.log('just stored sched_index: "' +
                    storage.getItem('sched_index') + '"');

            console.debug('contextMenu id set...');
            console.log('schedule: ' + JSON.stringify(schedule));
            // NOTE this is shallow copy.
            editcalPanel.schedule = schedule;
            editcalPanel.contentURL = data.url('editcal/editcal.html');
            editcalPanel.show();
        }
    });

    var editcalPanel= panels.Panel({
        width: 450,
        height: 280,
        contentURL: data.url('editcal/editcal.html'),
        contentScriptWhen: 'ready',
        contentScriptFile: [data.url('jquery.js'),
                            data.url('editcal/editcal.js')],
        onShow: function() {
            this.port.emit('fillform', editcalPanel.schedule);
        }

    });

    editcalPanel.port.on('close', function(){
        storage.dumpAllItems();
        editcalPanel.hide();
    });
    editcalPanel.port.on('save', function(schedule){
        console.debug('editcalPanel save schedule...');
        console.log('schedule: ' + JSON.stringify(schedule));
        var storekey = "sched" + schedule.id;
        storage.setItem(storekey, JSON.stringify(schedule));
        editcalPanel.port.emit('save_response', 'OK');
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
