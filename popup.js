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
    
    document.getElementById('schedhead').innerHTML = obj.year.toString() + "年" + obj.month.toString() + "月" + obj.day.toString() + "日";

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
            sched_table += "<div id='div_"+'sched'+s.id+"' class='div_sched_inner'><div><table class='sched_item_table'>"
            console.debug("time: " + time.toISOString());
            var sched_html = "";
            sched_html += '<tr id="sched' + s.id + '">';
            
            sched_html += '<td><img src="Edit-New.png" alt="Edit" title="修改" height="20px" width="20px" class="popup-menu-item"></td>';
            
            sched_html += '<td class="time">';
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
            sched_html += "&nbsp;" + disp_str + "</a></td>";
            //sched_html += s.summary + "</td>";
            
            sched_html += '<td><img src="Delete-New.png" alt="Remove" title="删除" height="20px" width="20px" class="popup-menu-item"></td></tr>';
            sched_table += sched_html;
            sched_table += "</table></div>";
            // This is to add a invisible editing div
            var editing_div = "<div id='sched"+s.id+"_edit' style='display:none;font-size:0.6em;padding:0em 0em 0.5em 0em;'>";
            editing_div += 
                "<div style='display:none;text-align:center;font-size:0.8em;font-weight:bold;padding:0.5em 0.5em 0.5em 0.5em;background-color:gray;'>修改日程</div>" +
                "<div style='padding:0em 0 0 0em;'>" + 
                "<div class='sch_div' id='div_time' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
                //"时间: " + 
                "<img src='label/time.png' style='height:1.2em;padding:0em 0.5em 0em 2em;'>" + 
                "<input type='text' maxlength='4' style='width:3em;height:1em;text-align:center;' id='year' value='"+time.getFullYear()+"'>年" + 
                "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='month' value='"+time.getMonth()+"'>月" + 
                "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='day' value='"+time.getDate()+"'>日 " + 
                "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='hour' value='"+time.getHours()+"'>时" + 
                "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='minute' value='"+time.getMinutes()+"'>分" + 
                "</div>" + 
                
                "<div class='sch_div' id='div_content' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
                //"日程: " + 
                "<img src='label/sched.png' style='height:1.2em;padding:0em 0.5em 0em 2em;'>" + 
                "<textarea cols='28' rows='2' style='width:14em;height:2em;vertical-align: top;' id='content' name='content'></textarea>" + 
                "</div>" + 

                "<div class='sch_div' id='div_loc' style='display:none;padding:0.1em 0.1em 0.1em 0.2em;'>" + 
                "地点: " + 
                "<input type='text' style='width:14em;height:1em;' id='address'>" + 
                "</div>" + 
                
                
                
                "<div class='sch_div' id='div_type' style='display:none;padding:0.1em 0.1em 0.1em 0.2em;'>" + 
                "类型: " + 
                "<input type='radio' name='type' id='meeting' value='meeting' checked='checked'/> 会议" + 
                "<input type='radio' name='type' id='memorial' value='memorial'/> 纪念日" + 
                "<input type='radio' name='type' id='deadline' value='deadline'/> 截止日期" + 
                "</div>" + 
                
                "<div class='sch_div' id='div_remind' style='padding:0.1em 0.1em 0em 0.2em;'>" + 
                //"提醒: " + 
                "<img src='label/remind.png' style='height:1.2em;padding:0em 0.5em 0.1em 2em;'>" + 
                "提前 " + 
                "<input type='text' style= 'overflow-x:visible;width:3em;height:1em;' id='remindTime'>" + 
                "<select id='remindUnit' name='remindUnit'>" + 
                "<option value='day'>天</option>" + 
                "<option value='hour'>小时</option>" + 
                "<option value='minute' selected='selected'>分</option>" + 
                "</select>" + 
                "</div>" + 
                
                "<div id='div_submit' style='display:none;text-align:center;background-color:#C0C0C0;padding:0.5em 0.5em 0.5em 0.5em;'>" + 
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
        sched_table = "<div id='div_tips' style='text-align:center;font-size:0.8em;padding:1em 1em 1em 1em;'>这一天没有日程</div>";
    }
    
    // Add '+' sign
    sched_table += 
                   "<div id='div_add' style='text-align:center;padding:0.2em 0em 0.1em 0em;'>" +
                   "<table class='sched_item_table'><tr>"+
                   "<td><img class='popup-menu-item' title='新建日程' alt='New' src='popup_add.png' height='20px' width='20px'></td>"+
                   "<td class='adding'><a href='#'>新建日程</a></td>"+
                   "<td><img src='Empty.png' height='20px' width='20px'></td>"+
                   "</tr></table>"+
                   "</div>";
    
    var time = new Date(obj.year, obj.month-1, obj.day, 7, 0);
    var adding_div = 
        "<div id='div_new' style='display:none;font-size:0.6em;'>" +
        
        "<div id='div_submit' style='text-align:center;font-size:16px;padding:0.2em 0em 0.1em 0em;'>" +
        "<table class='sched_item_table'><tr>"+
        "<td><img class='popup-menu-item' title='保存' alt='New_Save' src='popup_add.png' height='20px' width='20px'></td>"+
        "<td class='adding'><a href='#'>新建日程</a></td>"+
        "<td><img class='popup-menu-item' title='取消' alt='New_Cancel' src='Delete-New.png' height='20px' width='20px'></td>"+
        "</tr></table>"+
        "</div>" +
        
        "<div style='padding:0em 0 0 0em;'>" + 
        "<div class='sch_div' id='div_time' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
        //"时间: " + 
        "<img src='label/time.png' style='height:1.2em;padding:0em 0.5em 0em 2em;'>" + 
        "<input type='text' maxlength='4' style='width:3em;height:1em;text-align:center;' id='year' value='"+time.getFullYear().toString()+"'>年" + 
        "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='month' value='"+(time.getMonth()+1).toString()+"'>月" + 
        "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='day' value='"+time.getDate().toString()+"'>日 " + 
        "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='hour' value='"+(time.getHours()+1).toString()+"'>时" + 
        "<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='minute' value='00'>分" + 
        "</div>" + 
        
        "<div class='sch_div' id='div_content' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
        //"日程: " + 
        "<img src='label/sched.png' style='height:1.2em;padding:0em 0.5em 0em 2em;'>" + 
        "<textarea cols='28' rows='2' style='width:14em;height:2em;vertical-align: top;' id='content' name='content'></textarea>" + 
        "</div>" + 

        "<div class='sch_div' id='div_loc' style='display:none;padding:0.1em 0.1em 0.1em 0.2em;'>" + 
        "地点: " + 
        "<input type='text' style='width:14em;height:1em;' id='address'>" + 
        "</div>" + 
        
        
        
        "<div class='sch_div' id='div_type' style='display:none;padding:0.1em 0.1em 0.1em 0.2em;'>" + 
        "类型: " + 
        "<input type='radio' name='type' id='meeting' value='meeting' checked='checked'/> 会议" + 
        "<input type='radio' name='type' id='memorial' value='memorial'/> 纪念日" + 
        "<input type='radio' name='type' id='deadline' value='deadline'/> 截止日期" + 
        "</div>" + 
        
        "<div class='sch_div' id='div_remind' style='padding:0.1em 0.1em 0.1em 0.2em;'>" + 
        //"提醒: " + 
        "<img src='label/remind.png' style='height:1.2em;padding:0em 0.5em 0.1em 2em;'>" + 
        "提前 " + 
        "<input type='text' style= 'overflow-x:visible;width:3em;height:1em;' id='remindTime' value='15'>" + 
        "<select id='remindUnit' name='remindUnit'>" + 
        "<option value='day'>天</option>" + 
        "<option value='hour'>小时</option>" + 
        "<option value='minute' selected='selected'>分</option>" + 
        "</select>" + 
        "</div>" + 
        
        "<div id='div_submit_des' style='display:none;text-align:right;background-color:#E8EAF0;padding:0.2em 0.5em 0.2em 0.5em;'>" + 
        "<input type='submit' class='popup-menu-item' alt='New_Save' id='submit_des' value='保存' style='padding:0.2em 1em 0.2em 1em;margin:0.5em 0.5em 0.5em 0.5em;'/> " + 
        "<input type='submit' class='popup-menu-item' alt='New_Cancel' id='cancel_des' value='取消' style='padding:0.2em 1em 0.2em 1em;margin:0.5em 0.5em 0.5em 0.5em;' />" + 
        "</div>" + 
        "</div>" + 
        "</div>";
    sched_table += adding_div;
    
    document.getElementById('sched').innerHTML = sched_table;
    $('#sched').css("display", "block");
    $('#schedhead').css('display', 'block');
    $('tr:odd').css('background-color', '#ECF1F9');//odd num color
    $('tr:even').css('background-color', '#E2EAF5');//even num color
    
    $('.sched_item_table').css('-webkit-border-horizontal-spacing', '0');
    $('.sch_div > input').css('border', '#ECF1F9 solid 1px');
    $('.sch_div > textarea').css('border', '#ECF1F9 solid 1px');
    $('.sch_div > select').css('border', '#ECF1F9 solid 1px');
    $('#div_submit').css('font-size', '16px');

    var imgEdit = "Edit-New.png";
    var imgEdit_mouseover = "Edit-New-mouseover.png";
    
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
                    // change icon
                    imgEdit = "Edit-ing-New.png";
                    imgEdit_mouseover = "Edit-ing-New-mouseover.png";
                    $(this)[0].src = imgEdit_mouseover;
                    
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
                    // change icon
                    imgEdit = "Edit-New.png";
                    imgEdit_mouseover = "Edit-New-mouseover.png";
                    $(this)[0].src = imgEdit_mouseover;
                    
                    // == Edit_Save but the relative position of DOM tree is different
                    if (popup_save(sched_id, s) == true) {
                        // Hide and save and refresh
                        $("#" + sched_id + "_edit").css("display", "none");
                        // refresh schedule list
                        g_ScheduleList = getSchedulesList();
                        // refresh jsDatePick
                        g_globalObject.repopulateMainBox();
                        // refresh sched
                        getSchedulesByTime(obj);
                    }
                    // else: time is wrong, flash div_time
                    else { 
                        var origin_color = $("#"+$(this).parent().parent().attr('id')+" > div > div#div_time")[0].style.background;
                        parentId = $(this).parent().parent().attr('id');
                        for (var i=0; i<1200; i+= 400) {
                            setTimeout(function(){$("#"+parentId+" > div > div#div_time")[0].style.background='#FF0000';}, i);
                            setTimeout(function(){$("#"+parentId+" > div > div#div_time")[0].style.background=origin_color;}, i+200);
                        }
                    }
                            
                }
            }
        } else if (action == "Edit_Save") {
            sched_id = /(sched\d+)_edit/.exec($(this).parent().parent().parent().attr('id'))[1];
            
            var schedule_str = getItem(sched_id);
            if (schedule_str != null) {
                var s = JSON.parse(schedule_str);
                var time = new Date(s.sched_time);

                if (popup_save(sched_id, s) == true) {
                    // Hide and save and refresh
                    $("#" + sched_id + "_edit").css("display", "none");
                    // refresh schedule list
                    g_ScheduleList = getSchedulesList();
                    // refresh jsDatePick
                    g_globalObject.repopulateMainBox();
                    // refresh sched
                    getSchedulesByTime(obj);
                }
                // else: time is wrong, flash div_time
                else { 
                    var origin_color = $("#"+$(this).parent().parent().parent().attr('id')+" > div > div#div_time")[0].style.background;
                    parentId = $(this).parent().parent().parent().attr('id');
                    for (var i=0; i<1200; i+= 400) {
                        setTimeout(function(){$("#"+parentId+" > div > div#div_time")[0].style.background='#FF0000';}, i);
                        setTimeout(function(){$("#"+parentId+" > div > div#div_time")[0].style.background=origin_color;}, i+200);
                    }
                }
            }
        } else if (action == "Edit_Cancel") {
            sched_id = /(sched\d+)_edit/.exec($(this).parent().parent().parent().attr('id'))[1];
            // Hide
            $("#" + sched_id + "_edit .warning").remove();
            $("#" + sched_id + "_edit").css("display", "none");
        } else if (action == "New") {
            // Show Adding, Hide tip and adding button
            $("#div_new").css("display", "block");
            $("#div_tips").css("display", "none");
            $("#div_add").css("display", "none");
                        
        } else if (action == "New_Save") {
            // Save form to new schedule, refresh g_ScheduleList, jsDatePick and sched list
            // Save form
            if (popup_new() == true) {
                // refresh schedule list
                g_ScheduleList = getSchedulesList();
                // refresh jsDatePick
                g_globalObject.repopulateMainBox();
                // refresh sched
                getSchedulesByTime(obj);
            }
            // else: time is wrong, flash div_time
            else { 
                var origin_color = $("#"+$(this).parent().parent().parent().attr('id')+" > div > div#div_time")[0].style.background;
                parentId = $(this).parent().parent().parent().attr('id');
                for (var i=0; i<1200; i+= 400) {
                    setTimeout(function(){$("#"+parentId+" > div > div#div_time")[0].style.background='#FF0000';}, i);
                    setTimeout(function(){$("#"+parentId+" > div > div#div_time")[0].style.background=origin_color;}, i+200);
                }
            }
            
        } else if (action == "New_Cancel") {
            // Hide Adding, Show tip and adding button
            $("#div_new").css("display", "none");
            $("#div_tips").css("display", "block");
            $("#div_add").css("display", "block");
            $('#div_new .warning').remove();
            
        } else {
            console.warn("Not supported yet!"+action);
        }
    });

    $("img.popup-menu-item").mouseover(function(){
        var action = $(this).attr("alt");
        if (action == "Remove") {
            $(this)[0].src="Delete-New-mouseover.png";
        } else if (action == "Edit") {
            $(this)[0].src=imgEdit_mouseover;
        } else if (action == "New") {
            $(this)[0].src="popup_add_mouseover.png";
        } else if (action == "New_Save") {
            $(this)[0].src="popup_add_mouseover.png";
        } else if (action == "New_Cancel") {
            $(this)[0].src="Delete-New-mouseover.png";
        } else {
            console.log('Not supported');
        }
    });
    
    $("img.popup-menu-item").mouseout(function(){
        var action = $(this).attr("alt");
        if (action == "Remove") {
            $(this)[0].src="Delete-New.png";
        } else if (action == "Edit") {
            $(this)[0].src=imgEdit;
        } else if (action == "New") {
            $(this)[0].src="popup_add.png";
        } else if (action == "New_Save") {
            $(this)[0].src="popup_add.png";
        } else if (action == "New_Cancel") {
            $(this)[0].src="Delete-New.png";
        } else {
            console.log('Not supported');
        }
    });

}

function popup_save(sched_id, s) {
    var userYear = Number($("#" + sched_id + "_edit > div > div#div_time > input#year")[0]["value"]);
    var userMonth = Number($("#" + sched_id + "_edit > div > div#div_time > input#month")[0]["value"]-1);
    var userDate = Number($("#" + sched_id + "_edit > div > div#div_time > input#day")[0]["value"]);
    var userHour = Number($("#" + sched_id + "_edit > div > div#div_time > input#hour")[0]["value"]);
    var userMinute = Number($("#" + sched_id + "_edit > div > div#div_time > input#minute")[0]["value"]);
    var userSecond = 0;

    s.sched_time = new Date(userYear, userMonth, userDate, userHour, userMinute, userSecond);
    // Checking time in the Javascript way.
    if (s.sched_time.getFullYear() != userYear ||
            s.sched_time.getMonth() != userMonth ||
            s.sched_time.getDate() != userDate ||
            s.sched_time.getHours() != userHour ||
            s.sched_time.getMinutes() != userMinute ||
            s.sched_time.getSeconds() != userSecond) {

        var msg = chrome.i18n.getMessage("extWarnInvalidTimeSetting");
        console.warn(msg);

        // FIXME
        // #div_time is duplicate.
        //var div = $('#' + sched_id + '_edit #div_time');
        //if (div.html().indexOf(msg) == -1) {
        //    div.append('<span class="warning">' + msg + '</span>');
        //} else {
        //    div.find(".warning").append("!");
        //}
        
        // consider return where is wrong
        return false;
    }

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

    console.log('Storing schedule...');
    // store into local storage
    var storekey = "sched" + s.id;
    setItem(storekey, JSON.stringify(s));

    return true;
}


function popup_new() {
    // add all input values
    var userYear = Number($("#div_new > div > div#div_time > input#year")[0]["value"]);
    var userMonth = Number($("#div_new > div > div#div_time > input#month")[0]["value"]-1);
    var userDate = Number($("#div_new > div > div#div_time > input#day")[0]["value"]);
    var userHour = Number($("#div_new > div > div#div_time > input#hour")[0]["value"]);
    var userMinute = Number($("#div_new > div > div#div_time > input#minute")[0]["value"]);
    var userSecond = 0;

    var s = {
        id: 0,
        type: "meeting",
        add_time: new Date().getTime(),
        summary: "",
        content: "",
        sched_time: new Date().getTime(),  // Using the same time
        sched_loc: '',
        sched_remindtime:1000*60*15,//remind the user 15min before the deadline
    };
    
    // Get the Unique sched_index; Note that the method 
    var sched_index = Number(getItem('sched_index'));
    s.id = sched_index;
    setItem('sched_index', ++sched_index);

    s.sched_time = new Date(userYear, userMonth, userDate, userHour, userMinute, userSecond);
    // Checking time in the Javascript way.
    if (s.sched_time.getFullYear() != userYear ||
            s.sched_time.getMonth() != userMonth ||
            s.sched_time.getDate() != userDate ||
            s.sched_time.getHours() != userHour ||
            s.sched_time.getMinutes() != userMinute ||
            s.sched_time.getSeconds() != userSecond) {

        var msg = chrome.i18n.getMessage("extWarnInvalidTimeSetting");
        console.warn(msg);

        // FIXME
        // #div_time is duplicate.
        //var div = $('#div_new #div_time');
        //if (div.html().indexOf(msg) == -1) {
        //    div.append('<span class="warning">' + msg + '</span>');
        //} else {
        //    div.find(".warning").append("!");
        //}
        
        // consider return where is wrong
        return false;
    }

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

    console.log('Storing schedule...');
    // store into local storage
    var storekey = 'sched'+s.id;
    setItem(storekey, JSON.stringify(s));

    return true;
}

// DEBUGGING CODE
// Warning Duplicate IDs
// from: http://stackoverflow.com/questions/482763/jquery-to-check-for-duplicate-ids-in-a-dom
function checkDupId() {
    $('[id]').each(function(){
        var ids = $('[id="'+this.id+'"]');
        if(ids.length>1 && ids[0]==this)
        console.warn('Multiple IDs #'+this.id);
    });
}
