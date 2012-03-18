ec_debug("advanced.js loaded");

$('#export').click(function(){
    self.port.emit('export');
});
