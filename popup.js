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
        getSchedulesByTime(obj);
    });

};

function getSchedulesByTime(obj) {
    var maxid_plus1 = getItem('sched_index');
    if (maxid_plus1 == null) {
        return null;
    }
    var sched_table = "<table>";

    for (var i = 0; i < maxid_plus1; ++i) {
        var schedule_str = getItem('sched' + i);
        if (schedule_str == null) {
            continue;
        }
        var s = JSON.parse(schedule_str);
        var time = new Date(s.sched_time);
        if ((time.getFullYear() == obj.year) &&
            ((time.getMonth() + 1) == obj.month) &&
            (time.getDate() == obj.day)) {
            console.debug("time: " + time.toISOString());
            var sched_html = "";
            sched_html += "<tr id=\"sched" + s.id + "\"><td>";
            sched_html += time.getHours() + ":" + time.getMinutes() + "</td>"
            sched_html += '<td class="summary" title=' + s.content + '>';
            sched_html += s.summary + "</td>";
            sched_html += '<td><img src="Edit.png" alt="Edit" title="Edit" height="20px" width="20px" class="popup-menu-item"></td>';
            sched_html += '<td><img src="Delete-New.png" alt="Remove" title="Remove" height="20px" width="20px" class="popup-menu-item"></td></tr>';
            sched_table += sched_html;
        }
    }
    sched_table += "</table>";
    document.getElementById('sched').innerHTML = sched_table;
    $(".popup-menu-item").unbind();
    $(".popup-menu-item").click(function(){
        var action = $(this).attr("alt");
        var sched_id = $(this).parent().parent().attr("id");
        if (action == "Remove") {
            console.log("To remove " + sched_id);
            // remove the key-value pair in LocalStorage
            removeItem(sched_id);
            // remove the table row in current GUI
            $("#" + sched_id).remove();
        } else if (action == "Edit") {
            var sched_str = getItem(sched_id);
            var request = {
                newsched: false,
                schedule_str: sched_str,
            };
            chrome.tabs.create({"url":"editcal.html", active:false},
                function(tab){
                    console.log('to sendRequest');
                    console.log(request);
                    chrome.extension.sendRequest(request);
                    chrome.tabs.update(tab.id, {active: true});
                });
        } else {
            console.warn("Not supported yet!");
        }
    });
}

