// This is preserved for reminding

function periodCheck() {
    console.log('EasyCal Period Check'+Date().toString());
    
    var maxid_plus1 = getItem('sched_index');
    if (maxid_plus1 == null) {
        return null;
    }

    for (var i = 0; i < maxid_plus1; ++i) {
        var schedule_str = getItem('sched' + i);
        if (schedule_str == null) {
            continue;
        }
        var s = JSON.parse(schedule_str);
        //console.log(s);
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
            var notification = webkitNotifications.createNotification(
                'huaci.png',// icon url - can be relative
                strTitle,//  notification title
                s.content
            );
            setTimeout( function() { notification.show(); }, millisecond_left );
            console.log('to remind at'+time.toString());
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
                var notification = webkitNotifications.createNotification(
                    'huaci.png',// icon url - can be relative
                    strTitle,//  notification title
                    s.content
                );
                setTimeout( function() { notification.show(); }, millisecond_left );
                console.log('to remind at'+time.toString());
            }
        }
    }
}

setInterval("periodCheck()", 60 * 1000);
