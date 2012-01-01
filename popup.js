g_globalObject = {}

window.onload = function(){
    sl = getSchedulesList();
    g_globalObject = new JsDatePick({
        useMode:1,
        isStripped:true,
        target:"calendar",
        SchedulesList:sl,
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

    // Display schedules of today.
    var today = new Date();
    var today_obj = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
    };
    getSchedulesByTime(today_obj);

    g_globalObject.setOnSelectedDelegate(function(){
        var obj = g_globalObject.getSelectedDay();
        console.log("a date was just selected and the date is : " + obj.day + "/" + obj.month + "/" + obj.year);
        getSchedulesByTime(obj);
    });
};


function getSchedulesList() {
    var maxid_plus1 = getItem('sched_index');
    if (maxid_plus1 == null) {
        return {};
    }
    var sched_table = "<table>";

    SchedulesList = {}
    for (var i = 0; i < maxid_plus1; ++i) {
        var schedule_str = getItem('sched' + i);
        if (schedule_str == null) {
            continue;
        }
        var s = JSON.parse(schedule_str);
        var time = new Date(s.sched_time);
        
        SchedulesList[time.getFullYear().toString()+'-'+time.getMonth().toString()+'-'+time.getDate().toString()] = 1;
    }
    return SchedulesList;
}


function getSchedulesByTime(obj) {
    var maxid_plus1 = getItem('sched_index');
    if (maxid_plus1 == null) {
        return null;
    }
    //var sched_table = "<table>";
    var sched_table = "";

    for (var i = 0; i < maxid_plus1; ++i) {
        var schedule_str = getItem('sched' + i);
        if (schedule_str == null) {
            continue;
        }
        var s = JSON.parse(schedule_str);
        var time = new Date(s.sched_time);
        
        // write shcedule table
        if ((time.getFullYear() == obj.year) &&
            ((time.getMonth() + 1) == obj.month) &&
            (time.getDate() == obj.day)) {
            sched_table += "<div id='div_"+'sched'+s.id+"' class='div_sched_inner'><div><table>"
            console.debug("time: " + time.toISOString());
            var sched_html = "";
            sched_html += '<tr id="sched' + s.id + '"><td class="time">';
            if (Number(time.getMinutes()) < 10) {
                sched_html += time.getHours() + ":0" + time.getMinutes() + "</td>";
            } else {
                sched_html += time.getHours() + ":" + time.getMinutes() + "</td>";
            }
            sched_html += '<td class="summary"><a href="#" title="' + s.content + '">';
            var disp_str = s.summary;
            if (disp_str.length > 13) {
                disp_str = disp_str.substr(0, 12) + '...';
            }
            sched_html += disp_str + "</a></td>";
            //sched_html += s.summary + "</td>";
            sched_html += '<td><img src="Edit-New.png" alt="Edit" title="Edit" height="20px" width="20px" class="popup-menu-item"></td>';
            sched_html += '<td><img src="Delete-New.png" alt="Remove" title="Remove" height="20px" width="20px" class="popup-menu-item"></td></tr>';
            sched_table += sched_html;
            sched_table += "</table></div>";
            // This is to add a invisible editing div
            var editing_div = "<div id='sched"+s.id+"_edit' style='display:none;font-size:0.6em;'>";
            editing_div += 
                "<div style='padding:0.5em 0 0 0.5em;'>" + 
                "<div class='sch_div' id='div_time'>" + 
                "时间: " + 
                "<input type='text' maxlength='4' style='width:3em;height:1em;text-align:center;' id='year' value='"+time.getFullYear()+"'>-" + 
                "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='month' value='"+time.getMonth()+"'>-" + 
                "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='day' value='"+time.getDate()+"'>   " + 
                "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='hour' value='"+time.getHours()+"'>:" + 
                "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='minute' value='"+time.getMinutes()+"'>" + 
                "</div>" + 
                
                "<div class='sch_div' id='div_loc'>" + 
                "地点: " + 
                "<input type='text' style='width:14em;height:1em;' id='address'>" + 
                "</div>" + 
                
                
                "<div class='sch_div' id='div_content'>" + 
                "内容: " + 
                "<textarea cols='28' rows='2' style='width:14em;height:2em;vertical-align: top;' id='content' name='content'></textarea>" + 
                "</div>" + 
                
                "<div class='sch_div' id='div_type'>" + 
                "类型: " + 
                "<input type='radio' name='type' id='meeting' value='meeting' checked='checked'/> 会议" + 
                "<input type='radio' name='type' id='memorial' value='memorial'/> 纪念日" + 
                "<input type='radio' name='type' id='deadline' value='deadline'/> 截止日期" + 
                "</div>" + 
                
                "<div class='sch_div' id='div_remind'>" + 
                "提醒: 提前 " + 
                "<input type='text' style= 'overflow-x:visible;width:3em;height:1em;' id='remindTime'>" + 
                "<select id='remindUnit' name='remindUnit'>" + 
                "<option value='day'>天</option>" + 
                "<option value='hour'>小时</option>" + 
                "<option value='minute' selected='selected'>分</option>" + 
                "</select>" + 
                "</div>" + 
                
                "<div id='div_submit' style='text-align: center;'>" + 
                "<input type='submit' class='popup-menu-item' alt='Edit_Save' id='submit' value='保存' style='padding:0.2em 1em 0.2em 1em;margin:0.5em 0.5em 0.5em 0.5em;'/> " + 
                "<input type='submit' class='popup-menu-item' alt='Edit_Cancel' id='cancel' value='取消' style='padding:0.2em 1em 0.2em 1em;margin:0.5em 0.5em 0.5em 0.5em;' />" + 
                "</div>" + 
                "</div>";
                
            editing_div += "</div>";
            sched_table += editing_div;
            sched_table += "</div>";
        }
    }
    //sched_table += "</table>";
    document.getElementById('sched').innerHTML = sched_table;
    if (sched_table === "<table></table>") {
        $('#schedhead').css("display", "none");
        $('#sched').css("display", "none");
        return;
    }
    $('#sched').css("display", "block");
    $('#schedhead').css('display', 'inline');
    $('tr:odd').css('background-color', '#FAE6E6');
    $('tr:even').css('background-color', '#E6E6FA');
    $('.summary').cluetip();
    $(".popup-menu-item").unbind();
    $(".popup-menu-item").click(function(){
        var action = $(this).attr("alt");
        var sched_id = $(this).parent().parent().attr("id");
        if (action == "Remove") {
            console.log("To remove " + sched_id);
            // remove the g_ScheduleList[XXXX-XX-XX]
            var schedule_str = getItem(sched_id);
            if (schedule_str != null) {
                var s = JSON.parse(schedule_str);
                var time = new Date(s.sched_time);
                delete g_ScheduleList[time.getFullYear().toString()+'-'+time.getMonth().toString()+'-'+time.getDate().toString()];
            }
            g_globalObject.repopulateMainBox()
            
            // remove the key-value pair in LocalStorage
            removeItem(sched_id);
            
            // remove the table row in current GUI
            $("#div_" + sched_id).remove();
        } else if (action == "Edit") {
            var schedule_str = getItem(sched_id);
            if (schedule_str != null) {
                var s = JSON.parse(schedule_str);
                var time = new Date(s.sched_time);
                if ($("#" + sched_id + "_edit")[0].style.display == 'none') {
                    // Show
                    $("#" + sched_id + "_edit").css("display", "block");
                    
                    // Value Set
                    var schedule_str = getItem(sched_id);
                    if (schedule_str != null) {
                        var s = JSON.parse(schedule_str);
                        var time = new Date(s.sched_time);
                        $("#" + sched_id + "_edit > div > div#div_time > input#year")[0]["value"] = time.getFullYear().toString();
                        $("#" + sched_id + "_edit > div > div#div_time > input#month")[0]["value"] = (time.getMonth()+1).toString();
                        $("#" + sched_id + "_edit > div > div#div_time > input#day")[0]["value"] = time.getDate().toString();
                        $("#" + sched_id + "_edit > div > div#div_time > input#hour")[0]["value"] = time.getHours().toString();
                        $("#" + sched_id + "_edit > div > div#div_time > input#minute")[0]["value"] = time.getMinutes().toString();
                        $("#" + sched_id + "_edit > div > div#div_loc > input#address").val(s.sched_loc);
                        $("#" + sched_id + "_edit > div > div#div_content > #content")[0]["value"] = s.content;
                        $("#" + sched_id + "_edit > div > #div_type > input:radio[value="+s.type+"]")[0].checked = true;
                        $("#" + sched_id + "_edit > div > div#div_remind > #remindTime")[0]["value"] = s.timebefore;
                        $("#" + sched_id + "_edit > div > div#div_remind > #remindUnit").val(s.timestyle)          
                    }
                } else {
                    // Hide and save and refresh
                    $("#" + sched_id + "_edit").css("display", "none");
                    popup_save(sched_id, s);
                    // refresh schedule list
                    g_ScheduleList = getSchedulesList();
                    // refresh jsDatePick
                    g_globalObject.repopulateMainBox()
                    // refresh sched
                    getSchedulesByTime(obj);
                }
            }     
        } else if (action == "Edit_Save") {
            sched_id = /(sched\d+)_edit/.exec($(this).parent().parent().parent().attr('id'))[1];
            var schedule_str = getItem(sched_id);
            if (schedule_str != null) {
                var s = JSON.parse(schedule_str);
                var time = new Date(s.sched_time);

                // Hide and save and refresh
                $("#" + sched_id + "_edit").css("display", "none");
                popup_save(sched_id, s);
                // refresh schedule list
                g_ScheduleList = getSchedulesList();
                // refresh jsDatePick
                g_globalObject.repopulateMainBox()
                // refresh sched
                getSchedulesByTime(obj);
            }
        } else if (action == "Edit_Cancel") {
            sched_id = /(sched\d+)_edit/.exec($(this).parent().parent().parent().attr('id'))[1];
            // Hide
            $("#" + sched_id + "_edit").css("display", "none");
        } else {
            console.warn("Not supported yet!"+action);
        }
    });
}

function popup_save(sched_id, s) {
    // FIXME
    // add all input values
    var userYear = Number($("#" + sched_id + "_edit > div > div#div_time > input#year")[0]["value"]);
    var userMonth = Number($("#" + sched_id + "_edit > div > div#div_time > input#month")[0]["value"]-1);
    var userDate = Number($("#" + sched_id + "_edit > div > div#div_time > input#day")[0]["value"]);
    var userHour = Number($("#" + sched_id + "_edit > div > div#div_time > input#hour")[0]["value"]);
    var userMinute = Number($("#" + sched_id + "_edit > div > div#div_time > input#minute")[0]["value"]);
    var userSecond = 0;

    //TODO
    // warn about stuff like 2011-02-30
    // Check input value.
    if ((userMonth<0) || (userMonth>11) ||
        (userDate<1) || (userDate>31) ||
        (userHour<0) || (userHour>23) ||
        (userMinute<0) || (userMinute>59) ||
        (userSecond<0) || (userSecond>59)) {
        return false;
    }

    console.log('Storing schedule...');
    // Not ending with semicolon is not an error in Javascript :)
    s.sched_time = new Date();
    s.sched_time.setFullYear(userYear);
    s.sched_time.setMonth(userMonth);
    s.sched_time.setDate(userDate);
    s.sched_time.setHours(userHour, userMinute, userSecond);

    s.sched_loc = $("#" + sched_id + "_edit > div > div#div_loc > input#address").val();
    s.content = $("#" + sched_id + "_edit > div > div#div_content > #content")[0]["value"];
    s.summary = s.content;
    s.type = $("#" + sched_id + "_edit > div > #div_type > input:radio[checked=checked]").attr('value');

    var timebefore = $("#" + sched_id + "_edit > div > div#div_remind > #remindTime")[0]["value"];
    var timestyle = $("#" + sched_id + "_edit > div > div#div_remind > #remindUnit").val();

    s.timebefore = timebefore;
    s.timestyle = timestyle

    //if(timestyle=="year") s.sched_remindtime = timebefore*1000*60*60*24*365;
    //if(timestyle=="month") s.sched_remindtime = timebefore*1000*60*60*24*30;
    
    // s.sched_remindtime is the timestamp due to remind 
    s.sched_remindtime = new Date();
    if(timestyle=="day") {
        s.sched_remindtime.setTime(s.sched_time.getTime() - timebefore*1000*60*60*24);
    }
    if(timestyle=="hour") {
        s.sched_remindtime.setTime(s.sched_time.getTime() - timebefore*1000*60*60);
    }
    if(timestyle=="minute") {
        s.sched_remindtime.setTime(s.sched_time.getTime() - timebefore*1000*60);
    }
    //if(timestyle=="second") s.sched_remindtime = timebefore*1000;

    console.log('sched:');
    console.log(s);

    // store into local storage
    var storekey = "sched" + s.id;
    setItem(storekey, JSON.stringify(s));
}