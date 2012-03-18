const expsched = require("expsched");

exports.test_toICSDate = function(test) {
    var ts = {
        '2012-03-14T00:00:00.001Z' : '20120314T000000Z',
        "2012-03-18T13:15:33.986Z" : '20120318T131533Z',
        '' : '',
    };
    for (var t in ts) {
        test.assertEqual(expsched.toICSDate(t), ts[t]);
    }
    var t1 = new Date("2012-03-18T13:15:33.986Z");
    test.assertEqual(expsched.toICSDate(t1), '20120318T131533Z');
};

exports.test_formatContent = function(test) {
    var cases = {
        '' : '',
        'a\nb\ncc' : 'a\\nb\\ncc',
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab' :
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
            '\r\n b',
        '中中中中中中中中中中中中中中中中中中中中文' :
            '中中中中中中中中中中中中中中中中中中中中\r\n 文',
    };
    for (var c in cases) {
        test.assertEqual(expsched.formatContent(c), cases[c]);
    }
};
