var debug_on = true;

function ec_debug()
{
    console.debug('len:' + arguments.length);
    if (debug_on) {
        for (var i = 0; i < arguments.length; ++i) {
            console.debug(arguments[i]);
        }
    }
}
