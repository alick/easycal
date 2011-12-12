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
	chrome.tabs.create({"url":"http://www.google.com/calendar/event?action=TEMPLATE&text="+my_selection});
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

var title = chrome.i18n.getMessage("extMenuTitle");
var id = chrome.contextMenus.create({"title": title, "contexts":["selection"],
                                       "onclick": genericOnClick});
//console.log("'" + context + "' item:" + id);
