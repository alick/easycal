g_messages = {
"extPopupTitleModify":{
	"message":"Change",
	"description":"Change"
},
"extPopupTitleRepeat1":{
	"message":"Repeat every day",
	"description":"Repeat every day"
},
"extPopupTitleRepeat2":{
	"message":"Repeat every 2 days",
	"description":"Repeat every 2 days"
},
"extPopupTitleRepeat7":{
	"message":"Repeat every week",
	"description":"Repeat every week"
},
"extPopupTitleRepeat30":{
	"message":"Repeat every month",
	"description":"Repeat every month"
},
"extPopupTitleRepeat365":{
	"message":"Repeat every year",
	"description":"Repeat every year"
},
"extPopupTitleRemove":{
	"message":"Delete",
	"description":"Delete"
},
"extPopupTitleChangeSch":{
	"message":"Change Schedule",
	"description":"Change Schedule"
},
"extPopupTitleNoSch":{
	"message":"No schedules on this day",
	"description":"No schedules on this day"
},
"extPopupTitleNewSch":{
	"message":"Create New Schedule",
	"description":"Create New Schedule"
},
"extPopupTitleSave":{
	"message":"Save",
	"description":"Save"
},
"extPopupTitleCancel":{
	"message":"Cancel",
	"description":"Cancel"
},

"extPopupHelp":{
    "message":"Help",
	"description":"Help"
},

"extHelpPage":{
    "message":"Help-en.html",
	"description":"file name of Help file"
}
};

function _(key) {
    var translation = g_messages[key]["message"];
    console.debug('translation:' + translation);
    if (translation === undefined) {
        return key;
    } else {
        return translation;
    }
}
