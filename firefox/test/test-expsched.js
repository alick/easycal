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
            'aaaaaaaaaaaaaaa\r\n aaaaaaaaaaaaaaa\r\n aaaaaaaaaaaaaaa\r\n ' +
            'aaaaaaaaaaaaaaa' + '\r\n b',
        '中中中中中中中中中中中中中中中文文文文文test' :
            '中中中中中中中中中中中中中中中\r\n 文文文文文test',
        // \uD834\uDD2A == U+1D12A represented by a UTF-16 surrogate pair
        // JavaScript say it has length of 2, though.
        // cf http://rosettacode.org/wiki/String_length#Byte_Length_27
        //'\uD834\uDD2A\uD834\uDD2A' : '',
    };
    for (var c in cases) {
        test.assertEqual(expsched.formatContent(c), cases[c]);
    }
};
