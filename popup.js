window.onload = addSchedule;
var $ = function(id){return document.getElementById(id);}
function addSchedule () {
    var maxid_plus1 = getItem('sched_index');
    if (maxid_plus1 == null) {
        return;
    }
    for (var i = 0; i < maxid_plus1; ++i) {
        var schedule_str = getItem('sched' + i);
        if (schedule_str == null) {
            continue;
        }
        var schedule = JSON.parse(schedule_str);
        log("schedule summary: " + schedule.summary);
        var sched_time = new Date(schedule.sched_time);
        var sched_html = "<div>" +
                         sched_time.toISOString() +
                         " " + schedule.summary +
                         "</div>";
        $('#sched').innerHTML += sched_html;
    }
}
