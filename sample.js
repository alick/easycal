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
        sched_time: timestamp + 1000 * 60 * 60 * 24,
    };

    //chrome.tabs.create({"url":"http://www.google.com/calendar/event?action=TEMPLATE&text="+my_selection});
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));

    // store into local storage
    setItem(storekey, JSON.stringify(schedule));
    var stored = getItem(storekey);
    log("stored item: " + storekey + "=>" + stored);
    var storedObj = JSON.parse(stored);
    log("schedule summary: " + storedObj.summary);

    setItem('sched_index', ++sched_index);
    //clearStrg();
    //stored = getItem('selection'); // should be null
    //log("stored item:" + stored);
}

var title = chrome.i18n.getMessage("extMenuTitle");
var id = chrome.contextMenus.create({"title": title, "contexts":["selection"],
                                       "onclick": genericOnClick});
//console.log("'" + context + "' item:" + id);


