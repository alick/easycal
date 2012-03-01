var storage = require("easycal/storage")

exports.test_get_non_exist_item = function(test) {
    test.assertEqual(storage.getItem("wtf"), undefined);
};
