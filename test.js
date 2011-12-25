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
            sendResponse({farewell: "OK. Goodbye."});
        }
        else {
            sendResponse({}); // snub them.
        }
    });

