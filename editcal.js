console.debug('This is from content scripts!');
// Add our popup layer div.
$('body').append('<div id="easycal-editcal"></div>');
$('body').append('<div id="easycal-mist"></div>');
$('#easycal-editcal').load(chrome.extension.getURL("editcal.html") +
                           ' fieldset');
$('#easycal-editcal').css({
    position: "absolute",
    top: (window.pageYOffset + window.innerHeight / 10),
    left: (window.pageXOffset + window.innerWidth / 5),
    width: "50%",
    'z-index': 1002,
    'background-color': 'white',
});
$('#easycal-mist').css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: $('body').css('height'),
    'z-index': 1001,
    'background-color': 'rgba(180, 180, 180, 0.9)',
});
// Click on grey out area to cancel.
$('#easycal-mist').click(function(){
    $('#easycal-editcal').remove();
    $('#easycal-mist').remove();
});

(function(){
    // SEE ALSO http://code.google.com/chrome/extensions/messaging.html
    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                "request from a content script:" + sender.tab.url :
                "request from the extension");
            console.log(request);
            console.log(request.schedule_str.sched_time);
            if (request) {
                // global schedule variable
                g_newsched = request.newsched;
                g_schedule = JSON.parse(request.schedule_str);
                console.log("newsched:" + g_newsched);
                console.log("time: " + g_schedule.sched_time);
                console.log("summary: " + g_schedule.summary);
                sendResponse({farewell: "OK. Goodbye."});
            }
            else {
                sendResponse({}); // snub them.
            }
        });
})();

$('body').ajaxComplete(function() {
    console.log('ajax completed');
    fillForm();
    $('#easycal-editcal #submit').bind('click', function(event){
        event.preventDefault();

        var userYear = Number($('#year').val());
        var userMonth = Number($('#month').val()-1);
        var userDate = Number($('#day').val());
        var userHour = Number($('#hour').val());
        var userMinute = Number($('#minute').val());
        var userSecond = 0; // Assume second is 0.

        g_schedule.sched_time = new Date(userYear, userMonth, userDate, userHour, userMinute, userSecond);
        // Checking time in the Javascript way.
        if (g_schedule.sched_time.getFullYear() != userYear ||
                g_schedule.sched_time.getMonth() != userMonth ||
                g_schedule.sched_time.getDate() != userDate ||
                g_schedule.sched_time.getHours() != userHour ||
                g_schedule.sched_time.getMinutes() != userMinute ||
                g_schedule.sched_time.getSeconds() != userSecond) {

            var origin_color = $("#easycal-editcal #div_time").css('background');
            for (var i=0; i<1200; i+= 400) {
                setTimeout(function(){$("#easycal-editcal #div_time").css('background', 'red');}, i);
                setTimeout(function(){$("#easycal-editcal #div_time").css('background', origin_color);}, i+200);
            }
            return false;
        }

        g_schedule.sched_loc = $('#address').val();
        g_schedule.summary = $('#summary').val();
        g_schedule.content = $('#content').val();
        g_schedule.type = $('input:radio[name=type]:checked').val();
        g_schedule.summary = $('#summary').val();
        //g_schedule.remind = $('select[name=remindUnit]').val();

        g_schedule.timebefore = Number($('#remindTime').val());
        var timebefore = Number($('#remindTime').val());
        var timestyle=$('select[name=remindUnit]').val();

        g_schedule.timebefore = timebefore;
        g_schedule.timestyle = timestyle;

        //if(timestyle=="year") g_schedule.sched_remindtime = timebefore*1000*60*60*24*365;
        //if(timestyle=="month") g_schedule.sched_remindtime = timebefore*1000*60*60*24*30;
        
        // g_schedule.sched_remindtime is the timestamp due to remind
        g_schedule.sched_remindtime = new Date();
        if(timestyle=="day") {
            g_schedule.sched_remindtime.setTime(g_schedule.sched_time.getTime() - timebefore*1000*60*60*24);
        }
        if(timestyle=="hour") {
            g_schedule.sched_remindtime.setTime(g_schedule.sched_time.getTime() - timebefore*1000*60*60);
        }
        if(timestyle=="minute") {
            g_schedule.sched_remindtime.setTime(g_schedule.sched_time.getTime() - timebefore*1000*60);
        }
        //if(timestyle=="second") g_schedule.sched_remindtime = timebefore*1000;

        console.log('sched:');
        console.log(g_schedule);

        // store into local storage
        console.log('Sending schedule...');
        var request = {
            newsched: true,
            schedule_str: JSON.stringify(g_schedule),
        };
        chrome.extension.sendRequest(request, function(response) {
            console.log(response.farewell);
            if (response.farewell === "OK. I got it.") {
                console.log("Your schedule has been successfully saved ^_^");
                // TODO
                // Let user see the info

                $('#easycal-editcal').html("Your schedule has been successfully saved ^_^");
                setTimeout(
                    function(){
                        $('#easycal-editcal').remove();
                        $('#easycal-mist').remove();
                    },
                    1 * 1000);
            }
        });

        return false;
    });
});

function fillForm() {
    if (g_schedule) {
        console.log('Filling the form...');
        var time = new Date(g_schedule.sched_time);
        $('#easycal-editcal #year').val(time.getFullYear());
        $('#easycal-editcal #month').val(time.getMonth() + 1);
        $('#easycal-editcal #day').val(time.getDate());
        $('#easycal-editcal #hour').val(time.getHours());
        $('#easycal-editcal #minute').val(time.getMinutes());

        $('#easycal-editcal #address').val(g_schedule.sched_loc);
        $('#easycal-editcal #summary').val(g_schedule.summary);
        $('#easycal-editcal #content').val(g_schedule.content);
        $('#easycal-editcal input:radio[name=type][value=meeting]')[0].checked = true;
        $('#easycal-editcal #remindTime').val('15');
    }
}
