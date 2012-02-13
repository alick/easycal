var ss = require('simple-storage');

function getSchedulesByTime (date_obj) {
    console.debug('Begin getSchedulesByTime...');
    var ScheduleList = [];
    for (var key in ss.storage) {
        // First make sure key is of format 'sched<num>'
        if ((key.indexOf('sched') < 0) || isNaN(parseInt(key.substr(5)))) {
            // not sched key
            continue;
        }

        var schedule_str = ss.storage[key];
        //console.log(key + '->' + schedule_str);
        var s = JSON.parse(schedule_str);
        // FIXME
        // We just store a string not an object.
        var time = new Date(s.sched_time);
        var this_day = new Date(date_obj.year, date_obj.month-1, date_obj.day);
        var shed_day = new Date(time.getFullYear(), time.getMonth(), time.getDate());
        var loop = parseInt(s.loop);
        
        if (loop > 0 && loop <= 7) {
            if (this_day.getTime() > shed_day.getTime() && (this_day.getTime() - shed_day.getTime())%(loop*24*60*60*1000) == 0) {
                time.setFullYear(date_obj.year, date_obj.month-1, date_obj.day);
            }
        } else if (loop == 30) {
            if (this_day.getDate() == shed_day.getDate()) {
                time.setFullYear(date_obj.year, date_obj.month-1, date_obj.day);
            }
        } else if (loop == 365) {
            if (this_day.getDate() == shed_day.getDate() && this_day.getMonth() == shed_day.getMonth()) {
                time.setFullYear(date_obj.year, date_obj.month-1, date_obj.day);
            }
        }
        
        // write shcedule table
        if ((time.getFullYear() == date_obj.year) &&
            ((time.getMonth() + 1) == date_obj.month) &&
            (time.getDate() == date_obj.day)) {
            ScheduleList.push(s);
        }
    }
    //ScheduleList.forEach(function(element, index, array){
        //console.log('ScheduleList[' + index + ']:' + JSON.stringify(element));
    //});
    ScheduleList.sort(cmpSchedule);
    //ScheduleList.forEach(function(element, index, array){
        //console.log('ScheduleList[' + index + ']:' + JSON.stringify(element));
    //});
    console.debug('End getSchedulesByTime...');
    return ScheduleList;
}

function cmpSchedule(s1, s2) {
    var t1 = (new Date(s1.sched_time)).getTime();
    var t2 = (new Date(s2.sched_time)).getTime();
    return t1 - t2;
}

exports.getSchedulesByTime = getSchedulesByTime;
