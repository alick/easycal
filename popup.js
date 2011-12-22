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

    schedules = getAllSchedules();

    g_globalObject.setOnSelectedDelegate(function(){
        var obj = g_globalObject.getSelectedDay();
        console.log("a date was just selected and the date is : " + obj.day + "/" + obj.month + "/" + obj.year);
        document.getElementById("calendar_result").innerHTML = obj.day + "/" + obj.month + "/" + obj.year;
        getSchedulesByTime(obj);
    });
};

function getAllSchedules () {
    var maxid_plus1 = getItem('sched_index');
    if (maxid_plus1 == null) {
        return null;
    }
    var sched_list = [];
    for (var i = 0; i < maxid_plus1; ++i) {
        var schedule_str = getItem('sched' + i);
        if (schedule_str == null) {
            continue;
        }
        var schedule = JSON.parse(schedule_str);
        sched_list.push(schedule);
    }
    return sched_list;
}

function getSchedulesByTime(obj) {
    var sched_table = "<table>";
    for (var sched in schedules) {
        s = schedules[sched];
        var time = new Date(s.sched_time);
        if ((time.getFullYear() == obj.year) &&
            ((time.getMonth() + 1) == obj.month) &&
            (time.getDate() == obj.day)) {
            console.debug("time: " + time.toISOString());
            var sched_html = "";
            sched_html += "<tr id=\"sched" + s.id + "\"><td>";
            sched_html += time.getHours() + ":" + time.getMinutes() + "</td><td>";
            sched_html += s.summary + "</td><td>SET</td></tr>";
            console.debug(sched_html);
            sched_table += sched_html;
        }
    }
    sched_table += "</table>";
    document.getElementById('sched').innerHTML = sched_table;
    console.debug(document.getElementById('sched').innerHTML);
}
