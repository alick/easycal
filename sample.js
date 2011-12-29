// Copyright (c) 2011 wangheda All rights reserved
// Use of this source code is governed by GPL license

if (typeof SCHEDULE_TYPE == "undefined") {
    var SCHEDULE_TYPE = {
        DEFAULT: 0,
        MEETING: 1,
    };
}

// A generic onclick callback function.
function genericOnClick(info, tab) {
    var my_selection = info.selectionText;
    var my_text = "";//content of calendar
    var my_dates = "";//date YYMMDDThhmmssZ/YYMMDDThhmmssZ
    var my_details = "";//detail of calendar
    var my_location = "";//location of calendar
    var my_trp = "false";
    var my_siteurl = "wangheda.info";
    var my_sitename = "HedaWang";

    var this_time = new Date();
    var timestamp = this_time.getTime();
    var sched_index = getItem('sched_index');
    console.log('sched_index: "'+sched_index+'"');
    if (sched_index == null) {
        sched_index = '0';
    }
    var storekey = "sched" + sched_index;
    var schedule = {
        id: sched_index,
        type: SCHEDULE_TYPE.DEFAULT,
        add_time: timestamp,
        summary: my_selection,
        content: my_selection,
        sched_time: timestamp + 1000 * 60 * 60 * 24,  // Using the same time tomorrow as the schedule time
        sched_loc: '',
		sched_remindtime:1000*60*15,//remind the user 15min before the deadline
    };
    
    // ================= time extraction =======================
    var patt1 = /(\d+)年(\d+)月(\d+)日*/;
    var patt2 = /(\d\d\d\d)-(\d+)-(\d+)/;
    var patt3 = /(\d+)月(\d+)日*/;
    var patt4 = /(\d+)-(\d+)/;
    var patt5 = /(\d+)日/;
    var patt6 = /([今明])[天晚]/;
    
    var patt_t = /(\d+)[:：](\d+)/;
    var patt_t_1 = /([上中下]午|晚上*)(\d+)[时点](\d+)[分]*/;
    var patt_t_2 = /(\d+)[时点](\d+)[分]*/
    var patt_t_3 = /([上中下]午|晚上*)(\d+)[时点]/;
    var patt_t_4 = /(\d+)[时点]/
    var patt_t_5 = /([上中下]午|晚上*)/;
    
    var results1 = patt1.exec(my_selection);
    var results2 = patt2.exec(my_selection);
    var results3 = patt3.exec(my_selection);
    var results4 = patt4.exec(my_selection);
    var results5 = patt5.exec(my_selection);
    var results6 = patt6.exec(my_selection);
    
    var results_t = patt_t.exec(my_selection);
    var results_t_1 = patt_t_1.exec(my_selection);
    var results_t_2 = patt_t_2.exec(my_selection);
    var results_t_3 = patt_t_3.exec(my_selection);
    var results_t_4 = patt_t_4.exec(my_selection);
    var results_t_5 = patt_t_5.exec(my_selection);
    
    var now_time = new Date();
    
    // day
    if (results1) {
        now_time.setFullYear(Number(results1[1]), Number(results1[2])-1, Number(results1[3]));
        now_time.setHours(0, 0, 0, 0);
    }
    else if (results2) {
        now_time.setFullYear(Number(results2[1]), Number(results2[2])-1, Number(results2[3]));
        now_time.setHours(0, 0, 0, 0);
    }
    else if (results3) {
        now_time.setMonth(Number(results3[1])-1, Number(results3[2]));
        now_time.setHours(0, 0, 0, 0);
    }
    else if (results4) {
        now_time.setMonth(Number(results4[1])-1, Number(results4[2]));
        now_time.setHours(0, 0, 0, 0);
    }
    else if (results5) {
        now_time.setDate(Number(results5[1]));
        now_time.setHours(0, 0, 0, 0);
    }
    else if (results6) {
        now_time.setHours(0, 0, 0, 0);
        if (results6[1] == "明") {
            now_time.setTime(now_time.getTime()+1000*60*60*24);
        }
    }

    // time
    if (results_t) {
        now_time.setHours(Number(results_t[1]), Number(results_t[2]), 0, 0);
    }
    else if (results_t_1) {
        if (results_t_1[1] == "中午" && Number(results_t_1[2])<=2 
           || results_t_1[1] == "下午" && Number(results_t_1[2])<=11 
           || results_t_1[1] == "晚上" && Number(results_t_1[2])<=11 && Number(results_t_1[2])>4
           || results_t_1[1] == "晚" && Number(results_t_1[2])<=11 && Number(results_t_1[2])>4) {
            now_time.setHours(Number(results_t_1[2])+12, Number(results_t_1[3]), 0, 0);
        }
        else {
            now_time.setHours(Number(results_t_1[2]), Number(results_t_1[3]), 0, 0);
        }
    }
    else if (results_t_2) {
        now_time.setHours(Number(results_t_2[1]), Number(results_t_2[2]), 0, 0);
    }
    else if (results_t_3) {
        if (results_t_3[1] == "中午" && Number(results_t_3[2])<=2 
           || results_t_3[1] == "下午" && Number(results_t_3[2])<=11 
           || results_t_3[1] == "晚上" && Number(results_t_3[2])<=11 && Number(results_t_3[2])>4
           || results_t_3[1] == "晚" && Number(results_t_3[2])<=11 && Number(results_t_3[2])>4) {
            now_time.setHours(Number(results_t_3[2])+12, 0, 0, 0);
        }
        else {
            now_time.setHours(Number(results_t_3[2]), 0, 0, 0);
        }
    }
    else if (results_t_4) {
        now_time.setHours(Number(results_t_4[1]), 0, 0, 0);
    }
    else if (results_t_5) {
        if (results_t_5[1] == "上午") {
            now_time.setHours(8, 0, 0, 0);
        }
        else if (results_t_5[1] == "中午") {
            now_time.setHours(12, 0, 0, 0);
        }
        else if (results_t_5[1] == "下午") {
            now_time.setHours(14, 0, 0, 0);
        }
        else if (results_t_5[1] == "晚" || results_t_5[1] == "晚上") {
            now_time.setHours(19, 0, 0, 0);
        }
    }
    console.log('time detected: '+now_time.toLocaleString());
    schedule.sched_time = now_time;
    
    // =========================================================
    
    // ================= location extraction =======================
    var patt_loc = /地点[:：](\S+)/;
    var results_loc = patt_loc.exec(my_selection);
    
    if (results_loc) {
        schedule.sched_loc = results_loc[1];
        console.log('location detected: '+schedule.sched_loc);
    }
    
    // =========================================================


    //chrome.tabs.create({"url":"http://www.google.com/calendar/event?action=TEMPLATE&text="+my_selection});
    chrome.tabs.create({"url":"editcal.html"});
    chrome.tabs.getSelected(null, function(tab) {
        var request = {
            newsched: true,
            schedule_str: JSON.stringify(schedule),
        };
        chrome.tabs.sendRequest(tab.id, request,
            function(response) {
            console.log(response.farewell);
        });
    });

    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));

}

var title = chrome.i18n.getMessage("extMenuTitle");
var id = chrome.contextMenus.create({"title": title, "contexts":["selection"],
                                       "onclick": genericOnClick});
//console.log("'" + context + "' item:" + id);


