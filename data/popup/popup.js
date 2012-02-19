console.debug('Hello from popup.js');
var CONSTANT_CONTENT_LENGTH = 20;

g_globalObject = {};

self.port.on('show_popup', function(){
    //sl = getSchedulesList(storage);
    g_globalObject = new JsDatePick({
        useMode:1,
        isStripped:true,
        target:"calendar",
        //SchedulesList:sl,
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
    $('#schedhead_today').text(today_obj.year + "-" + today_obj.month + "-" + today_obj.day);
    self.port.emit('getSchedulesByTime', today_obj);

    g_globalObject.setOnSelectedDelegate(function(){
        var obj = g_globalObject.getSelectedDay();
        console.log("a date was just selected and the date is : " + obj.day + "/" + obj.month + "/" + obj.year);
        $('#schedhead_today').text(obj.year + "-" + obj.month + "-" + obj.day);
        self.port.emit('getSchedulesByTime', obj);
    });

    $('#schedhead_help').unbind();
    $('#schedhead_help').click(function(){
        self.port.emit('open_help_page');
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
            }
            sched_html += '" height="20px" width="20px" class="easycal_label" style="">';
        }
        sched_html += '</td>';

        sched_html += '<td class="content"  style="vertical-align:middle;">';
        sched_html += '<a href="#" title="' + s.content + '">';
        var disp_str = s.content;
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

    $('.content').cluetip();
    console.debug('Binding click function...');
    $(".popup-menu-item").unbind();
    $(".popup-menu-item").click(function(){
        var action = $(this).attr("alt");
        var sched_id = $(this).parent().parent().attr("id");
        if (action == "Remove") {
            console.log("To remove " + sched_id);
            self.port.emit('removeSchedule', sched_id);
            // TODO
            // refresh schedule list
            // g_ScheduleList = getSchedulesList();
            // refresh jsDatePick
            g_globalObject.repopulateMainBox();
            // refresh sched
            //getSchedulesByTime(storage, obj);
            // Just remove the div
            $('#div_' + sched_id).remove();
        } else {
            console.warn("Not supported yet!"+action);
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
            console.log('Not supported');
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
            console.log('Not supported');
        }
    });

    // Do one check.
    checkDupId();
});

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
