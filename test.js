// SEE ALSO http://code.google.com/chrome/extensions/messaging.html
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "request from a content script:" + sender.tab.url :
                    "request from the extension");
        console.log(request);
        console.log(request.sched_time);
        if (request) {
            // global schedule variable
            g_schedule = request;
            console.log("time: " + g_schedule.sched_time);
            console.log("summary: " + g_schedule.summary);
            fillForm();
            sendResponse({farewell: "OK. Goodbye."});
        }
        else {
            sendResponse({}); // snub them.
        }
    });

function fillForm() {
    if (g_schedule) {
        console.log('Filling the form...');
        var time = new Date(g_schedule.sched_time);
        $('#year').val(time.getFullYear());
        $('#month').val(time.getMonth() + 1);
        $('#day').val(time.getDate());
        $('#hour').val(time.getHours());
        $('#minute').val(time.getMinutes());
        $('#second').val(time.getSeconds());

        $('#address').val(g_schedule.sched_loc);
        $('#content').val(g_schedule.content);
        $('input:radio[name=type][value=meeting]')[0].checked = true;
        $('#remindTime').val('15');
    }
};

$(document).ready(function(){
    $('#submit').bind('click', function(){
        console.log('Storing schedule...');
        // FIXME
        // add all input values
        var userYear = Number($('#year').val());
        var userMonth = Number($('#month').val()-1);
        var userDate = Number($('#day').val());
        var userHour = Number($('#hour').val());
        var userMinute = Number($('#minute').val());
        var userSecond = Number($('#second').val());
        if (userMonth<0) userMonth = 0;
        if (userMonth>11) userMonth = 11;
        if (userDate<1) userDate = 1;
        if (userDate>31) userDate = 31;
        if (userHour<0) userHour = 0;
        if (userHour>23) userHour = 23;
        if (userMinute<0) userMinute = 0;
        if (userMinute>59) userMinute = 59;
        g_schedule.sched_time = new Date()
        g_schedule.sched_time.setFullYear(userYear);
        g_schedule.sched_time.setMonth(userMonth);
        g_schedule.sched_time.setDate(userDate);
        g_schedule.sched_time.setHours(userHour, userMinute);
        
        g_schedule.sched_loc = $('#address').val();
        g_schedule.type = $('input:radio[name=type]:checked').val();
        //g_schedule.remind = $('select[name=remindUnit]').val();
		
		var timebefore =Number($('#remindTime').val());
		var timestyle=$('select[name=remindUnit]').val();
		if(timestyle=="year") g_schedule.sched_remindtime = timebefore*1000*60*60*24*365;
		if(timestyle=="month") g_schedule.sched_remindtime = timebefore*1000*60*60*24*30;
		if(timestyle=="day") g_schedule.sched_remindtime = timebefore*1000*60*60*24;
		if(timestyle=="hour") g_schedule.sched_remindtime = timebefore*1000*60*60;
		if(timestyle=="minute") g_schedule.sched_remindtime = timebefore*1000*60;
		if(timestyle=="second") g_schedule.sched_remindtime = timebefore*1000;
		
        console.log('sched:');
        console.log(g_schedule);

        // store into local storage
        var storekey = "sched" + g_schedule.id;
        setItem(storekey, JSON.stringify(g_schedule));

        setItem('sched_index', ++g_schedule.id);

        alert("Your schedule has been successfully saved ^_^");
        // close this tab
        //window.close();
        // prevent going to other page
        return false;
    });
});
