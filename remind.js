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
        var time = new Date(s.sched_remindtime);
        var now_time = new Date();
        var millisecond_left = time.getTime() - now_time.getTime();
        if (millisecond_left > 0 && millisecond_left <= 60 * 1000) {
            AUTO_CLOSE_DELAY_SECONDS = 2;
            var notification = webkitNotifications.createNotification(
                'huaci.png',// icon url - can be relative
                chrome.i18n.getMessage('extNewRemind'),//  notification title
                s.content
            );
            setTimeout( function() { notification.show(); }, millisecond_left );
            console.log('to remind at'+time.toString());
        }
    }
}

setInterval("periodCheck()", 60 * 1000);
