var ss = require('simple-storage');

// Export easycal schedules to ics format.
// It returns a string containing all matching schedules' info.
// However it does not include the first and last line of ics file.
// In this way an empty returned value indicates no schedules are exported.
function exportSchedules(option) {
    var ics = '';
    for (var key in ss.storage) {
        // First make sure key is of format 'sched<num>'
        if ((key.indexOf('sched') < 0) || isNaN(parseInt(key.substr(5)))) {
            // not sched key
            continue;
        }
        var schedule_str = ss.storage[key];
        var s = JSON.parse(schedule_str);
        for (var key in s) {
            console.debug(key + '=>' + s[key]);
        }
        if (meetExportReq(s, option) === true) {
            var now = new Date();
            var rand = Math.floor(Math.random() * 10000);
            var uid = now.getTime() + '-' + rand;
            var description = formatContent(s.content);
            //TODO
            // Add alarm/remind info
            var tmp =
                'BEGIN:VEVENT\r\n' +
                'UID:' + uid +'\r\n' +
                'DTSTAMP:' + toICSDate(now) + '\r\n' +
                'DTSTART:' + toICSDate(s.sched_time) + '\r\n' +
                'DESCRIPTION:' + description + '\r\n' +
                'END:VEVENT\r\n';
            ics += tmp;
        }
    }
    return ics;
}

function meetExportReq(schedule, option) {
    if (option.type === "all") {
        return true;
    } else {
        return false;
    }
}

function toICSDate(js_date) {
    var js_date_str;
    if (typeof(js_date) === 'object') {
        js_date_str = js_date.toISOString();
    } else if (typeof(js_date) === 'string') {
        js_date_str = js_date;
    } else {
        console.error('toICSdate: input is not a date or a string');
        return '';
    }
    return js_date_str.replace(/[-:]|(\.\d+)/g,'');
}

function formatContent(content) {
    // At most 60 char (excluding line break) in one line.
    var linelen = 60;
    // Replace newline char.
    var tmp_res = content.replace(/\n/g, '\\n');
    var nline = Math.floor(tmp_res.length / linelen) + 1;
    var res = tmp_res.substr(0, linelen);
    for (var i = 1; i < nline; ++i) {
        res += '\r\n ' + tmp_res.substr(i * linelen, linelen);
    }
    return res;
}

exports.exportSchedules = exportSchedules;
exports.formatContent = formatContent;
exports.toICSDate = toICSDate;

/*
 * A sample
 *
BEGIN:VEVENT
UID:uid1@example.com
DTSTAMP:20120307T120000Z
DTSTART:20120314T100000Z
DTEND:20120314T110000Z
SUMMARY:Some event
DESCRIPTION:Meet the big
  and tall guy\nSome Place
END:VEVENT
*/
