// Copyright (c) 2011 wangheda All rights reserved
// Use of this source code is governed by GPL license

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
    
    // Get uniqe key
    var sched_index = getItem('sched_index');
    setItem('sched_index', sched_index+1);
    
    console.log('sched_index: "'+sched_index+'"');
    if (sched_index == null) {
        sched_index = '0';
    }
    var storekey = "sched" + sched_index;
    var schedule = {
        id: sched_index,
        type: "default",
        add_time: timestamp,
        summary: my_selection,
        content: my_selection,
        sched_time: timestamp + 1000 * 60 * 60 * 24,  // Using the same time tomorrow as the schedule time
        sched_loc: '',
		sched_remindtime:1000*60*15,//remind the user 15min before the deadline
    };
    
    
    schedule.sched_time = timeExtraction(my_selection)
    schedule.sched_loc = locExtraction(my_selection)
    
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


