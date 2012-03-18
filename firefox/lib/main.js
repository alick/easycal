// Import the APIs we need.
var widgets = require("widget");
var tabs = require("tabs");
var contextMenu = require("context-menu");
var panels = require("panel");
var ss = require('simple-storage');
var pageMod = require("page-mod");

var notifications = require("notifications");
var privateBrowsing = require('private-browsing');

var data = require("self").data;

var storage = require("storage");
var schedules = require("schedule");
var remind = require("remind");
var expsched = require("expsched");

// The low-level interface. Necessary for file-IO.
var {Cc, Ci} = require("chrome");
var file = require("file");

// Whether we are in develop mode:
var devmode = true;
function $debug(msg) {
    if (devmode === true && msg) {
        console.debug('[devmode]' + msg);
    } else {
        ; // Keep silent.
    }
}

exports.main = function(options, callbacks) {
    $debug(options.loadReason);

    var label_enabled  = "Add Selection to EasyCal";
    var label_disabled = "Add Selection Disabled";
    // Create a new context menu item.
    var menuItem = contextMenu.Item({
        label: label_enabled,
        // Show this item when a selection exists.
        context: contextMenu.SelectionContext(),
        contentScriptFile: data.url('contextmenu.js'),
        data: "enabled",
        // When we receive a message, set the right sched_id
        onMessage: function (schedule) {
            // Get uniqe key
            var sched_index = storage.getItem('sched_index');
            if ((sched_index === null) || (sched_index === undefined)) {
                sched_index = 0;
            } else {
                sched_index = parseInt(sched_index);
            }
            schedule.id = sched_index;
            // NOTE
            // If the schedule is not stored at last,
            // then one hole is born.
            storage.setItem('sched_index', sched_index + 1);

            // NOTE this is shallow copy.
            editcalPanel.schedule = schedule;
            editcalPanel.port.emit('reset_html');
            editcalPanel.show();
        }
    });

    var editcalPanel= panels.Panel({
        width: 450,
        height: 270,
        contentURL: data.url('editcal/editcal.html'),
        contentScriptWhen: 'ready',
        contentScriptFile: [data.url('jquery.js'),
                            data.url('editcal/editcal.js')],
        onShow: function() {
            this.port.emit('fillform', editcalPanel.schedule);
        }

    });

    editcalPanel.port.on('close', function(){
        editcalPanel.hide();
    });
    editcalPanel.port.on('save', function(schedule){
        var storekey = "sched" + schedule.id;
        storage.setItem(storekey, JSON.stringify(schedule));
        editcalPanel.port.emit('save_response', 'OK');
    });

    var popupPanel = panels.Panel({
        width: 538,
        height: 265,
        contentURL: data.url('popup/popup.html'),
        contentScriptWhen: 'ready',
        contentScriptFile: [data.url('jquery.js'),
                            data.url('popup/l10n.js'),
                            data.url('popup/jsDatePick.full.1.3.js'),
                            data.url('popup/jquery.cluetip.min.js'),
                            data.url('popup/popup.js')],
        onShow: function() {
            this.port.emit('show_popup');
        }
    });
    popupPanel.port.on('getSchedulesByTime', function(date_obj){
        var sched_list = schedules.getSchedulesByTime(date_obj);
        popupPanel.port.emit('sendSchedulesByTime', sched_list);
    });
    popupPanel.port.on('getSchedulesList', function(){
        var sched_list = schedules.getSchedulesList();
        popupPanel.port.emit('sendSchedulesList', sched_list);
    });
    popupPanel.port.on('removeSchedule', function(sched_id){
        storage.removeItem(sched_id);
    });
    popupPanel.port.on('getScheduleById', function(sched_id){
        var schedule_str = storage.getItem(sched_id);
        popupPanel.port.emit('sendScheduleById', schedule_str);
    });
    popupPanel.port.on('saveSchedule', function(schedule){
        var storekey = "sched" + schedule.id;
        storage.setItem(storekey, JSON.stringify(schedule));
        //popupPanel.port.emit('saveSchedule_response', 'OK');
    });
    popupPanel.port.on('getNewScheduleId', function(){
        var sched_index = storage.getItem('sched_index');
        if (sched_index === null || sched_index === undefined) {
            sched_index = 0;
        } else {
            sched_index = parseInt(sched_index);
        }
        popupPanel.port.emit('sendNewScheduleId', sched_index);
        storage.setItem('sched_index', ++sched_index);
    });
    popupPanel.port.on('open_help_page', function(){
        tabs.open(data.url('help/Help-en.html'));
    });
    popupPanel.port.on('open_advanced_page', function(){
        tabs.open(data.url('advanced/advanced.html'));
    });
    var widget = widgets.Widget({
        id: "easycal-popup",
        label: "Click to manage the schedules.",
        contentURL: data.url("widget/easycal-small-on.png"),
        onClick: function() {
            $debug('widget: show the popupPanel');
        },
        contentScriptWhen: 'ready',
        contentScriptFile: data.url('widget/widget.js'),
        panel: popupPanel,
    });

    pageMod.PageMod({
        include: "resource://jid1-dzy2ln9wv9xzrw-at-jetpack/easycal/data/advanced/advanced.html",
        contentScriptFile: [data.url('jquery.js'),
                            data.url('debug.js'),
                            data.url('advanced/advanced.js')],
        onAttach: function(worker) {
            worker.port.on('export', function(option) {
                $debug('export:' + JSON.stringify(option));
                var ics = expsched.exportSchedules(option);
                // Get unique file name under tmp dir.
                var f = Cc["@mozilla.org/file/directory_service;1"].
                        getService(Ci.nsIProperties).
                        get("TmpD", Ci.nsIFile);
                f.append("easycal-exported.ics");
                f.createUnique(Ci.nsIFile.NORMAL_FILE_TYPE, 0666);
                $debug('path:'+f.path);

                var writer = file.open(f.path, "w");
                // TODO
                // Consider using async write
                writer.write(ics);
                writer.close();
                tabs.open("file://" + f.path);
            });
        }
    });

    // Remind
    remind.remindStart();

    // Show help at first install.
    if (storage.getItem("InitiallyShowHelp") === undefined) {
        storage.setItem("InitiallyShowHelp", "Done");
        // Open tab "Help-en.html"
        tabs.open(data.url('help/Help-en.html'));
    }

    ss.on("OverQuota", function () {
        notifications.notify({
            title: 'Storage space exceeded',
            text: 'Please remove some outdated schedules.'});
    });

    privateBrowsing.on('start', function() {
        widget.contentURL = data.url('widget/easycal-small-off.png');
        menuItem.label = label_disabled;
        menuItem.data = "disabled";
    });

    privateBrowsing.on('stop', function() {
        widget.contentURL = data.url('widget/easycal-small-on.png');
        menuItem.label = label_enabled;
        menuItem.data = "enabled";
    });
};
