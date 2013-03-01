// This is preserved for reminding
var ss = require('sdk/simple-storage');
var notifications = require("sdk/notifications");
var timers = require("sdk/timers");
var self = require("sdk/self");
var myIconURL = self.data.url("easycal-64x64.png");

function periodCheck() {
    for (var key in ss.storage) {
        // First make sure key is of format 'sched<num>'
        if ((key.indexOf('sched') < 0) || isNaN(parseInt(key.substr(5)))) {
            // not sched key
            continue;
        }
        var schedule_str = ss.storage[key];
        var s = JSON.parse(schedule_str);
        var time = new Date(s.sched_remindtime);
        var now_time = new Date();
        var millisecond_left = time.getTime() - now_time.getTime();
        if (millisecond_left > 0 && millisecond_left <= 60 * 1000) {
            AUTO_CLOSE_DELAY_SECONDS = 2;
            var sched_time = new Date(s.sched_time);
            var strTitle = sched_time.getHours().toString()+":";
            if (sched_time.getMinutes() < 10) {
                strTitle += "0" + sched_time.getMinutes().toString();
            } else {
                strTitle += sched_time.getMinutes().toString();
            }
            var showNotify = function(){
                notifications.notify({
                    title: strTitle,
                    text: s.content,
                    iconURL: myIconURL
                });
            };
            timers.setTimeout(showNotify, millisecond_left);
        } else if (millisecond_left < 0) {
            var enableRemind = false;
            var minutes_left = Math.floor(millisecond_left/(60 * 1000));
            if (minutes_left % (60*24) == 0) {
                // check if is
                var loop = parseInt(s.loop);
                if (loop > 0 && loop <= 7) {
                    var days_left = minutes_left / (60*24);
                    if (days_left % loop == 0) {
                        enableRemind = true;
                    }
                } else if (loop == 30) {
                    if (now_time.getDate() == time.getDate()) {
                        enableRemind = true;
                    }
                } else if (loop == 365) {
                    if (now_time.getDate() == time.getDate() && now_time.getMonth() == time.getMonth()) {
                        enableRemind = true;
                    }
                }
            }
            if (enableRemind) {
                millisecond_left = ( millisecond_left % (60*1000) + (60*1000) ) % (60*1000);
                AUTO_CLOSE_DELAY_SECONDS = 2;
                var sched_time = new Date(s.sched_time);
                var strTitle = sched_time.getHours().toString()+":";
                if (sched_time.getMinutes() < 10) {
                    strTitle += "0" + sched_time.getMinutes().toString();
                } else {
                    strTitle += sched_time.getMinutes().toString();
                }
                var showNotify = function(){
                    notifications.notify({
                        title: strTitle,
                        text: s.content,
                        iconURL: myIconURL
                    });
                };
                timers.setTimeout(showNotify, millisecond_left);
            }
        }
    }
}

function remindStart() {
    timers.setInterval(periodCheck, 60 * 1000);
}

exports.remindStart = remindStart;
