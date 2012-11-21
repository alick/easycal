var ss = require('simple-storage');

function getSchedulesByTime (date_obj) {
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
        
        if (loop > 0 && loop < 10000 && loop != 30 && loop != 365) {
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
    ScheduleList.sort(cmpSchedule);
    return ScheduleList;
}

function cmpSchedule(s1, s2) {
    var t1 = (new Date(s1.sched_time)).getTime();
    var t2 = (new Date(s2.sched_time)).getTime();
    return t1 - t2;
}

function getUpcomingSchedulesNum() {
    var num = 0;
    var today = new Date();
    var date_obj = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
    };
    var sched_list = getSchedulesByTime(date_obj);
    for (var i = 0; i < sched_list.length; ++i) {
        var s = sched_list[i];
        stime = new Date(s.sched_time);
        stime.setFullYear(date_obj.year, date_obj.month-1, date_obj.day);
        if (stime.getTime() > today.getTime()) {
            num += 1;
        }
    }
    return num;
}

//FIXME
// The function name is confusing.
function getSchedulesList() {
    // FIXME
    // The name ScheduleList is confusing.
    var SchedulesList = {};
    for (var key in ss.storage) {
        // First make sure key is of format 'sched<num>'
        if ((key.indexOf('sched') < 0) || isNaN(parseInt(key.substr(5)))) {
            // not sched key
            continue;
        }
        var schedule_str = ss.storage[key];
        var s = JSON.parse(schedule_str);
        var time = new Date(s.sched_time);

        // give limited display for DatePick
        // TODO
        // Might need clean ups.
        var loop = parseInt(s.loop);
        if (loop > 0 && loop <= 29) {
            // 1 2 or 7 or other user defined value
            var newTime = new Date(time);
            for (var j=0; j<31; j++) {
                SchedulesList[newTime.getFullYear().toString()+'-'+newTime.getMonth().toString()+'-'+newTime.getDate().toString()] = 1;
                newTime.setDate(newTime.getDate()+loop);
            }
        } else if (loop == 30) {
            // 30 means monthly
            var newTime = new Date(time);
            for (var j=0; j<20; j++) {
                SchedulesList[newTime.getFullYear().toString()+'-'+newTime.getMonth().toString()+'-'+newTime.getDate().toString()] = 1;
                newTime.setMonth(newTime.getMonth()+1);
            }
        } else if (loop == 365) {
            // 365 means yearly
            var newTime = new Date(time);
            for (var j=0; j<10; j++) {
                SchedulesList[newTime.getFullYear().toString()+'-'+newTime.getMonth().toString()+'-'+newTime.getDate().toString()] = 1;
                newTime.setFullYear(newTime.getFullYear()+1);
            }
        } else if (loop == 0) {
            SchedulesList[time.getFullYear().toString()+'-'+time.getMonth().toString()+'-'+time.getDate().toString()] = 1;
        } else {
            // Should not be here
            console.error('Invalid loop value!');
        }
    }
    return SchedulesList;
}

exports.getSchedulesByTime = getSchedulesByTime;
exports.getSchedulesList = getSchedulesList;
exports.getUpcomingSchedulesNum = getUpcomingSchedulesNum;
