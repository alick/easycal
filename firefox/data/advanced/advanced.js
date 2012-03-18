ec_debug("advanced.js loaded");

$('#export').click(function(){
    // NOTE
    // Check option value here.
    option = {
        type: "all",
    };
    /*
     * Some other options:
     *
    option = {
        type: "from today on",
    };
    */
    self.port.emit('export', option);
});

self.port.on('warnNoSchedule', function(){
    alert('No schedule is in the date range. So nothing was exported.');
});
