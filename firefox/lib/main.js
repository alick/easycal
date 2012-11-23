// Import the APIs we need.
var widgets = require("widget");
var tabs = require("tabs");
var contextMenu = require("context-menu");
var panels = require("panel");
var ss = require('simple-storage');

var notifications = require("notifications");
var privateBrowsing = require('private-browsing');

var pref = require("simple-prefs");
var _ = require("l10n").get;

var data = require("self").data;

var storage = require("storage");
var schedules = require("schedule");
var remind = require("remind");

// Whether we are in develop mode:
var devmode = false;
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
    var logo_img_html = '<img src="' + data.url("widget/easycal-small-on.png") + '" />';
    var logo_img_html_off = '<img src="' + data.url("widget/easycal-small-off.png") + '" />';
    var widget = widgets.Widget({
        id: "easycal-popup",
        label: "Click to manage the schedules.",
        // The nbsp in content serves as a placeholder to make sure
        // content will not become empty. Without it, exceptions will be
        // throwed and users can not click the widget.
        content: logo_img_html + '&nbsp;',
        onClick: function() {
            $debug('widget: show the popupPanel');
        },
        contentScriptWhen: 'ready',
        contentScriptFile: data.url('widget/widget.js'),
        panel: popupPanel,
    });

    var show_time = pref.prefs['show_time'];
    var show_event = pref.prefs['show_event'];
    var show_logo = pref.prefs['show_logo'];
    // Remember widget content before switching to privacy mode.
    var orig_widget_content = widget.content;
    var orig_widget_width = widget.width;
    if (show_time) {
        var d = new Date();
        var time = d.toTimeString().substr(0, 8);
        widget.content += '<span id="timer">&nbsp;' + time + '</span>';
        widget.width += 80;
    }
    if (show_event) {
        var num = schedules.getUpcomingSchedulesNum();
        var event_str = _("event_id", num);
        widget.content += '<span id="event">&nbsp;' + event_str + '</span>';
        widget.width += 80;
    }
    if (!show_logo) {
        widget.content = widget.content.replace(logo_img_html, '');
        widget.width -= 16;
    }
    pref.on('show_time', function(name){
        show_time = pref.prefs[name];
        if (show_time) {
            var d = new Date();
            var time = d.toTimeString().substr(0, 8);
            widget.content += '<span id="timer">&nbsp;' + time + '</span>';
            widget.width += 80;
        } else {
            $debug('content: ' + widget.content);
            widget.content = widget.content.replace(/<span id="timer">[^>]*<\/span>/g, '');
            $debug('content: ' + widget.content);
            widget.width -= 80;
        }
    });
    pref.on('show_event', function(name){
        show_event = pref.prefs[name];
        if (show_event) {
            var num = schedules.getUpcomingSchedulesNum();
            var event_str = _("event_id", num);
            widget.content += '<span id="event">&nbsp;' + event_str + '</span>';
            widget.width += 80;
        } else {
            $debug('content: ' + widget.content);
            widget.content = widget.content.replace(/<span id="event">[^>]*<\/span>/g, '');
            $debug('content: ' + widget.content);
            widget.width -= 80;
        }
    });
    pref.on('show_logo', function(name){
        show_logo = pref.prefs[name];
        if (show_logo) {
            widget.width += 16;
            widget.content = logo_img_html + widget.content;
        } else {
            widget.content = widget.content.replace(logo_img_html, '');
            widget.width -= 16;
        }
    });
    widget.port.on('refresh_event_num', function(){
        $debug('to refresh event number...');
        var num = schedules.getUpcomingSchedulesNum();
        var event_str = _("event_id", num);
        widget.port.emit('refresh_event_html', event_str);
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
        orig_widget_content = widget.content;
        orig_widget_width = widget.width;
        widget.content = logo_img_html_off;
        widget.width = 16;
        menuItem.label = label_disabled;
        menuItem.data = "disabled";
    });

    privateBrowsing.on('stop', function() {
        widget.content = orig_widget_content;
        widget.width = orig_widget_width;
        menuItem.label = label_enabled;
        menuItem.data = "enabled";
    });
};
