g_messages = {
"extEditLabelLoop":{
	"message":"Repeat:",
	"description":"Repeat:"
},
"extEditLabelNoLoop":{
	"message":"No repeat",
	"description":"No repeat"
},
"extEditLabelEveryDay":{
	"message":"Every day",
	"description":"Every day"
},
"extEditLabelEvery2Day":{
	"message":"Every 2 days",
	"description":"Every 2 days"
},
"extEditLabelEveryWeek":{
	"message":"Every week",
	"description":"Every week"
},
"extEditLabelEveryMonth":{
	"message":"Every month",
	"description":"Every month"
},
"extEditLabelEveryYear":{
	"message":"Every year",
	"description":"Every year"
},
"extEditLabelContent":{
	"message":"Schedule:",
	"description":"Schedule:"
},
"extEditLabelRemind":{
	"message":"Remind:",
	"description":"Remind:"
},
"extEditLabelBefore":{
	"message":"before",
	"description":"before"
},
"extEditLabelRemindDay":{
	"message":"days",
	"description":"days"
},
"extEditLabelRemindHour":{
	"message":"hours",
	"description":"hours"
},
"extEditLabelRemindMinute":{
	"message":"minutes",
	"description":"minutes"
},

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
