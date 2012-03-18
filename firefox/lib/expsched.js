var ss = require('simple-storage');

function exportSchedules(option) {
    var ics = 'contents of file';
    for (var key in ss.storage) {
        // First make sure key is of format 'sched<num>'
        if ((key.indexOf('sched') < 0) || isNaN(parseInt(key.substr(5)))) {
            // not sched key
            continue;
        }
        var schedule_str = ss.storage[key];
        var s = JSON.parse(schedule_str);
        if (meetExportReq(s, option) === true) {
        }
    }
    return ics;
}

function meetExportReq(schedule, option) {
    if (option.type === "all") {
        return true;
    }
}

exports.exportSchedules = exportSchedules;
