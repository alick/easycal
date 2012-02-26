console.debug('This is from editcal.js!');
var sched_id = -1;
var form_html = '';

$('#easycal-form-submit').hover(
        function(){
            console.debug("%%%%%%%%%%%%%%%%%%%%%%");
            $('#easycal-form-submit').attr('src', "save_mouseover.png");
        },
        function(){
            $('#easycal-form-submit').attr('src', "save.png");
        });
$('#easycal-form-cancel').hover(
        function(){
            $('#easycal-form-cancel').attr('src', "cancel_mouseover.png");
        },
        function(){
            $('#easycal-form-cancel').attr('src', "cancel.png");
        });

$('#easycal-form-cancel').on('click', function(){
    self.port.emit('close');
});

$('#easycal-form-submit').on('click', function(){

    var userYear = Number($('#easycal_year').val());
    var userMonth = Number($('#easycal_month').val()-1);
    var userDate = Number($('#easycal_day').val());
    var userHour = Number($('#easycal_hour').val());
    var userMinute = Number($('#easycal_minute').val());
    var userSecond = 0; // Assume second is 0.

    var schedule = {};
    if (sched_id === -1) {
        console.warn('schedule id invalid');
        return false;
    }
    schedule.id = sched_id;
    var sched_time = new Date(userYear, userMonth, userDate, userHour, userMinute, userSecond);
    // Checking time in the Javascript way.
    if (sched_time.getFullYear() != userYear ||
        sched_time.getMonth() != userMonth ||
        sched_time.getDate() != userDate ||
        sched_time.getHours() != userHour ||
        sched_time.getMinutes() != userMinute ||
        sched_time.getSeconds() != userSecond) {

            // Blink to give warning.
            var origin_color = $("#div_time").css('background');
            for (var i=0; i<1200; i+= 400) {
                setTimeout(function(){$("#div_time").css('background', 'red');}, i);
                setTimeout(function(){$("#div_time").css('background', origin_color);}, i+200);
            }
            return false;
        }
    //schedule.sched_time = sched_time.getTime();
    schedule.sched_time = sched_time;

    schedule.loop = $('select[name=easycal_loop]').val();

    schedule.content = $('#easycal_content').val();
    schedule.type = $('input:radio[name=type]:checked').val();
    //schedule.remind = $('select[name=remindUnit]').val();

    schedule.timebefore = Number($('#easycal_remindTime').val());
    var timebefore = Number($('#easycal_remindTime').val());
    var timestyle=$('select[name=remindUnit]').val();

    schedule.timebefore = timebefore;
    schedule.timestyle = timestyle;

    // schedule.sched_remindtime is the timestamp due to remind
    schedule.sched_remindtime = new Date();
    if(timestyle=="day") {
        schedule.sched_remindtime.setTime(schedule.sched_time.getTime() - timebefore*1000*60*60*24);
    }
    if(timestyle=="hour") {
        schedule.sched_remindtime.setTime(schedule.sched_time.getTime() - timebefore*1000*60*60);
    }
    if(timestyle=="minute") {
        schedule.sched_remindtime.setTime(schedule.sched_time.getTime() - timebefore*1000*60);
    }

    console.log('schedule from user input:');
    console.log(JSON.stringify(schedule));

    self.port.emit('save', schedule);

    return false;
});

self.port.on('reset_html', function() {
    $('#saved_img').css('display', 'none');
    $("#form_fill").css('display', 'block');
});
self.port.on('fillform', function(schedule) {
    console.debug("begin to fill the form...");
    sched_id = schedule.id;
    var time = new Date(schedule.sched_time);
    $('#easycal_year').val(time.getFullYear());
    $('#easycal_month').val(time.getMonth() + 1);
    $('#easycal_day').val(time.getDate());
    $('#easycal_hour').val(time.getHours());
    $('#easycal_minute').val(time.getMinutes());

    $('#easycal_content').val(schedule.content);
    $('#easycal_remindTime').val('15');

});

self.port.on('save_response', function(response) {
    if (response === "OK") {
        console.log("Your schedule has been successfully saved ^_^");

        var w = $("#form_fill").css('width');
        var h = $("#form_fill").css('height');
        $("#form_fill").css('display', 'none');
        $('#saved_img').css('display', 'block');
        $('#saved_img').css('width', w);
        $('#saved_img').css('height', h);

        console.debug('body size: ' + $('body').css('width') + ', ' + $('body').css('height'));

        setTimeout(
            function(){
                self.port.emit('close');
            },
            1000
            );
    } else {
        console.log("Your schedule has NOT been successfully saved -_-");
    }
});
