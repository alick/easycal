// Copyright (c) 2011 wangheda All rights reserved
// Use of this source code is governed by GPL license

// set picture used in editcal
var imgLogo = chrome.extension.getURL("huaci.png");
var imgSave = chrome.extension.getURL("easycal_img/save.png");
var imgCancel = chrome.extension.getURL("easycal_img/cancel.png");
var imgSave_onmouseover = chrome.extension.getURL("easycal_img/save_mouseover.png");
var imgCancel_onmouseover = chrome.extension.getURL("easycal_img/cancel_mouseover.png");
var imgSaving1 = chrome.extension.getURL("easycal_img/saving_1.png");
var imgSaving2 = chrome.extension.getURL("easycal_img/saving_2.png");
var imgSaving3 = chrome.extension.getURL("easycal_img/saving_3.png");
var imgSavingOk = chrome.extension.getURL("easycal_img/saving_ok.png");

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
    console.log('sched_index: "'+sched_index+'"');
    if (sched_index == null) {
        setItem('sched_index', 0);
        sched_index = 0;
    }
    sched_index = Number(sched_index);
    setItem('sched_index', sched_index+1);
    
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
    
    chrome.tabs.insertCSS(null, {file: "editcal.css"});
    chrome.tabs.executeScript(null, {file: "jquery.js"});
    //chrome.tabs.executeScript(null, {file: "storage.js"});
    chrome.tabs.executeScript(null, {file: "editcal.js"});
    //chrome.tabs.create({"url":"http://www.google.com/calendar/event?action=TEMPLATE&text="+my_selection});
    //chrome.tabs.create({"url":"editcal.html"});
    chrome.tabs.getSelected(null, function(tab) {
        var request = {
            newsched: true,
            schedule_str: JSON.stringify(schedule),
            imgFile: {"imgLogo":imgLogo, 
                      "imgSave":imgSave, 
                      "imgSave_onmouseover":imgSave_onmouseover, 
                      "imgCancel":imgCancel, 
                      "imgCancel_onmouseover":imgCancel_onmouseover, 
                      "imgSaving1":imgSaving1, 
                      "imgSaving2":imgSaving2, 
                      "imgSaving3":imgSaving3, 
                      "imgSavingOk":imgSavingOk,},
        };
        chrome.tabs.sendRequest(tab.id, request,
            function(response) {
            console.log(response.farewell);
        });
    });

    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));

    // listen for schedule info
    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                "request from a content script:" + sender.tab.url :
                "request from the extension");
            if (request) {
                console.log("request:" + request);
                // global schedule variable
                g_newsched = request.newsched;
                g_schedule = JSON.parse(request.schedule_str);
                console.log("newsched:" + g_newsched);
                console.log("time: " + g_schedule.sched_time);
                console.log("summary: " + g_schedule.summary);
                var storekey = "sched" + g_schedule.id;
                setItem(storekey, JSON.stringify(g_schedule));
                sendResponse({farewell: "OK. I got it."});
            }
            else {
                sendResponse({}); // snub them.
            }
        });

}

var title = chrome.i18n.getMessage("extMenuTitle");
var id = chrome.contextMenus.create({"title": title, "contexts":["selection"],
                                       "onclick": genericOnClick});
//console.log("'" + context + "' item:" + id);

// Show help at first install
if (getItem("InitiallyShowHelp") == null) {
    setItem("InitiallyShowHelp", "Done");
    // Open tab "Help.html"
    chrome.tabs.create({"url":"Help.html"});
}
