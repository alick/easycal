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
    }
};

$(document).ready(function(){
    $('#submit').bind('click', function(){
        console.log('Storing schedule...');
        // FIXME
        // add all input values
        g_schedule.sched_loc = $('#address').val();
        g_schedule.type = $('input:radio[name=type]:checked').val();
        //g_schedule.remind = $('select[name=remindUnit]').val();
        console.log('sched:');
        console.log(g_schedule);

        // store into local storage
        var storekey = "sched" + g_schedule.id;
        setItem(storekey, JSON.stringify(g_schedule));

        setItem('sched_index', ++g_schedule.id);

        alert("Your schedule has been successfully saved ^_^");
        // close this tab
        window.close();
        // prevent going to other page
        return false;
    });
});
