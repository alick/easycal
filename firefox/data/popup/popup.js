var CONSTANT_CONTENT_LENGTH = 20;
// Maximum user defined repeating(loop) duration (in days)
// Setting to a higher value might cause api changes
// because loop == 30 actually means repeating monthly.
// Also I doubt whether setting to a higher value makes sense
// in practice.
var LOOP_VAL_MAX = 29;

var ERROR_TIME_SETTING = -1;
var ERROR_LOOP_VAL = -2;

// Indicator of whether we are editing/adding the schedule.
// If editing_mode is true, we should keep the data from
// being lost accidentally.
var editing_mode = false;

g_globalObject = new JsDatePick({
    useMode:1,
    isStripped:true,
    target:"calendar",
});

// The form inner HTML used when editing and adding schedules.
var form_div_html =
"<div class='sch_div' id='div_time' style='padding:0.1em 0.1em 0.1em 0.2em;'>" +
// Time
"<img src='label/time.png' style='height:1.2em;padding:0em 0.5em 0em 2em;' title=''>" +
"<input type='text' maxlength='4' style='width:3em;height:1em;text-align:center;' id='year' value=''> - " +
"<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='month' value=''> - " +
"<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='day' value=''> " +
"<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='hour' value=''> : " +
"<input type='text' maxlength='2' style='width:1.5em;height:1em;text-align:center;' id='minute' value=''> " +
"</div>" +
// To loop or not
"<div class='sch_div' id='div_loop' style='padding:0.1em 0.1em 0.1em 0.2em;'>" +
"<img src='label/loop.png' style='height:1.2em;padding:0em 0.5em 0em 2em;' title='"+_("extEditLabelLoop")+"'>" +
"<select id='easycal_loop' name='easycal_loop'>" +
"<option value='0' selected='selected'>"+_("extEditLabelNoLoop")+"</option>" +
"<option value='1'>"+_("extEditLabelEveryDay")+"</option>" +
"<option value='2'>"+_("extEditLabelEvery2Day")+"</option>" +
"<option value='7'>"+_("extEditLabelEveryWeek")+"</option>" +
"<option value='30'>"+_("extEditLabelEveryMonth")+"</option>" +
"<option value='365'>"+_("extEditLabelEveryYear")+"</option>" +
"<option value='-1'>"+_("Other")+"</option>" +
"</select>" +
"</div>" +
// Schedule content
"<div class='sch_div' id='div_content' style='padding:0.1em 0.1em 0.1em 0.2em;'>" +
"<img src='label/sched.png' style='height:1.2em;padding:0em 0.5em 0em 2em;' title='"+_("extEditLabelContent")+"'>" +
"<textarea cols='28' rows='2' style='width:14em;height:2em;vertical-align: top;' id='content' name='content'></textarea>" +
"</div>" +
// Whether to remind
"<div class='sch_div' id='div_remind' style='padding:0.1em 0.1em 0em 0.2em;'>" +
"<img src='label/remind.png' style='height:1.2em;padding:0em 0.5em 0.1em 2em;' title='"+_("extEditLabelRemind")+"'>" +
_("extEditLabelBefore") +
"<input type='text' style= 'overflow-x:visible;width:3em;height:1em;' id='remindTime'>" +
"<select id='remindUnit' name='remindUnit'>" +
"<option value='day'>"+_("extEditLabelRemindDay")+"</option>" +
"<option value='hour'>"+_("extEditLabelRemindHour")+"</option>" +
"<option value='minute' selected='selected'>"+_("extEditLabelRemindMinute")+"</option>" +
"</select>" +
"</div>" +
// Save and Cancel Button
"<div class='sch_div' id='div_action' style='padding:0.1em 0.1em 0em 0.2em;'>" +
"<input type='button' class='action_save' value='Save' /> " +
"<input type='button' class='action_cancel' value='Cancel' />" +
"</div>";

self.port.on('show_popup', function(){
    editing_mode = false;
    self.port.emit('getSchedulesList');

    // Display schedules of today.
    var today = new Date();
    var today_obj = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
    };
    $('#schedhead_today').text(today_obj.year + "-" + today_obj.month + "-" + today_obj.day);
    // TODO
    // obj is a global variable.
    // Give obj a more proper name.
    self.port.emit('getSchedulesByTime', today_obj);
    obj = today_obj;

    g_globalObject.setOnSelectedDelegate(function(){
        if (editing_mode === true) {
            // We are in editing_mode, warn here to keep editing.
            warnEditing($('div.form_div'));
            return;
        }
        // Make obj global.
        obj = g_globalObject.getSelectedDay();
        $('#schedhead_today').text(obj.year + "-" + obj.month + "-" + obj.day);
        self.port.emit('getSchedulesByTime', obj);
    });
});

self.port.on('sendSchedulesByTime', function (TodayScheduleList) {
    var sched_table = "";

    for (var i = 0; i < TodayScheduleList.length; ++i) {
        var s = TodayScheduleList[i];
        var time = new Date(s.sched_time);
        
        // Write schedule table.
        sched_table += "<div id='div_"+'sched'+s.id+"' class='div_sched_inner'><div><table class='sched_item_table' style='vertical-align:middle;'>"
        var sched_html = "";
        sched_html += '<tr id="sched' + s.id + '">';
        
        sched_html += '<td><img src="Edit-New.png" alt="Edit" title="Change" height="20px" width="20px" class="popup-menu-item" editing="0"></td>';
        
        sched_html += '<td class="time">';
        if (Number(time.getMinutes()) < 10) {
            sched_html += time.getHours() + ":0" + time.getMinutes() + "</td>";
        } else {
            sched_html += time.getHours() + ":" + time.getMinutes() + "</td>";
        }
        
        sched_html += '<td class="td_label"  style="">';
        // put label for repeat schedule
        var loop = parseInt(s.loop);
        if (loop > 0) {
            sched_html += '<img src="label/repeat.png" alt="None" title="';
            if (loop == 1) {
                sched_html += 'Repeat every day';
            } else if (loop == 2) {
                sched_html += 'Repeat every 2 days';
            } else if (loop == 7) {
                sched_html += "Repeat every week";
            } else if (loop == 30) {
                sched_html += "Repeat every month";
            } else if (loop == 365) {
                sched_html += "Repeat every year";
            } else {
                sched_html += "Repeat every " + loop + " days";
            }
            sched_html += '" height="20px" width="20px" class="easycal_label" style="">';
        }
        sched_html += '</td>';

        // NOTE: escape HTML tags/quotes! It is about security.(injection)
        // Some credits goes to
        // http://bigdingus.com/2007/12/29/html-escaping-in-javascript/
        var disp_str = s.content.replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;")
                                .replace(/&/g, "&amp;")
                                .replace(/"/g, "&#34;")
                                .replace(/'/g, "&#39;");
        sched_html += '<td class="content" style="vertical-align:middle;">';
        sched_html += '<a href="#" title="' + disp_str + '">';
        if (disp_str.length > CONSTANT_CONTENT_LENGTH) {
            disp_str = disp_str.substr(0, CONSTANT_CONTENT_LENGTH-1) + '...';
        }
        sched_html += disp_str + "</a></td>";
        
        sched_html += '<td><img src="Delete-New.png" alt="Remove" title="Delete" height="20px" width="20px" class="popup-menu-item"></td></tr>';
        sched_table += sched_html;
        sched_table += "</table></div>";

        // This is to add an invisible editing div
        var editing_div = "<div id='sched"+s.id+"_edit' style='display:none;font-size:0.6em;padding:0em 0em 0.5em 0em;'>";
        editing_div +=
            "<div style='display:none;text-align:center;font-size:0.8em;font-weight:bold;padding:0.5em 0.5em 0.5em 0.5em;background-color:gray;'>"+_("extPopupTitleChangeSch")+"</div>";
        editing_div += '<div class="form_div"></div>';

        editing_div += "</div>";
        sched_table += editing_div;

        sched_table += "</div>";
    }
    
    // Add tips if there is no schedule
    if (sched_table == "") {
        sched_table = "<div id='div_tips' style='text-align:center;font-size:0.8em;padding:1em 1em 1em 1em;'>"+_("extPopupTitleNoSch")+"</div>";
    }

    // Add '+' sign
    sched_table +=
                   "<div id='div_add' style='text-align:center;padding:1px 0 1px 0;' class='div_sched_inner'>" +
                   "<table class='sched_item_table'><tr>"+
                   "<td><img class='popup-menu-item' title='"+_("extPopupTitleNewSch")+"' alt='New' src='popup_add.png' height='20px' width='20px'></td>"+
                   "<td class='adding'><a href='#'>"+_("extPopupTitleNewSch")+"</a></td>"+
                   "<td><img src='Empty.png' height='20px' width='20px'></td>"+
                   "</tr></table>"+
                   "</div>";

    var adding_div =
        "<div id='div_new' style='display:none;font-size:0.6em;' class='div_sched_inner'>" +

        "<div id='div_submit' style='text-align:center;font-size:16px;padding:1px 0 1px 0;'>" +
        "<table class='sched_item_table'><tr>"+
        "<td><img class='popup-menu-item' title='"+_("extPopupTitleSave")+"' alt='New_Save' src='popup_add.png' height='20px' width='20px'></td>"+
        "<td class='adding'><a href='#'>"+_("extPopupTitleNewSch")+"</a></td>"+
        "<td><img class='popup-menu-item' title='"+_("extPopupTitleCancel")+"' alt='New_Cancel' src='Delete-New.png' height='20px' width='20px'></td>"+
        "</tr></table>"+
        "</div>" +
        '<div class="form_div"></div>' +

        "</div>";
    sched_table += adding_div;

    $('#sched').html(sched_table);
    $('#sched .div_sched_inner tr:odd').addClass('tr-odd');
    $('#sched .div_sched_inner tr:even').addClass('tr-even');

    var imgEdit = "Edit-New.png";
    var imgEdit_mouseover = "Edit-New-mouseover.png";

    $('td.content a').cluetip({splitTitle: "\n", showTitle: false});
    $(".popup-menu-item").unbind();
    $(".popup-menu-item").click(function(){
        var action = $(this).attr("alt");
        var sched_id = $(this).parent().parent().attr("id");
        if (action == "Remove") {
            if (editing_mode === true) {
                warnEditing($('div.form_div'));
                return;
            }
            self.port.emit('removeSchedule', sched_id);
            // FIXME
            // Refresh schedule list transmits too much data
            self.port.emit('getSchedulesList');
            // refresh sched
            //getSchedulesByTime(storage, obj);
            // Just remove the div
            $('#div_' + sched_id).remove();
        } else if (action == "Edit") {
            self.port.emit('getScheduleById', sched_id);
        } else if (action == "New") {
            if (editing_mode === true) {
                warnEditing($('div.form_div'));
                return;
            }
            // Show Adding, Hide tip and adding button
            $("#div_new").css("display", "block");
            $("#div_new div.form_div").html(form_div_html);
            $("#div_tips").css("display", "none");
            $("#div_add").css("display", "none");

            var time = new Date(obj.year, obj.month-1, obj.day, 17, 0);
            $("#div_new div.form_div #div_time > input#year")[0]["value"] = time.getFullYear().toString();
            $("#div_new div.form_div #div_time > input#month")[0]["value"] = (time.getMonth()+1).toString();
            $("#div_new div.form_div #div_time > input#day")[0]["value"] = time.getDate().toString();
            $("#div_new div.form_div #div_time > input#hour")[0]["value"] = time.getHours().toString();
            strMin = time.getMinutes().toString();
            if (strMin.length == 1) strMin = '0'+strMin;
            $("#div_new div.form_div #div_time > input#minute")[0]["value"] = strMin;
            $("#div_new div.form_div #div_content > #content")[0]["value"] = '';
            $("#div_new div.form_div #div_remind > #remindTime")[0]["value"] = 15;
            $("#div_new div.form_div #div_remind > #remindUnit").val("minute");
            $("#div_new div.form_div #div_loop > #easycal_loop").val(0);

            allowOtherLoopVal();
            editing_mode = true;

            $('input.action_save').unbind();
            $('input.action_save').click(function(){
                self.port.emit('getNewScheduleId');
            });
            $('input.action_cancel').unbind();
            $('input.action_cancel').click(function(){
                // Hide Adding, Show tip and adding button
                $("#div_new").css("display", "none");
                $("#div_tips").css("display", "block");
                $("#div_add").css("display", "block");
                $("#div_new div.form_div").html('');
                editing_mode = false;
            });
        } else if (action == "New_Save") {
            self.port.emit('getNewScheduleId');
        } else if (action == "New_Cancel") {
            // Hide Adding, Show tip and adding button
            $("#div_new").css("display", "none");
            $("#div_tips").css("display", "block");
            $("#div_add").css("display", "block");
            $("#div_new div.form_div").html('');
            editing_mode = false;
        } else if (action == "help") {
            self.port.emit('open_help_page');
        } else {
            console.warn("Action not recognized:" + action);
        }
    });

    $("img.popup-menu-item").mouseover(function(){
        var action = $(this).attr("alt");
        if ($(this).attr("editing") == "0") {
            imgEdit_mouseover = "Edit-New-mouseover.png";
        } else {
            imgEdit_mouseover = "Edit-ing-New-mouseover.png";
        }

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
        } else if (action == "help") {
            $(this)[0].src="label/help_mouseover.png";
        } else {
            console.warn("Action not recognized:" + action);
        }
    });

    $("img.popup-menu-item").mouseout(function(){
        var action = $(this).attr("alt");
        if ($(this).attr("editing") == "0") {
            imgEdit = "Edit-New.png";
        } else {
            imgEdit = "Edit-ing-New.png";
        }

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
        } else if (action == "help") {
            $(this)[0].src="label/help.png";
        } else {
            console.warn("Action not recognized:" + action);
        }
    });
});

self.port.on('sendScheduleById', function(schedule_str) {
    // schedule_str !== null | undefined
    if (schedule_str === null || schedule_str === undefined) {
        return;
    }
    var s = JSON.parse(schedule_str);
    var time = new Date(s.sched_time);
    var sched_id = 'sched' + s.id;
    var img_selector = '#' + sched_id + ' img[alt="Edit"]';
    if ($("#" + sched_id + "_edit")[0].style.display == 'none') {
        if (editing_mode === true) {
            warnEditing($('div.form_div'));
            return;
        }
        // change icon
        $(img_selector).attr("src", "Edit-ing-New-mouseover.png");
        $(img_selector).attr('editing', '1');

        // Show
        $("#" + sched_id + "_edit").css("display", "block");
        $("#" + sched_id + "_edit div.form_div").html(form_div_html);

        // Value Set
        $("#" + sched_id + "_edit > div > div#div_time > input#year")[0]["value"] = time.getFullYear().toString();
        $("#" + sched_id + "_edit > div > div#div_time > input#month")[0]["value"] = (time.getMonth()+1).toString();
        $("#" + sched_id + "_edit > div > div#div_time > input#day")[0]["value"] = time.getDate().toString();
        $("#" + sched_id + "_edit > div > div#div_time > input#hour")[0]["value"] = time.getHours().toString();
        strMin = time.getMinutes().toString();
        if (strMin.length == 1) strMin = '0'+strMin;
        $("#" + sched_id + "_edit > div > div#div_time > input#minute")[0]["value"] = strMin;
        $("#" + sched_id + "_edit > div > div#div_content > #content")[0]["value"] = s.content;
        $("#" + sched_id + "_edit > div > div#div_remind > #remindTime")[0]["value"] = s.timebefore;
        $("#" + sched_id + "_edit > div > div#div_remind > #remindUnit").val(s.timestyle);
        var predefined_loop_val = new Array(0, 1, 2, 7, 30, 365);
        if (predefined_loop_val.indexOf(parseInt(s.loop)) != -1) {
            $("#" + sched_id + "_edit > div > div#div_loop > #easycal_loop").val(s.loop);
        } else {
            $("#" + sched_id + "_edit > div > div#div_loop > #easycal_loop").val(-1);
            var other_choice = '<span id="loop_other">Every ' +
                               '<input type="text" maxlength="2" value="' + s.loop +
                               '" /> Days</span>';
            $('div#div_loop').append(other_choice);
        }

        allowOtherLoopVal();
        editing_mode = true;

        $('input.action_save').unbind();
        $('input.action_save').click(function(){
            // == Edit_Save
            var ret = saveSchedule("#" + sched_id + "_edit", s);
            if (ret === true) {
                // change icon
                $(img_selector).attr('src', "Edit-New-mouseover.png");
                $(img_selector).attr('editing', '0');

                // Hide and save and refresh
                $("#" + sched_id + "_edit").css("display", "none");
                $("#" + sched_id + "_edit div.form_div").html('');
                editing_mode = false;

                // refresh schedule list
                self.port.emit('getSchedulesList');
                // refresh sched
                self.port.emit('getSchedulesByTime', obj);
            }
            else if (ret === ERROR_TIME_SETTING){
                warnEditing($("#"+sched_id+"_edit > div > div#div_time"));
            }
            else if (ret === ERROR_LOOP_VAL) {
                warnEditing($("#"+sched_id+"_edit > div > div#div_loop"));
            } else {
                // Should never be here.
                console.error('Unknown error in saveSchedule!');
            }
        });
        $('input.action_cancel').unbind();
        $('input.action_cancel').click(function(){
            // change icon
            $(img_selector).attr('src', "Edit-New-mouseover.png");
            $(img_selector).attr('editing', '0');

            // Hide
            $("#" + sched_id + "_edit").css("display", "none");
            $("#" + sched_id + "_edit div.form_div").html('');

            editing_mode = false;
        });
    }
});

self.port.on('sendNewScheduleId', function(sched_index) {
    var s = {}; // empty schedule object
    s.id = sched_index;
    // Save form
    var ret = saveSchedule("#div_new", s);
    if (ret === true) {
        editing_mode = false;
        // refresh schedule list
        self.port.emit('getSchedulesList');
        // refresh sched
        self.port.emit('getSchedulesByTime', obj);
    }
    // else: time is wrong, flash div_time
    else if (ret === ERROR_TIME_SETTING) {
        warnEditing($("#div_new > div > div#div_time"));
    }
    else if (ret === ERROR_LOOP_VAL) {
        warnEditing($("#div_new > div > div#div_loop"));
    } else {
        // Should never be here.
        console.error('Unknown error in saveSchedule!');
    }
});

// Save the schedule edited or added.
function saveSchedule(sched_div_id, s) {
    var userYear   = Number($(sched_div_id + " > div > div#div_time > input#year")[0]["value"]);
    var userMonth  = Number($(sched_div_id + " > div > div#div_time > input#month")[0]["value"]-1);
    var userDate   = Number($(sched_div_id + " > div > div#div_time > input#day")[0]["value"]);
    var userHour   = Number($(sched_div_id + " > div > div#div_time > input#hour")[0]["value"]);
    var userMinute = Number($(sched_div_id + " > div > div#div_time > input#minute")[0]["value"]);
    var userSecond = 0;

    s.sched_time = new Date(userYear, userMonth, userDate, userHour, userMinute, userSecond);
    // Checking time in the Javascript way.
    if (s.sched_time.getFullYear() != userYear ||
            s.sched_time.getMonth() != userMonth ||
            s.sched_time.getDate() != userDate ||
            s.sched_time.getHours() != userHour ||
            s.sched_time.getMinutes() != userMinute ||
            s.sched_time.getSeconds() != userSecond) {

        console.warn("Invalid time setting!");
        return ERROR_TIME_SETTING;
    }

    s.loop = parseInt($(sched_div_id + " > div > div#div_loop > #easycal_loop").val());
    if (s.loop === -1) {
        // Other user defined value
        var value = parseInt($(sched_div_id + " #loop_other input").val(), 10);
        if (value > 0 && value <= LOOP_VAL_MAX) {
            s.loop = value;
        } else {
            return ERROR_LOOP_VAL;
        }
    }

    s.content = $(sched_div_id + " > div > div#div_content > #content")[0]["value"];

    var timebefore = $(sched_div_id + " > div > div#div_remind > #remindTime")[0]["value"];
    var timestyle = $(sched_div_id + " > div > div#div_remind > #remindUnit").val();

    s.timebefore = timebefore;
    s.timestyle = timestyle;

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

    // Store into the storage.
    self.port.emit('saveSchedule', s);

    return true;
}

self.port.on('sendSchedulesList', function(has_schedule_map){
    // Set the global g_ScheduleList.
    g_ScheduleList = has_schedule_map;
    // refresh jsDatePick calendar
    g_globalObject.repopulateMainBox();
});

function allowOtherLoopVal() {
    $('select#easycal_loop').unbind();
    $('select#easycal_loop').change(function(){
        if ($(this).val() != -1) {
            $('div#div_loop #loop_other').remove();
        } else {
            var other_choice = '<span id="loop_other">Every ' +
                               '<input type="text" maxlength="2" /> Days</span>';
            $('div#div_loop').append(other_choice);
        }
    });
}

// @param selector: jQuery selector
function warnEditing(selector) {
    var origin_color = selector.css('background-color');
    for (var i=0; i<1200; i+= 400) {
        setTimeout(function(){selector.css('background-color', '#FFD0D0');}, i);
        setTimeout(function(){selector.css('background-color', origin_color);}, i+200);
    }
}
