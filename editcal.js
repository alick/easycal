$(document).ready(function(){
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
                g_newsched = request.newsched;
                g_schedule = JSON.parse(request.schedule_str);
                console.log("newsched:" + g_newsched);
                console.log("time: " + g_schedule.sched_time);
                console.log("summary: " + g_schedule.summary);
                fillForm();
                sendResponse({farewell: "OK. Goodbye."});
            }
            else {
                sendResponse({}); // snub them.
            }
        });

    $('#submit').bind('click', function(event){
        event.preventDefault();
        // FIXME
        // add all input values
        var userYear = Number($('#year').val());
        var userMonth = Number($('#month').val()-1);
        var userDate = Number($('#day').val());
        var userHour = Number($('#hour').val());
        var userMinute = Number($('#minute').val());
        var userSecond = Number($('#second').val());

        console.debug(userYear);
        console.debug(userMonth);
        console.debug(userDate);
        console.debug(userHour);
        console.debug(userMinute);
        console.debug(userSecond);
        //TODO
        // warn about stuff like 2011-02-30
        // Check input value.
        if ((userMonth<0) || (userMonth>11) ||
            (userDate<1) || (userDate>31) ||
            (userHour<0) || (userHour>23) ||
            (userMinute<0) || (userMinute>59) ||
            (userSecond<0) || (userSecond>59)) {
            //$('#time').append('<p class="warning">Invalid time setting.</p>');
            alert('Invalid time setting.');
            return false;
        }

        console.log('Storing schedule...');
        // Not ending with semicolon is not an error in Javascript :)
        g_schedule.sched_time = new Date();
        g_schedule.sched_time.setFullYear(userYear);
        g_schedule.sched_time.setMonth(userMonth);
        g_schedule.sched_time.setDate(userDate);
        g_schedule.sched_time.setHours(userHour, userMinute);

        g_schedule.sched_loc = $('#address').val();
        g_schedule.summary = $('#summary').val();
        g_schedule.content = $('#content').val();
        g_schedule.type = $('input:radio[name=type]:checked').val();
		g_schedule.summary = $('#summary').val();
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

        if (g_newsched) {
            setItem('sched_index', ++g_schedule.id);
        }
        
        //alert("Your schedule has been successfully saved ^_^");
        // Create a notification:
        AUTO_CLOSE_DELAY_SECONDS = 2;
        var notification = webkitNotifications.createNotification(
                'huaci.png',// icon url - can be relative
                chrome.i18n.getMessage('extNotifyTitle'),//'完成',  notification title
                chrome.i18n.getMessage('extNotifySubtitle')//'日程已经保存', notification body text
                );
        notification.show();
        setTimeout( function() { notification.cancel(); window.close();}, AUTO_CLOSE_DELAY_SECONDS*1000 );


        // close this tab 
        // NOTE: if you close this tab, setTimeout will be out of its function domain.
        // I close the window after cancel the notification. Is there any better solution? 
        // Like, put notification in background, the tab only deliver a message to the background.
        // window.close();
        
        // prevent going to other page
        return false;
    });
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
        $('#summary').val(g_schedule.summary);
        $('#content').val(g_schedule.content);
        $('input:radio[name=type][value=meeting]')[0].checked = true;
        $('#remindTime').val('15');
    }
};
