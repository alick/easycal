(function(){
    console.log("addListener");
    // SEE ALSO http://code.google.com/chrome/extensions/messaging.html
    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                "request from a content script:" + sender.tab.url :
                "request from the extension");
            console.log('request: ' + request);
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
                sendResponse({farewell: "NO. request is null."}); // snub them.
            }
        });
})();
