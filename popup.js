window.onload = function(){
    g_globalObject = new JsDatePick({
        useMode:1,
        isStripped:true,
        target:"calendar"
        /*selectedDate:{
          day:5,
          month:9,
          year:2006
          },
          yearsRange:[1978,2020],
          limitToToday:false,
          cellColorScheme:"beige",
          dateFormat:"%m-%d-%Y",
          imgPath:"img/",
          weekStartDay:1*/
    });

    g_globalObject.setOnSelectedDelegate(function(){
        var obj = g_globalObject.getSelectedDay();
        console.log("a date was just selected and the date is : " + obj.day + "/" + obj.month + "/" + obj.year);
        document.getElementById("calendar_result").innerHTML = obj.day + "/" + obj.month + "/" + obj.year;
    });
};

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
        document.getElementById('sched').innerHTML += sched_html;
    }
}
