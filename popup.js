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


function myCmp(a, b) {
    return a[0] - b[0];
}


function getSchedulesByTime(obj) {
    var maxid_plus1 = getItem('sched_index');
    if (maxid_plus1 == null) {
        setItem('sched_index', 0);
        maxid_plus1 = 0;
    }
    maxid_plus1 = Number(maxid_plus1)
    //var sched_table = "<table>";
    var sched_table = "";
    
    //sort
    TodayScheduleList = Array();
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
            TodayScheduleList.push(Array(Number(time.getTime()), s));
        }
    }
    TodayScheduleList.sort(myCmp);

    for (var i = 0; i < TodayScheduleList.length; ++i) {
        //var schedule_str = getItem('sched' + i);
        //if (schedule_str == null) {
        //    continue;
        //}
        
        var s = TodayScheduleList[i][1];
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
            sched_html += '<td><img src="Edit-New.png" alt="Edit" title="修改" height="20px" width="20px" class="popup-menu-item"></td>';
            sched_html += '<td><img src="Delete-New.png" alt="Remove" title="删除" height="20px" width="20px" class="popup-menu-item"></td></tr>';
            sched_table += sched_html;
            sched_table += "</table></div>";
            // This is to add a invisible editing div
            var editing_div = "<div id='sched"+s.id+"_edit' style='display:none;font-size:0.6em;'>";
            editing_div += 
                "<div style='text-align:center;font-size:0.8em;font-weight:bold;padding:0.5em 0.5em 0.5em 0.5em;background-color:gray;'>修改日程</div>" +
                "<div style='padding:0em 0 0 0em;'>" + 
                "<div class='sch_div' id='div_time' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
                "时间: " + 
                "<input type='text' maxlength='4' style='width:3em;height:1em;text-align:center;' id='year' value='"+time.getFullYear()+"'>-" + 
                "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='month' value='"+time.getMonth()+"'>-" + 
                "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='day' value='"+time.getDate()+"'>   " + 
                "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='hour' value='"+time.getHours()+"'>:" + 
                "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='minute' value='"+time.getMinutes()+"'>" + 
                "</div>" + 
                
                "<div class='sch_div' id='div_content' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
                "内容: " + 
                "<textarea cols='28' rows='2' style='width:14em;height:2em;vertical-align: top;' id='content' name='content'></textarea>" + 
                "</div>" + 

                "<div class='sch_div' id='div_loc' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
                "地点: " + 
                "<input type='text' style='width:14em;height:1em;' id='address'>" + 
                "</div>" + 
                
                
                
                "<div class='sch_div' id='div_type' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
                "类型: " + 
                "<input type='radio' name='type' id='meeting' value='meeting' checked='checked'/> 会议" + 
                "<input type='radio' name='type' id='memorial' value='memorial'/> 纪念日" + 
                "<input type='radio' name='type' id='deadline' value='deadline'/> 截止日期" + 
                "</div>" + 
                
                "<div class='sch_div' id='div_remind' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
                "提醒: 提前 " + 
                "<input type='text' style= 'overflow-x:visible;width:3em;height:1em;' id='remindTime'>" + 
                "<select id='remindUnit' name='remindUnit'>" + 
                "<option value='day'>天</option>" + 
                "<option value='hour'>小时</option>" + 
                "<option value='minute' selected='selected'>分</option>" + 
                "</select>" + 
                "</div>" + 
                
                "<div id='div_submit' style='text-align:center;background-color:#C0C0C0;padding:0.5em 0.5em 0.5em 0.5em;'>" + 
                "<input type='submit' class='popup-menu-item' alt='Edit_Save' id='submit' value='保存' style='padding:0.2em 1em 0.2em 1em;margin:0.5em 0em 0.5em 0em;'/> " + 
                "<input type='submit' class='popup-menu-item' alt='Edit_Cancel' id='cancel' value='取消' style='padding:0.2em 1em 0.2em 1em;margin:0.5em 0em 0.5em 0em;' />" + 
                "</div>" + 
                "</div>";
                
            editing_div += "</div>";
            sched_table += editing_div;
            sched_table += "</div>";
        }
    }
    
    // Add tips if there is no schedule
    if (sched_table == "") {
        sched_table = "<div id='div_tips' style='text-align:center;font-size:0.8em;padding:1em 1em 1em 1em;'>这一天没有日程，你可以<a href='#' class='popup-menu-item' alt='New'>新建日程</a></div>";
    }
    
    // Add '+' sign
    sched_table += "<div id='div_add' style='text-align:center;padding:0.5em 0em 0.1em 0em;'><img class='popup-menu-item' alt='New' src='popup_add.png'></div>";
    
    var time = new Date(obj.year, obj.month-1, obj.day, 7, 0);
    var adding_div = 
        "<div id='div_new' style='display:none;font-size:0.6em;'>" +
        "<div style='text-align:center;font-size:0.8em;font-weight:bold;padding:0.5em 0.5em 0.5em 0.5em;background-color:gray;'>新建日程</div>" +
        "<div style='padding:0em 0 0 0em;'>" + 
        "<div class='sch_div' id='div_time' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
        "时间: " + 
        "<input type='text' maxlength='4' style='width:3em;height:1em;text-align:center;' id='year' value='"+time.getFullYear().toString()+"'>-" + 
        "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='month' value='"+(time.getMonth()+1).toString()+"'>-" + 
        "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='day' value='"+time.getDate().toString()+"'>   " + 
        "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='hour' value='"+(time.getHours()+1).toString()+"'>:" + 
        "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='minute' value='00'>" + 
        "</div>" + 
        
        "<div class='sch_div' id='div_content' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
        "内容: " + 
        "<textarea cols='28' rows='2' style='width:14em;height:2em;vertical-align: top;' id='content' name='content'></textarea>" + 
        "</div>" + 

        "<div class='sch_div' id='div_loc' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
        "地点: " + 
        "<input type='text' style='width:14em;height:1em;' id='address'>" + 
        "</div>" + 
        
        
        
        "<div class='sch_div' id='div_type' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
        "类型: " + 
        "<input type='radio' name='type' id='meeting' value='meeting' checked='checked'/> 会议" + 
        "<input type='radio' name='type' id='memorial' value='memorial'/> 纪念日" + 
        "<input type='radio' name='type' id='deadline' value='deadline'/> 截止日期" + 
        "</div>" + 
        
        "<div class='sch_div' id='div_remind' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
        "提醒: 提前 " + 
        "<input type='text' style= 'overflow-x:visible;width:3em;height:1em;' id='remindTime' value='15'>" + 
        "<select id='remindUnit' name='remindUnit'>" + 
        "<option value='day'>天</option>" + 
        "<option value='hour'>小时</option>" + 
        "<option value='minute' selected='selected'>分</option>" + 
        "</select>" + 
        "</div>" + 
        
        "<div id='div_submit' style='text-align:center;background-color:#C0C0C0;padding:0.2em 0.5em 0.2em 0.5em;'>" + 
        "<input type='submit' class='popup-menu-item' alt='New_Save' id='submit' value='保存' style='padding:0.2em 1em 0.2em 1em;margin:0.5em 0.5em 0.5em 0.5em;'/> " + 
        "<input type='submit' class='popup-menu-item' alt='New_Cancel' id='cancel' value='取消' style='padding:0.2em 1em 0.2em 1em;margin:0.5em 0.5em 0.5em 0.5em;' />" + 
        "</div>" + 
        "</div>" + 
        "</div>";
    sched_table += adding_div;
    
    document.getElementById('sched').innerHTML = sched_table;
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
                // remove the key-value pair in LocalStorage
                removeItem(sched_id);
                // refresh schedule list
                g_ScheduleList = getSchedulesList();
                // refresh jsDatePick
                g_globalObject.repopulateMainBox();
                // refresh sched
                getSchedulesByTime(obj);
            }
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
                        strMin = time.getMinutes().toString();
                        if (strMin.length == 1) strMin = '0'+strMin;
                        $("#" + sched_id + "_edit > div > div#div_time > input#minute")[0]["value"] = strMin;
                        $("#" + sched_id + "_edit > div > div#div_loc > input#address").val(s.sched_loc);
                        $("#" + sched_id + "_edit > div > div#div_content > #content")[0]["value"] = s.content;
                        $("#" + sched_id + "_edit > div > #div_type > input:radio[value="+s.type+"]")[0].checked = true;
                        $("#" + sched_id + "_edit > div > div#div_remind > #remindTime")[0]["value"] = s.timebefore;
                        $("#" + sched_id + "_edit > div > div#div_remind > #remindUnit").val(s.timestyle);
                    }
                } else {
                    // Hide and save and refresh
                    $("#" + sched_id + "_edit").css("display", "none");
                    popup_save(sched_id, s);
                    // refresh schedule list
                    g_ScheduleList = getSchedulesList();
                    // refresh jsDatePick
                    g_globalObject.repopulateMainBox();
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
                g_globalObject.repopulateMainBox();
                // refresh sched
                getSchedulesByTime(obj);
            }
        } else if (action == "Edit_Cancel") {
            sched_id = /(sched\d+)_edit/.exec($(this).parent().parent().parent().attr('id'))[1];
            // Hide
            $("#" + sched_id + "_edit").css("display", "none");
        } else if (action == "New") {
            // Show Adding, Hide tip and adding button
            $("#div_new").css("display", "block");
            $("#div_tips").css("display", "none");
            $("#div_add").css("display", "none");
                        
        } else if (action == "New_Save") {
            // Save form to new schedule, refresh g_ScheduleList, jsDatePick and sched list
            // Save form
            popup_new();
            // refresh schedule list
            g_ScheduleList = getSchedulesList();
            // refresh jsDatePick
            g_globalObject.repopulateMainBox();
            // refresh sched
            getSchedulesByTime(obj);
            
        } else if (action == "New_Cancel") {
            // Hide Adding, Show tip and adding button
            $("#div_new").css("display", "none");
            $("#div_tips").css("display", "block");
            $("#div_add").css("display", "block");
            
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
    s.timestyle = timestyle;

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


function popup_new() {
    // FIXME
    // add all input values
    var userYear = Number($("#div_new > div > div#div_time > input#year")[0]["value"]);
    var userMonth = Number($("#div_new > div > div#div_time > input#month")[0]["value"]-1);
    var userDate = Number($("#div_new > div > div#div_time > input#day")[0]["value"]);
    var userHour = Number($("#div_new > div > div#div_time > input#hour")[0]["value"]);
    var userMinute = Number($("#div_new > div > div#div_time > input#minute")[0]["value"]);
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

    var s = {
        id: 0,
        type: "meeting",
        add_time: new Date().getTime(),
        summary: "",
        content: "",
        sched_time: new Date().getTime(),  // Using the same time tomorrow as the schedule time
        sched_loc: '',
		sched_remindtime:1000*60*15,//remind the user 15min before the deadline
    };
    
    // Get the Unique sched_index; Note that the method 
    var sched_index = Number(getItem('sched_index'));
    s.id = sched_index;
    setItem('sched_index', ++sched_index);

    console.log('Storing schedule...');
    // Not ending with semicolon is not an error in Javascript :)
    s.sched_time = new Date();
    s.sched_time.setFullYear(userYear);
    s.sched_time.setMonth(userMonth);
    s.sched_time.setDate(userDate);
    s.sched_time.setHours(userHour, userMinute, userSecond);

    s.sched_loc = $("#div_new > div > div#div_loc > input#address").val();
    s.content = $("#div_new > div > div#div_content > #content")[0]["value"];
    s.summary = s.content;
    s.type = $("#div_new > div > #div_type > input:radio[checked=checked]").attr('value');

    var timebefore = $("#div_new > div > div#div_remind > #remindTime")[0]["value"];
    var timestyle = $("#div_new > div > div#div_remind > #remindUnit").val();

    s.timebefore = timebefore;
    s.timestyle = timestyle;

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
    var storekey = 'sched'+s.id;
    setItem(storekey, JSON.stringify(s));
}